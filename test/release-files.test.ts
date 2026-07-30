import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

import { parseProgram } from '../lib/source-codec.js';
import { verifyRelease } from '../lib/verify.js';
import {
  releaseDirName,
  renderRelease,
  renderChangesJson,
  renderProofJson,
  renderReleaseJson,
  renderSourceSrc,
  stableJson,
} from '../lib/release-files.js';
import { buildReleases, verificationInput } from './helpers.js';

const [built] = buildReleases(1);
assert.ok(built);
const verified = verifyRelease(verificationInput(built));

describe('deterministic output', () => {
  test('rendering the same release twice is byte-identical', () => {
    const first = renderRelease(verified);
    const second = renderRelease(verified);
    assert.deepEqual(first, second);
    for (const [name, contents] of Object.entries(first)) {
      assert.equal(contents, second[name], `${name} differs between renders`);
    }
  });

  test('every file ends with exactly one newline and uses LF', () => {
    for (const [name, contents] of Object.entries(renderRelease(verified))) {
      assert.ok(contents.endsWith('\n'), `${name} must end with a newline`);
      assert.ok(!contents.endsWith('\n\n'), `${name} must not end with a blank line`);
      assert.ok(!contents.includes('\r'), `${name} must not contain CR`);
    }
  });

  test('JSON files use two-space indentation', () => {
    for (const name of ['release.json', 'changes.json', 'proof.json']) {
      const contents = renderRelease(verified)[name];
      assert.ok(contents);
      const indented = contents.split('\n').find((line) => line.startsWith(' '));
      assert.ok(indented?.startsWith('  ') && !indented.startsWith('   '), `${name} indentation`);
    }
  });

  test('JSON key order is fixed, not derived from iteration order', () => {
    const keys = Object.keys(JSON.parse(renderReleaseJson(verified)) as object);
    assert.deepEqual(keys.slice(0, 6), [
      'releaseId',
      'name',
      'revision',
      'packedState',
      'packedStateDecimal',
      'sourceHash',
    ]);
  });

  test('no local timestamp or random value leaks into the output', () => {
    const all = Object.values(renderRelease(verified)).join('\n');
    const thisYear = new Date().getUTCFullYear();
    for (const year of [thisYear - 1, thisYear, thisYear + 1]) {
      assert.ok(!all.includes(`${year}-`), `output must not contain a local date (${year}-)`);
    }
    assert.ok(!/generated (at|on)/i.test(all), 'output must not record when it was generated');
    // The only 10-digit numbers present should be chain-derived block numbers, never a clock.
    assert.ok(!all.includes(String(Math.floor(Date.now() / 1000)).slice(0, 6)));
  });

  test('bigints are serialized losslessly as decimal strings', () => {
    const json = stableJson({ big: 2n ** 200n });
    assert.equal(JSON.parse(json).big, (2n ** 200n).toString());
  });

  test('the directory name follows v0.<id>', () => {
    assert.equal(releaseDirName(0n), 'v0.0');
    assert.equal(releaseDirName(7n), 'v0.7');
    assert.equal(releaseDirName(1234n), 'v0.1234');
  });
});

describe('file contents', () => {
  test('source.src carries the final 16 decoded instructions', () => {
    const text = renderSourceSrc(verified);
    const body = text
      .split('\n')
      .filter((line) => !line.startsWith('#'))
      .join('\n');
    assert.deepEqual(parseProgram(body), verified.program);
    assert.ok(text.includes(verified.hash), 'the header records the Source Hash');
  });

  test('release.json carries every required field', () => {
    const json = JSON.parse(renderReleaseJson(verified)) as Record<string, unknown>;
    assert.equal(json.releaseId, verified.id.toString());
    assert.equal(json.revision, verified.finalRevision.toString());
    assert.equal(json.packedState, `0x${verified.state.toString(16).padStart(8, '0')}`);
    assert.equal(json.sourceHash, verified.hash);
    assert.equal(json.previousSourceHash, null, 'release 0 has no previous hash');
    assert.equal(json.buys, verified.buys);
    assert.equal(json.sells, verified.sells);
    assert.equal(json.finalizedBlock, verified.finalizedBlock.toString());
    assert.equal(json.chainId, verified.chainId);
    assert.equal(json.contract, verified.contractAddress);
    assert.equal(json.verified, true);
  });

  test('release.json records the previous hash for a later release', () => {
    const releases = buildReleases(2);
    const second = releases[1];
    assert.ok(second);
    const verifiedSecond = verifyRelease(verificationInput(second));
    const json = JSON.parse(renderReleaseJson(verifiedSecond)) as Record<string, unknown>;
    assert.equal(json.previousSourceHash, releases[0]?.hash);
  });

  test('changes.json carries all 32 changes in blockchain order', () => {
    const json = JSON.parse(renderChangesJson(verified)) as {
      count: number;
      changes: Array<Record<string, unknown>>;
    };
    assert.equal(json.count, 32);
    assert.equal(json.changes.length, 32);
    for (const [index, change] of json.changes.entries()) {
      const source = verified.changes[index];
      assert.ok(source);
      assert.equal(change.revision, source.revision.toString());
      assert.ok(change.direction === 'BUY' || change.direction === 'SELL');
      assert.equal(change.direction, source.direction);
      assert.equal(change.slot, source.slot);
      assert.equal(change.trader, source.trader);
      assert.equal(change.transactionHash, source.transactionHash);
      assert.equal(change.blockNumber, source.blockNumber.toString());
      assert.equal(change.logIndex, source.logIndex);
      assert.ok(typeof change.oldInstruction === 'string');
      assert.ok(typeof change.newInstruction === 'string');
    }
  });

  test('proof.json carries the finalization transaction, block hash, event index and policy', () => {
    const json = JSON.parse(renderProofJson(verified)) as Record<string, unknown>;
    assert.equal(json.finalizationTransaction, verified.finalizationTransaction);
    assert.equal(json.finalizationBlockHash, verified.finalizationBlockHash);
    assert.equal(json.finalizationEventIndex, verified.finalizationLogIndex);
    assert.equal(json.requiredConfirmations, verified.requiredConfirmations.toString());
    assert.equal(json.finalizationBlockNumber, verified.finalizedBlock.toString());
  });

  test('proof.json does not record the observed confirmation depth', () => {
    // It grows with every block, so recording it would rewrite history on each run.
    const deep = verifyRelease(
      verificationInput(built, { headBlock: built.storage.finalizedBlock + 10_000n }),
    );
    assert.equal(renderProofJson(deep), renderProofJson(verified));
  });

  test('the README states the same facts as the JSON', () => {
    const readme = renderRelease(verified)['README.md'];
    assert.ok(readme);
    assert.ok(readme.includes(`# SOURCE v0.${verified.id}`));
    assert.ok(readme.includes(verified.hash));
    assert.ok(readme.includes(verified.finalizationTransaction));
    assert.ok(readme.includes(`| Buys | ${verified.buys} |`));
    assert.ok(readme.includes(`| Sells | ${verified.sells} |`));
    for (const change of verified.changes) {
      assert.ok(readme.includes(change.transactionHash), 'every change is listed');
    }
  });

  test('a release renders exactly the five required files', () => {
    assert.deepEqual(Object.keys(renderRelease(verified)).sort(), [
      'README.md',
      'changes.json',
      'proof.json',
      'release.json',
      'source.src',
    ]);
  });
});
