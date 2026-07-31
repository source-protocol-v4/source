# SOURCE v0.8

Finalized release 8 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.8 |
| Revision | 288 |
| Packed state | `0xdfb635ae` |
| Source Hash | `0x9a433446b6f71aeaeb08ea5591dfc6a53b625b47860ccbfadd8d53af6c643e1c` |
| Previous Source Hash | `0x7f88acf05d5e3fbf23812a29d15503a36e9c494ecdb5d32355811e32712b1d0d` |
| Buys | 21 |
| Sells | 11 |
| Changes | 32 |
| Finalized block | 25654672 |
| Finalization tx | `0x57f1bc13141e43e4c94c0dfd74bfbf0f8d46eff247777ee74eae9123285bc61c` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | SWAP |
| 1 | LOOP |
| 2 | SWAP |
| 3 | SWAP |
| 4 | PUSH |
| 5 | PUSH |
| 6 | LOOP |
| 7 | EMPTY |
| 8 | SWAP |
| 9 | PUSH |
| 10 | LOOP |
| 11 | SWAP |
| 12 | LOOP |
| 13 | LOOP |
| 14 | PUSH |
| 15 | LOOP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 257 | BUY | 9 | EMPTY → PUSH | 25654660 | `0x0cb7aa3168b48f0b4e7804ceb65062d6c5a9a2e22ab38b863b6174139faad744` |
| 258 | BUY | 14 | EMPTY → PUSH | 25654660 | `0xde76bafed501fce9bc76dc8f5395e227fbac3376a1b38aca8effecc8853fa180` |
| 259 | BUY | 8 | LOOP → EMPTY | 25654660 | `0x499a69a4872df0f9180a9bf24fc42d9e418e86288d6639f19dee3b7111bc615b` |
| 260 | BUY | 14 | PUSH → SWAP | 25654660 | `0xdca3ed1a4b6ad51e3cc56bc9615a153225899c341d757cffbf9a46c8ca9c9f55` |
| 261 | SELL | 15 | EMPTY → LOOP | 25654661 | `0x24644949e34d092f2d230cc97c05001ccaa04417120990cf1b8e22112234f7e4` |
| 262 | SELL | 9 | PUSH → EMPTY | 25654662 | `0xc9bbebcaeb68c6ae8c6f2a514be777d1b838df1322d441640d1c2b88e65963b5` |
| 263 | BUY | 5 | PUSH → SWAP | 25654662 | `0xf147c1443fc93b48cef49c05094a8e6a44c4e075f5ebcab55581719309aab5f0` |
| 264 | SELL | 7 | PUSH → EMPTY | 25654663 | `0xc46d1b68319d76de21b4412322d91f5a2445d1f44c7799d32ae114e187390364` |
| 265 | BUY | 5 | SWAP → LOOP | 25654663 | `0x56080e7527b6d7f7beb52204c50eb081288f278b51bea3e1bb62ebdbea04cb37` |
| 266 | SELL | 3 | PUSH → EMPTY | 25654663 | `0xc08fb060c1493b1ccff38fbb81899312e24d20aba8437fea3b11e0048e1c8d68` |
| 267 | SELL | 14 | SWAP → PUSH | 25654663 | `0xb27d17cfae706ea898598b0da8242621e2699f2f2ea7a21d5f156488ca5fef27` |
| 268 | SELL | 15 | LOOP → SWAP | 25654664 | `0x47d8eb6205cee0482e6a740699c14f1731f5045477c4e23e00391ca4e8773445` |
| 269 | SELL | 10 | EMPTY → LOOP | 25654664 | `0xe0e199bc2a2aa0198012ced8f39e7b2956df5433674e546d992b4d530196e8eb` |
| 270 | SELL | 11 | EMPTY → LOOP | 25654664 | `0xe94957d4b53f887f9b3aba25c6692ddb164f3ad68a5e2ca7fd79067ce40f7442` |
| 271 | BUY | 6 | SWAP → LOOP | 25654665 | `0xb6bfc12b97882c8f5b10b60847d1cc364fa76301c4d6f374e01aeb9c35a8fc92` |
| 272 | BUY | 5 | LOOP → EMPTY | 25654666 | `0x1ba11976759fb054444adba8138540870cef231bd70138b43a98e72c15eacbdc` |
| 273 | BUY | 11 | LOOP → EMPTY | 25654666 | `0x7b6fed7c6e18452ae37874cd2b12b0f58539e151c8ce84c4b90283db9a9e2edd` |
| 274 | SELL | 3 | EMPTY → LOOP | 25654666 | `0x83f4b0d8fc54391ddd6f1ddd9b539f844213a9e9341f79c5aec2f485d9d45321` |
| 275 | SELL | 3 | LOOP → SWAP | 25654666 | `0x96294206eaf8e1b46df28f5a10da6495e53bac5f44a24c14b5a2bfdcb257b349` |
| 276 | BUY | 15 | SWAP → LOOP | 25654666 | `0x8e7a34d44b2bcdb68885b1e2086ff785b8fd6aed4fb620ddd0c8dbed21157b04` |
| 277 | BUY | 4 | SWAP → LOOP | 25654668 | `0x3cbde0ec7fd56a870cb29c2910f380d1daedfefd824b6628be9e252b7b81b8df` |
| 278 | BUY | 4 | LOOP → EMPTY | 25654668 | `0xfbf826a291ca08c5dc9458e57271365830025a60bf2751450420b740e3633862` |
| 279 | BUY | 9 | EMPTY → PUSH | 25654668 | `0x4226b7cadb67b26169e22121ad10cd8becebd612a4ef49303d390127e5d6a994` |
| 280 | BUY | 5 | EMPTY → PUSH | 25654669 | `0xf32af44e2157439ff25c1178ece181cc9cb64ed31961c067fec492d6e54b55da` |
| 281 | BUY | 11 | EMPTY → PUSH | 25654669 | `0xc30839c53f3049e0e4cef743a9c5f073770dced9cddfb7f53e1ef5a951023f6f` |
| 282 | BUY | 4 | EMPTY → PUSH | 25654670 | `0x2f79d0c7515d668a7c4fd40991ad10ad643d08db958d3c9b9df03c720c1dc93d` |
| 283 | SELL | 6 | LOOP → SWAP | 25654670 | `0x5bff9d8a3b353dc4555f7e42c5253f1b6f0f63a5074c80031a4ee0f90d212d64` |
| 284 | BUY | 8 | EMPTY → PUSH | 25654671 | `0x98668bccbcaed1b8d8cf00c3a7dcfe97519689f63d07e419a11ae604063ca34d` |
| 285 | BUY | 6 | SWAP → LOOP | 25654671 | `0x33320bb183f29997b763d8773858b9d10cc302410ff0508920974ee706f6a2c9` |
| 286 | BUY | 12 | SWAP → LOOP | 25654671 | `0x3c6d642db5d07db541134d998dd962be8c95a1a9833daaa3c9d520ee820e8244` |
| 287 | BUY | 8 | PUSH → SWAP | 25654672 | `0xb6f71750e2ced4e1960a8949314782a561f213e81f1c9ad73c5ae10f84e1210e` |
| 288 | BUY | 11 | PUSH → SWAP | 25654672 | `0x57f1bc13141e43e4c94c0dfd74bfbf0f8d46eff247777ee74eae9123285bc61c` |
