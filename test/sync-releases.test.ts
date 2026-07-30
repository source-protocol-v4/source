/**
 * End-to-end tests for `scripts/sync-releases.ts`, driven by a local mock JSON-RPC server rather
 * than mainnet. The script is run as a real child process against that server, so what is tested
 * is the shipped script — its validation, its verification, its file writing and its idempotence —
 * and not a reimplementation of it.
 */

import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { test, describe, before, after } from 'node:test';

import {
  encodeAbiParameters,
  encodeEventTopics,
  parseAbiItem,
  toFunctionSelector,
  toHex,
  type Address,
  type Hex,
} from 'viem';

import { SOURCE_ABI } from '../lib/contract.js';
import { TEST_CHAIN_ID, TEST_CONTRACT, buildReleases, type BuiltRelease } from './helpers.js';

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const SYNC_SCRIPT = path.join(REPO_ROOT, 'scripts', 'sync-releases.ts');

const SWAP_TAXED_EVENT = parseAbiItem(
  'event SwapTaxed(address indexed trader, bool indexed isBuy, uint256 ethAmount, uint256 srcAmount, uint256 feeAmount, uint256 timestamp)',
);
const SOURCE_CHANGED_EVENT = parseAbiItem(
  'event SourceChanged(uint256 indexed revision, uint8 indexed slot, uint8 oldOp, uint8 newOp, bool isBuy, uint32 newState, bytes32 newHash, uint256 timestamp)',
);
const RELEASE_FINALIZED_EVENT = parseAbiItem(
  'event ReleaseFinalized(uint256 indexed releaseId, uint32 state, bytes32 hash, uint256 finalRevision, uint256 finalizedBlock, uint32 buys, uint32 sells)',
);

const TRADER: Address = '0x000000000000000000000000000000000000ABcD';

interface MockState {
  releases: BuiltRelease[];
  /** How many releases the contract reports as finalized. */
  visible: number;
  headBlock: bigint;
}

/**
 * A minimal `eth_*` JSON-RPC server that answers exactly what the sync script asks for, from a
 * synthesized set of releases. Contract calls are dispatched by matching the encoded selector of
 * each ABI function, so the script's real viem encoding is exercised.
 */
function startMockNode(state: MockState): Promise<{ server: Server; url: string }> {
  const selectorOf = (name: string): Hex => {
    const item = SOURCE_ABI.find((entry) => entry.type === 'function' && entry.name === name);
    assert.ok(item, `no ABI entry for ${name}`);
    return functionSelector(item as { name: string; inputs: readonly { type: string }[] });
  };

  const selectors = new Map<string, string>();
  for (const name of [
    'totalReleases',
    'releaseAt',
    'SLOT_COUNT',
    'RELEASE_SIZE',
    'BITS_PER_SLOT',
    'SLOT_MASK',
  ]) {
    selectors.set(selectorOf(name), name);
  }

  const handle = (method: string, params: unknown[]): unknown => {
    switch (method) {
      case 'eth_chainId':
        return toHex(TEST_CHAIN_ID);
      case 'eth_blockNumber':
        return toHex(state.headBlock);
      case 'eth_getCode':
        return '0x60806040523480156100';
      case 'eth_call': {
        const call = params[0] as { data: Hex };
        const name = selectors.get(call.data.slice(0, 10));
        switch (name) {
          case 'totalReleases':
            return encodeAbiParameters([{ type: 'uint256' }], [BigInt(state.visible)]);
          case 'SLOT_COUNT':
            return encodeAbiParameters([{ type: 'uint256' }], [16n]);
          case 'RELEASE_SIZE':
            return encodeAbiParameters([{ type: 'uint256' }], [32n]);
          case 'BITS_PER_SLOT':
            return encodeAbiParameters([{ type: 'uint256' }], [2n]);
          case 'SLOT_MASK':
            return encodeAbiParameters([{ type: 'uint256' }], [3n]);
          case 'releaseAt': {
            const id = Number(BigInt(`0x${call.data.slice(10)}`));
            const release = state.releases[id];
            assert.ok(release, `mock has no release ${id}`);
            return encodeAbiParameters(
              [
                {
                  type: 'tuple',
                  components: [
                    { name: 'state', type: 'uint32' },
                    { name: 'hash', type: 'bytes32' },
                    { name: 'finalRevision', type: 'uint256' },
                    { name: 'finalizedBlock', type: 'uint256' },
                    { name: 'buys', type: 'uint32' },
                    { name: 'sells', type: 'uint32' },
                  ],
                },
              ],
              [
                {
                  state: release.storage.state,
                  hash: release.storage.hash,
                  finalRevision: release.storage.finalRevision,
                  finalizedBlock: release.storage.finalizedBlock,
                  buys: release.storage.buys,
                  sells: release.storage.sells,
                },
              ],
            );
          }
          default:
            throw new Error(`mock received an unexpected eth_call: ${call.data.slice(0, 10)}`);
        }
      }
      case 'eth_getLogs': {
        const filter = params[0] as { fromBlock: Hex; toBlock: Hex; topics?: (Hex | null)[] };
        const from = BigInt(filter.fromBlock);
        const to = BigInt(filter.toBlock);
        const topic0 = filter.topics?.[0];
        return buildLogs(state, topic0 ?? null, from, to, filter.topics?.[1] ?? null);
      }
      default:
        throw new Error(`mock received an unsupported method: ${method}`);
    }
  };

  const server = createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const request = JSON.parse(body) as { id: number; method: string; params?: unknown[] };
      let payload: unknown;
      try {
        payload = { jsonrpc: '2.0', id: request.id, result: handle(request.method, request.params ?? []) };
      } catch (error) {
        payload = {
          jsonrpc: '2.0',
          id: request.id,
          error: { code: -32000, message: (error as Error).message },
        };
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(payload));
    });
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      assert.ok(address && typeof address === 'object');
      resolve({ server, url: `http://127.0.0.1:${address.port}` });
    });
  });
}

/** Encode the logs the mock chain would return for a filter. */
function buildLogs(
  state: MockState,
  topic0: Hex | null,
  from: bigint,
  to: bigint,
  topic1: Hex | null,
): unknown[] {
  const [changedTopic] = encodeEventTopics({ abi: [SOURCE_CHANGED_EVENT], eventName: 'SourceChanged' });
  const [finalizedTopic] = encodeEventTopics({
    abi: [RELEASE_FINALIZED_EVENT],
    eventName: 'ReleaseFinalized',
  });
  const [swapTopic] = encodeEventTopics({ abi: [SWAP_TAXED_EVENT], eventName: 'SwapTaxed' });

  const logs: Array<Record<string, unknown>> = [];
  const visible = state.releases.slice(0, state.visible);

  if (topic0 === changedTopic || topic0 === swapTopic) {
    for (const release of visible) {
      for (const change of release.changes) {
        if (change.blockNumber < from || change.blockNumber > to) continue;
        if (topic0 === changedTopic) {
          logs.push({
            address: TEST_CONTRACT,
            topics: encodeEventTopics({
              abi: [SOURCE_CHANGED_EVENT],
              eventName: 'SourceChanged',
              args: { revision: change.revision, slot: change.slot },
            }),
            data: encodeAbiParameters(
              [
                { type: 'uint8' },
                { type: 'uint8' },
                { type: 'bool' },
                { type: 'uint32' },
                { type: 'bytes32' },
                { type: 'uint256' },
              ],
              [change.oldOp, change.newOp, change.isBuy, change.newState, change.newHash, change.timestamp],
            ),
            blockNumber: toHex(change.blockNumber),
            blockHash: change.blockHash,
            transactionHash: change.transactionHash,
            transactionIndex: toHex(change.transactionIndex),
            logIndex: toHex(change.logIndex),
            removed: false,
          });
        } else {
          logs.push({
            address: TEST_CONTRACT,
            topics: encodeEventTopics({
              abi: [SWAP_TAXED_EVENT],
              eventName: 'SwapTaxed',
              args: { trader: TRADER, isBuy: change.isBuy },
            }),
            data: encodeAbiParameters(
              [{ type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }],
              [10n ** 18n, 30n * 10n ** 18n, 2n * 10n ** 16n, change.timestamp],
            ),
            blockNumber: toHex(change.blockNumber),
            blockHash: change.blockHash,
            transactionHash: change.transactionHash,
            transactionIndex: toHex(change.transactionIndex),
            // one slot before the SourceChanged log of the same transaction
            logIndex: toHex(Math.max(change.logIndex - 1, 0)),
            removed: false,
          });
        }
      }
    }
  }

  if (topic0 === finalizedTopic) {
    for (const release of visible) {
      const log = release.finalized;
      if (log.blockNumber < from || log.blockNumber > to) continue;
      const topics = encodeEventTopics({
        abi: [RELEASE_FINALIZED_EVENT],
        eventName: 'ReleaseFinalized',
        args: { releaseId: log.releaseId },
      });
      if (topic1 && topics[1] !== topic1) continue;
      logs.push({
        address: TEST_CONTRACT,
        topics,
        data: encodeAbiParameters(
          [
            { type: 'uint32' },
            { type: 'bytes32' },
            { type: 'uint256' },
            { type: 'uint256' },
            { type: 'uint32' },
            { type: 'uint32' },
          ],
          [log.state, log.hash, log.finalRevision, log.finalizedBlock, log.buys, log.sells],
        ),
        blockNumber: toHex(log.blockNumber),
        blockHash: log.blockHash,
        transactionHash: log.transactionHash,
        transactionIndex: toHex(log.transactionIndex),
        logIndex: toHex(log.logIndex),
        removed: false,
      });
    }
  }

  return logs;
}

function functionSelector(item: { name: string; inputs: readonly { type: string }[] }): Hex {
  return toFunctionSelector(`${item.name}(${item.inputs.map((input) => input.type).join(',')})`);
}

describe('sync-releases', () => {
  let server: Server;
  let url: string;
  let workdir: string;
  const state: MockState = { releases: [], visible: 0, headBlock: 0n };

  before(async () => {
    state.releases = buildReleases(3);
    state.visible = 0;
    state.headBlock = 0n;

    const started = await startMockNode(state);
    server = started.server;
    url = started.url;

    workdir = await mkdtemp(path.join(os.tmpdir(), 'source-mirror-'));
  });

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await rm(workdir, { recursive: true, force: true });
  });

  /** Run the real sync script against the mock node, with `releases/` redirected into a temp dir. */
  async function runSync(releasesDir: string): Promise<{ stdout: string; stderr: string; code: number }> {
    try {
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        ['--import', 'tsx', SYNC_SCRIPT],
        {
          cwd: REPO_ROOT,
          env: {
            ...process.env,
            ETH_RPC_URL: url,
            SOURCE_ADDRESS: TEST_CONTRACT,
            DEPLOYMENT_BLOCK: '1',
            CHAIN_ID: String(TEST_CHAIN_ID),
            CONFIRMATIONS: '20',
            SOURCE_RELEASES_DIR: releasesDir,
          },
        },
      );
      return { stdout, stderr, code: 0 };
    } catch (error) {
      const failure = error as { stdout?: string; stderr?: string; code?: number };
      return { stdout: failure.stdout ?? '', stderr: failure.stderr ?? '', code: failure.code ?? 1 };
    }
  }

  async function listReleases(dir: string): Promise<string[]> {
    if (!existsSync(dir)) return [];
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  }

  test('does nothing when the contract has finalized no releases', async () => {
    const dir = path.join(workdir, 'empty');
    state.visible = 0;
    state.headBlock = 2_000_000n;
    const result = await runSync(dir);
    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /nothing finalized on chain yet/);
    assert.deepEqual(await listReleases(dir), []);
  });

  test('mirrors one missing release', async () => {
    const dir = path.join(workdir, 'one');
    state.visible = 1;
    const first = state.releases[0];
    assert.ok(first);
    state.headBlock = first.storage.finalizedBlock + 50n;

    const result = await runSync(dir);
    assert.equal(result.code, 0, result.stderr);
    assert.deepEqual(await listReleases(dir), ['v0.0']);

    const files = await readdir(path.join(dir, 'v0.0'));
    assert.deepEqual(files.sort(), [
      'README.md',
      'changes.json',
      'proof.json',
      'release.json',
      'source.src',
    ]);

    const release = JSON.parse(await readFile(path.join(dir, 'v0.0', 'release.json'), 'utf8')) as {
      sourceHash: string;
      verified: boolean;
      buys: number;
      sells: number;
    };
    assert.equal(release.sourceHash, first.storage.hash);
    assert.equal(release.verified, true);
    assert.equal(release.buys + release.sells, 32);

    const changes = JSON.parse(await readFile(path.join(dir, 'v0.0', 'changes.json'), 'utf8')) as {
      changes: Array<{ trader: string }>;
    };
    assert.equal(changes.changes.length, 32);
    assert.equal(changes.changes[0]?.trader, TRADER, 'the trader is resolved from SwapTaxed');
  });

  test('repeated synchronization with no new releases changes nothing', async () => {
    const dir = path.join(workdir, 'idempotent');
    state.visible = 1;
    const first = state.releases[0];
    assert.ok(first);
    state.headBlock = first.storage.finalizedBlock + 50n;

    assert.equal((await runSync(dir)).code, 0);
    const snapshot = await snapshotDir(dir);

    const second = await runSync(dir);
    assert.equal(second.code, 0, second.stderr);
    assert.match(second.stdout, /already mirrored|already up to date/);
    assert.deepEqual(await snapshotDir(dir), snapshot, 'a second run must change nothing');

    const third = await runSync(dir);
    assert.equal(third.code, 0);
    assert.deepEqual(await snapshotDir(dir), snapshot, 'a third run must change nothing');
  });

  test('mirrors multiple missing releases in one run', async () => {
    const dir = path.join(workdir, 'many');
    state.visible = 3;
    const third = state.releases[2];
    assert.ok(third);
    state.headBlock = third.storage.finalizedBlock + 50n;

    const result = await runSync(dir);
    assert.equal(result.code, 0, result.stderr);
    assert.deepEqual(await listReleases(dir), ['v0.0', 'v0.1', 'v0.2']);

    // each release records its predecessor's hash
    for (const id of [1, 2]) {
      const current = JSON.parse(await readFile(path.join(dir, `v0.${id}`, 'release.json'), 'utf8')) as {
        previousSourceHash: string;
      };
      assert.equal(current.previousSourceHash, state.releases[id - 1]?.hash);
    }
    const first = JSON.parse(await readFile(path.join(dir, 'v0.0', 'release.json'), 'utf8')) as {
      previousSourceHash: string | null;
    };
    assert.equal(first.previousSourceHash, null);
  });

  test('picks up only the newly finalized release on a later run', async () => {
    const dir = path.join(workdir, 'incremental');
    state.visible = 1;
    const first = state.releases[0];
    const second = state.releases[1];
    assert.ok(first && second);
    state.headBlock = first.storage.finalizedBlock + 50n;
    assert.equal((await runSync(dir)).code, 0);
    assert.deepEqual(await listReleases(dir), ['v0.0']);
    const before = await snapshotDir(dir);

    state.visible = 2;
    state.headBlock = second.storage.finalizedBlock + 50n;
    const result = await runSync(dir);
    assert.equal(result.code, 0, result.stderr);
    assert.deepEqual(await listReleases(dir), ['v0.0', 'v0.1']);

    // the already-mirrored release must not be rewritten
    for (const [name, contents] of Object.entries(before)) {
      assert.equal((await snapshotDir(dir))[name], contents, `${name} was rewritten`);
    }
  });

  test('does not mirror a release with too few confirmations', async () => {
    const dir = path.join(workdir, 'shallow');
    state.visible = 1;
    const first = state.releases[0];
    assert.ok(first);
    state.headBlock = first.storage.finalizedBlock + 3n;

    const result = await runSync(dir);
    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /required confirmations/);
    assert.deepEqual(await listReleases(dir), [], 'nothing may be written yet');

    // once it is deep enough, the same release is mirrored
    state.headBlock = first.storage.finalizedBlock + 50n;
    assert.equal((await runSync(dir)).code, 0);
    assert.deepEqual(await listReleases(dir), ['v0.0']);
  });

  test('stops at the first unconfirmed release and mirrors the ones before it', async () => {
    const dir = path.join(workdir, 'partial');
    state.visible = 3;
    const second = state.releases[1];
    const third = state.releases[2];
    assert.ok(second && third);
    // deep enough for releases 0 and 1, too shallow for 2
    state.headBlock = second.storage.finalizedBlock + 25n;
    assert.ok(state.headBlock < third.storage.finalizedBlock + 20n);

    const result = await runSync(dir);
    assert.equal(result.code, 0, result.stderr);
    assert.deepEqual(await listReleases(dir), ['v0.0', 'v0.1']);
  });

  test('mirrors releases whose changes share a block across the release boundary', async () => {
    // Two qualifying swaps can land in one block, so a release's first change may share a block
    // with its predecessor's 32nd. A scan that started one block late would miss it.
    const dense = buildReleases(2, { changesPerBlock: 64, shareBlockAcrossReleases: true });
    const first = dense[0];
    const second = dense[1];
    assert.ok(first && second);
    assert.equal(
      second.changes[0]?.blockNumber,
      first.storage.finalizedBlock,
      'the fixture must put both releases in the same block',
    );

    const previous = { releases: state.releases, visible: state.visible, headBlock: state.headBlock };
    state.releases = dense;

    try {
      const dir = path.join(workdir, 'dense');

      // Mirror release 0 first, so the second run has to resolve release 1's replay anchor through
      // `loadPreviousAnchor` — the path that decides which block the event scan starts at.
      state.visible = 1;
      state.headBlock = first.storage.finalizedBlock + 50n;
      const initial = await runSync(dir);
      assert.equal(initial.code, 0, initial.stderr);
      assert.deepEqual(await listReleases(dir), ['v0.0']);

      // Now release 1 is finalized, and its first change sits in release 0's finalization block.
      state.visible = 2;
      state.headBlock = second.storage.finalizedBlock + 50n;
      const result = await runSync(dir);
      assert.equal(result.code, 0, result.stderr);
      assert.deepEqual(await listReleases(dir), ['v0.0', 'v0.1']);
    } finally {
      state.releases = previous.releases;
      state.visible = previous.visible;
      state.headBlock = previous.headBlock;
    }
  });

  test('rejects a misconfigured environment before touching the chain', async () => {
    const dir = path.join(workdir, 'badconfig');
    const cases: Array<[Record<string, string>, RegExp]> = [
      [{ SOURCE_ADDRESS: 'not-an-address' }, /SOURCE_ADDRESS is not an address/],
      [{ ETH_RPC_URL: '' }, /ETH_RPC_URL is not set/],
      [{ DEPLOYMENT_BLOCK: 'abc' }, /DEPLOYMENT_BLOCK must be a non-negative integer/],
      [{ CHAIN_ID: '999' }, /RPC reports chain id 1, expected 999/],
    ];
    for (const [overrides, expected] of cases) {
      const { stderr, code } = await runWithEnv(dir, overrides);
      assert.equal(code, 1, `expected a failure for ${JSON.stringify(overrides)}`);
      assert.match(stderr, expected);
    }
  });

  async function runWithEnv(
    releasesDir: string,
    overrides: Record<string, string>,
  ): Promise<{ stderr: string; code: number }> {
    try {
      const { stderr } = await execFileAsync(process.execPath, ['--import', 'tsx', SYNC_SCRIPT], {
        cwd: REPO_ROOT,
        env: {
          ...process.env,
          ETH_RPC_URL: url,
          SOURCE_ADDRESS: TEST_CONTRACT,
          DEPLOYMENT_BLOCK: '1',
          CHAIN_ID: String(TEST_CHAIN_ID),
          CONFIRMATIONS: '20',
          SOURCE_RELEASES_DIR: releasesDir,
          ...overrides,
        },
      });
      return { stderr, code: 0 };
    } catch (error) {
      const failure = error as { stderr?: string; code?: number };
      return { stderr: failure.stderr ?? '', code: failure.code ?? 1 };
    }
  }
});

/** Every file under `dir`, keyed by relative path, for byte-exact comparison across runs. */
async function snapshotDir(dir: string): Promise<Record<string, string>> {
  const snapshot: Record<string, string> = {};
  if (!existsSync(dir)) return snapshot;
  const walk = async (current: string, prefix: string): Promise<void> => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await walk(full, relative);
      else snapshot[relative] = await readFile(full, 'utf8');
    }
  };
  await walk(dir, '');
  return snapshot;
}
