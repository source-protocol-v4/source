# SOURCE v0.19

Finalized release 19 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.19 |
| Revision | 640 |
| Packed state | `0xa743db53` |
| Source Hash | `0xa44bbe659c56d6782b057b5e8cb555ff0eb3168ebacc9f87078680da5bfbf79b` |
| Previous Source Hash | `0xec873458668878910c65b1b913d28420dd14ec3156ca1aabe00130b21b871db1` |
| Buys | 18 |
| Sells | 14 |
| Changes | 32 |
| Finalized block | 25654815 |
| Finalization tx | `0xd83e4ddf34e260d6bde6e19391d90c2df67827191f07fa27cd89bfa6ee702adb` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | LOOP |
| 1 | EMPTY |
| 2 | PUSH |
| 3 | PUSH |
| 4 | LOOP |
| 5 | SWAP |
| 6 | PUSH |
| 7 | LOOP |
| 8 | LOOP |
| 9 | EMPTY |
| 10 | EMPTY |
| 11 | PUSH |
| 12 | LOOP |
| 13 | PUSH |
| 14 | SWAP |
| 15 | SWAP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 609 | BUY | 3 | SWAP → LOOP | 25654809 | `0x819e535833be6d693f8e8fba5ff3eb471bb883da1499c9c9b5353fd680367819` |
| 610 | BUY | 7 | EMPTY → PUSH | 25654809 | `0xdce59d6537ca30e8ca3aaa30783f49a79094285af94b50e07ebf79f65d04edee` |
| 611 | BUY | 10 | SWAP → LOOP | 25654809 | `0x57e0cf2e8d26d002e0dcb38db8418c3122d8ac05cbfe4b2914924120fc820ed2` |
| 612 | BUY | 13 | EMPTY → PUSH | 25654809 | `0x2f7837ecf9681d0bb4c21ef8b729745a339e488408ba5d47f922e5479d91ad1f` |
| 613 | BUY | 14 | SWAP → LOOP | 25654809 | `0x288a0d5ae144a264f4a620fed557b3cee8e3dc512a0feba617fdfe42f9de4b71` |
| 614 | SELL | 8 | LOOP → SWAP | 25654809 | `0x552652d9b53ee14dc3aec7587ac7a81f488f18c3c7644b3539e5ddc34089ef8d` |
| 615 | SELL | 2 | SWAP → PUSH | 25654809 | `0x5d083812b8e01193637dd13d94bcabd4b87208466187ce565b526503cfbcf5f0` |
| 616 | BUY | 12 | LOOP → EMPTY | 25654810 | `0x97b0d41fd17ed682e74c56861605a904f3a12e71b82c73f31c3043d4c567cb0a` |
| 617 | BUY | 10 | LOOP → EMPTY | 25654810 | `0x6bd5269bd005b852535021455b44e4e22acd63f96c2684ea33601642f01ceac5` |
| 618 | SELL | 11 | PUSH → EMPTY | 25654811 | `0x2d819e6ca98e04d93d62247ca01a9d030f383edb520c324d96019bb871d25777` |
| 619 | BUY | 3 | LOOP → EMPTY | 25654811 | `0xe2726ecbfba22f670c325c05352ec20bf117a108e52ba1b671ef2cf9ec43a5ca` |
| 620 | SELL | 3 | EMPTY → LOOP | 25654811 | `0x4191a535ff6a7c5b7a89ba451d73c11cf5849457a42191d0b0e266ca054d83f9` |
| 621 | BUY | 3 | LOOP → EMPTY | 25654811 | `0x6e745d63bbdca11823d411b655463c0c19c28187dee98a2b481e88c9015f287a` |
| 622 | SELL | 12 | EMPTY → LOOP | 25654811 | `0x57f5bdd041a7bdd0092e35cb91c26b43393d8d254222b3927ae5b02c9c5c2e31` |
| 623 | SELL | 14 | LOOP → SWAP | 25654811 | `0xd7999be29dbb75e4c33163103dd89b31655dd7983a0f17aa4bb7a53253c7db7e` |
| 624 | SELL | 7 | PUSH → EMPTY | 25654811 | `0x2da9ad10b77d5470f0de086bc34a44b3f7b1c2923e3073044af1b50d294f2984` |
| 625 | SELL | 14 | SWAP → PUSH | 25654811 | `0x507ebed57f7cf3852dd2354b99818e25729b4573143a80acd86b4e94962a34b0` |
| 626 | BUY | 14 | PUSH → SWAP | 25654812 | `0x9469fccec62cb7a7cb3fc6fa1381281dc74f81b0d2d58658aa782d10a45ea578` |
| 627 | BUY | 15 | SWAP → LOOP | 25654812 | `0x029bd89078bb5aa5cde2c7a47861714d6459c7e29cc4fa17e422d910b2ed075d` |
| 628 | BUY | 4 | SWAP → LOOP | 25654812 | `0xb128aaa57b8b8c03c9f4841f87dc13c116ce554d3bcc0c642736efdaa528a0e2` |
| 629 | SELL | 9 | SWAP → PUSH | 25654813 | `0xb9e80c33d6418e13ee3cc5d186fefff8fcb44c2556b88d81053b4f3ce2a100ab` |
| 630 | SELL | 0 | LOOP → SWAP | 25654813 | `0x9c166e1d89666fe8eb37310665be3522f7498fa3d4ebb3a4f93127ef79f11fe1` |
| 631 | BUY | 6 | EMPTY → PUSH | 25654814 | `0xa807673d8d20c41c09ea78714e9b48d5da7ec667a6bbc482aacfe753b5b1c97c` |
| 632 | BUY | 0 | SWAP → LOOP | 25654814 | `0x3d45d4b1f955684911235d0658fa023f7bca1a724cf6cf0f160309f600e9d815` |
| 633 | BUY | 11 | EMPTY → PUSH | 25654814 | `0x00d49485e5a49c19d4b97cf56c0e9ebee1870f3db2b9dca14e1105eae435da84` |
| 634 | SELL | 7 | EMPTY → LOOP | 25654814 | `0x898cb1f63377dd973cbcf9b60ac36c90f2d18d5bc9da1df79b31cb1c6a4cc914` |
| 635 | SELL | 9 | PUSH → EMPTY | 25654814 | `0xaf8b7a51da90d7cf8452341b05b7a35ebbe87eb10f2c56a2d2568c520f09023e` |
| 636 | SELL | 10 | EMPTY → LOOP | 25654814 | `0xd62f12d5e0bfc0763c334f57849d9f4021621049e59a69165e9867d03887bae3` |
| 637 | BUY | 8 | SWAP → LOOP | 25654815 | `0xe2af883900aa964938dc796270a7cc5b7184cb7ec71dd49d4606f094ba1c81ac` |
| 638 | BUY | 10 | LOOP → EMPTY | 25654815 | `0xff0b26acda3917b187eec7911b8c08d9b8446a3a413497fc6a22438fac9eb501` |
| 639 | BUY | 3 | EMPTY → PUSH | 25654815 | `0x0ecb77349d8dbd9a5ad5b0483313967debd8088a214ec9a831fb23fad1b170fd` |
| 640 | SELL | 15 | LOOP → SWAP | 25654815 | `0xd83e4ddf34e260d6bde6e19391d90c2df67827191f07fa27cd89bfa6ee702adb` |
