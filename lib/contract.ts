/**
 * The SOURCE contract as this mirror sees it: its ABI, the environment that points at it, and the
 * read paths used to pull finalized releases off Ethereum Mainnet.
 *
 * Everything here is read-only. The mirror holds no private key and never builds a transaction —
 * see the note in README.md.
 */

import {
  createPublicClient,
  fallback,
  http,
  getAddress,
  isAddress,
  parseAbi,
  parseAbiItem,
  type Abi,
  type Address,
  type Hex,
  type PublicClient,
} from 'viem';
import { mainnet } from 'viem/chains';

import { RELEASE_SIZE } from './source-codec.js';

/**
 * The subset of the SOURCE ABI this mirror reads, transcribed from the compiled artifact
 * (`out/SOURCE.sol/SOURCE.json`). Signatures — and therefore event topics — match the deployed
 * contract exactly; anything else would fail the bytecode and decode checks below.
 */
export const SOURCE_ABI = [
  ...parseAbi([
    'function totalReleases() view returns (uint256)',
    'function releaseId() view returns (uint256)',
    'function revision() view returns (uint256)',
    'function sourceState() view returns (uint32)',
    'function sourceHash() view returns (bytes32)',
    'function releaseStatus() view returns (uint256 progress, uint256 size, uint256 nextReleaseId, uint32 buys, uint32 sells)',
    'function currentSource() view returns (uint32 state, uint8[16] instructions, uint256 rev, uint256 progress, bytes32 hash_)',
    'function releaseAt(uint256 id) view returns ((uint32 state, bytes32 hash, uint256 finalRevision, uint256 finalizedBlock, uint32 buys, uint32 sells))',
    'function SLOT_COUNT() view returns (uint256)',
    'function RELEASE_SIZE() view returns (uint256)',
    'function BITS_PER_SLOT() view returns (uint256)',
    'function SLOT_MASK() view returns (uint256)',
  ]),
  parseAbiItem(
    'event SourceChanged(uint256 indexed revision, uint8 indexed slot, uint8 oldOp, uint8 newOp, bool isBuy, uint32 newState, bytes32 newHash, uint256 timestamp)',
  ),
  parseAbiItem(
    'event ReleaseFinalized(uint256 indexed releaseId, uint32 state, bytes32 hash, uint256 finalRevision, uint256 finalizedBlock, uint32 buys, uint32 sells)',
  ),
] as const satisfies Abi;

export const SOURCE_CHANGED_EVENT = SOURCE_ABI[SOURCE_ABI.length - 2] as Extract<
  (typeof SOURCE_ABI)[number],
  { type: 'event'; name: 'SourceChanged' }
>;
export const RELEASE_FINALIZED_EVENT = SOURCE_ABI[SOURCE_ABI.length - 1] as Extract<
  (typeof SOURCE_ABI)[number],
  { type: 'event'; name: 'ReleaseFinalized' }
>;

/** One finalized release exactly as `releaseAt(id)` returns it. */
export interface Release {
  state: number;
  hash: Hex;
  finalRevision: bigint;
  finalizedBlock: bigint;
  buys: number;
  sells: number;
}

/** One decoded `SourceChanged` log, with the on-chain position that orders it. */
export interface SourceChangedLog {
  revision: bigint;
  slot: number;
  oldOp: number;
  newOp: number;
  isBuy: boolean;
  newState: number;
  newHash: Hex;
  timestamp: bigint;
  blockNumber: bigint;
  blockHash: Hex;
  transactionHash: Hex;
  transactionIndex: number;
  logIndex: number;
}

/** One decoded `ReleaseFinalized` log, with the on-chain position that orders it. */
export interface ReleaseFinalizedLog {
  releaseId: bigint;
  state: number;
  hash: Hex;
  finalRevision: bigint;
  finalizedBlock: bigint;
  buys: number;
  sells: number;
  blockNumber: bigint;
  blockHash: Hex;
  transactionHash: Hex;
  transactionIndex: number;
  logIndex: number;
}

/** The environment this mirror runs against. */
export interface SourceConfig {
  /** Every configured endpoint, in priority order. The first is the primary. */
  rpcUrls: string[];
  address: Address;
  deploymentBlock: bigint;
  chainId: number;
  confirmations: bigint;
}

export class ConfigError extends Error {
  override name = 'ConfigError';
}

export class VerificationError extends Error {
  override name = 'VerificationError';
}

const DEFAULT_CHAIN_ID = 1;
const DEFAULT_CONFIRMATIONS = 20n;

/**
 * Read and validate the environment. Every value is checked here so a misconfigured run fails
 * before it touches the network — never halfway through writing release files.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): SourceConfig {
  // ETH_RPC_URL may hold several endpoints, separated by commas or newlines. Extras are used as
  // fallbacks when the primary rate-limits or fails, so a free-tier provider does not sink a run.
  const rpcUrls = (env.ETH_RPC_URL ?? '')
    .split(/[,\n]/)
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
  if (rpcUrls.length === 0) throw new ConfigError('ETH_RPC_URL is not set');
  for (const url of rpcUrls) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new ConfigError(`ETH_RPC_URL is not a valid URL: ${url}`);
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new ConfigError(`ETH_RPC_URL must be http(s), got ${parsedUrl.protocol}`);
    }
  }

  const rawAddress = (env.SOURCE_ADDRESS ?? '').trim();
  if (!rawAddress) throw new ConfigError('SOURCE_ADDRESS is not set');
  if (!isAddress(rawAddress)) throw new ConfigError(`SOURCE_ADDRESS is not an address: ${rawAddress}`);
  const address = getAddress(rawAddress);

  const deploymentBlock = parseBigint(env.DEPLOYMENT_BLOCK, 'DEPLOYMENT_BLOCK');
  if (deploymentBlock === undefined) throw new ConfigError('DEPLOYMENT_BLOCK is not set');

  const chainId = Number(parseBigint(env.CHAIN_ID, 'CHAIN_ID') ?? BigInt(DEFAULT_CHAIN_ID));
  if (!Number.isSafeInteger(chainId) || chainId <= 0) {
    throw new ConfigError(`CHAIN_ID must be a positive integer, got ${String(env.CHAIN_ID)}`);
  }

  const confirmations = parseBigint(env.CONFIRMATIONS, 'CONFIRMATIONS') ?? DEFAULT_CONFIRMATIONS;
  if (confirmations < 0n) throw new ConfigError('CONFIRMATIONS must not be negative');

  return { rpcUrls, address, deploymentBlock, chainId, confirmations };
}

function parseBigint(raw: string | undefined, label: string): bigint | undefined {
  const value = (raw ?? '').trim();
  if (!value) return undefined;
  if (!/^\d+$/.test(value)) {
    throw new ConfigError(`${label} must be a non-negative integer, got ${value}`);
  }
  return BigInt(value);
}

/**
 * Build the read client.
 *
 * `retryDelay` is the base of viem's exponential backoff, so a 429 waits ~1s, ~2s, ~4s … rather
 * than hammering a rate-limited endpoint. When several RPC URLs are configured they are wrapped in
 * a fallback transport: a request that keeps failing on one endpoint is retried on the next, which
 * is what keeps a free-tier provider's rate limit from failing the whole run.
 */
export function createClient(config: SourceConfig): PublicClient {
  // SOURCE_RPC_RETRY_DELAY_MS only exists so the test suite can collapse the backoff; a real run
  // always wants the patient default.
  const retryDelay = Number(process.env.SOURCE_RPC_RETRY_DELAY_MS ?? 1_000);
  const options = { batch: false, retryCount: 5, retryDelay, timeout: 30_000 } as const;
  const transports = config.rpcUrls.map((url) => http(url, options));
  return createPublicClient({
    chain: config.chainId === mainnet.id ? mainnet : undefined,
    transport:
      transports.length === 1
        ? (transports[0] as ReturnType<typeof http>)
        : fallback(transports, { rank: false, retryCount: 2 }),
  }) as PublicClient;
}

/**
 * Step 1 of the sync: prove the RPC really is the chain we were configured for and that the
 * configured address really holds the SOURCE contract.
 *
 * The bytecode check is deliberately behavioural rather than a hardcoded hash: we require code to
 * exist at the address and require the contract's own constants to read back the values this
 * codec assumes. A wrong address, a proxy to something else, or a differently-parameterized
 * deployment all fail here rather than producing plausible-looking release files.
 */
export async function validateDeployment(
  client: PublicClient,
  config: SourceConfig,
): Promise<{ bytecodeSize: number }> {
  const chainId = await client.getChainId();
  if (chainId !== config.chainId) {
    throw new ConfigError(`RPC reports chain id ${chainId}, expected ${config.chainId}`);
  }

  const bytecode = await client.getCode({ address: config.address });
  if (!bytecode || bytecode === '0x') {
    throw new ConfigError(`no contract deployed at ${config.address} on chain ${chainId}`);
  }

  const head = await client.getBlockNumber();
  if (config.deploymentBlock > head) {
    throw new ConfigError(
      `DEPLOYMENT_BLOCK ${config.deploymentBlock} is ahead of chain head ${head}`,
    );
  }

  const [slotCount, releaseSize, bitsPerSlot, slotMask] = await Promise.all([
    client.readContract({ address: config.address, abi: SOURCE_ABI, functionName: 'SLOT_COUNT' }),
    client.readContract({ address: config.address, abi: SOURCE_ABI, functionName: 'RELEASE_SIZE' }),
    client.readContract({ address: config.address, abi: SOURCE_ABI, functionName: 'BITS_PER_SLOT' }),
    client.readContract({ address: config.address, abi: SOURCE_ABI, functionName: 'SLOT_MASK' }),
  ]);

  assertConstant('SLOT_COUNT', slotCount, 16n);
  assertConstant('RELEASE_SIZE', releaseSize, BigInt(RELEASE_SIZE));
  assertConstant('BITS_PER_SLOT', bitsPerSlot, 2n);
  assertConstant('SLOT_MASK', slotMask, 3n);

  return { bytecodeSize: (bytecode.length - 2) / 2 };
}

function assertConstant(label: string, actual: bigint, expected: bigint): void {
  if (actual !== expected) {
    throw new ConfigError(
      `contract ${label} is ${actual}, expected ${expected} — the address does not hold the SOURCE contract this mirror understands`,
    );
  }
}

/** How many releases the contract has finalized so far. Ids run 0 .. totalReleases-1. */
export async function readTotalReleases(
  client: PublicClient,
  config: SourceConfig,
): Promise<bigint> {
  return client.readContract({
    address: config.address,
    abi: SOURCE_ABI,
    functionName: 'totalReleases',
  });
}

/** Read one finalized release from contract storage. Reverts on chain for an unsealed id. */
export async function readRelease(
  client: PublicClient,
  config: SourceConfig,
  id: bigint,
): Promise<Release> {
  const release = await client.readContract({
    address: config.address,
    abi: SOURCE_ABI,
    functionName: 'releaseAt',
    args: [id],
  });
  return {
    state: release.state,
    hash: release.hash,
    finalRevision: release.finalRevision,
    finalizedBlock: release.finalizedBlock,
    buys: release.buys,
    sells: release.sells,
  };
}

/**
 * Fetch `ReleaseFinalized` logs in a block range, ordered by (block, transaction, log index).
 * Ranges are chunked so a bounded-range RPC provider does not reject the query.
 */
export async function fetchReleaseFinalizedLogs(
  client: PublicClient,
  config: SourceConfig,
  fromBlock: bigint,
  toBlock: bigint,
  options: { releaseId?: bigint; chunkSize?: bigint } = {},
): Promise<ReleaseFinalizedLog[]> {
  const logs = await getLogsChunked(client, config, fromBlock, toBlock, options.chunkSize, (from, to) =>
    client.getLogs({
      address: config.address,
      event: RELEASE_FINALIZED_EVENT,
      args: options.releaseId === undefined ? {} : { releaseId: options.releaseId },
      fromBlock: from,
      toBlock: to,
    }),
  );

  return logs.map((log) => {
    const args = log.args as {
      releaseId?: bigint;
      state?: number;
      hash?: Hex;
      finalRevision?: bigint;
      finalizedBlock?: bigint;
      buys?: number;
      sells?: number;
    };
    return {
      releaseId: required(args.releaseId, 'ReleaseFinalized.releaseId'),
      state: required(args.state, 'ReleaseFinalized.state'),
      hash: required(args.hash, 'ReleaseFinalized.hash'),
      finalRevision: required(args.finalRevision, 'ReleaseFinalized.finalRevision'),
      finalizedBlock: required(args.finalizedBlock, 'ReleaseFinalized.finalizedBlock'),
      buys: required(args.buys, 'ReleaseFinalized.buys'),
      sells: required(args.sells, 'ReleaseFinalized.sells'),
      ...position(log),
    };
  });
}

/**
 * Fetch `SourceChanged` logs in a block range, ordered by (block, transaction, log index).
 * That ordering is the blockchain order the release files record.
 */
export async function fetchSourceChangedLogs(
  client: PublicClient,
  config: SourceConfig,
  fromBlock: bigint,
  toBlock: bigint,
  options: { chunkSize?: bigint } = {},
): Promise<SourceChangedLog[]> {
  const logs = await getLogsChunked(client, config, fromBlock, toBlock, options.chunkSize, (from, to) =>
    client.getLogs({
      address: config.address,
      event: SOURCE_CHANGED_EVENT,
      fromBlock: from,
      toBlock: to,
    }),
  );

  return logs.map((log) => {
    const args = log.args as {
      revision?: bigint;
      slot?: number;
      oldOp?: number;
      newOp?: number;
      isBuy?: boolean;
      newState?: number;
      newHash?: Hex;
      timestamp?: bigint;
    };
    return {
      revision: required(args.revision, 'SourceChanged.revision'),
      slot: required(args.slot, 'SourceChanged.slot'),
      oldOp: required(args.oldOp, 'SourceChanged.oldOp'),
      newOp: required(args.newOp, 'SourceChanged.newOp'),
      isBuy: required(args.isBuy, 'SourceChanged.isBuy'),
      newState: required(args.newState, 'SourceChanged.newState'),
      newHash: required(args.newHash, 'SourceChanged.newHash'),
      timestamp: required(args.timestamp, 'SourceChanged.timestamp'),
      ...position(log),
    };
  });
}

/** Default `eth_getLogs` window. Wide enough to be quick, narrow enough for public providers. */
const DEFAULT_CHUNK_SIZE = 10_000n;

async function getLogsChunked<T extends { blockNumber: bigint | null; logIndex: number | null }>(
  _client: PublicClient,
  _config: SourceConfig,
  fromBlock: bigint,
  toBlock: bigint,
  chunkSize: bigint | undefined,
  query: (from: bigint, to: bigint) => Promise<T[]>,
): Promise<T[]> {
  if (toBlock < fromBlock) return [];
  const size = chunkSize && chunkSize > 0n ? chunkSize : DEFAULT_CHUNK_SIZE;
  const collected: T[] = [];
  for (let from = fromBlock; from <= toBlock; from += size) {
    const to = from + size - 1n > toBlock ? toBlock : from + size - 1n;
    collected.push(...(await query(from, to)));
  }
  return collected.sort(compareLogPosition);
}

/**
 * Blockchain order for logs: block number, then position within the block. `logIndex` is already
 * block-scoped and monotonic across the whole block, so it orders transactions too.
 */
export function compareLogPosition(
  a: { blockNumber: bigint | null; logIndex: number | null },
  b: { blockNumber: bigint | null; logIndex: number | null },
): number {
  const aBlock = a.blockNumber ?? 0n;
  const bBlock = b.blockNumber ?? 0n;
  if (aBlock !== bBlock) return aBlock < bBlock ? -1 : 1;
  return (a.logIndex ?? 0) - (b.logIndex ?? 0);
}

function position(log: {
  blockNumber: bigint | null;
  blockHash: Hex | null;
  transactionHash: Hex | null;
  transactionIndex: number | null;
  logIndex: number | null;
}): {
  blockNumber: bigint;
  blockHash: Hex;
  transactionHash: Hex;
  transactionIndex: number;
  logIndex: number;
} {
  return {
    blockNumber: required(log.blockNumber, 'log.blockNumber'),
    blockHash: required(log.blockHash, 'log.blockHash'),
    transactionHash: required(log.transactionHash, 'log.transactionHash'),
    transactionIndex: required(log.transactionIndex, 'log.transactionIndex'),
    logIndex: required(log.logIndex, 'log.logIndex'),
  };
}

function required<T>(value: T | null | undefined, label: string): T {
  if (value === null || value === undefined) {
    throw new VerificationError(`${label} missing from RPC response — pending logs are not accepted`);
  }
  return value;
}
