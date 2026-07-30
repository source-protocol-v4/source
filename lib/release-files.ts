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

import { instructionName, formatProgram, type Op } from './source-codec.js';
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
