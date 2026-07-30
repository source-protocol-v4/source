/**
 * The chained Source Hash, reproduced bit-for-bit from the Solidity.
 *
 * `SOURCE._advanceSource` extends the chain with:
 *
 *     bytes32 newHash = keccak256(
 *         abi.encodePacked(sourceHash, block.chainid, address(this), rev, state, slot, oldOp, newOp, isBuy)
 *     );
 *
 * `abi.encodePacked` concatenates each value at its natural width with no padding and no length
 * prefix, so the preimage is exactly 32 + 32 + 20 + 32 + 4 + 1 + 1 + 1 + 1 = 124 bytes:
 *
 *   bytes32 prevHash   32 bytes
 *   uint256 chainId    32 bytes
 *   address contract   20 bytes
 *   uint256 revision   32 bytes
 *   uint32  newState    4 bytes
 *   uint8   slot        1 byte
 *   uint8   oldOp       1 byte
 *   uint8   newOp       1 byte
 *   bool    isBuy       1 byte  (0x01 / 0x00)
 *
 * The chain starts at bytes32(0): `sourceHash` is never initialized, so the first change hashes
 * over a zero previous hash.
 */

import { encodePacked, keccak256, getAddress, isAddress, isHex } from 'viem';
import type { Address, Hex } from 'viem';

import { isOp, isSlot, type Op } from './source-codec.js';

/** The value of `sourceHash` before any change has been made. */
export const GENESIS_SOURCE_HASH: Hex = `0x${'00'.repeat(32)}`;

/** The exact byte length of one Source Hash preimage. */
export const SOURCE_HASH_PREIMAGE_BYTES = 124;

/** One qualifying Source change, as the hash chain sees it. */
export interface SourceChangeInput {
  /** `block.chainid` at the time of the change. */
  chainId: bigint;
  /** The SOURCE contract address (`address(this)`). */
  contractAddress: Address;
  /** The new global revision after this change. */
  revision: bigint;
  /** The full packed program after the change. */
  newState: number;
  /** Which of the 16 slots changed. */
  slot: number;
  /** The instruction that was in the slot. */
  oldOp: Op;
  /** The instruction now in the slot. */
  newOp: Op;
  /** True when a buy drove the change. */
  isBuy: boolean;
}

/**
 * Build the `abi.encodePacked` preimage of one Source Hash link.
 * Exposed so tests can compare the preimage itself against Solidity, not only the digest.
 */
export function sourceHashPreimage(previousHash: Hex, change: SourceChangeInput): Hex {
  assertHash32(previousHash, 'previousHash');
  assertUint(change.chainId, 'chainId');
  assertUint(change.revision, 'revision');
  if (!isAddress(change.contractAddress)) {
    throw new Error(`contractAddress is not an address: ${change.contractAddress}`);
  }
  if (!Number.isInteger(change.newState) || change.newState < 0 || change.newState > 0xffff_ffff) {
    throw new Error(`newState must be a uint32, got ${change.newState}`);
  }
  if (!isSlot(change.slot)) throw new Error(`invalid slot: ${change.slot}`);
  if (!isOp(change.oldOp)) throw new Error(`invalid oldOp: ${change.oldOp}`);
  if (!isOp(change.newOp)) throw new Error(`invalid newOp: ${change.newOp}`);
  if (typeof change.isBuy !== 'boolean') throw new Error('isBuy must be a boolean');

  return encodePacked(
    ['bytes32', 'uint256', 'address', 'uint256', 'uint32', 'uint8', 'uint8', 'uint8', 'bool'],
    [
      previousHash,
      change.chainId,
      // encodePacked lowercases; the checksummed form hashes identically since only the 20 raw
      // bytes are encoded, but normalizing keeps the preimage stable across input casings.
      getAddress(change.contractAddress),
      change.revision,
      change.newState,
      change.slot,
      change.oldOp,
      change.newOp,
      change.isBuy,
    ],
  );
}

/** Extend the hash chain by one change. Mirrors the `keccak256` in `_advanceSource`. */
export function nextSourceHash(previousHash: Hex, change: SourceChangeInput): Hex {
  const preimage = sourceHashPreimage(previousHash, change);
  // 2 for the "0x", 2 hex chars per byte.
  if (preimage.length !== 2 + SOURCE_HASH_PREIMAGE_BYTES * 2) {
    throw new Error(
      `Source Hash preimage must be ${SOURCE_HASH_PREIMAGE_BYTES} bytes, got ${(preimage.length - 2) / 2}`,
    );
  }
  return keccak256(preimage);
}

/**
 * Fold a whole ordered run of changes into the chain and return the resulting hash.
 * `startHash` is the chain value *before* the first change in `changes`.
 */
export function chainSourceHash(startHash: Hex, changes: readonly SourceChangeInput[]): Hex {
  let hash = startHash;
  for (const change of changes) hash = nextSourceHash(hash, change);
  return hash;
}

/**
 * Replay a run of changes, returning the hash after each one, so a caller can point at the exact
 * change where a chain diverges rather than only learning that it did.
 */
export function chainSourceHashes(startHash: Hex, changes: readonly SourceChangeInput[]): Hex[] {
  const hashes: Hex[] = [];
  let hash = startHash;
  for (const change of changes) {
    hash = nextSourceHash(hash, change);
    hashes.push(hash);
  }
  return hashes;
}

function assertHash32(value: Hex, label: string): void {
  if (!isHex(value) || value.length !== 66) {
    throw new Error(`${label} must be a 32-byte hex string, got ${String(value)}`);
  }
}

function assertUint(value: bigint, label: string): void {
  if (typeof value !== 'bigint' || value < 0n) {
    throw new Error(`${label} must be a non-negative bigint, got ${String(value)}`);
  }
}
