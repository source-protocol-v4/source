/**
 * Deterministic rendering of a verified release into its five files.
 *
 * Determinism rules, enforced here rather than by convention:
 *   - key order is fixed by the literal order in these builders, never by iteration over a map
 *   - two-space indentation, exactly one trailing newline, LF line endings
 *   - no local clock, no randomness, no run-dependent values anywhere in the output
 *
 * Re-rendering an already-mirrored release must therefore produce byte-identical files, which is
 * what makes `sync-releases` idempotent.
 */

import { SLOT_COUNT, instructionName, formatProgram, type Op } from './source-codec.js';
import { formatState, type VerifiedRelease } from './verify.js';

/** A rendered release: relative file name to file contents. */
export type ReleaseFiles = Record<string, string>;

/** The directory name a release is mirrored into, relative to `releases/`. */
export function releaseDirName(id: bigint): string {
  return `v0.${id}`;
}

/**
 * Serialize to JSON with two-space indentation and a trailing newline, rendering bigints as
 * decimal strings so no value silently loses precision.
 */
export function stableJson(value: unknown): string {
  return `${JSON.stringify(value, jsonReplacer, 2)}\n`;
}

function jsonReplacer(_key: string, value: unknown): unknown {
  return typeof value === 'bigint' ? value.toString() : value;
}

/** `source.src` — the final 16 decoded instructions, slot 0 first. */
export function renderSourceSrc(release: VerifiedRelease): string {
  const header = [
    `# SOURCE v0.${release.id}`,
    `# state ${formatState(release.state)}`,
    `# revision ${release.finalRevision}`,
    `# hash ${release.hash}`,
    '',
  ].join('\n');
  return `${header}${formatProgram(release.program)}`;
}

/** `release.json` — the sealed release, exactly as the contract reports it. */
export function renderReleaseJson(release: VerifiedRelease): string {
  return stableJson({
    releaseId: release.id.toString(),
    name: `v0.${release.id}`,
    revision: release.finalRevision.toString(),
    packedState: formatState(release.state),
    packedStateDecimal: release.state.toString(),
    sourceHash: release.hash,
    previousSourceHash: release.previousHash,
    buys: release.buys,
    sells: release.sells,
    changes: release.changes.length,
    finalizedBlock: release.finalizedBlock.toString(),
    chainId: release.chainId,
    contract: release.contractAddress,
    instructions: release.program.map((op: Op, slot: number) => ({
      slot,
      op,
      instruction: instructionName(op),
    })),
    verified: true,
  });
}

/** `changes.json` — all 32 changes in blockchain order. */
export function renderChangesJson(release: VerifiedRelease): string {
  return stableJson({
    releaseId: release.id.toString(),
    chainId: release.chainId,
    contract: release.contractAddress,
    count: release.changes.length,
    changes: release.changes.map((change) => ({
      revision: change.revision.toString(),
      direction: change.direction,
      slot: change.slot,
      oldInstruction: instructionName(change.oldOp),
      newInstruction: instructionName(change.newOp),
      oldOp: change.oldOp,
      newOp: change.newOp,
      trader: change.trader,
      transactionHash: change.transactionHash,
      blockNumber: change.blockNumber.toString(),
      logIndex: change.logIndex,
    })),
  });
}

/**
 * `proof.json` — what an independent party needs to re-check this mirror against the chain.
 *
 * `requiredConfirmations` is the policy the release was accepted under. The confirmation depth at
 * sync time is deliberately NOT recorded: it grows with every block, so writing it would make the
 * file non-deterministic and rewrite history on each run.
 */
export function renderProofJson(release: VerifiedRelease): string {
  return stableJson({
    releaseId: release.id.toString(),
    chainId: release.chainId,
    contract: release.contractAddress,
    finalizationTransaction: release.finalizationTransaction,
    finalizationBlockNumber: release.finalizedBlock.toString(),
    finalizationBlockHash: release.finalizationBlockHash,
    finalizationEventIndex: release.finalizationLogIndex,
    requiredConfirmations: release.requiredConfirmations.toString(),
    sourceHash: release.hash,
    previousSourceHash: release.previousHash,
    finalRevision: release.finalRevision.toString(),
    packedState: formatState(release.state),
    verified: true,
  });
}

/** `README.md` — the human-readable view of the same facts. */
export function renderReleaseReadme(release: VerifiedRelease): string {
  const program = release.program
    .map((op: Op, slot: number) => `| ${slot} | ${instructionName(op)} |`)
    .join('\n');

  const changes = release.changes
    .map(
      (change) =>
        `| ${change.revision} | ${change.direction} | ${change.slot} | ${instructionName(change.oldOp)} → ${instructionName(change.newOp)} | ${change.blockNumber} | \`${change.transactionHash}\` |`,
    )
    .join('\n');

  return `# SOURCE v0.${release.id}

Finalized release ${release.id} of the Living Source program, mirrored from Ethereum chain ${release.chainId}
and verified independently from the contract's own \`SourceChanged\` events.

| Field | Value |
| --- | --- |
| Release | v0.${release.id} |
| Revision | ${release.finalRevision} |
| Packed state | \`${formatState(release.state)}\` |
| Source Hash | \`${release.hash}\` |
| Previous Source Hash | ${release.previousHash === null ? 'none (first release)' : `\`${release.previousHash}\``} |
| Buys | ${release.buys} |
| Sells | ${release.sells} |
| Changes | ${release.changes.length} |
| Finalized block | ${release.finalizedBlock} |
| Finalization tx | \`${release.finalizationTransaction}\` |
| Contract | \`${release.contractAddress}\` |
| Required confirmations | ${release.requiredConfirmations} |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
${program}

## Changes

All ${release.changes.length} changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
${changes}
`;
}

/** Render every file of a release. Keys are file names relative to the release directory. */
export function renderRelease(release: VerifiedRelease): ReleaseFiles {
  return {
    'source.src': renderSourceSrc(release),
    'release.json': renderReleaseJson(release),
    'changes.json': renderChangesJson(release),
    'proof.json': renderProofJson(release),
    'README.md': renderReleaseReadme(release),
  };
}

// ── repository-level summaries ───────────────────────────────────────────────────────────────
//
// These describe the mirror as a whole rather than one release, so they are rewritten on every
// run that adds a release. They stay deterministic under the same rules as everything above: a
// given latest release always renders the same bytes.

/** The block characters the contract's own header art uses, indexed by opcode. */
const OP_GLYPHS = ['░', '▒', '▓', '█'] as const;

/**
 * `releases/latest.json` — the newest release, always at a fixed path.
 *
 * Gives shields.io a stable endpoint for dynamic badges and anyone else a one-request way to read
 * the current state without listing directories.
 */
export function renderLatestJson(release: VerifiedRelease, totalReleases: number): string {
  return stableJson({
    releaseId: release.id.toString(),
    name: `v0.${release.id}`,
    totalReleases,
    revision: release.finalRevision.toString(),
    packedState: formatState(release.state),
    sourceHash: release.hash,
    previousSourceHash: release.previousHash,
    buys: release.buys,
    sells: release.sells,
    finalizedBlock: release.finalizedBlock.toString(),
    chainId: release.chainId,
    contract: release.contractAddress,
    program: release.program.map((op: Op) => instructionName(op)),
    glyphs: release.program.map((op: Op) => OP_GLYPHS[op]).join(''),
    verified: true,
  });
}

/**
 * The program drawn as the contract's own header art: two rows of eight glyphs, one per slot.
 * Slot 0 is the top-left, matching the numbering in `source.src`.
 */
export function renderProgramArt(release: VerifiedRelease): string {
  const glyph = (slot: number): string => OP_GLYPHS[release.program[slot] as Op];
  const row = (start: number): string =>
    Array.from({ length: 8 }, (_, i) => glyph(start + i)).join('  ');
  const indices = (start: number): string =>
    Array.from({ length: 8 }, (_, i) => String(start + i).padStart(2, ' ')).join(' ');

  // The frame is 44 characters wide inside the borders; every line is padded to exactly that so
  // the box closes regardless of the glyphs in it.
  const WIDTH = 44;
  const line = (body: string): string => `│${body.padEnd(WIDTH, ' ')}│`;

  return [
    `┌${'─'.repeat(WIDTH)}┐`,
    line(`  ${indices(0)}`),
    line(`  ${row(0)}     THE PROGRAM`),
    line(''),
    line(`  ${indices(8)}`),
    line(`  ${row(8)}`),
    `└${'─'.repeat(WIDTH)}┘`,
  ].join('\n');
}

/** The marker pair delimiting the generated block in the root README. */
export const README_BEGIN = '<!-- SOURCE:BEGIN -->';
export const README_END = '<!-- SOURCE:END -->';

/**
 * The generated block for the root README: the current program as art, plus the headline numbers.
 * Rendered between {@link README_BEGIN} and {@link README_END} so the surrounding prose is never
 * touched.
 */
export function renderReadmeBlock(release: VerifiedRelease, totalReleases: number): string {
  const legend = release.program
    .map((op: Op, slot: number) => `${String(slot).padStart(2, '0')} ${instructionName(op)}`)
    .join(' · ');

  return [
    README_BEGIN,
    '',
    '```',
    renderProgramArt(release),
    '```',
    '',
    `**v0.${release.id}** · revision ${release.finalRevision} · ${totalReleases} release${totalReleases === 1 ? '' : 's'} sealed · \`${formatState(release.state)}\``,
    '',
    `<sub>${legend}</sub>`,
    '',
    README_END,
  ].join('\n');
}

/**
 * Splice the generated block into a README, replacing whatever sits between the markers.
 * Returns the text unchanged when the markers are absent, so a hand-edited README is never
 * mangled by an automated run.
 */
export function spliceReadmeBlock(readme: string, block: string): string {
  const start = readme.indexOf(README_BEGIN);
  const end = readme.indexOf(README_END);
  if (start < 0 || end < 0 || end < start) return readme;
  return readme.slice(0, start) + block + readme.slice(end + README_END.length);
}

/**
 * `releases/HISTORY.md` — every mirrored release in one table, oldest first.
 *
 * `releases` must already be ordered by id; the caller owns that ordering because it also owns
 * which releases exist.
 */
export function renderHistory(releases: readonly VerifiedRelease[]): string {
  const rows = releases
    .map((release) => {
      const art = release.program.map((op: Op) => OP_GLYPHS[op]).join('');
      return `| [v0.${release.id}](v0.${release.id}/) | \`${art}\` | ${release.finalRevision} | ${release.buys} | ${release.sells} | ${release.finalizedBlock} | \`${formatState(release.state)}\` |`;
    })
    .join('\n');

  return `# History

Every sealed release, oldest first. Each row is the program as it stood when that release closed.

Glyphs: \`${OP_GLYPHS[0]}\` EMPTY · \`${OP_GLYPHS[1]}\` PUSH · \`${OP_GLYPHS[2]}\` SWAP · \`${OP_GLYPHS[3]}\` LOOP — slot 0 leftmost.

| Release | Program | Revision | Buys | Sells | Block | State |
| --- | --- | --- | --- | --- | --- | --- |
${rows}
`;
}

/**
 * The palette the SVG and the web page share, keyed by opcode. Picked to match the project's
 * logo: EMPTY recedes into the background, the three real instructions get progressively
 * stronger tints of the same pink.
 */
const OP_COLORS = ['#f6dfe3', '#f3b3c0', '#ef8098', '#e8637a'] as const;

/**
 * `releases/program.svg` — the current program as a self-contained image.
 *
 * Deliberately plain SVG with no external fonts or scripts, so it renders anywhere GitHub,
 * a social card or a README embeds it. Deterministic: the same release always yields the same
 * bytes, so an unchanged program does not produce a diff.
 */
export function renderProgramSvg(release: VerifiedRelease, totalReleases: number): string {
  const CELL = 92;
  const GAP = 10;
  const PAD = 28;
  const COLS = 8;
  const ROWS = 2;
  const HEADER = 84;
  const FOOTER = 52;
  const width = PAD * 2 + COLS * CELL + (COLS - 1) * GAP;
  const height = PAD * 2 + HEADER + ROWS * CELL + GAP + FOOTER;

  const cells = release.program
    .map((op: Op, slot: number) => {
      const x = PAD + (slot % COLS) * (CELL + GAP);
      const y = PAD + HEADER + Math.floor(slot / COLS) * (CELL + GAP);
      const label = instructionName(op);
      // EMPTY is the quiet state, so its label is muted against the pale fill.
      const labelFill = op === 0 ? '#c9909d' : '#ffffff';
      return [
        `  <g>`,
        `    <rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="14" fill="${OP_COLORS[op]}"/>`,
        `    <text x="${x + 10}" y="${y + 24}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="13" fill="${labelFill}" opacity="0.75">${String(slot).padStart(2, '0')}</text>`,
        `    <text x="${x + CELL / 2}" y="${y + CELL / 2 + 16}" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="15" font-weight="600" fill="${labelFill}">${label}</text>`,
        `  </g>`,
      ].join('\n');
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="SOURCE program at v0.${release.id}">
  <rect width="${width}" height="${height}" rx="24" fill="#fdf2f4"/>
  <text x="${PAD}" y="${PAD + 30}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="26" font-weight="700" fill="#8a4453">SOURCE</text>
  <text x="${PAD}" y="${PAD + 56}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="14" fill="#b57384">v0.${release.id} · revision ${release.finalRevision} · ${totalReleases} release${totalReleases === 1 ? '' : 's'} sealed</text>
${cells}
  <text x="${PAD}" y="${height - PAD - 6}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="13" fill="#b57384">${formatState(release.state)} · ${release.buys} buys · ${release.sells} sells</text>
</svg>
`;
}

/** One change as `STATS.md` counts it. Only the fields the tallies actually read. */
export interface ChangeSummary {
  slot: number;
  direction: 'BUY' | 'SELL';
  trader: string;
}

/**
 * `releases/STATS.md` — tallies over every mirrored change.
 *
 * Purely descriptive: it summarises what the verified releases already say and introduces no new
 * claims about the chain.
 */
export function renderStats(
  releases: readonly VerifiedRelease[],
  changes: readonly ChangeSummary[],
): string {
  const total = changes.length;
  const buys = changes.filter((change) => change.direction === 'BUY').length;
  const sells = total - buys;

  const perSlot = new Array<number>(SLOT_COUNT).fill(0);
  for (const change of changes) {
    if (change.slot >= 0 && change.slot < SLOT_COUNT) perSlot[change.slot] = (perSlot[change.slot] ?? 0) + 1;
  }
  const busiest = Math.max(...perSlot, 1);

  const slotRows = perSlot
    .map((count, slot) => {
      // A 20-cell bar keeps the table readable at any width.
      const filled = Math.round((count / busiest) * 20);
      const bar = '█'.repeat(filled) + '·'.repeat(20 - filled);
      const share = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
      return `| ${String(slot).padStart(2, '0')} | \`${bar}\` | ${count} | ${share}% |`;
    })
    .join('\n');

  const traders = new Map<string, number>();
  for (const change of changes) {
    const trader = change.trader.toLowerCase();
    if (trader === '0x0000000000000000000000000000000000000000') continue;
    traders.set(trader, (traders.get(trader) ?? 0) + 1);
  }
  const topTraders = [...traders.entries()]
    // Count descending, then address ascending, so equal counts never reorder between runs.
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([trader, count], index) => `| ${index + 1} | \`${trader}\` | ${count} |`)
    .join('\n');

  const buyShare = total > 0 ? ((buys / total) * 100).toFixed(1) : '0.0';
  const sellShare = total > 0 ? ((sells / total) * 100).toFixed(1) : '0.0';
  const mostActive = perSlot.indexOf(Math.max(...perSlot));
  const leastActive = perSlot.indexOf(Math.min(...perSlot));

  return `# Statistics

Tallied over every change in every mirrored release. Regenerated whenever a release is added.

| | |
| --- | --- |
| Releases | ${releases.length} |
| Changes | ${total} |
| Buys | ${buys} (${buyShare}%) |
| Sells | ${sells} (${sellShare}%) |
| Most rewritten slot | ${mostActive} (${perSlot[mostActive] ?? 0} times) |
| Least rewritten slot | ${leastActive} (${perSlot[leastActive] ?? 0} times) |
| Distinct traders | ${traders.size} |

## Changes per slot

The slot is chosen by the chain, not by the trader, so over time the counts drift toward each
other — an even spread is the expected shape, not a designed one.

| Slot | | Changes | Share |
| --- | --- | --- | --- |
${slotRows}

## Most active traders

By number of program changes their trades produced. The trader is the \`tx.origin\` label the
contract records for colour only — it grants nothing and is never read for authorization.

${topTraders.length > 0 ? `| # | Trader | Changes |\n| --- | --- | --- |\n${topTraders}` : '_No trader labels recorded._'}
`;
}

/**
 * The generated index for `releases/README.md`: the newest releases first, so the directory is
 * browsable without scrolling through every folder.
 */
export function renderReleaseIndex(releases: readonly VerifiedRelease[], limit = 20): string {
  const newest = [...releases].sort((a, b) => (a.id < b.id ? 1 : -1)).slice(0, limit);
  const rows = newest
    .map((release) => {
      const art = release.program.map((op: Op) => OP_GLYPHS[op]).join('');
      return `| [v0.${release.id}](v0.${release.id}/) | \`${art}\` | ${release.finalRevision} | ${release.buys}/${release.sells} | ${release.finalizedBlock} |`;
    })
    .join('\n');

  const omitted = releases.length - newest.length;

  return [
    README_BEGIN,
    '',
    `**${releases.length} release${releases.length === 1 ? '' : 's'} mirrored.** Newest first.`,
    '',
    '| Release | Program | Revision | Buys/Sells | Block |',
    '| --- | --- | --- | --- | --- |',
    rows,
    '',
    omitted > 0
      ? `<sub>${omitted} older release${omitted === 1 ? '' : 's'} not shown — see [HISTORY.md](HISTORY.md) for the full list.</sub>`
      : '<sub>See [HISTORY.md](HISTORY.md) for the same list with packed states.</sub>',
    '',
    README_END,
  ].join('\n');
}
