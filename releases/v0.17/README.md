# SOURCE v0.17

Finalized release 17 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.17 |
| Revision | 576 |
| Packed state | `0xcef6adbd` |
| Source Hash | `0x52c3153298308b383aefd04beb58a315a44b11a126c0457fc942b5efbe8838a1` |
| Previous Source Hash | `0xcb28a5ba763d7eae0c23bfb1036fe1340caad5ca8373f8765628b07de61fcc92` |
| Buys | 19 |
| Sells | 13 |
| Changes | 32 |
| Finalized block | 25654802 |
| Finalization tx | `0x6b507c9a26d2440c7ffab466076a103d2a9b7c10810621bfcb3dedd321301a67` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | LOOP |
| 2 | LOOP |
| 3 | SWAP |
| 4 | PUSH |
| 5 | LOOP |
| 6 | SWAP |
| 7 | SWAP |
| 8 | SWAP |
| 9 | PUSH |
| 10 | LOOP |
| 11 | LOOP |
| 12 | SWAP |
| 13 | LOOP |
| 14 | EMPTY |
| 15 | LOOP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 545 | BUY | 11 | SWAP → LOOP | 25654793 | `0xe905fd8e25431e73cf20f9198f74dfd1b95d6835e4c7d1f7aebe3c41ead00cf6` |
| 546 | BUY | 13 | EMPTY → PUSH | 25654793 | `0xf03490614ecf33221a5bd03fa7be82e73d586dc7e3b602af5b74d2d8cabc9f53` |
| 547 | SELL | 8 | LOOP → SWAP | 25654793 | `0xb3fc690b91170ee40c4894d56b3ff8c43c39d289a4827d1d5c6bbaaf324ce5e5` |
| 548 | SELL | 8 | SWAP → PUSH | 25654794 | `0x51a23e0a07b789a1c4024b86a196410239fb5ed9861a71371646e8547132d579` |
| 549 | SELL | 3 | EMPTY → LOOP | 25654794 | `0x754c7bd0a1592a7482682b365d602b3d5d3e31ee75d2a3e1c667062c4794d60d` |
| 550 | SELL | 3 | LOOP → SWAP | 25654794 | `0x6ec0f9e58066787250eb4815ee90c0306f8adee758498b82d6ab6d28ab4dd8fb` |
| 551 | BUY | 7 | EMPTY → PUSH | 25654795 | `0xc09547f02ca7b1693b55ab55bf5a89c9fad1c41b09c15077ada8fdd86fcf71d0` |
| 552 | BUY | 6 | EMPTY → PUSH | 25654797 | `0xd93f1d67ef063c045d015a9536fceff88abc80667c026c18f1245e8c80adb096` |
| 553 | BUY | 5 | LOOP → EMPTY | 25654797 | `0xa0ca94129d9a997f24545145e5fd7b314ed561f6a6ea9cb9d3b0bf94b67f7f26` |
| 554 | BUY | 6 | PUSH → SWAP | 25654797 | `0x5f57c8833d6badae938029c99d3ce1b0a6060db2dfd7a2eb685f83e832360887` |
| 555 | BUY | 3 | SWAP → LOOP | 25654797 | `0x8d2bd623718ad3876a73ac40c9dc2d77c36c717bc7f53c5cfd22df8c3d8ecc64` |
| 556 | BUY | 3 | LOOP → EMPTY | 25654797 | `0x7650f9ca8ab1893ba4f3f8a78927198ebbe96304fbfcab7dcc47c3630167fd35` |
| 557 | SELL | 10 | EMPTY → LOOP | 25654797 | `0x87039e458c01fbde9fd3ee826c5545babf94d52952c48286495978c1d66f55a6` |
| 558 | BUY | 9 | PUSH → SWAP | 25654798 | `0x5f100dc4cccf9736ac8801b432ca998962208f906ee1ecd4f28cf1464f846390` |
| 559 | BUY | 3 | EMPTY → PUSH | 25654798 | `0x9648b6b324d204279c59c3d25e96713e0daa169f3a1023e705313539e9eb29ed` |
| 560 | BUY | 8 | PUSH → SWAP | 25654798 | `0x424c93b886a2fd5e0225a43a5f8b536c1214963de63530eb74397aaca6f0fe84` |
| 561 | BUY | 3 | PUSH → SWAP | 25654798 | `0x49096680dde0507020d05f02652def29791f208335fb5dc24efee6a857be383a` |
| 562 | BUY | 15 | PUSH → SWAP | 25654798 | `0xca394db6019c337f595f78576ed8b984db0e6c053a478856381ba3bb1ac366f4` |
| 563 | SELL | 0 | PUSH → EMPTY | 25654798 | `0xe3e126079c08b45c7f7169c8905b2bfc4941c56603352b3c48bd4f7e894b1a15` |
| 564 | SELL | 9 | SWAP → PUSH | 25654799 | `0x74546ef4c6fe2dae7d3ace8f86e42786af178c537f31f36213bc25fe3b861325` |
| 565 | BUY | 11 | LOOP → EMPTY | 25654799 | `0xb5ec0539aaf2c1c4b82d78acd09ff7edc51e025f404b040c2d9d55d3856e3635` |
| 566 | BUY | 7 | PUSH → SWAP | 25654799 | `0x2df64b797112fc058425e1d2e63e164ac8ebcbdd2a3fa5fbd59063e2a39f5f59` |
| 567 | SELL | 10 | LOOP → SWAP | 25654799 | `0xeeb6f2c146f2ec28ca4da4a93c082b50de85b0727e9f5b531d5316fb9e6fa496` |
| 568 | SELL | 5 | EMPTY → LOOP | 25654799 | `0xb41c869d2a62774f87c202467a9f622e74be2cd8faa6fb80d1d756714f114bae` |
| 569 | SELL | 11 | EMPTY → LOOP | 25654799 | `0xac655c2c1db1105e3366d0a2279138cbfe1f565e3bbbbd189f4ed78a645e6a2e` |
| 570 | BUY | 0 | EMPTY → PUSH | 25654800 | `0xefb50ac3e59f0b2bc0f196b8139f6ba6d51f1dfa8e8e423411468f4d7b1749c1` |
| 571 | BUY | 1 | SWAP → LOOP | 25654800 | `0x1709b1095b3aa36f6815c28075adcb4ec3a49d75914c7c76a03e995b1cf581f6` |
| 572 | SELL | 13 | PUSH → EMPTY | 25654800 | `0x11812b69196217fc3fea65b68a39d38eedb7a3fb8c23d0f1a574b556040c1e75` |
| 573 | BUY | 15 | SWAP → LOOP | 25654801 | `0x6e50e8802aa9bedc30d2411368a9827635a8552f67aa781e800e48ce94eeb247` |
| 574 | SELL | 4 | SWAP → PUSH | 25654801 | `0x50ea6edb5d12749d1c7aef94fc2485d5b5cb5da7a87880a294009e7e21389f23` |
| 575 | SELL | 13 | EMPTY → LOOP | 25654801 | `0xdb4d9a57e359879fc34a0363d5133b3c1897fd9caff8dad831c559f58c7ebf7b` |
| 576 | BUY | 10 | SWAP → LOOP | 25654802 | `0x6b507c9a26d2440c7ffab466076a103d2a9b7c10810621bfcb3dedd321301a67` |
