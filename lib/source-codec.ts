/**
 * Encoding and decoding of the Living Source program.
 *
 * The program is SLOT_COUNT (16) instructions packed BITS_PER_SLOT (2) bits each into the low
 * 32 bits of `sourceState`. Slot i occupies bits [2i, 2i+1]; slot 0 is the least significant
 * pair. This mirrors `SOURCE.currentSource()` / `SOURCE.instructionAt()` exactly:
 *
 *     instructions[i] = uint8((uint256(state) >> (i * BITS_PER_SLOT)) & SLOT_MASK)
 */

/** Number of instruction slots in the program. Mirrors `SOURCE.SLOT_COUNT`. */
export const SLOT_COUNT = 16;
/** Bits per packed instruction. Mirrors `SOURCE.BITS_PER_SLOT`. */
export const BITS_PER_SLOT = 2;
/** Mask for a single packed instruction. Mirrors `SOURCE.SLOT_MASK`. */
export const SLOT_MASK = 3;
/** Qualifying Source changes required to finalize one release. Mirrors `SOURCE.RELEASE_SIZE`. */
export const RELEASE_SIZE = 32;

/** The four instructions, indexed by their on-chain opcode. */
export const INSTRUCTIONS = ['EMPTY', 'PUSH', 'SWAP', 'LOOP'] as const;

export type Instruction = (typeof INSTRUCTIONS)[number];
/** An opcode as stored on-chain: 0 EMPTY, 1 PUSH, 2 SWAP, 3 LOOP. */
export type Op = 0 | 1 | 2 | 3;

/** The 16 instructions of a decoded program, slot 0 first. */
export type Program = [Op, Op, Op, Op, Op, Op, Op, Op, Op, Op, Op, Op, Op, Op, Op, Op];

/** Widest value `sourceState` can hold: it is a uint32 on-chain. */
const UINT32_MAX = 0xffff_ffff;

export function isOp(value: number): value is Op {
  return Number.isInteger(value) && value >= 0 && value <= SLOT_MASK;
}

export function isSlot(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value < SLOT_COUNT;
}

/** The mnemonic for an opcode. Throws on anything outside 0..3. */
export function instructionName(op: number): Instruction {
  if (!isOp(op)) throw new Error(`invalid instruction opcode: ${op}`);
  return INSTRUCTIONS[op];
}

/** The opcode for a mnemonic. Throws on an unknown mnemonic. */
export function instructionOp(name: string): Op {
  const index = INSTRUCTIONS.indexOf(name as Instruction);
  if (index < 0) throw new Error(`invalid instruction name: ${name}`);
  return index as Op;
}

/**
 * Unpack a `sourceState` into its 16 instructions, slot 0 first.
 * Equivalent to `SOURCE.currentSource()`'s `instructions` return value.
 */
export function decodeState(state: number): Program {
  assertState(state);
  const program = new Array<Op>(SLOT_COUNT);
  for (let i = 0; i < SLOT_COUNT; i++) {
    program[i] = ((state >>> (i * BITS_PER_SLOT)) & SLOT_MASK) as Op;
  }
  return program as Program;
}

/** Pack 16 instructions back into a `sourceState`. The inverse of {@link decodeState}. */
export function encodeState(program: readonly Op[]): number {
  if (program.length !== SLOT_COUNT) {
    throw new Error(`program must have exactly ${SLOT_COUNT} instructions, got ${program.length}`);
  }
  let state = 0;
  for (let i = 0; i < SLOT_COUNT; i++) {
    const op = program[i] as number;
    if (!isOp(op)) throw new Error(`invalid instruction opcode at slot ${i}: ${op}`);
    state |= op << (i * BITS_PER_SLOT);
  }
  return state >>> 0;
}

/** Read the instruction in one slot. Equivalent to `SOURCE.instructionAt(slot)`. */
export function instructionAt(state: number, slot: number): Op {
  assertState(state);
  if (!isSlot(slot)) throw new Error(`invalid slot: ${slot}`);
  return ((state >>> (slot * BITS_PER_SLOT)) & SLOT_MASK) as Op;
}

/**
 * Write an instruction into one slot, leaving every other slot untouched.
 * Mirrors the clear-then-write in `SOURCE._advanceSource`.
 */
export function writeSlot(state: number, slot: number, op: Op): number {
  assertState(state);
  if (!isSlot(slot)) throw new Error(`invalid slot: ${slot}`);
  if (!isOp(op)) throw new Error(`invalid instruction opcode: ${op}`);
  const shift = slot * BITS_PER_SLOT;
  return (((state & ~(SLOT_MASK << shift)) | (op << shift)) >>> 0) as number;
}

/**
 * The instruction a change produces from `oldOp`.
 *
 * BUY:  EMPTY -> PUSH -> SWAP -> LOOP -> EMPTY   (forward, +1 mod 4)
 * SELL: EMPTY -> LOOP -> SWAP -> PUSH -> EMPTY   (backward, -1 mod 4, written as +3)
 */
export function nextOp(oldOp: Op, isBuy: boolean): Op {
  if (!isOp(oldOp)) throw new Error(`invalid instruction opcode: ${oldOp}`);
  return ((isBuy ? oldOp + 1 : oldOp + 3) & SLOT_MASK) as Op;
}

/** Whether `newOp` is the instruction `oldOp` must become under a buy/sell. */
export function isValidTransition(oldOp: Op, newOp: Op, isBuy: boolean): boolean {
  return isOp(oldOp) && isOp(newOp) && nextOp(oldOp, isBuy) === newOp;
}

/**
 * Render a decoded program as the body of a `source.src` file: one `slot: INSTRUCTION` line per
 * slot, slot 0 first, terminated by a trailing newline.
 */
export function formatProgram(program: readonly Op[]): string {
  if (program.length !== SLOT_COUNT) {
    throw new Error(`program must have exactly ${SLOT_COUNT} instructions, got ${program.length}`);
  }
  const width = String(SLOT_COUNT - 1).length;
  return (
    program
      .map((op, slot) => `${String(slot).padStart(width, '0')}: ${instructionName(op)}`)
      .join('\n') + '\n'
  );
}

/** Parse a `source.src` body back into a program. The inverse of {@link formatProgram}. */
export function parseProgram(text: string): Program {
  const lines = text.split('\n').filter((line) => line.trim().length > 0);
  if (lines.length !== SLOT_COUNT) {
    throw new Error(`expected ${SLOT_COUNT} instruction lines, got ${lines.length}`);
  }
  const program = new Array<Op>(SLOT_COUNT);
  for (const [index, line] of lines.entries()) {
    const match = /^(\d+):\s+([A-Z]+)$/.exec(line.trim());
    if (!match) throw new Error(`malformed instruction line: ${JSON.stringify(line)}`);
    const slot = Number(match[1]);
    if (slot !== index) throw new Error(`instruction lines out of order at line ${index + 1}`);
    program[index] = instructionOp(match[2] as string);
  }
  return program as Program;
}

function assertState(state: number): void {
  if (!Number.isInteger(state) || state < 0 || state > UINT32_MAX) {
    throw new Error(`sourceState must be a uint32, got ${state}`);
  }
}
