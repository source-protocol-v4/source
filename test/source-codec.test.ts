import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

import {
  BITS_PER_SLOT,
  INSTRUCTIONS,
  RELEASE_SIZE,
  SLOT_COUNT,
  SLOT_MASK,
  decodeState,
  encodeState,
  formatProgram,
  instructionAt,
  instructionName,
  instructionOp,
  isValidTransition,
  nextOp,
  parseProgram,
  writeSlot,
  type Op,
} from '../lib/source-codec.js';

describe('instruction encoding and decoding', () => {
  test('the four opcodes match the Solidity constants', () => {
    assert.deepEqual([...INSTRUCTIONS], ['EMPTY', 'PUSH', 'SWAP', 'LOOP']);
    assert.equal(instructionName(0), 'EMPTY');
    assert.equal(instructionName(1), 'PUSH');
    assert.equal(instructionName(2), 'SWAP');
    assert.equal(instructionName(3), 'LOOP');
    assert.equal(instructionOp('EMPTY'), 0);
    assert.equal(instructionOp('LOOP'), 3);
  });

  test('the codec parameters match the contract', () => {
    assert.equal(SLOT_COUNT, 16);
    assert.equal(BITS_PER_SLOT, 2);
    assert.equal(SLOT_MASK, 3);
    assert.equal(RELEASE_SIZE, 32);
  });

  test('an all-EMPTY program is state 0', () => {
    assert.equal(encodeState(new Array<Op>(16).fill(0)), 0);
    assert.deepEqual(decodeState(0), new Array<Op>(16).fill(0));
  });

  test('an all-LOOP program is state 0xffffffff', () => {
    const allLoop = new Array<Op>(16).fill(3);
    assert.equal(encodeState(allLoop), 0xffff_ffff);
    assert.deepEqual(decodeState(0xffff_ffff), allLoop);
  });

  test('slot 0 is the least significant instruction pair', () => {
    // slot 0 = PUSH (1), slot 1 = SWAP (2), rest EMPTY  ->  0b1001 = 9
    const program = new Array<Op>(16).fill(0) as Op[];
    program[0] = 1;
    program[1] = 2;
    assert.equal(encodeState(program), 0b1001);
    assert.equal(instructionAt(0b1001, 0), 1);
    assert.equal(instructionAt(0b1001, 1), 2);
    assert.equal(instructionAt(0b1001, 2), 0);
  });

  test('encode and decode round trip over every slot position', () => {
    for (let slot = 0; slot < SLOT_COUNT; slot++) {
      for (const op of [0, 1, 2, 3] as Op[]) {
        const program = new Array<Op>(16).fill(0) as Op[];
        program[slot] = op;
        const state = encodeState(program);
        assert.deepEqual(decodeState(state), program, `slot ${slot} op ${op}`);
        assert.equal(instructionAt(state, slot), op);
      }
    }
  });

  test('decoding every 32-bit state round trips (sampled across the whole range)', () => {
    for (let state = 0; state < 0xffff_ffff; state += 65_413) {
      assert.equal(encodeState(decodeState(state)), state >>> 0);
    }
    assert.equal(encodeState(decodeState(0xffff_ffff)), 0xffff_ffff);
  });

  test('writeSlot touches only its own slot', () => {
    const state = 0xa5a5_5a5a;
    for (let slot = 0; slot < SLOT_COUNT; slot++) {
      const updated = writeSlot(state, slot, 3);
      const before = decodeState(state);
      const after = decodeState(updated);
      assert.equal(after[slot], 3);
      for (let i = 0; i < SLOT_COUNT; i++) {
        if (i !== slot) assert.equal(after[i], before[i], `slot ${i} changed writing slot ${slot}`);
      }
    }
  });

  test('rejects invalid inputs instead of producing a wrong program', () => {
    assert.throws(() => decodeState(-1), /uint32/);
    assert.throws(() => decodeState(0x1_0000_0000), /uint32/);
    assert.throws(() => decodeState(1.5), /uint32/);
    assert.throws(() => instructionAt(0, 16), /invalid slot/);
    assert.throws(() => instructionAt(0, -1), /invalid slot/);
    assert.throws(() => writeSlot(0, 0, 4 as Op), /invalid instruction/);
    assert.throws(() => instructionName(4), /invalid instruction/);
    assert.throws(() => instructionOp('JUMP'), /invalid instruction/);
    assert.throws(() => encodeState([0, 1]), /exactly 16/);
  });
});

describe('buy and sell transitions', () => {
  test('a buy advances EMPTY -> PUSH -> SWAP -> LOOP -> EMPTY', () => {
    assert.equal(nextOp(0, true), 1);
    assert.equal(nextOp(1, true), 2);
    assert.equal(nextOp(2, true), 3);
    assert.equal(nextOp(3, true), 0);
  });

  test('a sell rewinds EMPTY -> LOOP -> SWAP -> PUSH -> EMPTY', () => {
    assert.equal(nextOp(0, false), 3);
    assert.equal(nextOp(3, false), 2);
    assert.equal(nextOp(2, false), 1);
    assert.equal(nextOp(1, false), 0);
  });

  test('a buy followed by a sell on one slot is the identity', () => {
    for (const op of [0, 1, 2, 3] as Op[]) {
      assert.equal(nextOp(nextOp(op, true), false), op);
      assert.equal(nextOp(nextOp(op, false), true), op);
    }
  });

  test('four changes in one direction cycle back', () => {
    for (const op of [0, 1, 2, 3] as Op[]) {
      for (const isBuy of [true, false]) {
        let current = op;
        for (let i = 0; i < 4; i++) current = nextOp(current, isBuy);
        assert.equal(current, op);
      }
    }
  });

  test('isValidTransition accepts only the one legal successor', () => {
    for (const oldOp of [0, 1, 2, 3] as Op[]) {
      for (const isBuy of [true, false]) {
        const legal = nextOp(oldOp, isBuy);
        for (const candidate of [0, 1, 2, 3] as Op[]) {
          assert.equal(
            isValidTransition(oldOp, candidate, isBuy),
            candidate === legal,
            `old ${oldOp} -> ${candidate} (${isBuy ? 'buy' : 'sell'})`,
          );
        }
      }
    }
  });

  test('a buy and a sell from the same instruction never agree', () => {
    for (const oldOp of [0, 1, 2, 3] as Op[]) {
      assert.notEqual(nextOp(oldOp, true), nextOp(oldOp, false));
    }
  });
});

describe('source.src rendering', () => {
  test('renders 16 ordered lines and ends with a newline', () => {
    const text = formatProgram(decodeState(0b1001));
    const lines = text.split('\n');
    assert.equal(lines.length, 17, 'sixteen lines plus the trailing newline');
    assert.equal(lines[0], '00: PUSH');
    assert.equal(lines[1], '01: SWAP');
    assert.equal(lines[2], '02: EMPTY');
    assert.equal(lines[16], '');
    assert.ok(text.endsWith('\n'));
  });

  test('round trips through parseProgram', () => {
    for (const state of [0, 1, 0b1001, 0xdead_beef, 0xffff_ffff]) {
      const program = decodeState(state);
      assert.deepEqual(parseProgram(formatProgram(program)), program, `state ${state}`);
    }
  });

  test('rejects a malformed or reordered program file', () => {
    assert.throws(() => parseProgram('00: PUSH\n'), /expected 16/);
    assert.throws(() => parseProgram(formatProgram(decodeState(0)).replace('00:', '01:')), /out of order/);
    const garbled = formatProgram(decodeState(0)).replace('00: EMPTY', 'not an instruction');
    assert.throws(() => parseProgram(garbled), /malformed/);
  });
});
