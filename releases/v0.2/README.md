# SOURCE v0.2

Finalized release 2 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.2 |
| Revision | 96 |
| Packed state | `0x9f3d7e73` |
| Source Hash | `0x73752dcb1fa3aa22eb8748686964ba679e42b978328276a939edbf797d1c07c5` |
| Previous Source Hash | `0x2b5d0ec6817bf39e04a59447ad36f8669facb93d181cea5ae31a4013ca11e56a` |
| Buys | 24 |
| Sells | 8 |
| Changes | 32 |
| Finalized block | 25654625 |
| Finalization tx | `0x3408476e324a2720c3ced63112c1598694e0a8960eb13bf6b4da5945f1a29f84` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | LOOP |
| 1 | EMPTY |
| 2 | LOOP |
| 3 | PUSH |
| 4 | SWAP |
| 5 | LOOP |
| 6 | LOOP |
| 7 | PUSH |
| 8 | PUSH |
| 9 | LOOP |
| 10 | LOOP |
| 11 | EMPTY |
| 12 | LOOP |
| 13 | LOOP |
| 14 | PUSH |
| 15 | SWAP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 65 | BUY | 3 | EMPTY → PUSH | 25654611 | `0x3833aeba422f0f9e6f2b9fc5a9febdc7e616d2d95ac84c707ee2221bf869692a` |
| 66 | BUY | 12 | SWAP → LOOP | 25654613 | `0xc22fc7a5e0e0b3a70f87d5e8d22df103efd78bcf871a4e5d9241deb47bdfdfc9` |
| 67 | SELL | 15 | SWAP → PUSH | 25654613 | `0x170ba1796e7bee47063d285563f2613e93f17f1ddf9763be7e771f6bed2ec3d3` |
| 68 | BUY | 15 | PUSH → SWAP | 25654613 | `0xa5a9fa5f8719e499dec4d5e53d85db0ca1c1a377db6e5c07a15ff62b845be648` |
| 69 | SELL | 6 | SWAP → PUSH | 25654613 | `0xca2f0c4a59fda9a443afe893b3022c222a31084b978401138caa6ff6cc20b0c0` |
| 70 | BUY | 8 | SWAP → LOOP | 25654614 | `0x1aaf6ca82c0c0ad7bac749b6ff248e4db8b987d9625d0fb0a623bb4bcc903877` |
| 71 | BUY | 0 | PUSH → SWAP | 25654616 | `0x082ded52308f6865d04da655d0a8df09edd1ec58f81b57f92081c7a60a3a751e` |
| 72 | BUY | 11 | LOOP → EMPTY | 25654616 | `0xe1bac4c6fbcf9fa68992c433777dab0de742a37caaf19fd572a3cb5bed2ad80e` |
| 73 | SELL | 2 | PUSH → EMPTY | 25654617 | `0x10977cc2a34ef87d0e1646cd7e1803ff12a3566ff322ac2568173b7b619919f4` |
| 74 | BUY | 1 | LOOP → EMPTY | 25654619 | `0xd2d47602e8a420e77505f73573fc41a63c6ea251b8b0e72038eda725ae9f93b4` |
| 75 | BUY | 6 | PUSH → SWAP | 25654619 | `0xead9d23e18fec5b96b6a6f8148edfd76af23fd0e70667a2a8a1baa95820c918c` |
| 76 | BUY | 8 | LOOP → EMPTY | 25654619 | `0xd9c951ea6e651fe4f2e2f5e85648ef06790e2f3ab3041a5bef60f68d53a5ae49` |
| 77 | BUY | 0 | SWAP → LOOP | 25654619 | `0x42946782fbeec181a5924d62ad5883d27b5c5b52de01b30510c6e50f98c8ccaa` |
| 78 | SELL | 8 | EMPTY → LOOP | 25654620 | `0x37643bd9155ea3e7b953a4a3bf847c55939bfddfa76421b9f4296eed7c518cad` |
| 79 | SELL | 8 | LOOP → SWAP | 25654620 | `0xcb681da9d7ffd0f114d8807e469eae10c32e399c09b781736c1a9047442054db` |
| 80 | BUY | 4 | PUSH → SWAP | 25654620 | `0xbeaeea60e05b8f6556151ad312f66ccdab31178d571f8592c3e90645c0d07977` |
| 81 | BUY | 2 | EMPTY → PUSH | 25654621 | `0x4dc2e2046616a3fe480e99dad4c4ba2c29254b10e6f034bbbbdd121a39f84ecd` |
| 82 | BUY | 10 | EMPTY → PUSH | 25654621 | `0xf5d76af9db935ad6d96e7744239d52917afe9f9fd9d45905edc7098341481d0c` |
| 83 | BUY | 7 | EMPTY → PUSH | 25654621 | `0x5e0073b3e35e62253949d84a6866c0c909cd209968b794970a4c5b21dce497b4` |
| 84 | SELL | 15 | SWAP → PUSH | 25654621 | `0x7692131b19285088e190c2c0d8233e7b0c86316b122be990d0bb7eb664efd459` |
| 85 | BUY | 10 | PUSH → SWAP | 25654624 | `0xdd834d9f7fff8fe20e60b9f1d50402b6031b3c7e46ef56b9896e85facc4f1769` |
| 86 | BUY | 2 | PUSH → SWAP | 25654624 | `0xcb0c2609ca8c8befcff8a59712965b982395d3e981968c34fab07ddf52ef1a49` |
| 87 | SELL | 8 | SWAP → PUSH | 25654624 | `0x56b96ecd017f361f960ba4dfdc5281922a589a3f57ed0c29636633536678aa67` |
| 88 | BUY | 9 | EMPTY → PUSH | 25654624 | `0x3db945388e45c4443496769c40ccbaa6ea2fd9a84bcd9c6f22ff4f90100b3536` |
| 89 | BUY | 9 | PUSH → SWAP | 25654624 | `0xb74b462eebfd3b89cc3e22a772884629cf61411cdf1dad1139db7f7910913ee2` |
| 90 | BUY | 14 | EMPTY → PUSH | 25654624 | `0x0b036895120f24cfca373898f08d697af2bc6bc349f61bd5d1f3d32a06f722a8` |
| 91 | SELL | 5 | EMPTY → LOOP | 25654624 | `0xf6694068275c9a5e47226f2a4ebd81073a5d03ddc7f44b0618df135002e906ee` |
| 92 | BUY | 10 | SWAP → LOOP | 25654624 | `0x5e78d9ecf37ad26cf1e9c1b23a8b6c6f1f66b50723515067ee8f345d1452e22d` |
| 93 | BUY | 9 | SWAP → LOOP | 25654624 | `0xdd846fc1f1de9ac45e9669275e2708c2bb2b8af0d47465d8144232f7fa073049` |
| 94 | BUY | 6 | SWAP → LOOP | 25654624 | `0x65e41f573bbeb33c42babab9c600d7d90ca3668d9d954db67139ede7108321f1` |
| 95 | BUY | 15 | PUSH → SWAP | 25654625 | `0x1cd86fef63e378c199d4581257b54d32663bc7b473304b30755517b565acd5d4` |
| 96 | BUY | 2 | SWAP → LOOP | 25654625 | `0x3408476e324a2720c3ced63112c1598694e0a8960eb13bf6b4da5945f1a29f84` |
