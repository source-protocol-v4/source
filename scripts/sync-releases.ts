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
import {
  releaseDirName,
  renderHistory,
  renderLatestJson,
  renderReadmeBlock,
  renderRelease,
  spliceReadmeBlock,
} from '../lib/release-files.js';

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

/** Pause between per-release reads, so a long backlog does not burst past a provider's rate limit. */
const REQUEST_SPACING_MS = Number(process.env.SOURCE_REQUEST_SPACING_MS ?? 250);

const sleep = (ms: number): Promise<void> =>
  ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

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

  // Every log the whole run needs, fetched once over the full range and then indexed in memory.
  // Anything per-release here would multiply into one request per release and trip a provider's
  // rate limit as soon as several releases are outstanding.
  const finalizedLogs = await fetchReleaseFinalizedLogs(client, config, scanFrom, headBlock);
  const changeLogs = await fetchSourceChangedLogs(client, config, scanFrom, headBlock);
  const traders = await fetchTraders(client, config, scanFrom, headBlock);
  console.log(
    `fetched ${finalizedLogs.length} ReleaseFinalized, ${changeLogs.length} SourceChanged and ${traders.size} trader label(s)`,
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
  /** The newest release verified this run, used to refresh the repository-level summaries. */
  let latestVerified: VerifiedRelease | null = null;

  for (const [index, id] of missing.entries()) {
    // Space out the per-release reads. Without this, mirroring a long backlog fires one request
    // per release back-to-back, which is exactly what a free-tier provider rate-limits.
    if (index > 0) await sleep(REQUEST_SPACING_MS);

    // The one unavoidable per-release request. A transport failure here is not a verification
    // failure: stop, keep everything already verified, and let the next run resume from this id.
    let storage: Release;
    try {
      storage = await readRelease(client, config, id);
    } catch (error: unknown) {
      networkFailure = describeNetworkError(error);
      if (!networkFailure) throw error;
      console.log(`  v0.${id}  stopping early: ${networkFailure}`);
      break;
    }

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

    latestVerified = verified;
    state = verified.state;
    hash = verified.hash;
  }

  for (const { id, reason } of skipped) {
    console.log(`  v0.${id}  not yet mirrored: ${reason}`);
  }

  // Repository-level summaries follow the newest release, so they are refreshed whenever one was
  // added. They are derived entirely from already-verified data — no extra RPC calls.
  if (written.length > 0 && latestVerified) {
    await writeSummaries(latestVerified, Number(totalReleases));
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

  // viem wraps transport errors in higher-level ones (ContractFunctionExecutionError around an
  // HttpRequestError, say), so the HTTP status lives further down the `cause` chain than the
  // error we were handed. Walk it rather than only inspecting the outermost error.
  for (let current: unknown = error, depth = 0; current && depth < 10; depth++) {
    if (!(current instanceof Error)) break;

    const status = (current as { status?: number }).status;
    if (status === 429) return 'RPC rate limit (HTTP 429)';
    if (typeof status === 'number' && status >= 500) return `RPC server error (HTTP ${status})`;

    const name = current.name;
    if (
      name === 'HttpRequestError' ||
      name === 'TimeoutError' ||
      name === 'RpcRequestError' ||
      name === 'InternalRpcError'
    ) {
      return `RPC transport failure (${name})`;
    }

    const code = (current as { code?: string }).code;
    if (code && ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'EAI_AGAIN', 'ENOTFOUND'].includes(code)) {
      return `network failure (${code})`;
    }

    current = (current as { cause?: unknown }).cause;
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
 * Map every transaction in the scanned range to its `SwapTaxed` trader label.
 *
 * Fetched once for the whole run, in the same wide chunks as the other event scans. The trader is
 * cosmetic — `SourceChanged` does not carry it and the contract never reads it for authorization —
 * so a provider that refuses this query degrades the label to the zero address rather than failing
 * the run: the releases themselves are still fully verified from `SourceChanged`.
 */
async function fetchTraders(
  client: PublicClient,
  config: SourceConfig,
  fromBlock: bigint,
  toBlock: bigint,
): Promise<Map<string, Address>> {
  const traders = new Map<string, Address>();
  const chunk = 10_000n;
  try {
    for (let from = fromBlock; from <= toBlock; from += chunk) {
      const to = from + chunk - 1n > toBlock ? toBlock : from + chunk - 1n;
      const logs = await client.getLogs({
        address: config.address,
        event: SWAP_TAXED_EVENT,
        fromBlock: from,
        toBlock: to,
      });
      for (const log of logs) {
        const trader = (log.args as { trader?: Address }).trader;
        if (trader && log.transactionHash) traders.set(log.transactionHash.toLowerCase(), trader);
      }
    }
  } catch (error: unknown) {
    const failure = describeNetworkError(error);
    if (!failure) throw error;
    console.log(`  trader labels unavailable (${failure}) — recording them as the zero address`);
    return new Map();
  }
  return traders;
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

/**
 * Refresh the repository-level summaries: `releases/latest.json`, `releases/HISTORY.md` and the
 * generated block in the root README.
 *
 * All three are derived from data that has already been verified, so nothing here can introduce an
 * unverified claim. Each is written only when its bytes actually change, preserving idempotence.
 * A missing README block is not an error — the splice is a no-op when the markers are absent.
 */
async function writeSummaries(latest: VerifiedRelease, totalReleases: number): Promise<void> {
  await writeIfChanged(
    path.join(RELEASES_DIR, 'latest.json'),
    renderLatestJson(latest, totalReleases),
  );

  const history = await readMirroredReleases();
  if (history.length > 0) {
    await writeIfChanged(path.join(RELEASES_DIR, 'HISTORY.md'), renderHistory(history));
  }

  // Sits beside the releases directory, so a run pointed at a scratch directory by the test suite
  // never touches the repository's own README.
  const readmePath = path.join(path.dirname(RELEASES_DIR), 'README.md');
  if (existsSync(readmePath)) {
    const readme = await readFile(readmePath, 'utf8');
    const spliced = spliceReadmeBlock(readme, renderReadmeBlock(latest, totalReleases));
    if (spliced !== readme) {
      await writeFile(readmePath, spliced, 'utf8');
      console.log('  README.md  program banner updated');
    }
  }
}

/** Write only when the contents differ, so an unchanged file is never touched. */
async function writeIfChanged(file: string, contents: string): Promise<void> {
  const existing = existsSync(file) ? await readFile(file, 'utf8') : null;
  if (existing === contents) return;
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents, 'utf8');
  console.log(`  ${path.basename(file)}  updated`);
}

/**
 * Read every mirrored release back off disk, oldest first, so the history covers releases from
 * earlier runs and not only the ones added just now.
 *
 * The files were written from verified data, and `verify-release` re-checks them against the
 * chain, so reading them back here does not weaken any guarantee.
 */
async function readMirroredReleases(): Promise<VerifiedRelease[]> {
  if (!existsSync(RELEASES_DIR)) return [];
  const entries = await readdir(RELEASES_DIR, { withFileTypes: true });
  const ids = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => /^v0\.(\d+)$/.exec(entry.name))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => BigInt(match[1] as string))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const releases: VerifiedRelease[] = [];
  for (const id of ids) {
    const file = path.join(RELEASES_DIR, releaseDirName(id), 'release.json');
    if (!existsSync(file)) continue;
    const parsed = JSON.parse(await readFile(file, 'utf8')) as {
      releaseId: string;
      revision: string;
      packedStateDecimal: string;
      sourceHash: Hex;
      previousSourceHash: Hex | null;
      buys: number;
      sells: number;
      finalizedBlock: string;
      chainId: number;
      contract: Address;
      instructions: Array<{ op: number }>;
    };
    releases.push({
      id: BigInt(parsed.releaseId),
      chainId: parsed.chainId,
      contractAddress: parsed.contract,
      state: Number(parsed.packedStateDecimal),
      program: parsed.instructions.map((entry) => entry.op) as VerifiedRelease['program'],
      hash: parsed.sourceHash,
      previousHash: parsed.previousSourceHash,
      finalRevision: BigInt(parsed.revision),
      finalizedBlock: BigInt(parsed.finalizedBlock),
      buys: parsed.buys,
      sells: parsed.sells,
      // Not recorded in release.json and not used by the history table.
      confirmations: 0n,
      requiredConfirmations: 0n,
      changes: [],
      finalizationTransaction: '0x',
      finalizationBlockHash: '0x',
      finalizationLogIndex: 0,
    });
  }
  return releases;
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
