#!/usr/bin/env tsx
/**
 * Mirror newly finalized SOURCE releases into `releases/`.
 *
 * The whole run is read-only against Ethereum: it validates the RPC and the deployment, reads the
 * finalized releases, verifies each one independently from its own events, and writes files only
 * for releases that pass every check. It holds no private key and sends no transaction.
 *
 * Idempotence: a release directory is written only when it does not exist, or when its rendered
 * bytes differ from what is on disk. A run with no new releases changes nothing.
 */

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { parseAbiItem, type Address, type Hex, type PublicClient } from 'viem';

import {
  ConfigError,
  VerificationError,
  createClient,
  fetchReleaseFinalizedLogs,
  fetchSourceChangedLogs,
  loadConfig,
  readRelease,
  readTotalReleases,
  validateDeployment,
  type Release,
  type ReleaseFinalizedLog,
  type SourceChangedLog,
  type SourceConfig,
} from '../lib/contract.js';
import { RELEASE_SIZE } from '../lib/source-codec.js';
import { GENESIS_HASH, GENESIS_STATE, verifyRelease, type VerifiedRelease } from '../lib/verify.js';
import { releaseDirName, renderRelease } from '../lib/release-files.js';

/** `SwapTaxed` carries the trader label that `SourceChanged` does not. */
const SWAP_TAXED_EVENT = parseAbiItem(
  'event SwapTaxed(address indexed trader, bool indexed isBuy, uint256 ethAmount, uint256 srcAmount, uint256 feeAmount, uint256 timestamp)',
);

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
/**
 * Where release directories are written. Overridable only so the test suite can point a real run
 * of this script at a scratch directory; in normal use it is always `<repo>/releases`.
 */
const RELEASES_DIR = process.env.SOURCE_RELEASES_DIR
  ? path.resolve(process.env.SOURCE_RELEASES_DIR)
  : path.join(REPO_ROOT, 'releases');

async function main(): Promise<void> {
  const config = loadConfig();
  const client = createClient(config);

  console.log(`SOURCE release mirror`);
  console.log(`  contract     ${config.address}`);
  console.log(`  chain id     ${config.chainId}`);
  console.log(`  deployed at  block ${config.deploymentBlock}`);
  console.log(`  confirmations ${config.confirmations}`);

  // 1. RPC, chain id, address and deployed bytecode.
  const { bytecodeSize } = await validateDeployment(client, config);
  console.log(`  bytecode     ${bytecodeSize} bytes at ${config.address}`);

  // 2. How many releases the contract has finalized.
  const totalReleases = await readTotalReleases(client, config);
  const headBlock = await client.getBlockNumber();
  console.log(`  head block   ${headBlock}`);
  console.log(`  finalized    ${totalReleases} release(s) on chain`);

  if (totalReleases === 0n) {
    console.log('nothing finalized on chain yet — nothing to mirror.');
    return;
  }

  // 3. Which of them are missing locally.
  const mirrored = await readMirroredIds();
  const missing: bigint[] = [];
  for (let id = 0n; id < totalReleases; id++) {
    if (!mirrored.has(id)) missing.push(id);
  }

  if (missing.length === 0) {
    console.log('every finalized release is already mirrored — nothing to do.');
    return;
  }
  console.log(`missing locally: ${missing.map((id) => `v0.${id}`).join(', ')}`);

  // 4. Fetch every event once for the whole affected range.
  //
  // Verification of release N replays from release N-1's sealed state, so the scan must start at
  // the earliest revision any missing release needs. Releases are contiguous and ordered, so that
  // is the first missing id; everything before it is read from its own already-verified storage.
  const firstMissing = missing[0] as bigint;
  const previous = await loadPreviousAnchor(client, config, firstMissing);

  const scanFrom = previous.block ?? config.deploymentBlock;
  console.log(`scanning events from block ${scanFrom} to ${headBlock}`);

  const [finalizedLogs, changeLogs] = await Promise.all([
    fetchReleaseFinalizedLogs(client, config, scanFrom, headBlock),
    fetchSourceChangedLogs(client, config, scanFrom, headBlock),
  ]);
  console.log(
    `fetched ${finalizedLogs.length} ReleaseFinalized and ${changeLogs.length} SourceChanged event(s)`,
  );

  const finalizedById = indexFinalizedLogs(finalizedLogs);
  const changesByRevision = indexChangeLogs(changeLogs);

  // 5-9. Verify each missing release, then write only the ones that fully pass.
  let state = previous.state;
  let hash = previous.hash;
  const written: bigint[] = [];
  const skipped: Array<{ id: bigint; reason: string }> = [];
  /** Set when the RPC gave out mid-run; the run keeps its progress but still exits non-zero. */
  let networkFailure: string | null = null;

  for (const id of missing) {
    const storage = await readRelease(client, config, id);

    const finalized = finalizedById.get(id);
    if (!finalized) {
      throw new VerificationError(
        `release ${id}: no ReleaseFinalized event found in blocks ${scanFrom}..${headBlock}`,
      );
    }

    const changes = collectChanges(id, changesByRevision);

    // 5. Confirmation depth. A release that is real but still too shallow is not an error: it is
    // simply not ready, and neither it nor anything after it is written this run.
    const depth = headBlock >= storage.finalizedBlock ? headBlock - storage.finalizedBlock + 1n : 0n;
    if (depth < config.confirmations) {
      skipped.push({
        id,
        reason: `only ${depth} of ${config.confirmations} required confirmations`,
      });
      break;
    }

    let traders: Map<string, Address>;
    try {
      traders = await resolveTraders(client, config, changes);
    } catch (error: unknown) {
      // A transport failure (rate limit, timeout) is not a verification failure: stop here and keep
      // whatever earlier releases were already verified, so the run still commits its progress and
      // the next run resumes from this id. A verification error is never caught — it must fail.
      networkFailure = describeNetworkError(error);
      if (!networkFailure) throw error;
      console.warn(`  v0.${id}  stopping early: ${networkFailure}`);
      break;
    }

    // 6-8. Full verification. Any mismatch throws and fails the run.
    const verified = verifyRelease(
      {
        id,
        chainId: config.chainId,
        contractAddress: config.address,
        confirmations: config.confirmations,
        headBlock,
        storage,
        finalized,
        changes,
        previousState: state,
        previousHash: hash,
      },
      traders,
    );

    // 9. Only now does anything touch the filesystem.
    const changed = await writeRelease(verified);
    if (changed) {
      written.push(id);
      console.log(`  v0.${id}  verified and written (${verified.buys} buys, ${verified.sells} sells)`);
    } else {
      console.log(`  v0.${id}  verified, already up to date`);
    }

    state = verified.state;
    hash = verified.hash;
  }

  for (const { id, reason } of skipped) {
    console.log(`  v0.${id}  not yet mirrored: ${reason}`);
  }

  if (written.length === 0) {
    console.log('no new release files written.');
  } else {
    // The workflow reads these to build its commit message without re-deriving anything.
    const first = written[0] as bigint;
    const last = written[written.length - 1] as bigint;
    const message =
      written.length === 1
        ? `release: mirror SOURCE v0.${first}`
        : `release: mirror SOURCE v0.${first}-v0.${last}`;

    console.log(`written: ${written.map((id) => `v0.${id}`).join(', ')}`);
    await emitOutputs({
      released: 'true',
      count: String(written.length),
      first: `v0.${first}`,
      last: `v0.${last}`,
      message,
    });
  }

  // Surface the transport failure after the outputs are emitted, so the workflow still commits the
  // releases that were verified before the RPC gave out. The next run picks up the rest.
  if (networkFailure) {
    throw new RpcUnavailableError(
      `${networkFailure} — mirrored ${written.length} release(s) this run, remaining ones will be retried next run`,
    );
  }
}

/** A run cut short by the RPC rather than by bad chain data. */
class RpcUnavailableError extends Error {
  override name = 'RpcUnavailableError';
}

/**
 * Describe a transport-level failure, or return null if this is not one.
 *
 * Only RPC transport problems qualify — rate limits, timeouts, connection resets, 5xx. A
 * verification error means the chain data disagrees with the mirror and must never be softened
 * into "try again later".
 */
function describeNetworkError(error: unknown): string | null {
  if (error instanceof VerificationError || error instanceof ConfigError) return null;
  if (!(error instanceof Error)) return null;

  const status = (error as { status?: number }).status;
  if (status === 429) return 'RPC rate limit (HTTP 429)';
  if (typeof status === 'number' && status >= 500) return `RPC server error (HTTP ${status})`;

  const name = error.name;
  if (
    name === 'HttpRequestError' ||
    name === 'TimeoutError' ||
    name === 'RpcRequestError' ||
    name === 'InternalRpcError'
  ) {
    return `RPC transport failure (${name})`;
  }

  const code = (error as { code?: string }).code;
  if (code && ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'EAI_AGAIN', 'ENOTFOUND'].includes(code)) {
    return `network failure (${code})`;
  }
  return null;
}

/** Ids already present in `releases/`, read from directory names. */
async function readMirroredIds(): Promise<Set<bigint>> {
  if (!existsSync(RELEASES_DIR)) return new Set();
  const entries = await readdir(RELEASES_DIR, { withFileTypes: true });
  const ids = new Set<bigint>();
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const match = /^v0\.(\d+)$/.exec(entry.name);
    if (!match) continue;
    // A directory only counts as mirrored when it holds the full set of files, so a run
    // interrupted mid-write is retried rather than silently accepted.
    const complete = ['source.src', 'release.json', 'changes.json', 'proof.json', 'README.md'].every(
      (file) => existsSync(path.join(RELEASES_DIR, entry.name, file)),
    );
    if (complete) ids.add(BigInt(match[1] as string));
  }
  return ids;
}

/**
 * The state and hash a release must replay from, plus the block its predecessor finalized in.
 * For release 0 this is the genesis state (all EMPTY) and the zero hash.
 */
async function loadPreviousAnchor(
  client: PublicClient,
  config: SourceConfig,
  id: bigint,
): Promise<{ state: number; hash: Hex; block: bigint | null }> {
  if (id === 0n) return { state: GENESIS_STATE, hash: GENESIS_HASH, block: null };
  const previous = await readRelease(client, config, id - 1n);
  // Scan from the predecessor's own finalization block, not the one after it: two qualifying swaps
  // can land in the same block, so this release's first change may share a block with the
  // predecessor's 32nd. Changes are selected by revision, so re-scanning that block is harmless.
  return { state: previous.state, hash: previous.hash, block: previous.finalizedBlock };
}

function indexFinalizedLogs(logs: ReleaseFinalizedLog[]): Map<bigint, ReleaseFinalizedLog> {
  const byId = new Map<bigint, ReleaseFinalizedLog>();
  for (const log of logs) {
    const existing = byId.get(log.releaseId);
    if (existing) {
      throw new VerificationError(
        `duplicate ReleaseFinalized for release ${log.releaseId}: block ${existing.blockNumber} log ${existing.logIndex} and block ${log.blockNumber} log ${log.logIndex}`,
      );
    }
    byId.set(log.releaseId, log);
  }
  return byId;
}

function indexChangeLogs(logs: SourceChangedLog[]): Map<bigint, SourceChangedLog> {
  const byRevision = new Map<bigint, SourceChangedLog>();
  for (const log of logs) {
    const existing = byRevision.get(log.revision);
    if (existing) {
      throw new VerificationError(
        `duplicate SourceChanged for revision ${log.revision}: block ${existing.blockNumber} log ${existing.logIndex} and block ${log.blockNumber} log ${log.logIndex}`,
      );
    }
    byRevision.set(log.revision, log);
  }
  return byRevision;
}

/** The 32 changes composing release `id`, in revision order. Missing events fail the run. */
function collectChanges(id: bigint, byRevision: Map<bigint, SourceChangedLog>): SourceChangedLog[] {
  const first = id * BigInt(RELEASE_SIZE) + 1n;
  const changes: SourceChangedLog[] = [];
  for (let i = 0; i < RELEASE_SIZE; i++) {
    const revision = first + BigInt(i);
    const log = byRevision.get(revision);
    if (!log) {
      throw new VerificationError(
        `release ${id}: no SourceChanged event for revision ${revision} — the mirror will not write a partially observed release`,
      );
    }
    changes.push(log);
  }
  return changes;
}

/**
 * Map each change's transaction to its `SwapTaxed` trader. One `getLogs` call per distinct block
 * touched by the release, which is far fewer than one per transaction.
 */
async function resolveTraders(
  client: PublicClient,
  config: SourceConfig,
  changes: SourceChangedLog[],
): Promise<Map<string, Address>> {
  const blocks = changes.map((change) => change.blockNumber);
  const traders = new Map<string, Address>();
  if (blocks.length === 0) return traders;

  // One chunked scan over the whole span the release occupies, rather than one request per block.
  // A release's 32 changes are usually spread over many blocks, and a per-block query multiplies
  // into hundreds of calls that a rate-limited provider will reject.
  let from = blocks[0] as bigint;
  let to = from;
  for (const block of blocks) {
    if (block < from) from = block;
    if (block > to) to = block;
  }

  const logs = await getSwapTaxedLogs(client, config, from, to);
  for (const log of logs) {
    const trader = (log.args as { trader?: Address }).trader;
    if (trader && log.transactionHash) traders.set(log.transactionHash.toLowerCase(), trader);
  }
  return traders;
}

/** Fetch `SwapTaxed` logs in chunks, so a bounded-range provider does not reject the query. */
async function getSwapTaxedLogs(
  client: PublicClient,
  config: SourceConfig,
  fromBlock: bigint,
  toBlock: bigint,
): Promise<Array<{ args: unknown; transactionHash: Hex | null }>> {
  const chunk = 10_000n;
  const collected: Array<{ args: unknown; transactionHash: Hex | null }> = [];
  for (let from = fromBlock; from <= toBlock; from += chunk) {
    const to = from + chunk - 1n > toBlock ? toBlock : from + chunk - 1n;
    collected.push(
      ...(await client.getLogs({
        address: config.address,
        event: SWAP_TAXED_EVENT,
        fromBlock: from,
        toBlock: to,
      })),
    );
  }
  return collected;
}

/** Write a verified release. Returns true when anything on disk actually changed. */
async function writeRelease(release: VerifiedRelease): Promise<boolean> {
  const dir = path.join(RELEASES_DIR, releaseDirName(release.id));
  const files = renderRelease(release);

  let changed = false;
  await mkdir(dir, { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    const file = path.join(dir, name);
    const existing = existsSync(file) ? await readFile(file, 'utf8') : null;
    if (existing === contents) continue;
    await writeFile(file, contents, 'utf8');
    changed = true;
  }
  return changed;
}

/** Publish results to `$GITHUB_OUTPUT` when running under Actions; a no-op locally. */
async function emitOutputs(outputs: Record<string, string>): Promise<void> {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  const lines = Object.entries(outputs).map(([key, value]) => `${key}=${value}\n`);
  await writeFile(file, lines.join(''), { encoding: 'utf8', flag: 'a' });
}

main().catch((error: unknown) => {
  if (
    error instanceof ConfigError ||
    error instanceof VerificationError ||
    error instanceof RpcUnavailableError
  ) {
    console.error(`${error.name}: ${error.message}`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
