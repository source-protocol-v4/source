#!/usr/bin/env tsx
/**
 * Re-verify releases that are already mirrored in `releases/`.
 *
 *   npm run verify:release -- 1     verify one release
 *   npm run verify:all              verify every mirrored release
 *
 * This is the auditor's path: it re-reads the release from the chain, replays its 32 changes from
 * the previous release's sealed state, and then also checks that the files on disk are exactly
 * what that verified release renders to. A tampered file fails here even when the chain agrees.
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import type { PublicClient, Hex } from 'viem';

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
  type SourceChangedLog,
  type SourceConfig,
} from '../lib/contract.js';
import { RELEASE_SIZE } from '../lib/source-codec.js';
import { GENESIS_HASH, GENESIS_STATE, verifyRelease } from '../lib/verify.js';
import { releaseDirName, renderRelease } from '../lib/release-files.js';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
/** See the note on the same constant in `sync-releases.ts`. */
const RELEASES_DIR = process.env.SOURCE_RELEASES_DIR
  ? path.resolve(process.env.SOURCE_RELEASES_DIR)
  : path.join(REPO_ROOT, 'releases');

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const all = args.includes('--all');
  const ids = args.filter((arg) => !arg.startsWith('--'));

  if (!all && ids.length === 0) {
    console.error('usage: verify-release <id> [<id>...]   |   verify-release --all');
    process.exitCode = 2;
    return;
  }

  const config = loadConfig();
  const client = createClient(config);
  await validateDeployment(client, config);

  const targets = all ? await mirroredIds() : ids.map(parseId);
  if (targets.length === 0) {
    console.log('no mirrored releases to verify.');
    return;
  }

  const totalReleases = await readTotalReleases(client, config);
  const headBlock = await client.getBlockNumber();

  let failures = 0;
  for (const id of targets) {
    try {
      await verifyOne(client, config, id, totalReleases, headBlock);
      console.log(`v0.${id}  OK`);
    } catch (error: unknown) {
      failures++;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`v0.${id}  FAILED: ${message}`);
    }
  }

  console.log(
    failures === 0
      ? `verified ${targets.length} release(s), all OK`
      : `verified ${targets.length} release(s), ${failures} FAILED`,
  );
  if (failures > 0) process.exitCode = 1;
}

async function verifyOne(
  client: PublicClient,
  config: SourceConfig,
  id: bigint,
  totalReleases: bigint,
  headBlock: bigint,
): Promise<void> {
  if (id >= totalReleases) {
    throw new VerificationError(`release ${id} is not finalized on chain (${totalReleases} so far)`);
  }

  const storage = await readRelease(client, config, id);

  // Replay anchor: the previous release's sealed state and hash.
  let previousState = GENESIS_STATE;
  let previousHash: Hex = GENESIS_HASH;
  let scanFrom = config.deploymentBlock;
  if (id > 0n) {
    const previous = await readRelease(client, config, id - 1n);
    previousState = previous.state;
    previousHash = previous.hash;
    // From the predecessor's finalization block, not the one after: this release's first change
    // may share that block. `selectChanges` filters by revision, so the overlap is harmless.
    scanFrom = previous.finalizedBlock;
  }

  const [finalizedLogs, changeLogs] = await Promise.all([
    fetchReleaseFinalizedLogs(client, config, scanFrom, storage.finalizedBlock, { releaseId: id }),
    fetchSourceChangedLogs(client, config, scanFrom, storage.finalizedBlock),
  ]);

  if (finalizedLogs.length === 0) {
    throw new VerificationError(`no ReleaseFinalized event found for release ${id}`);
  }
  if (finalizedLogs.length > 1) {
    throw new VerificationError(`duplicate ReleaseFinalized events for release ${id}`);
  }

  const changes = selectChanges(id, changeLogs);
  const traders = await tradersFromFiles(id);

  const verified = verifyRelease(
    {
      id,
      chainId: config.chainId,
      contractAddress: config.address,
      confirmations: config.confirmations,
      headBlock,
      storage,
      finalized: finalizedLogs[0] as (typeof finalizedLogs)[number],
      changes,
      previousState,
      previousHash,
    },
    traders,
  );

  // The chain agrees. Now check the mirrored files are exactly what it renders to.
  const dir = path.join(RELEASES_DIR, releaseDirName(id));
  if (!existsSync(dir)) {
    throw new VerificationError(`release ${id} verified on chain but is not mirrored in releases/`);
  }
  const expected = renderRelease(verified);
  for (const [name, contents] of Object.entries(expected)) {
    const file = path.join(dir, name);
    if (!existsSync(file)) throw new VerificationError(`missing file ${releaseDirName(id)}/${name}`);
    const actual = await readFile(file, 'utf8');
    if (actual !== contents) {
      throw new VerificationError(
        `${releaseDirName(id)}/${name} does not match the verified release — the mirrored file has been altered`,
      );
    }
  }
}

/** Pick the 32 changes belonging to release `id` out of a wider scan. */
function selectChanges(id: bigint, logs: SourceChangedLog[]): SourceChangedLog[] {
  const first = id * BigInt(RELEASE_SIZE) + 1n;
  const last = first + BigInt(RELEASE_SIZE) - 1n;
  const byRevision = new Map<bigint, SourceChangedLog>();
  for (const log of logs) {
    if (log.revision < first || log.revision > last) continue;
    if (byRevision.has(log.revision)) {
      throw new VerificationError(`duplicate SourceChanged for revision ${log.revision}`);
    }
    byRevision.set(log.revision, log);
  }
  const changes: SourceChangedLog[] = [];
  for (let revision = first; revision <= last; revision++) {
    const log = byRevision.get(revision);
    if (!log) throw new VerificationError(`no SourceChanged event for revision ${revision}`);
    changes.push(log);
  }
  return changes;
}

/**
 * Re-use the trader labels already recorded in the mirrored `changes.json`.
 *
 * The trader is a cosmetic `tx.origin` label from `SwapTaxed`, not part of any consensus value.
 * Reading it back from the file keeps re-verification from depending on log queries that some
 * pruned RPC endpoints answer slowly, while still letting the byte-comparison above catch any
 * change to it: a file with the wrong trader would have to be self-consistent AND match every
 * chain-derived field, and the chain-derived fields are recomputed from scratch.
 */
async function tradersFromFiles(id: bigint): Promise<Map<string, `0x${string}`>> {
  const file = path.join(RELEASES_DIR, releaseDirName(id), 'changes.json');
  const traders = new Map<string, `0x${string}`>();
  if (!existsSync(file)) return traders;
  const parsed = JSON.parse(await readFile(file, 'utf8')) as {
    changes?: Array<{ transactionHash?: string; trader?: string }>;
  };
  for (const change of parsed.changes ?? []) {
    if (change.transactionHash && change.trader) {
      traders.set(change.transactionHash.toLowerCase(), change.trader as `0x${string}`);
    }
  }
  return traders;
}

async function mirroredIds(): Promise<bigint[]> {
  if (!existsSync(RELEASES_DIR)) return [];
  const entries = await readdir(RELEASES_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => /^v0\.(\d+)$/.exec(entry.name))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => BigInt(match[1] as string))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function parseId(raw: string): bigint {
  const trimmed = raw.trim().replace(/^v0\./, '');
  if (!/^\d+$/.test(trimmed)) throw new ConfigError(`not a release id: ${raw}`);
  return BigInt(trimmed);
}

main().catch((error: unknown) => {
  if (error instanceof ConfigError || error instanceof VerificationError) {
    console.error(`${error.name}: ${error.message}`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
