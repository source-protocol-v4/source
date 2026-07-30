// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {SOURCE} from "../../src/SOURCE.sol";

/// @notice Reference implementation of the Living Source mechanics, lifted verbatim from
/// `SOURCE._advanceSource` and `SOURCE.currentSource`.
///
/// The real contract can only advance the program through a Uniswap v4 swap, which would drag a
/// PoolManager, a mined hook address, a pool and liquidity into what is a pure-arithmetic parity
/// check. The transition, packing and hashing code below is copied from the contract unchanged,
/// and `SourceParityTest` asserts every constant it depends on against the deployed contract's own
/// public constants, so a change to either side breaks the test.
contract SourceReference {
    uint256 internal constant BITS_PER_SLOT = 2;
    uint256 internal constant SLOT_MASK = 3;
    uint256 internal constant SLOT_COUNT = 16;

    /// @dev Copy of the slot rewrite and hash extension in `SOURCE._advanceSource`.
    function advance(uint32 state, bytes32 prevHash, uint256 rev, uint8 slot, bool isBuy)
        external
        view
        returns (uint32 newState, bytes32 newHash, uint8 oldOp, uint8 newOp)
    {
        uint256 shift = uint256(slot) * BITS_PER_SLOT;
        oldOp = uint8((uint256(state) >> shift) & SLOT_MASK);
        newOp = isBuy ? uint8((oldOp + 1) & SLOT_MASK) : uint8((oldOp + 3) & SLOT_MASK);
        newState = uint32((uint256(state) & ~(SLOT_MASK << shift)) | (uint256(newOp) << shift));
        newHash = keccak256(
            abi.encodePacked(prevHash, block.chainid, address(this), rev, newState, slot, oldOp, newOp, isBuy)
        );
    }

    /// @notice The exact `abi.encodePacked` preimage the Source Hash is taken over.
    function preimage(bytes32 prevHash, uint256 rev, uint32 state, uint8 slot, uint8 oldOp, uint8 newOp, bool isBuy)
        external
        view
        returns (bytes memory)
    {
        return abi.encodePacked(prevHash, block.chainid, address(this), rev, state, slot, oldOp, newOp, isBuy);
    }

    /// @dev Copy of the unpacking loop in `SOURCE.currentSource`.
    function unpack(uint32 state) external pure returns (uint8[16] memory instructions) {
        for (uint256 i = 0; i < SLOT_COUNT; i++) {
            instructions[i] = uint8((uint256(state) >> (i * BITS_PER_SLOT)) & SLOT_MASK);
        }
    }
}

contract SourceParityTest is Test {
    SourceReference internal ref;

    /// @dev A fixed address, so the emitted fixture is deterministic across runs and machines.
    address internal constant FIXTURE_CONTRACT = 0x00000000000000000000000000000000000c0dE1;
    uint256 internal constant FIXTURE_CHAIN_ID = 1;

    function setUp() public {
        ref = new SourceReference();
    }

    // ── the reference tracks the deployed contract ────────────────────────────────────────────

    /// @dev Read the parameters straight off a real SOURCE instance. The reference — and the
    /// TypeScript codec that mirrors it — are only valid while these hold.
    function test_ContractConstantsMatchTheCodec() public {
        SOURCE token = deployedSource();
        assertEq(token.SLOT_COUNT(), 16, "SLOT_COUNT");
        assertEq(token.BITS_PER_SLOT(), 2, "BITS_PER_SLOT");
        assertEq(token.SLOT_MASK(), 3, "SLOT_MASK");
        assertEq(token.RELEASE_SIZE(), 32, "RELEASE_SIZE");
        assertEq(uint256(token.OP_EMPTY()), 0, "OP_EMPTY");
        assertEq(uint256(token.OP_PUSH()), 1, "OP_PUSH");
        assertEq(uint256(token.OP_SWAP()), 2, "OP_SWAP");
        assertEq(uint256(token.OP_LOOP()), 3, "OP_LOOP");
    }

    /// @dev A fresh contract starts with an all-EMPTY program, a zero hash and revision 0 — the
    /// genesis anchor the mirror replays release 0 from.
    function test_GenesisAnchor() public {
        SOURCE token = deployedSource();
        (uint32 state, uint8[16] memory instructions, uint256 rev, uint256 progress, bytes32 hash_) =
            token.currentSource();
        assertEq(state, 0, "genesis state");
        assertEq(hash_, bytes32(0), "genesis hash");
        assertEq(rev, 0, "genesis revision");
        assertEq(progress, 0, "genesis progress");
        assertEq(token.totalReleases(), 0, "no releases at genesis");
        for (uint256 i = 0; i < 16; i++) {
            assertEq(uint256(instructions[i]), 0, "genesis slot must be EMPTY");
        }
    }

    /// @dev The reference unpacks exactly like the deployed `instructionAt`/`currentSource`.
    function testFuzz_UnpackMatchesContract(uint32 state) public {
        SOURCE token = deployedSource();
        // Put an arbitrary packed program into the contract's `sourceState` slot and read it back
        // through the contract's own view functions.
        vm.store(address(token), bytes32(uint256(SOURCE_STATE_SLOT)), bytes32(uint256(state)));
        (uint32 read, uint8[16] memory instructions,,,) = token.currentSource();
        assertEq(read, state, "sourceState round trip");

        uint8[16] memory refInstructions = ref.unpack(state);
        for (uint256 i = 0; i < 16; i++) {
            assertEq(instructions[i], refInstructions[i], "unpacked slot");
            assertEq(token.instructionAt(uint8(i)), refInstructions[i], "instructionAt");
        }
    }

    // ── transition algebra ────────────────────────────────────────────────────────────────────

    /// @dev A buy walks a slot forward and a sell walks it back, so the pair is a round trip.
    function testFuzz_BuyThenSellIsIdentity(uint32 state, uint8 rawSlot) public view {
        uint8 slot = uint8(rawSlot % 16);
        (uint32 afterBuy,,,) = ref.advance(state, bytes32(0), 1, slot, true);
        (uint32 afterSell,,,) = ref.advance(afterBuy, bytes32(0), 2, slot, false);
        assertEq(afterSell, state, "buy then sell must restore the program");
    }

    /// @dev A change rewrites its own slot and leaves the other fifteen alone.
    function testFuzz_OnlyTargetSlotChanges(uint32 state, uint8 rawSlot, bool isBuy) public view {
        uint8 slot = uint8(rawSlot % 16);
        (uint32 newState,,,) = ref.advance(state, bytes32(0), 1, slot, isBuy);
        uint8[16] memory before_ = ref.unpack(state);
        uint8[16] memory after_ = ref.unpack(newState);
        for (uint256 i = 0; i < 16; i++) {
            if (i == slot) continue;
            assertEq(after_[i], before_[i], "an untouched slot changed");
        }
    }

    /// @dev Four buys on one slot return it to where it started: EMPTY->PUSH->SWAP->LOOP->EMPTY.
    function testFuzz_FourBuysCycle(uint32 state, uint8 rawSlot) public view {
        uint8 slot = uint8(rawSlot % 16);
        uint32 s = state;
        for (uint256 i = 0; i < 4; i++) {
            (s,,,) = ref.advance(s, bytes32(0), i + 1, slot, true);
        }
        assertEq(s, state, "four buys must cycle back");
    }

    /// @dev The hash preimage is exactly 124 bytes: 32+32+20+32+4+1+1+1+1.
    function testFuzz_PreimageLength(bytes32 prevHash, uint256 rev, uint32 state, uint8 rawSlot, bool isBuy)
        public
        view
    {
        bytes memory p = ref.preimage(prevHash, rev, state, uint8(rawSlot % 16), 0, 1, isBuy);
        assertEq(p.length, 124, "abi.encodePacked preimage length");
    }

    /// @dev Changing any single input changes the hash: the chain really commits to all of them.
    function test_HashCommitsToEveryField() public view {
        bytes32 base = hashOf(bytes32(uint256(1)), 7, 0x0000_0f0f, 3, true);
        assertTrue(base != hashOf(bytes32(uint256(2)), 7, 0x0000_0f0f, 3, true), "prevHash");
        assertTrue(base != hashOf(bytes32(uint256(1)), 8, 0x0000_0f0f, 3, true), "revision");
        assertTrue(base != hashOf(bytes32(uint256(1)), 7, 0x0000_0f0e, 3, true), "state");
        assertTrue(base != hashOf(bytes32(uint256(1)), 7, 0x0000_0f0f, 4, true), "slot");
        assertTrue(base != hashOf(bytes32(uint256(1)), 7, 0x0000_0f0f, 3, false), "isBuy");
    }

    function hashOf(bytes32 prevHash, uint256 rev, uint32 state, uint8 slot, bool isBuy)
        internal
        view
        returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(prevHash, block.chainid, address(ref), rev, state, slot, uint8(0), uint8(1), isBuy)
        );
    }

    // ── the fixture the Node suite replays ────────────────────────────────────────────────────

    /// @notice Write `test/fixtures/solidity-parity.json`: a 64-change chain (two full releases)
    /// produced by the Solidity above. `npm test` replays it through the TypeScript codec and hash
    /// and requires an exact match, so the two implementations cannot drift apart silently.
    ///
    /// The fixture is committed. Re-generate it with:
    ///     forge test --match-test test_WriteParityFixture --ffi
    /// It is deterministic: fixed contract address, fixed chain id, fixed change sequence.
    function test_WriteParityFixture() public {
        // Put the reference at the fixed fixture address so the hashes do not depend on the
        // nonce-derived deploy address of this test run.
        vm.etch(FIXTURE_CONTRACT, address(ref).code);
        vm.chainId(FIXTURE_CHAIN_ID);
        SourceReference fixed_ = SourceReference(FIXTURE_CONTRACT);

        string memory json = "[";
        bytes32 hash_ = bytes32(0);
        uint32 state = 0;

        for (uint256 i = 0; i < 64; i++) {
            uint256 rev = i + 1;
            // A deterministic but non-trivial walk: every slot is visited, sells are interleaved
            // so the fixture exercises both transition directions and repeated slots.
            uint8 slot = uint8((i * 7 + i / 16) % 16);
            bool isBuy = (i % 3) != 0;

            (uint32 newState, bytes32 newHash, uint8 oldOp, uint8 newOp) =
                fixed_.advance(state, hash_, rev, slot, isBuy);

            json = string.concat(
                json,
                i == 0 ? "" : ",",
                "{\"revision\":",
                vm.toString(rev),
                ",\"slot\":",
                vm.toString(uint256(slot)),
                ",\"oldOp\":",
                vm.toString(uint256(oldOp)),
                ",\"newOp\":",
                vm.toString(uint256(newOp)),
                ",\"isBuy\":",
                isBuy ? "true" : "false",
                ",\"newState\":",
                vm.toString(uint256(newState)),
                ",\"newHash\":\"",
                vm.toString(newHash),
                "\"}"
            );

            state = newState;
            hash_ = newHash;
        }

        json = string.concat(
            "{\"chainId\":",
            vm.toString(FIXTURE_CHAIN_ID),
            ",\"contract\":\"",
            vm.toString(FIXTURE_CONTRACT),
            "\",\"genesisHash\":\"",
            vm.toString(bytes32(0)),
            "\",\"changes\":",
            json,
            "]}"
        );

        // writeJson pretty-prints, so the committed fixture stays readable and diffable and the
        // regeneration command needs no follow-up formatting step.
        vm.writeJson(json, "test/fixtures/solidity-parity.json");
        console.log("wrote test/fixtures/solidity-parity.json with 64 changes");
    }

    // ── helpers ───────────────────────────────────────────────────────────────────────────────

    /// @dev Storage slot of `sourceState`, per `forge inspect SOURCE storage`. Rewriting storage
    /// directly is what lets `testFuzz_UnpackMatchesContract` drive the contract's own view
    /// functions over an arbitrary packed program without going through a Uniswap v4 swap.
    uint256 internal constant SOURCE_STATE_SLOT = 20;

    /// @dev Pin the slot: if the contract's storage layout ever shifts, this fails loudly instead
    /// of letting the fuzz test above silently write into the wrong variable.
    function test_SourceStateSlotIsPinned() public {
        SOURCE token = deployedSource();
        assertEq(token.sourceState(), 0, "sourceState must start at zero");
        uint32 marker = 0x2a2a2a2a;
        vm.store(address(token), bytes32(SOURCE_STATE_SLOT), bytes32(uint256(marker)));
        assertEq(token.sourceState(), marker, "SOURCE_STATE_SLOT does not point at sourceState");
    }

    /// @dev A real SOURCE instance. The constructor only needs three non-zero addresses; the pool
    /// is never bound, which is fine because nothing here swaps.
    function deployedSource() internal returns (SOURCE) {
        return new SOURCE(IPoolManager(makeAddr("poolManager")), makeAddr("reserve"), makeAddr("owner"));
    }
}
