import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

import { parseProgram } from '../lib/source-codec.js';
import { verifyRelease } from '../lib/verify.js';
import {
  README_BEGIN,
  README_END,
  releaseDirName,
  renderHistory,
  renderLatestJson,
  renderProgramArt,
  renderReadmeBlock,
  renderRelease,
  renderChangesJson,
  renderProofJson,
  renderReleaseJson,
  renderSourceSrc,
  spliceReadmeBlock,
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

describe('repository-level summaries', () => {
  test('latest.json reports the newest release and the total', () => {
    const json = JSON.parse(renderLatestJson(verified, 21)) as Record<string, unknown>;
    assert.equal(json.releaseId, verified.id.toString());
    assert.equal(json.name, `v0.${verified.id}`);
    assert.equal(json.totalReleases, 21);
    assert.equal(json.sourceHash, verified.hash);
    assert.equal(json.revision, verified.finalRevision.toString());
    assert.equal(json.verified, true);
    assert.equal((json.program as string[]).length, 16);
    assert.equal((json.glyphs as string).length, 16);
  });

  test('latest.json exposes exactly the fields the badges query', () => {
    // The README badges read $.name, $.totalReleases and $.revision. Renaming any of them
    // silently breaks the badges, so pin them here.
    const json = JSON.parse(renderLatestJson(verified, 3)) as Record<string, unknown>;
    for (const field of ['name', 'totalReleases', 'revision']) {
      assert.ok(field in json, `badge field ${field} is missing from latest.json`);
    }
  });

  test('the program art is a closed box of equal-width lines', () => {
    const lines = renderProgramArt(verified).split('\n');
    assert.equal(lines.length, 7);
    const width = [...(lines[0] as string)].length;
    for (const [index, line] of lines.entries()) {
      assert.equal([...line].length, width, `line ${index} is a different width`);
    }
    assert.ok(lines[0]?.startsWith('┌') && lines[0]?.endsWith('┐'));
    assert.ok(lines[6]?.startsWith('└') && lines[6]?.endsWith('┘'));
    for (const line of lines.slice(1, 6)) {
      assert.ok(line.startsWith('│') && line.endsWith('│'), 'a body line is not framed');
    }
  });

  test('the README block carries the release, revision and every slot', () => {
    const block = renderReadmeBlock(verified, 7);
    assert.ok(block.startsWith(README_BEGIN));
    assert.ok(block.endsWith(README_END));
    assert.ok(block.includes(`v0.${verified.id}`));
    assert.ok(block.includes(`revision ${verified.finalRevision}`));
    assert.ok(block.includes('7 releases sealed'));
    for (let slot = 0; slot < 16; slot++) {
      assert.ok(block.includes(String(slot).padStart(2, '0')), `slot ${slot} missing from legend`);
    }
  });

  test('the README block singularises a lone release', () => {
    assert.ok(renderReadmeBlock(verified, 1).includes('1 release sealed'));
  });

  test('splicing replaces only the marked block', () => {
    const readme = `# Title\n\nintro\n\n${README_BEGIN}\nold content\n${README_END}\n\noutro\n`;
    const spliced = spliceReadmeBlock(readme, renderReadmeBlock(verified, 2));
    assert.ok(spliced.startsWith('# Title\n\nintro\n\n'), 'text before the block is preserved');
    assert.ok(spliced.endsWith('\n\noutro\n'), 'text after the block is preserved');
    assert.ok(!spliced.includes('old content'), 'the old block is gone');
    assert.ok(spliced.includes(`v0.${verified.id}`));
  });

  test('splicing is idempotent', () => {
    const readme = `intro\n${README_BEGIN}\nx\n${README_END}\noutro\n`;
    const block = renderReadmeBlock(verified, 2);
    const once = spliceReadmeBlock(readme, block);
    assert.equal(spliceReadmeBlock(once, block), once, 'a second splice must change nothing');
  });

  test('a README without markers is left untouched', () => {
    const readme = '# Title\n\njust prose, no markers\n';
    assert.equal(spliceReadmeBlock(readme, renderReadmeBlock(verified, 1)), readme);
  });

  test('HISTORY lists every release oldest first', () => {
    const releases = buildReleases(3).map((built) => verifyRelease(verificationInput(built)));
    const history = renderHistory(releases);
    assert.ok(history.startsWith('# History\n'));
    for (const release of releases) {
      assert.ok(history.includes(`[v0.${release.id}]`), `v0.${release.id} missing`);
    }
    const first = history.indexOf('[v0.0]');
    const last = history.indexOf('[v0.2]');
    assert.ok(first > 0 && last > first, 'releases must be listed oldest first');
    assert.ok(history.endsWith('\n'));
  });

  test('the summaries are deterministic', () => {
    assert.equal(renderLatestJson(verified, 5), renderLatestJson(verified, 5));
    assert.equal(renderReadmeBlock(verified, 5), renderReadmeBlock(verified, 5));
    assert.equal(renderProgramArt(verified), renderProgramArt(verified));
  });
});
