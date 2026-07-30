import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

import type { Hex } from 'viem';

import { VerificationError, type SourceChangedLog } from '../lib/contract.js';
import { RELEASE_SIZE, nextOp, writeSlot, type Op } from '../lib/source-codec.js';
import { GENESIS_SOURCE_HASH, nextSourceHash } from '../lib/source-hash.js';
import { GENESIS_HASH, GENESIS_STATE, verifyRelease } from '../lib/verify.js';
import {
  TEST_CHAIN_ID,
  TEST_CONFIRMATIONS,
  TEST_CONTRACT,
  buildReleases,
  cloneChanges,
  verificationInput,
} from './helpers.js';

describe('verifying a well-formed release', () => {
  test('release 0 replays from the genesis anchor', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    assert.equal(release.previousState, GENESIS_STATE);
    assert.equal(release.previousHash, GENESIS_HASH);

    const verified = verifyRelease(verificationInput(release));
    assert.equal(verified.id, 0n);
    assert.equal(verified.changes.length, RELEASE_SIZE);
    assert.equal(verified.state, release.storage.state);
    assert.equal(verified.hash, release.storage.hash);
    assert.equal(verified.buys + verified.sells, RELEASE_SIZE);
    assert.equal(verified.previousHash, null, 'release 0 has no previous hash');
    assert.equal(verified.finalRevision, 32n);
  });

  test('a later release replays from its predecessor and records the previous hash', () => {
    const releases = buildReleases(3);
    const third = releases[2];
    assert.ok(third);
    const verified = verifyRelease(verificationInput(third));
    assert.equal(verified.id, 2n);
    assert.equal(verified.previousHash, releases[1]?.hash);
    assert.equal(verified.finalRevision, 96n, 'release 2 covers revisions 65..96');
    assert.equal(verified.changes[0]?.revision, 65n);
    assert.equal(verified.changes[31]?.revision, 96n);
  });

  test('the decoded program matches the sealed packed state', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const verified = verifyRelease(verificationInput(release));
    let state = 0;
    for (const [slot, op] of verified.program.entries()) state |= op << (slot * 2);
    assert.equal(state >>> 0, verified.state);
  });

  test('buys and sells are counted from the events themselves', () => {
    const release = buildReleases(1, { isBuyAt: (index) => index % 2 === 0 })[0];
    assert.ok(release);
    const verified = verifyRelease(verificationInput(release));
    assert.equal(verified.buys, 16);
    assert.equal(verified.sells, 16);
  });
});

describe('incorrect hashes', () => {
  test('a tampered newHash on one change is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    (changes[7] as SourceChangedLog).newHash = `0x${'ab'.repeat(32)}`;
    assert.throws(
      () => verifyRelease(verificationInput(release, { changes })),
      (error: unknown) =>
        error instanceof VerificationError && /reports Source Hash .* replay produces/.test(error.message),
    );
  });

  test('a release whose sealed hash disagrees with its events is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const storage = { ...release.storage, hash: `0x${'cd'.repeat(32)}` as Hex };
    const finalized = { ...release.finalized, hash: storage.hash };
    assert.throws(
      () => verifyRelease({ ...verificationInput(release), storage, finalized }),
      /replayed Source Hash .* does not match the sealed hash/,
    );
  });

  test('a release verified against the wrong chain id is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    assert.throws(
      () => verifyRelease({ ...verificationInput(release), chainId: 11_155_111 }),
      /Source Hash/,
    );
  });

  test('a release verified against the wrong contract address is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    assert.throws(
      () =>
        verifyRelease({
          ...verificationInput(release),
          contractAddress: '0x000000000000000000000000000000000000bEEF',
        }),
      /Source Hash/,
    );
  });

  test('replaying from the wrong previous hash is rejected', () => {
    const releases = buildReleases(2);
    const second = releases[1];
    assert.ok(second);
    assert.throws(
      () => verifyRelease(verificationInput(second, { previousHash: GENESIS_SOURCE_HASH })),
      /Source Hash/,
    );
  });

  test('replaying from the wrong previous state is rejected', () => {
    const releases = buildReleases(2);
    const second = releases[1];
    assert.ok(second);
    assert.throws(
      () => verifyRelease(verificationInput(second, { previousState: 0 })),
      /the replayed program holds|packed state/,
    );
  });

  test('the event and the storage must agree on every field', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const base = verificationInput(release);
    assert.throws(
      () => verifyRelease({ ...base, finalized: { ...release.finalized, buys: 99 } }),
      /buys: event reports/,
    );
    assert.throws(
      () => verifyRelease({ ...base, finalized: { ...release.finalized, state: 12345 } }),
      /state: event reports/,
    );
    assert.throws(
      () => verifyRelease({ ...base, finalized: { ...release.finalized, releaseId: 5n } }),
      /carries id 5/,
    );
  });
});

describe('transition validation', () => {
  test('a change that skips the transition order is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    const target = changes[3] as SourceChangedLog;
    // claim a legal-looking but wrong successor, and re-derive state and hash so only the
    // transition rule itself is violated
    const wrongOp = ((target.newOp + 1) & 3) as Op;
    target.newOp = wrongOp;
    assert.throws(
      () => verifyRelease(verificationInput(release, { changes })),
      /which must yield \d+, not \d+/,
    );
  });

  test('a change claiming the wrong previous instruction is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    const target = changes[5] as SourceChangedLog;
    target.oldOp = ((target.oldOp + 1) & 3) as Op;
    assert.throws(
      () => verifyRelease(verificationInput(release, { changes })),
      /but the replayed program holds/,
    );
  });

  test('a direction flip is rejected even when it is self-consistent', () => {
    // Build a release where change 0 is a buy, then rebuild it as a sell with a matching state
    // and hash. Only the sealed release hash can catch this, and it does.
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    const target = changes[0] as SourceChangedLog;
    const flipped = !target.isBuy;
    target.isBuy = flipped;
    target.newOp = nextOp(target.oldOp as Op, flipped);
    target.newState = writeSlot(release.previousState, target.slot, target.newOp as Op);
    target.newHash = nextSourceHash(release.previousHash, {
      chainId: BigInt(TEST_CHAIN_ID),
      contractAddress: TEST_CONTRACT,
      revision: target.revision,
      newState: target.newState,
      slot: target.slot,
      oldOp: target.oldOp as Op,
      newOp: target.newOp as Op,
      isBuy: flipped,
    });
    assert.throws(() => verifyRelease(verificationInput(release, { changes })), VerificationError);
  });

  test('an out-of-range slot is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    (changes[2] as SourceChangedLog).slot = 16;
    assert.throws(() => verifyRelease(verificationInput(release, { changes })), /outside 0\.\.15/);
  });

  test('an out-of-range instruction is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    (changes[2] as SourceChangedLog).newOp = 4;
    assert.throws(() => verifyRelease(verificationInput(release, { changes })), /outside 0\.\.3/);
  });

  test('a tampered packed state is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    (changes[9] as SourceChangedLog).newState ^= 0b11 << 20;
    assert.throws(
      () => verifyRelease(verificationInput(release, { changes })),
      /reports packed state .* replay produces/,
    );
  });
});

describe('event ordering', () => {
  test('changes must be in blockchain order', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    const a = changes[10] as SourceChangedLog;
    const b = changes[11] as SourceChangedLog;
    changes[10] = b;
    changes[11] = a;
    assert.throws(
      () => verifyRelease(verificationInput(release, { changes })),
      /events are out of order, missing or duplicated/,
    );
  });

  test('a change whose log position goes backwards is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    const target = changes[6] as SourceChangedLog;
    target.blockNumber = (changes[5] as SourceChangedLog).blockNumber;
    target.logIndex = (changes[5] as SourceChangedLog).logIndex - 1;
    assert.throws(() => verifyRelease(verificationInput(release, { changes })), /does not follow change/);
  });

  test('the finalization must follow the 32nd change in the same block', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const finalized = { ...release.finalized, logIndex: 0 };
    assert.throws(
      () => verifyRelease({ ...verificationInput(release), finalized }),
      /must follow the 32nd SourceChanged/,
    );
  });

  test('the finalization must come from the same transaction as the 32nd change', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const finalized = { ...release.finalized, transactionHash: `0x${'ee'.repeat(32)}` as Hex };
    assert.throws(
      () => verifyRelease({ ...verificationInput(release), finalized }),
      /different transactions/,
    );
  });

  test('changes are recorded in blockchain order in the output', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const verified = verifyRelease(verificationInput(release));
    for (let i = 1; i < verified.changes.length; i++) {
      const previous = verified.changes[i - 1];
      const current = verified.changes[i];
      assert.ok(previous && current);
      assert.equal(current.revision, previous.revision + 1n);
      const ordered =
        current.blockNumber > previous.blockNumber ||
        (current.blockNumber === previous.blockNumber && current.logIndex > previous.logIndex);
      assert.ok(ordered, `change ${i} is not after change ${i - 1}`);
    }
  });
});

describe('missing or duplicate events', () => {
  test('a release with 31 changes is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes).slice(0, 31);
    assert.throws(
      () => verifyRelease(verificationInput(release, { changes })),
      /expected exactly 32 changes, got 31/,
    );
  });

  test('a release with 33 changes is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    changes.push({ ...(changes[31] as SourceChangedLog) });
    assert.throws(
      () => verifyRelease(verificationInput(release, { changes })),
      /expected exactly 32 changes, got 33/,
    );
  });

  test('a duplicated change replacing a missing one is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    changes[20] = { ...(changes[19] as SourceChangedLog) };
    assert.throws(
      () => verifyRelease(verificationInput(release, { changes })),
      /events are out of order, missing or duplicated/,
    );
  });

  test('a gap in the revision sequence is rejected', () => {
    const [release] = buildReleases(2);
    assert.ok(release);
    const changes = cloneChanges(release.changes);
    (changes[15] as SourceChangedLog).revision += 100n;
    assert.throws(
      () => verifyRelease(verificationInput(release, { changes })),
      /has revision \d+, expected \d+/,
    );
  });

  test('a release whose finalRevision is outside its own window is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const storage = { ...release.storage, finalRevision: 33n };
    const finalized = { ...release.finalized, finalRevision: 33n };
    assert.throws(
      () => verifyRelease({ ...verificationInput(release), storage, finalized }),
      /finalRevision is 33, expected 32/,
    );
  });

  test('the counters must sum to 32 and match the sealed ones', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const storage = { ...release.storage, buys: release.storage.buys + 1, sells: release.storage.sells - 1 };
    const finalized = { ...release.finalized, buys: storage.buys, sells: storage.sells };
    assert.throws(
      () => verifyRelease({ ...verificationInput(release), storage, finalized }),
      /do not match the sealed counters/,
    );
  });
});

describe('insufficient confirmations', () => {
  test('a release shallower than CONFIRMATIONS is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const headBlock = release.storage.finalizedBlock + 5n;
    assert.throws(
      () => verifyRelease(verificationInput(release, { headBlock })),
      /only 6 confirmations, needs 20/,
    );
  });

  test('a release exactly at CONFIRMATIONS is accepted', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    // the finalization block itself counts as the first confirmation
    const headBlock = release.storage.finalizedBlock + TEST_CONFIRMATIONS - 1n;
    const verified = verifyRelease(verificationInput(release, { headBlock }));
    assert.equal(verified.confirmations, TEST_CONFIRMATIONS);
    assert.equal(verified.requiredConfirmations, TEST_CONFIRMATIONS);
  });

  test('one block short of CONFIRMATIONS is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    const headBlock = release.storage.finalizedBlock + TEST_CONFIRMATIONS - 2n;
    assert.throws(
      () => verifyRelease(verificationInput(release, { headBlock })),
      /only 19 confirmations, needs 20/,
    );
  });

  test('a head behind the finalization block is rejected', () => {
    const [release] = buildReleases(1);
    assert.ok(release);
    assert.throws(
      () => verifyRelease(verificationInput(release, { headBlock: release.storage.finalizedBlock - 1n })),
      /chain head .* is behind finalization block/,
    );
  });
});
