/**
 * Independent verification of one finalized SOURCE release.
 *
 * Nothing here trusts the contract's own summary. A release is accepted only when the 32
 * `SourceChanged` events that compose it, replayed from the previous release's state, reproduce
 * the packed state, the counters, the revision and the chained Source Hash that the
 * `ReleaseFinalized` event and `releaseAt()` storage both report. Any disagreement is fatal.
 */

import type { Address, Hex } from 'viem';

import {
  RELEASE_SIZE,
  SLOT_COUNT,
  decodeState,
  instructionAt,
  isOp,
  isSlot,
  nextOp,
  writeSlot,
  type Op,
  type Program,
} from './source-codec.js';
import { GENESIS_SOURCE_HASH, nextSourceHash } from './source-hash.js';
import { VerificationError, type Release, type ReleaseFinalizedLog, type SourceChangedLog } from './contract.js';

/** Everything needed to verify release `id` without consulting the network again. */
export interface ReleaseVerificationInput {
  id: bigint;
  chainId: number;
  contractAddress: Address;
  confirmations: bigint;
  /** Chain head at the time of the check, used for the confirmation depth. */
  headBlock: bigint;
  /** The release as `releaseAt(id)` reports it. */
  storage: Release;
  /** The `ReleaseFinalized` log for this id. */
  finalized: ReleaseFinalizedLog;
  /** The 32 `SourceChanged` logs composing this release, in blockchain order. */
  changes: SourceChangedLog[];
  /** The packed state the release starts from: the previous release's state, or 0 for id 0. */
  previousState: number;
  /** The chain value before this release's first change: the previous release's hash, or zero. */
  previousHash: Hex;
}

/** One verified change, ready to be written to `changes.json`. */
export interface VerifiedChange {
  revision: bigint;
  direction: 'BUY' | 'SELL';
  slot: number;
  oldOp: Op;
  newOp: Op;
  trader: Address;
  transactionHash: Hex;
  blockNumber: bigint;
  logIndex: number;
}

/** A release that passed every check. */
export interface VerifiedRelease {
  id: bigint;
  chainId: number;
  contractAddress: Address;
  state: number;
  program: Program;
  hash: Hex;
  previousHash: Hex | null;
  finalRevision: bigint;
  finalizedBlock: bigint;
  buys: number;
  sells: number;
  confirmations: bigint;
  requiredConfirmations: bigint;
  changes: VerifiedChange[];
  finalizationTransaction: Hex;
  finalizationBlockHash: Hex;
  finalizationLogIndex: number;
}

/**
 * Verify one release. Throws {@link VerificationError} on the first mismatch — a release is either
 * fully verified or not written at all.
 *
 * `traders` maps a transaction hash to the `SwapTaxed` trader label for that transaction; the
 * `SourceChanged` event does not carry the trader itself. Entries are optional: an unresolved
 * trader is recorded as the zero address rather than failing the release, because the trader is a
 * cosmetic label the contract never uses for authorization.
 */
export function verifyRelease(
  input: ReleaseVerificationInput,
  traders: ReadonlyMap<string, Address> = new Map(),
): VerifiedRelease {
  const { id, storage, finalized, changes } = input;

  // ── 1. the release is deep enough to be considered settled ─────────────────────────────────
  if (input.headBlock < storage.finalizedBlock) {
    throw new VerificationError(
      `release ${id}: chain head ${input.headBlock} is behind finalization block ${storage.finalizedBlock}`,
    );
  }
  const depth = input.headBlock - storage.finalizedBlock + 1n;
  if (depth < input.confirmations) {
    throw new VerificationError(
      `release ${id}: only ${depth} confirmations, needs ${input.confirmations}`,
    );
  }

  // ── 2. the event and the storage tell the same story ───────────────────────────────────────
  if (finalized.releaseId !== id) {
    throw new VerificationError(
      `release ${id}: ReleaseFinalized carries id ${finalized.releaseId}`,
    );
  }
  assertEqual(`release ${id}: state`, finalized.state, storage.state);
  assertEqual(`release ${id}: hash`, finalized.hash, storage.hash);
  assertEqual(`release ${id}: finalRevision`, finalized.finalRevision, storage.finalRevision);
  assertEqual(`release ${id}: finalizedBlock`, finalized.finalizedBlock, storage.finalizedBlock);
  assertEqual(`release ${id}: buys`, finalized.buys, storage.buys);
  assertEqual(`release ${id}: sells`, finalized.sells, storage.sells);
  if (finalized.blockNumber !== storage.finalizedBlock) {
    throw new VerificationError(
      `release ${id}: ReleaseFinalized was emitted in block ${finalized.blockNumber} but the release records block ${storage.finalizedBlock}`,
    );
  }

  // ── 3. exactly 32 ordered changes, covering the right revision window ───────────────────────
  if (changes.length !== RELEASE_SIZE) {
    throw new VerificationError(
      `release ${id}: expected exactly ${RELEASE_SIZE} changes, got ${changes.length}`,
    );
  }
  // Release N covers revisions 32N+1 .. 32N+32, and the last one is the release's finalRevision.
  const firstRevision = id * BigInt(RELEASE_SIZE) + 1n;
  const lastRevision = firstRevision + BigInt(RELEASE_SIZE) - 1n;
  if (storage.finalRevision !== lastRevision) {
    throw new VerificationError(
      `release ${id}: finalRevision is ${storage.finalRevision}, expected ${lastRevision}`,
    );
  }

  const seenRevisions = new Set<bigint>();
  for (const [index, change] of changes.entries()) {
    const expectedRevision = firstRevision + BigInt(index);
    if (change.revision !== expectedRevision) {
      throw new VerificationError(
        `release ${id}: change ${index} has revision ${change.revision}, expected ${expectedRevision} — events are out of order, missing or duplicated`,
      );
    }
    if (seenRevisions.has(change.revision)) {
      throw new VerificationError(`release ${id}: duplicate event for revision ${change.revision}`);
    }
    seenRevisions.add(change.revision);

    if (index > 0) {
      const previous = changes[index - 1] as SourceChangedLog;
      const outOfOrder =
        change.blockNumber < previous.blockNumber ||
        (change.blockNumber === previous.blockNumber && change.logIndex <= previous.logIndex);
      if (outOfOrder) {
        throw new VerificationError(
          `release ${id}: change ${index} at (block ${change.blockNumber}, log ${change.logIndex}) does not follow change ${index - 1} at (block ${previous.blockNumber}, log ${previous.logIndex})`,
        );
      }
    }
  }

  const lastChange = changes[RELEASE_SIZE - 1] as SourceChangedLog;
  if (lastChange.blockNumber !== storage.finalizedBlock) {
    throw new VerificationError(
      `release ${id}: the 32nd change is in block ${lastChange.blockNumber} but the release finalized in block ${storage.finalizedBlock}`,
    );
  }
  if (lastChange.logIndex >= finalized.logIndex || lastChange.blockNumber !== finalized.blockNumber) {
    throw new VerificationError(
      `release ${id}: ReleaseFinalized (block ${finalized.blockNumber}, log ${finalized.logIndex}) must follow the 32nd SourceChanged (block ${lastChange.blockNumber}, log ${lastChange.logIndex}) in the same block`,
    );
  }
  if (lastChange.transactionHash !== finalized.transactionHash) {
    throw new VerificationError(
      `release ${id}: the 32nd change and the finalization were emitted by different transactions`,
    );
  }

  // ── 4. replay every change: slots, transitions, packed state, hash chain, counters ──────────
  let state = input.previousState;
  let hash = input.previousHash;
  let buys = 0;
  let sells = 0;
  const verified: VerifiedChange[] = [];

  for (const [index, change] of changes.entries()) {
    if (!isSlot(change.slot)) {
      throw new VerificationError(
        `release ${id}: change ${index} names slot ${change.slot}, outside 0..${SLOT_COUNT - 1}`,
      );
    }
    if (!isOp(change.oldOp) || !isOp(change.newOp)) {
      throw new VerificationError(
        `release ${id}: change ${index} carries instructions outside 0..3 (old ${change.oldOp}, new ${change.newOp})`,
      );
    }

    // the instruction the event claims was there must be the one our replayed state holds
    const actualOld = instructionAt(state, change.slot);
    if (actualOld !== change.oldOp) {
      throw new VerificationError(
        `release ${id}: change ${index} (revision ${change.revision}) claims slot ${change.slot} held ${change.oldOp}, but the replayed program holds ${actualOld}`,
      );
    }

    // and the transition must be the one a buy or a sell produces
    const expectedNew = nextOp(change.oldOp as Op, change.isBuy);
    if (expectedNew !== change.newOp) {
      throw new VerificationError(
        `release ${id}: change ${index} (revision ${change.revision}) is a ${change.isBuy ? 'buy' : 'sell'} from ${change.oldOp}, which must yield ${expectedNew}, not ${change.newOp}`,
      );
    }

    state = writeSlot(state, change.slot, change.newOp as Op);
    if (state !== change.newState) {
      throw new VerificationError(
        `release ${id}: change ${index} (revision ${change.revision}) reports packed state ${formatState(change.newState)}, replay produces ${formatState(state)}`,
      );
    }

    hash = nextSourceHash(hash, {
      chainId: BigInt(input.chainId),
      contractAddress: input.contractAddress,
      revision: change.revision,
      newState: state,
      slot: change.slot,
      oldOp: change.oldOp as Op,
      newOp: change.newOp as Op,
      isBuy: change.isBuy,
    });
    if (hash !== change.newHash) {
      throw new VerificationError(
        `release ${id}: change ${index} (revision ${change.revision}) reports Source Hash ${change.newHash}, replay produces ${hash}`,
      );
    }

    if (change.isBuy) buys++;
    else sells++;

    verified.push({
      revision: change.revision,
      direction: change.isBuy ? 'BUY' : 'SELL',
      slot: change.slot,
      oldOp: change.oldOp as Op,
      newOp: change.newOp as Op,
      trader: traders.get(change.transactionHash.toLowerCase()) ?? ZERO_ADDRESS,
      transactionHash: change.transactionHash,
      blockNumber: change.blockNumber,
      logIndex: change.logIndex,
    });
  }

  // ── 5. the replay must land exactly on what the contract sealed ─────────────────────────────
  if (state !== storage.state) {
    throw new VerificationError(
      `release ${id}: replayed state ${formatState(state)} does not match the sealed state ${formatState(storage.state)}`,
    );
  }
  if (hash !== storage.hash) {
    throw new VerificationError(
      `release ${id}: replayed Source Hash ${hash} does not match the sealed hash ${storage.hash}`,
    );
  }
  if (buys !== storage.buys || sells !== storage.sells) {
    throw new VerificationError(
      `release ${id}: replayed counters (${buys} buys, ${sells} sells) do not match the sealed counters (${storage.buys} buys, ${storage.sells} sells)`,
    );
  }
  if (buys + sells !== RELEASE_SIZE) {
    throw new VerificationError(
      `release ${id}: counters sum to ${buys + sells}, expected ${RELEASE_SIZE}`,
    );
  }

  return {
    id,
    chainId: input.chainId,
    contractAddress: input.contractAddress,
    state,
    program: decodeState(state),
    hash,
    previousHash: id === 0n ? null : input.previousHash,
    finalRevision: storage.finalRevision,
    finalizedBlock: storage.finalizedBlock,
    buys,
    sells,
    confirmations: depth,
    requiredConfirmations: input.confirmations,
    changes: verified,
    finalizationTransaction: finalized.transactionHash,
    finalizationBlockHash: finalized.blockHash,
    finalizationLogIndex: finalized.logIndex,
  };
}

/** The starting hash of the whole chain: `sourceHash` is zero before the first change. */
export const GENESIS_HASH = GENESIS_SOURCE_HASH;

/** The starting program: `sourceState` is zero, i.e. all sixteen slots EMPTY. */
export const GENESIS_STATE = 0;

const ZERO_ADDRESS: Address = '0x0000000000000000000000000000000000000000';

function assertEqual<T>(label: string, actual: T, expected: T): void {
  if (actual !== expected) {
    throw new VerificationError(
      `${label}: event reports ${String(actual)}, storage reports ${String(expected)}`,
    );
  }
}

/** A packed state as fixed-width hex, so mismatch messages line up. */
export function formatState(state: number): string {
  return `0x${state.toString(16).padStart(8, '0')}`;
}
