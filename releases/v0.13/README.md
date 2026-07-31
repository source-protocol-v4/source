# SOURCE v0.13

Finalized release 13 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.13 |
| Revision | 448 |
| Packed state | `0xe2e5d101` |
| Source Hash | `0x86055058de0e035a7e2a7e3ca9d6dbb6c74bceacd49c2889dc9bc9e1a8c37982` |
| Previous Source Hash | `0xab3373382d0891e8cb9c92f3322aeb5709cc578039a62986201ffd92bb339728` |
| Buys | 21 |
| Sells | 11 |
| Changes | 32 |
| Finalized block | 25654756 |
| Finalization tx | `0xfd404652a1b3059a2f94aba9f43d8d31c3adf81536f86988b7183fa786888f87` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | EMPTY |
| 2 | EMPTY |
| 3 | EMPTY |
| 4 | PUSH |
| 5 | EMPTY |
| 6 | PUSH |
| 7 | LOOP |
| 8 | PUSH |
| 9 | PUSH |
| 10 | SWAP |
| 11 | LOOP |
| 12 | SWAP |
| 13 | EMPTY |
| 14 | SWAP |
| 15 | LOOP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 417 | BUY | 7 | PUSH → SWAP | 25654736 | `0x0c1c30aa1d89805072b0960a3d2cf5f08ec1cbd3ed8764b15fde96ab061a3cdc` |
| 418 | SELL | 13 | SWAP → PUSH | 25654738 | `0x621fd063b52ff3fe1f2517aff18c412ff1bef3550ec61515ea53fedd9974e727` |
| 419 | SELL | 15 | LOOP → SWAP | 25654738 | `0xf075cddae2fc820e7efcc4191d151c1dcc6af95c49299068334aec93b7b20ae6` |
| 420 | SELL | 11 | EMPTY → LOOP | 25654739 | `0xc3ee4a78df4adfab8bca11c2d77b59d49a7233a32f31846557a0dad8fc34f857` |
| 421 | SELL | 12 | SWAP → PUSH | 25654740 | `0x8f52f13af94cd58e20cd3e681141c78574e77c2000bca4de51cf6956e7ecdf09` |
| 422 | BUY | 10 | LOOP → EMPTY | 25654740 | `0x3632dc6c18f2334d451281f350b73d41ce13e5d012d0811d2e3962366b5df989` |
| 423 | SELL | 10 | EMPTY → LOOP | 25654743 | `0xb5d7f1c80e9f026da9282b2509e58ac59a76caa12ab81c68c40b5e0f74dc57ae` |
| 424 | SELL | 13 | PUSH → EMPTY | 25654744 | `0x454a3c23261f00119bdc5bf99438cbf19c409cf271304eb533d716e26e4a3042` |
| 425 | SELL | 8 | LOOP → SWAP | 25654746 | `0x563a4b0d80750f326d7a99a15755792dc0502f433592efea5207fc68d1ae176d` |
| 426 | BUY | 9 | SWAP → LOOP | 25654748 | `0x2325e11ea7f1ad777cbd54c42e92ef7e9834af1ef0b01f2d50e5d7b8e1f3a2ab` |
| 427 | SELL | 10 | LOOP → SWAP | 25654749 | `0xa2700d947700aa4890ccb64f13dd2c2e80c8f84880f9e612577fc51bf88784ff` |
| 428 | BUY | 8 | SWAP → LOOP | 25654750 | `0xb37d0bedcf4faf2962228e29cb67732140c054fbae986136f3285bead786092c` |
| 429 | SELL | 10 | SWAP → PUSH | 25654751 | `0x54062e07174554746183cc572d2b37101a2e214b62c7456211bc3152f37ace5d` |
| 430 | BUY | 5 | SWAP → LOOP | 25654753 | `0x229527fc97b3f886ccfc4fe6f677cfd37b76e28375f5ac06ff4bd962c1fb6f54` |
| 431 | BUY | 8 | LOOP → EMPTY | 25654753 | `0xb4b1e3269331c0fb5c8e9c13fa478d372e3dc8fa8e1bb3281a24b36e8080db71` |
| 432 | BUY | 10 | PUSH → SWAP | 25654754 | `0x41dfe1227b5395ad4945646cb0b3fb8fd5e3f4b9d9f7c4d0f16fe751fbdcd680` |
| 433 | BUY | 12 | PUSH → SWAP | 25654755 | `0xc284e551225a26613d5af384892a5ac93315301a7735fcd3e5b1747deff762b0` |
| 434 | BUY | 0 | PUSH → SWAP | 25654755 | `0x3d86162826e4c9eea63c3dc07cae78565ae3c5201445a1f11bd480b3f6b26091` |
| 435 | BUY | 6 | SWAP → LOOP | 25654755 | `0xed1a052c719b2a26ad3909515b51cfc348fe3e48af6c32ced1053269a068eca8` |
| 436 | BUY | 6 | LOOP → EMPTY | 25654755 | `0x0cda4d84b740ee3959493b8ec7e2db0f9f67ee344b29a95c523fbb5d05622e59` |
| 437 | BUY | 9 | LOOP → EMPTY | 25654755 | `0xfb303e08b201fb4cdee15cd58d92e75097c5e0cb9e20aa1c13cac1eaa899ccc7` |
| 438 | BUY | 6 | EMPTY → PUSH | 25654755 | `0x9a6cf793859c1ee4a9db20a4cd8752f9705fd4fb53a9c2f23cf6f52fb890a3c9` |
| 439 | BUY | 7 | SWAP → LOOP | 25654755 | `0x1ca60b1f9da6c2509462fa1604dded3c45207d930de3064fe47de2f69c05b096` |
| 440 | BUY | 9 | EMPTY → PUSH | 25654755 | `0xede936ec67b48675791c5e80f162b557b4a2965c0257f09239cecb41f5f62c69` |
| 441 | SELL | 0 | SWAP → PUSH | 25654756 | `0x2cbc38e427dc0a09012a67fe4a143a7ea6148f56e6654f28c34d5e4cf9dd9b38` |
| 442 | SELL | 10 | SWAP → PUSH | 25654756 | `0x9d4f945f67b3d8253a7ce5977c78a23963c622e49f0516094dd963aac26f82a1` |
| 443 | BUY | 10 | PUSH → SWAP | 25654756 | `0x828a3baa18d15894b6e84c0eb9b4218369a695908a32f0ecd23e810a4594b9ed` |
| 444 | BUY | 15 | SWAP → LOOP | 25654756 | `0x50764958ae871c2e65aedff10951b55e6ab6896c71d37c6c688200564c1f75e5` |
| 445 | BUY | 3 | LOOP → EMPTY | 25654756 | `0xc9f56efd3f573ea711319d3e54e0ad90cb9f6767a9e9697451f7319067834770` |
| 446 | BUY | 5 | LOOP → EMPTY | 25654756 | `0x9d9cd0933c8c69be9ae5b19177fc779d83661f972d3a05d3823f088c3e43c1d4` |
| 447 | BUY | 8 | EMPTY → PUSH | 25654756 | `0xc0f87501c4a8f954a38f2f332b98c4134d80af0cdf776cd206722f648e6b3ec4` |
| 448 | BUY | 2 | LOOP → EMPTY | 25654756 | `0xfd404652a1b3059a2f94aba9f43d8d31c3adf81536f86988b7183fa786888f87` |
