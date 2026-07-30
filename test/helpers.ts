/**
 * Local fixtures for the Node test suite.
 *
 * Everything here is synthesized in-process from the same rules the Solidity implements, so the
 * unit tests never need a mainnet RPC. The Solidity-generated fixture in
 * `test/fixtures/solidity-parity.json` is the independent check that these rules are right.
 */

import type { Address, Hex } from 'viem';

import { RELEASE_SIZE, nextOp, writeSlot, type Op } from '../lib/source-codec.js';
import { GENESIS_SOURCE_HASH, nextSourceHash } from '../lib/source-hash.js';
import type { Release, ReleaseFinalizedLog, SourceChangedLog } from '../lib/contract.js';

export const TEST_CHAIN_ID = 1;
export const TEST_CONTRACT: Address = '0x00000000000000000000000000000000000c0dE1';
export const TEST_CONFIRMATIONS = 20n;

/** One synthesized release: its logs, its storage row and the anchor it replays from. */
export interface BuiltRelease {
  id: bigint;
  storage: Release;
  finalized: ReleaseFinalizedLog;
  changes: SourceChangedLog[];
  previousState: number;
  previousHash: Hex;
  /** State and hash after this release, i.e. the next release's anchor. */
  state: number;
  hash: Hex;
}

export interface BuildOptions {
  /** Which slot each change targets. Defaults to a deterministic walk over all 16 slots. */
  slotAt?: (index: number) => number;
  /** Whether each change is a buy. Defaults to a deterministic buy/sell mix. */
  isBuyAt?: (index: number) => boolean;
  /** First block the release's changes occupy. Later changes advance from here. */
  startBlock?: bigint;
  /** How many changes share one block. Defaults to 4. */
  changesPerBlock?: number;
  /**
   * When true, a release's first change shares the block its predecessor finalized in — two
   * qualifying swaps landing in one block, which the chain allows and the scan must handle.
   */
  shareBlockAcrossReleases?: boolean;
}

/**
 * Build a chain of `count` consecutive releases starting at id 0, each with exactly 32 valid
 * changes, correct transitions, correct packed states and a correct chained Source Hash.
 */
export function buildReleases(count: number, options: BuildOptions = {}): BuiltRelease[] {
  const slotAt = options.slotAt ?? ((index: number) => (index * 7 + Math.floor(index / 16)) % 16);
  const isBuyAt = options.isBuyAt ?? ((index: number) => index % 3 !== 0);
  const changesPerBlock = options.changesPerBlock ?? 4;
  let block = options.startBlock ?? 1_000_000n;

  const built: BuiltRelease[] = [];
  let state = 0;
  let hash: Hex = GENESIS_SOURCE_HASH;
  let globalIndex = 0;
  // Carried across releases so a shared block keeps a strictly increasing log index.
  let logIndex = 0;

  for (let r = 0; r < count; r++) {
    const id = BigInt(r);
    const previousState = state;
    const previousHash = hash;
    const changes: SourceChangedLog[] = [];
    let buys = 0;
    let sells = 0;
    if (!options.shareBlockAcrossReleases) logIndex = 0;

    for (let i = 0; i < RELEASE_SIZE; i++) {
      if (i > 0 && i % changesPerBlock === 0) {
        block += 1n;
        logIndex = 0;
      }
      const revision = BigInt(globalIndex + 1);
      const slot = slotAt(globalIndex);
      const isBuy = isBuyAt(globalIndex);
      const oldOp = ((state >>> (slot * 2)) & 3) as Op;
      const newOp = nextOp(oldOp, isBuy);
      state = writeSlot(state, slot, newOp);
      hash = nextSourceHash(hash, {
        chainId: BigInt(TEST_CHAIN_ID),
        contractAddress: TEST_CONTRACT,
        revision,
        newState: state,
        slot,
        oldOp,
        newOp,
        isBuy,
      });
      if (isBuy) buys++;
      else sells++;

      changes.push({
        revision,
        slot,
        oldOp,
        newOp,
        isBuy,
        newState: state,
        newHash: hash,
        timestamp: 1_700_000_000n + BigInt(globalIndex) * 12n,
        blockNumber: block,
        blockHash: fakeHash('block', block),
        transactionHash: fakeHash('tx', BigInt(globalIndex)),
        transactionIndex: logIndex,
        logIndex: logIndex * 2,
      });
      logIndex++;
      globalIndex++;
    }

    const lastChange = changes[RELEASE_SIZE - 1] as SourceChangedLog;
    const storage: Release = {
      state,
      hash,
      finalRevision: lastChange.revision,
      finalizedBlock: lastChange.blockNumber,
      buys,
      sells,
    };
    const finalized: ReleaseFinalizedLog = {
      releaseId: id,
      state,
      hash,
      finalRevision: storage.finalRevision,
      finalizedBlock: storage.finalizedBlock,
      buys,
      sells,
      blockNumber: lastChange.blockNumber,
      blockHash: lastChange.blockHash,
      transactionHash: lastChange.transactionHash,
      transactionIndex: lastChange.transactionIndex,
      // the finalization log is emitted right after the 32nd change, in the same transaction
      logIndex: lastChange.logIndex + 1,
    };

    built.push({ id, storage, finalized, changes, previousState, previousHash, state, hash });
    // In shared-block mode the next release starts in this same block, so it keeps both the block
    // number and the running log index.
    if (!options.shareBlockAcrossReleases) block += 1n;
  }

  return built;
}

/** The verification input for a built release, at a head deep enough to be confirmed. */
export function verificationInput(
  release: BuiltRelease,
  overrides: {
    headBlock?: bigint;
    confirmations?: bigint;
    changes?: SourceChangedLog[];
    previousState?: number;
    previousHash?: Hex;
  } = {},
) {
  return {
    id: release.id,
    chainId: TEST_CHAIN_ID,
    contractAddress: TEST_CONTRACT,
    confirmations: overrides.confirmations ?? TEST_CONFIRMATIONS,
    headBlock: overrides.headBlock ?? release.storage.finalizedBlock + TEST_CONFIRMATIONS,
    storage: release.storage,
    finalized: release.finalized,
    changes: overrides.changes ?? release.changes,
    previousState: overrides.previousState ?? release.previousState,
    previousHash: overrides.previousHash ?? release.previousHash,
  };
}

/** A deterministic stand-in hash. Never a real chain value; only used to fill log fields. */
export function fakeHash(kind: string, n: bigint): Hex {
  const tag = [...kind].map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  const body = `${tag}${n.toString(16)}`.padStart(64, '0').slice(-64);
  return `0x${body}`;
}

/** Deep-clone a log list so a test can corrupt one entry without touching the original. */
export function cloneChanges(changes: SourceChangedLog[]): SourceChangedLog[] {
  return changes.map((change) => ({ ...change }));
}
