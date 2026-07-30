// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

//                        ┌────────────────────────────────────────────┐
//                        │  0  1  2  3   4  5  6  7                   │
//                        │  ▓  ░  ▒  █   ░  █  ▓  ▒     THE PROGRAM   │
//                        │                                            │
//                        │  8  9 10 11  12 13 14 15                   │
//                        │  █  ▒  ░  ▓   ▒  ░  █  ▓                   │
//                        └────────────────────────────────────────────┘
//
//                 EMPTY ── PUSH ── SWAP ── LOOP ──┐
//                   └───────────────────────────  ┘
//
//        S O U R C E  —  the program rewrites itself. every buy pushes it forward,
//                        every sell rolls it back. holders take the whole cut, in ETH.
//
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuardTransient} from "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";
import {BaseTestHooks} from "v4-core/src/test/BaseTestHooks.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {LPFeeLibrary} from "v4-core/src/libraries/LPFeeLibrary.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {BalanceDelta, BalanceDeltaLibrary} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary, toBeforeSwapDelta} from "v4-core/src/types/BeforeSwapDelta.sol";
import {SwapParams} from "v4-core/src/types/PoolOperation.sol";

/// @title SOURCE — a fixed-supply ERC20 that is its own Uniswap v4 hook, pays ETH rewards to holders,
/// and carries a 16-instruction program that every qualifying swap rewrites.
///
/// SOURCE is a single contract: the ERC-20 token, the v4 hook, the holder-reward accounting and the
/// Living Source program all live at one address. 100,000 SRC are minted once at deployment and never
/// again — there is no mint function, no blacklist, no transfer tax, and no admin fee.
///
/// A 2% fee is charged on buys and 4% on sells through the one official SRC/native-ETH v4 pool. The fee
/// is always taken in native ETH — never in SRC — and 100% of it is pushed into the holder reward pool.
/// There is no treasury and no deployer allocation. Wallet-to-wallet transfers are completely fee-free.
///
/// Holders earn ETH proportionally to their SRC balance with no staking, using cumulative
/// reward-per-token accounting that never loops over holders. Rewards already earned survive transfers,
/// buys and sells because both sides of every balance change are settled first.
///
/// A reward left unclaimed for a full day can be swept by a private reserve wallet, so nothing strands.
/// Reclaiming only moves the reward into the reserve's own pending — no ETH leaves the contract — and
/// the reserve withdraws it through the same claim() path as any holder. Claiming refreshes a wallet's
/// 24h window, so an active holder is never swept.
///
/// Every swap of at least MIN_SOURCE_SWAP gross SRC also rewrites one of the program's 16 instruction
/// slots: a buy advances that slot (EMPTY→PUSH→SWAP→LOOP→EMPTY), a sell walks it back. Each change
/// bumps a global revision and extends a chained Source Hash; every 32 changes finalize an immutable
/// release. The slot is chosen deterministically from on-chain inputs — it is reproducible, not secret,
/// and neither the trader nor the owner picks it.
///
/// The owner holds no power over the mechanics — there is nothing to pause, no fee to change, no list
/// to edit. Ownership exists only so the launcher can renounce it (owner() → address(0)) as a public,
/// on-chain signal that the launch is final.
contract SOURCE is ERC20, Ownable, ReentrancyGuardTransient, BaseTestHooks {
    using BalanceDeltaLibrary for BalanceDelta;
    using PoolIdLibrary for PoolKey;

    // ── fixed parameters ─────────────────────────────────────────────────────────────────────────
    /// @notice The entire supply, minted once in the constructor. There is no other mint path.
    uint256 public constant SUPPLY = 100_000e18;
    /// @notice Basis-point denominator.
    uint256 public constant BPS = 10_000;
    /// @notice Fixed-point magnitude for the reward-per-share accumulator.
    /// @dev 1e27, not 1e18. `accRewardPerShare += amount * MAG / totalShares` truncates, and with a
    /// 100,000e18 share denominator a 1e18 magnitude would strand ~1e-13 of every fee as dust. At 1e27
    /// the same fee loses well under a wei of ETH. Headroom is ample: even at 1e9 ETH of lifetime fees
    /// against a single-wei share the accumulator stays far below 2^256.
    uint256 public constant MAG = 1e27;

    /// @notice ETH fee on a buy (ETH → SRC), in basis points. 2%.
    uint256 public constant BUY_FEE_BPS = 200;
    /// @notice ETH fee on a sell (SRC → ETH), in basis points. 4%.
    uint256 public constant SELL_FEE_BPS = 400;

    /// @notice Standard burn address, permanently excluded from rewards.
    address public constant DEAD = 0x000000000000000000000000000000000000dEaD;

    /// @notice A wallet's reward becomes sweepable after this long without a claim.
    uint256 public constant RESERVE_INTERVAL = 24 hours;

    // ── Living Source parameters ─────────────────────────────────────────────────────────────────
    /// @notice Number of instruction slots in the program.
    uint256 public constant SLOT_COUNT = 16;
    /// @notice Bits per packed instruction. Four states fit in two bits.
    uint256 public constant BITS_PER_SLOT = 2;
    /// @notice Mask for a single packed instruction.
    uint256 public constant SLOT_MASK = 3;
    /// @notice Qualifying Source changes required to finalize one release.
    uint256 public constant RELEASE_SIZE = 32;
    /// @notice Minimum gross SRC in a swap for it to rewrite the program. Smaller swaps still pay fees.
    uint256 public constant MIN_SOURCE_SWAP = 25e18;

    /// @notice Instruction: an empty slot.
    uint8 public constant OP_EMPTY = 0;
    /// @notice Instruction: PUSH.
    uint8 public constant OP_PUSH = 1;
    /// @notice Instruction: SWAP.
    uint8 public constant OP_SWAP = 2;
    /// @notice Instruction: LOOP.
    uint8 public constant OP_LOOP = 3;

    /// @notice The canonical Uniswap v4 PoolManager this hook is mounted on.
    IPoolManager public immutable poolManager;

    // ── reserve wallet (private/internal storage) ─────────────────────────────────────────────────
    // Never receives normal swap fees directly; only sweeps rewards left unclaimed for a full day.
    // A reclaimed reward is credited to the reserve's own pending and withdrawn with claim() — there
    // is no global cooldown, so a stale reward can be swept the moment it expires and no caller can
    // grief it.
    address private immutable reserve;

    // ── the canonical pool: bound once, in beforeInitialize ───────────────────────────────────────
    /// @notice Whether the one official pool has been bound. Binding is permanent.
    bool public poolBound;
    /// @notice The id of the bound pool.
    PoolId public canonicalPool;
    /// @notice The full key of the bound pool.
    PoolKey public poolKey;

    /// @notice Addresses that hold SRC but earn no rewards: pool infrastructure and system addresses.
    mapping(address => bool) public excluded;

    // ── ETH holder rewards: every fee, shared by SRC balance ──────────────────────────────────────
    /// @notice Cumulative ETH-per-token, summed over every fee ever collected (MAG-fixed).
    uint256 public accRewardPerShare;
    /// @notice Σ SRC held by reward-eligible wallets. Never counts excluded addresses.
    uint256 public totalShares;
    /// @notice Fees taken while no eligible wallet existed. Flushed into the next distribution.
    uint256 public ethBuffer;
    /// @notice Total ETH fees ever routed to the reward pool.
    uint256 public totalRewardsCollected;
    /// @notice Total ETH ever paid out of the reward pool.
    uint256 public totalRewardsClaimed;

    /// @notice accRewardPerShare at a wallet's last settle.
    mapping(address => uint256) public rewardCheckpoint;
    /// @notice Settled, unclaimed reward ETH per wallet.
    mapping(address => uint256) public pending;
    /// @notice Total ETH a wallet has ever claimed.
    mapping(address => uint256) public claimedOf;
    /// @notice When a wallet's pending began accruing; refreshed by claim and by reclaim.
    mapping(address => uint64) public rewardClock;

    // ── the Living Source program ────────────────────────────────────────────────────────────────
    /// @notice The 16 instructions, packed two bits each into the low 32 bits. Starts all-EMPTY.
    uint32 public sourceState;
    /// @notice Monotonic count of every qualifying Source change ever made. Never reset.
    uint256 public revision;
    /// @notice Qualifying changes made since the last release finalized. Always < RELEASE_SIZE.
    uint256 public releaseProgress;
    /// @notice The id of the release currently being written. Incremented on every finalization.
    uint256 public releaseId;
    /// @notice Chained commitment over every Source change ever made.
    bytes32 public sourceHash;
    /// @notice Qualifying buys counted toward the current release.
    uint32 public releaseBuys;
    /// @notice Qualifying sells counted toward the current release.
    uint32 public releaseSells;

    /// @notice One finalized, immutable release.
    struct Release {
        uint32 state; // packed Source state at finalization
        bytes32 hash; // Source Hash at finalization
        uint256 finalRevision; // global revision at finalization
        uint256 finalizedBlock; // block the release was sealed in
        uint32 buys; // qualifying buys within the release
        uint32 sells; // qualifying sells within the release
    }

    /// @notice Finalized releases by id. Written exactly once each and never mutated afterwards.
    mapping(uint256 => Release) private releases;

    // ── events ────────────────────────────────────────────────────────────────────────────────────
    /// @notice Emitted once, when the official pool is bound.
    event PoolBound(PoolId indexed poolId);
    /// @notice Emitted on every taxed swap.
    /// @param trader the transaction origin, a cosmetic label only — never used for authorization
    /// @param isBuy true when ETH was swapped in for SRC
    /// @param ethAmount the gross ETH side of the swap the fee was charged on
    /// @param srcAmount the gross SRC side of the same swap (what the Living Source threshold reads)
    /// @param feeAmount the ETH fee taken and routed to the reward pool
    /// @param timestamp the block timestamp of the swap
    event SwapTaxed(
        address indexed trader,
        bool indexed isBuy,
        uint256 ethAmount,
        uint256 srcAmount,
        uint256 feeAmount,
        uint256 timestamp
    );
    /// @notice Emitted for every ETH fee collected, with its timestamp.
    event EthFeeCollected(uint256 amount, uint256 timestamp);
    /// @notice Emitted when a fee is distributed into the reward accumulator.
    event RewardsAdded(uint256 amount, uint256 accRewardPerShare, uint256 timestamp);
    /// @notice Emitted when a fee arrives with no eligible holder and is parked in the buffer.
    event RewardsBuffered(uint256 amount, uint256 ethBuffer, uint256 timestamp);
    /// @notice Emitted when a holder withdraws reward ETH.
    event RewardsClaimed(address indexed account, uint256 amount, uint256 timestamp);
    /// @notice Emitted when a stale reward is folded into the reserve's pending.
    event Reclaimed(address indexed account, uint256 amount, uint256 timestamp);

    /// @notice Emitted on every qualifying Source change — one instruction slot rewritten.
    /// @param revision the new global revision after this change
    /// @param slot which of the 16 instruction slots changed
    /// @param oldOp the instruction that was there
    /// @param newOp the instruction now in the slot
    /// @param isBuy true when a buy drove the change (advancing), false for a sell (rewinding)
    /// @param newState the full packed program after the change
    /// @param newHash the extended Source Hash
    /// @param timestamp the block timestamp of the change
    event SourceChanged(
        uint256 indexed revision,
        uint8 indexed slot,
        uint8 oldOp,
        uint8 newOp,
        bool isBuy,
        uint32 newState,
        bytes32 newHash,
        uint256 timestamp
    );
    /// @notice Emitted when 32 qualifying changes seal a release.
    event ReleaseFinalized(
        uint256 indexed releaseId,
        uint32 state,
        bytes32 hash,
        uint256 finalRevision,
        uint256 finalizedBlock,
        uint32 buys,
        uint32 sells
    );

    // ── custom errors ─────────────────────────────────────────────────────────────────────────────
    error NotPoolManager();
    error NotCanonicalPool();
    error PoolAlreadyBound();
    error NothingToClaim();
    error RewardNotExpired();
    error EthTransferFailed();
    error ExactOutSellUnsupported();
    error ZeroAddress();
    error InvalidSlot();

    modifier onlyPoolManager() {
        if (msg.sender != address(poolManager)) revert NotPoolManager();
        _;
    }

    /// @param pm the canonical Uniswap v4 PoolManager this hook is mounted on.
    /// @param reserve_ the private reserve wallet that sweeps long-unclaimed rewards (it never receives
    /// swap fees directly).
    /// @param owner_ the launcher: receives the full supply to seed the LP and may later renounce
    /// ownership. The owner has no power over the token's mechanics — see the contract NatSpec.
    constructor(IPoolManager pm, address reserve_, address owner_) ERC20("SOURCE", "SRC") Ownable(owner_) {
        if (address(pm) == address(0) || reserve_ == address(0) || owner_ == address(0)) revert ZeroAddress();
        poolManager = pm;
        reserve = reserve_;

        // Pool infrastructure and system addresses hold or receive tokens but are not real holders:
        // they earn no reward share. address(0) is handled structurally in _update/_shareOf.
        excluded[address(pm)] = true;
        excluded[address(this)] = true;
        excluded[DEAD] = true;
        // the reserve is bookkeeping-only: it accrues swept rewards but earns no reward share of its own
        excluded[reserve_] = true;

        // 100% of supply minted once to the launcher, who seeds it as Uniswap v4 liquidity.
        _mint(owner_, SUPPLY);
    }

    /// @dev ETH fees arrive here via poolManager.take. Nothing else may push ETH in, so the contract's
    /// balance is always exactly the un-claimed portion of collected fees.
    receive() external payable onlyPoolManager {}

    // ── hook permissions (the bits encoded in this hook's address) ────────────────────────────────
    /// @notice The callbacks this hook subscribes to: bind the pool, then tax every swap.
    function getHookPermissions() public pure returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: true,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: true,
            afterSwapReturnDelta: true,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    // ── binding the one canonical pool ────────────────────────────────────────────────────────────
    /// @notice Bind the single official pool the first time it is initialized through the Uniswap v4
    /// PoolManager. The pool must pair native ETH (currency0) with SRC (currency1) on this hook;
    /// anything else is rejected. A second initialization reverts, so the binding is permanent.
    /// @dev This is the only "initialization authority" in the contract, and it is not an owner power:
    /// whoever initializes the pool first fixes it forever, and the key is validated so the only pool
    /// that can ever bind is ETH/SRC on this hook.
    function beforeInitialize(address, PoolKey calldata key, uint160)
        external
        override
        onlyPoolManager
        returns (bytes4)
    {
        if (poolBound) revert PoolAlreadyBound();
        if (
            Currency.unwrap(key.currency0) != address(0) // native ETH
                || Currency.unwrap(key.currency1) != address(this) // SRC
                || address(key.hooks) != address(this)
        ) revert NotCanonicalPool();
        poolBound = true;
        poolKey = key;
        canonicalPool = key.toId();
        emit PoolBound(canonicalPool);
        return IHooks.beforeInitialize.selector;
    }

    // ── taxing swaps ──────────────────────────────────────────────────────────────────────────────
    /// @dev Direction is read from `zeroForOne` against the bound key, where ETH is currency0 and SRC
    /// currency1 — enforced at bind time — so a buy is always ETH-in and a sell always SRC-in regardless
    /// of how a caller orders its arguments.
    ///
    /// The fee is denominated in native ETH, which decides where it can be charged. On an exact-in buy
    /// ETH is the specified input, so the fee is skimmed here in beforeSwap. On a sell, and on an
    /// exact-out buy, the ETH side is the unspecified one and is known only from the settled delta, so
    /// those fees are taken in afterSwap.
    ///
    /// An exact-out sell (ETH specified as output) is rejected: charging the ETH fee against a specified
    /// output would hand the trader less ETH than the exact amount they asked for, and taking it from the
    /// unspecified SRC input instead would denominate the fee in the wrong asset. Routers sell exact-in,
    /// so nothing legitimate is lost. The LP fee is overridden to 0 — the ETH tax is the only fee.
    function beforeSwap(address, PoolKey calldata key, SwapParams calldata params, bytes calldata)
        external
        override
        onlyPoolManager
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        _requireCanonical(key);
        // exact-out sell: the ETH side is the specified output — unsupported, see NatSpec above
        if (!params.zeroForOne && params.amountSpecified > 0) revert ExactOutSellUnsupported();

        // exact-in buy: ETH is the specified input, so skim the fee now
        if (params.zeroForOne && params.amountSpecified < 0) {
            uint256 fee = uint256(-params.amountSpecified) * BUY_FEE_BPS / BPS;
            if (fee > 0) {
                poolManager.take(Currency.wrap(address(0)), address(this), fee);
                return
                    (
                        IHooks.beforeSwap.selector,
                        toBeforeSwapDelta(int128(int256(fee)), 0),
                        LPFeeLibrary.OVERRIDE_FEE_FLAG
                    );
            }
        }
        return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, LPFeeLibrary.OVERRIDE_FEE_FLAG);
    }

    /// @dev Take whatever ETH fee is still owed (sells and exact-out buys), bank the whole fee into the
    /// holder reward pool, then let the swap rewrite the Living Source if its SRC side is large enough to
    /// qualify. ETH is always currency0 and SRC always currency1 on the bound pool.
    ///
    /// Note the two amounts are deliberately different things: the fee is charged on the ETH side, while
    /// the Living Source threshold is measured on the gross SRC side of the same swap.
    function afterSwap(address, PoolKey calldata key, SwapParams calldata params, BalanceDelta delta, bytes calldata)
        external
        override
        onlyPoolManager
        returns (bytes4, int128)
    {
        _requireCanonical(key);
        bool isBuy = params.zeroForOne;
        uint256 feeBps = isBuy ? BUY_FEE_BPS : SELL_FEE_BPS;
        uint256 fee;
        uint256 ethAmt;
        uint256 srcAmt;
        int128 ret = 0;

        if (isBuy) {
            // BUY — ETH in, SRC out
            srcAmt = uint256(uint128(delta.amount1()));
            if (params.amountSpecified < 0) {
                ethAmt = uint256(-params.amountSpecified); // exact-in: fee already skimmed in beforeSwap
                fee = ethAmt * feeBps / BPS;
            } else {
                ethAmt = uint256(uint128(-delta.amount0())); // exact-out buy: take the fee on the ETH input
                fee = ethAmt * feeBps / BPS;
                if (fee > 0) poolManager.take(Currency.wrap(address(0)), address(this), fee);
                ret = int128(int256(fee));
            }
        } else {
            // SELL (exact-in) — SRC in, ETH out is the unspecified side
            srcAmt = uint256(-params.amountSpecified);
            ethAmt = uint256(uint128(delta.amount0()));
            fee = ethAmt * feeBps / BPS;
            if (fee > 0) poolManager.take(Currency.wrap(address(0)), address(this), fee);
            ret = int128(int256(fee));
        }

        if (fee > 0) {
            emit EthFeeCollected(fee, block.timestamp);
            _bank(fee);
        }
        emit SwapTaxed(tx.origin, isBuy, ethAmt, srcAmt, fee, block.timestamp);

        // Only swaps of real SRC size move the program; everything else still paid its fee above.
        if (srcAmt >= MIN_SOURCE_SWAP) _advanceSource(isBuy, srcAmt);

        return (IHooks.afterSwap.selector, ret);
    }

    /// @dev Reject any pool but the bound canonical one.
    function _requireCanonical(PoolKey calldata key) private view {
        if (!poolBound || PoolId.unwrap(key.toId()) != PoolId.unwrap(canonicalPool)) revert NotCanonicalPool();
    }

    // ── the Living Source ─────────────────────────────────────────────────────────────────────────
    /// @dev Rewrite exactly one instruction slot, extend the hash chain, and seal a release every
    /// RELEASE_SIZE changes.
    ///
    /// The slot is derived by hashing values that are all fixed before the hook runs — the previous
    /// hash, the revision, the chain id, this address, the block, the swap size and direction. That
    /// makes it deterministic and reproducible by anyone replaying the chain. It is NOT secure
    /// randomness: a sufficiently motivated trader who controls their swap size can search for a
    /// preferred slot. That is acceptable because the program is cosmetic — no reward, fee, balance or
    /// permission anywhere in this contract reads it — and it is bounded to 0..15, so no slot outside
    /// the program can ever be addressed. What a trader cannot do is name a slot directly or skip the
    /// transition order.
    function _advanceSource(bool isBuy, uint256 srcAmt) private {
        uint256 rev = revision + 1;
        uint8 slot = _selectSlot(rev, srcAmt, isBuy);
        uint32 state = sourceState;
        uint8 oldOp;
        uint8 newOp;

        {
            uint256 shift = uint256(slot) * BITS_PER_SLOT;
            oldOp = uint8((uint256(state) >> shift) & SLOT_MASK);
            // BUY:  EMPTY → PUSH → SWAP → LOOP → EMPTY   (forward, +1 mod 4)
            // SELL: EMPTY → LOOP → SWAP → PUSH → EMPTY   (backward, -1 mod 4)
            newOp = isBuy ? uint8((oldOp + 1) & SLOT_MASK) : uint8((oldOp + 3) & SLOT_MASK);
            // clear the slot, then write the new instruction into it — every other slot is untouched
            state = uint32((uint256(state) & ~(SLOT_MASK << shift)) | (uint256(newOp) << shift));
        }

        sourceState = state;
        revision = rev;

        bytes32 newHash = keccak256(
            abi.encodePacked(sourceHash, block.chainid, address(this), rev, state, slot, oldOp, newOp, isBuy)
        );
        sourceHash = newHash;

        if (isBuy) releaseBuys++;
        else releaseSells++;

        emit SourceChanged(rev, slot, oldOp, newOp, isBuy, state, newHash, block.timestamp);

        uint256 progress = releaseProgress + 1;
        if (progress == RELEASE_SIZE) {
            _finalizeRelease(state, newHash, rev);
        } else {
            releaseProgress = progress;
        }
    }

    /// @dev Pick which of the 16 slots this change rewrites. Deterministic and reproducible off-chain
    /// from values all fixed before the hook runs; the modulo bounds it to 0..15 so an invalid slot is
    /// unrepresentable. See `_advanceSource` for why this deliberately is not secure randomness.
    function _selectSlot(uint256 rev, uint256 srcAmt, bool isBuy) private view returns (uint8) {
        return uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        sourceHash, rev, block.chainid, address(this), block.number, block.timestamp, srcAmt, isBuy
                    )
                )
            ) % SLOT_COUNT
        );
    }

    /// @dev Seal the current release and start the next one. The program, the global revision and the
    /// hash chain all carry forward untouched — only the per-release progress and counters reset.
    function _finalizeRelease(uint32 state, bytes32 hash_, uint256 rev) private {
        uint256 id = releaseId;
        uint32 buys = releaseBuys;
        uint32 sells = releaseSells;

        releases[id] = Release({
            state: state, hash: hash_, finalRevision: rev, finalizedBlock: block.number, buys: buys, sells: sells
        });

        emit ReleaseFinalized(id, state, hash_, rev, block.number, buys, sells);

        releaseId = id + 1;
        releaseProgress = 0;
        releaseBuys = 0;
        releaseSells = 0;
    }

    // ── reward accounting ─────────────────────────────────────────────────────────────────────────
    /// @dev Push a fee into the per-share accumulator. With no eligible holder the fee waits in the
    /// buffer and joins the next distribution, so no ETH is ever lost or stranded.
    function _bank(uint256 fee) private {
        totalRewardsCollected += fee;
        uint256 shares = totalShares;
        if (shares > 0) {
            uint256 amount = fee + ethBuffer;
            ethBuffer = 0;
            accRewardPerShare += amount * MAG / shares;
            emit RewardsAdded(amount, accRewardPerShare, block.timestamp);
        } else {
            ethBuffer += fee;
            emit RewardsBuffered(fee, ethBuffer, block.timestamp);
        }
    }

    /// @dev A wallet's reward share is its SRC balance, unless it is excluded infrastructure. SRC held
    /// by this contract is excluded, so tokens sitting on the reward contract can never be counted as a
    /// distributable balance.
    function _shareOf(address account) private view returns (uint256) {
        return excluded[account] ? 0 : balanceOf(account);
    }

    /// @dev Settle a wallet's accrued reward into its claimable `pending` at its current balance, then
    /// move its checkpoint forward. Starts the wallet's 24h clock the first time a reward lands.
    function _settle(address account) private {
        uint256 share = _shareOf(account);
        uint256 acc = accRewardPerShare;
        if (share > 0) {
            uint256 owed = share * (acc - rewardCheckpoint[account]) / MAG;
            if (owed > 0) {
                pending[account] += owed;
                if (rewardClock[account] == 0) rewardClock[account] = uint64(block.timestamp);
            }
        }
        rewardCheckpoint[account] = acc;
    }

    /// @dev Settle both parties before balances move, then keep totalShares in step with eligible
    /// balances. Settling on every transfer/buy/sell preserves already-earned rewards and stops
    /// transfer-based manipulation: tokens carry no unsettled reward with them.
    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0)) _settle(from);
        if (to != address(0)) _settle(to);
        super._update(from, to, value);
        bool fromEligible = from != address(0) && !excluded[from];
        bool toEligible = to != address(0) && !excluded[to];
        if (fromEligible && !toEligible) totalShares -= value;
        else if (!fromEligible && toEligible) totalShares += value;
    }

    // ── claims ────────────────────────────────────────────────────────────────────────────────────
    /// @notice Withdraw your reward ETH — your share of every fee taken while you held SRC. There is no
    /// staking and no minimum balance; rewards already settled stay claimable even at a zero balance.
    /// Claiming also refreshes your 24h window, so an active holder's reward is never reclaimed. Reverts
    /// when there is nothing to claim.
    /// @dev Checks-effects-interactions: pending is zeroed and the counters updated before any ETH is
    /// sent, and the whole call is reentrancy-guarded, so a reentrant receiver cannot be paid twice.
    /// @return amount the ETH paid out.
    function claim() external nonReentrant returns (uint256 amount) {
        _settle(msg.sender);
        amount = pending[msg.sender];
        if (amount == 0) revert NothingToClaim();
        pending[msg.sender] = 0;
        rewardClock[msg.sender] = uint64(block.timestamp); // claiming refreshes the 24h window
        claimedOf[msg.sender] += amount;
        totalRewardsClaimed += amount;
        (bool ok,) = msg.sender.call{value: amount}("");
        if (!ok) revert EthTransferFailed();
        emit RewardsClaimed(msg.sender, amount, block.timestamp);
    }

    /// @notice Fold a wallet's accrued reward into its claimable balance without paying out.
    /// Permissionless: it only moves a wallet's own reward from "accruing" to "settled".
    function sync(address account) external {
        _settle(account);
    }

    // ── reclaiming long-unclaimed rewards ─────────────────────────────────────────────────────────
    /// @notice Fold a wallet's reward into the reserve's own pending once it has gone unclaimed for a
    /// full day, so nothing strands. Only rewards that are themselves expired (the wallet's clock is
    /// older than RESERVE_INTERVAL) are reclaimable. There is NO global cooldown: a stale reward can be
    /// reclaimed the moment it expires, and because reclaiming only moves the reward into another
    /// pending balance (no ETH leaves here and no shared timer is touched) it is safe to leave
    /// permissionless — any caller may reclaim, and no caller can grief by resetting a cooldown, because
    /// there is none. The reclaimed ETH is later withdrawn through claim(), which the reserve calls like
    /// any other holder. The reserve never touches the wallet's SRC and never receives normal swap fees
    /// — only what was abandoned.
    /// @return amount the ETH moved into the reserve's pending.
    function reclaim(address account) external returns (uint256 amount) {
        if (account == reserve) revert RewardNotExpired(); // the reserve's own pending is not reclaimable
        _settle(account);
        uint64 clk = rewardClock[account];
        if (clk == 0 || block.timestamp <= uint256(clk) + RESERVE_INTERVAL) revert RewardNotExpired();
        amount = pending[account];
        if (amount == 0) revert NothingToClaim();
        _reclaim(account, amount);
    }

    /// @notice Reclaim EVERY currently-expired reward in one transaction. Same rules as reclaim(), but
    /// batched: accounts in the list that are not (yet) reclaimable — no started clock, clock not past
    /// RESERVE_INTERVAL, or nothing pending — are skipped rather than reverting the whole batch.
    /// Permissionless and cooldown-free (see reclaim); reverts only if the batch would take nothing.
    /// @param accounts candidate holder addresses (the zero address, the reserve and non-expired entries
    /// are skipped; duplicates are harmless — each account's pending is zeroed on first reclaim and
    /// contributes nothing on a repeat).
    /// @return total the total ETH reclaimed into the reserve's pending across all collected accounts.
    function reclaimMany(address[] calldata accounts) external returns (uint256 total) {
        for (uint256 i = 0; i < accounts.length; i++) {
            address account = accounts[i];
            if (account == address(0) || account == reserve) continue;
            _settle(account);
            uint64 clk = rewardClock[account];
            // skip anything not yet reclaimable instead of reverting the whole batch
            if (clk == 0 || block.timestamp <= uint256(clk) + RESERVE_INTERVAL) continue;
            uint256 amount = pending[account];
            if (amount == 0) continue;
            _reclaim(account, amount);
            total += amount;
        }
        if (total == 0) revert NothingToClaim();
    }

    /// @dev Move `amount` of a stale wallet's reward into the reserve's pending and restart the wallet's
    /// window so an idle holder keeps cycling. No ETH moves here; totalRewardsClaimed is charged only
    /// when the reserve actually withdraws through claim().
    function _reclaim(address account, uint256 amount) private {
        pending[account] = 0;
        rewardClock[account] = uint64(block.timestamp);
        pending[reserve] += amount; // reserve is excluded, so this pending only ever grows by reclaims
        emit Reclaimed(account, amount, block.timestamp);
    }

    // ── reward views ──────────────────────────────────────────────────────────────────────────────
    /// @notice A wallet's claimable reward ETH right now: what is already settled plus what it has
    /// earned since its last settle.
    function claimable(address account) public view returns (uint256 amount) {
        amount = pending[account];
        uint256 share = _shareOf(account);
        if (share > 0) amount += share * (accRewardPerShare - rewardCheckpoint[account]) / MAG;
    }

    /// @notice The total ETH a wallet has ever claimed.
    function lifetimeClaimed(address account) external view returns (uint256) {
        return claimedOf[account];
    }

    /// @notice The total ETH fees ever routed to holders, including any still sitting in the buffer.
    function totalRewardsDistributed() external view returns (uint256) {
        return totalRewardsCollected;
    }

    /// @notice The ETH this contract still owes holders: everything collected that has not been paid out.
    /// The contract's own ETH balance must always be at least this much — see the solvency invariant.
    function rewardLiabilities() external view returns (uint256) {
        return totalRewardsCollected - totalRewardsClaimed;
    }

    /// @notice When a given wallet's unclaimed reward becomes reclaimable (its clock + RESERVE_INTERVAL).
    /// Zero if the wallet has no started clock. There is no global cooldown, so once this time passes
    /// the reward can be reclaimed immediately.
    function reclaimableAt(address account) external view returns (uint256 accountExpiresAt) {
        uint64 clk = rewardClock[account];
        accountExpiresAt = clk == 0 ? 0 : uint256(clk) + RESERVE_INTERVAL;
    }

    /// @notice Whether a wallet's reward is reclaimable right now: its 24h clock has expired and it has
    /// a nonzero reward. Callers use this to build the batch list for reclaimMany. `amount` is what a
    /// reclaim would move (claimable()).
    function isReclaimable(address account) public view returns (bool reclaimable, uint256 amount) {
        if (account == reserve) return (false, 0); // the reserve's own pending is not itself reclaimable
        uint64 clk = rewardClock[account];
        if (clk == 0 || block.timestamp <= uint256(clk) + RESERVE_INTERVAL) return (false, 0);
        amount = claimable(account);
        reclaimable = amount > 0;
    }

    // ── Living Source views ───────────────────────────────────────────────────────────────────────
    /// @notice The whole program at once: the packed state, the 16 unpacked instructions, the global
    /// revision, progress toward the next release, and the current Source Hash.
    function currentSource()
        external
        view
        returns (uint32 state, uint8[16] memory instructions, uint256 rev, uint256 progress, bytes32 hash_)
    {
        state = sourceState;
        for (uint256 i = 0; i < SLOT_COUNT; i++) {
            instructions[i] = uint8((uint256(state) >> (i * BITS_PER_SLOT)) & SLOT_MASK);
        }
        return (state, instructions, revision, releaseProgress, sourceHash);
    }

    /// @notice The instruction currently in one slot (0–15). Reverts on an out-of-range slot.
    function instructionAt(uint8 slot) external view returns (uint8 op) {
        if (slot >= SLOT_COUNT) revert InvalidSlot();
        return uint8((uint256(sourceState) >> (uint256(slot) * BITS_PER_SLOT)) & SLOT_MASK);
    }

    /// @notice Progress toward the next release: changes so far, how many seal a release, and the id
    /// the next finalization will write.
    function releaseStatus()
        external
        view
        returns (uint256 progress, uint256 size, uint256 nextReleaseId, uint32 buys, uint32 sells)
    {
        return (releaseProgress, RELEASE_SIZE, releaseId, releaseBuys, releaseSells);
    }

    /// @notice How many releases have been finalized so far.
    function totalReleases() external view returns (uint256) {
        return releaseId;
    }

    /// @notice A finalized release by id. Reverts for an id that has not been sealed yet, so a caller
    /// can never mistake an empty slot for a real release.
    function releaseAt(uint256 id) external view returns (Release memory) {
        if (id >= releaseId) revert InvalidSlot();
        return releases[id];
    }

    /// @notice The minimum gross SRC a swap needs to move the program. Smaller swaps still pay fees.
    function sourceThreshold() external pure returns (uint256) {
        return MIN_SOURCE_SWAP;
    }

    // ── pool and fee views ────────────────────────────────────────────────────────────────────────
    /// @notice The bound pool: whether it has been bound, its id and its key.
    function poolInfo() external view returns (bool bound, PoolId id, PoolKey memory key) {
        return (poolBound, canonicalPool, poolKey);
    }

    /// @notice The fee schedule in basis points.
    function feeConstants() external pure returns (uint256 buyFeeBps, uint256 sellFeeBps) {
        return (BUY_FEE_BPS, SELL_FEE_BPS);
    }
}