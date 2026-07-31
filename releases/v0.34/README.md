# SOURCE v0.34

Finalized release 34 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.34 |
| Revision | 1120 |
| Packed state | `0x17cf4e11` |
| Source Hash | `0x63dd6ca7ebd5950266173fdb21622f2afe2dca048ef7d556271686af3f9579d9` |
| Previous Source Hash | `0xe11a3072e73ea847577feca826b682f24e617b974c4283ce464a88b1da97e3c7` |
| Buys | 21 |
| Sells | 11 |
| Changes | 32 |
| Finalized block | 25655662 |
| Finalization tx | `0x08795702c0346ab5667972bc8e20bc98a9a4477238d3ba0fee8991c4b0d54c6b` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | EMPTY |
| 2 | PUSH |
| 3 | EMPTY |
| 4 | SWAP |
| 5 | LOOP |
| 6 | EMPTY |
| 7 | PUSH |
| 8 | LOOP |
| 9 | LOOP |
| 10 | EMPTY |
| 11 | LOOP |
| 12 | LOOP |
| 13 | PUSH |
| 14 | PUSH |
| 15 | EMPTY |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 1089 | BUY | 12 | SWAP → LOOP | 25655524 | `0x58099b87c5373f6f1fb1e2656c2d117258da51c5d3ab83eca0cc89e56716b737` |
| 1090 | BUY | 7 | PUSH → SWAP | 25655533 | `0xbac2414102e78ffdce07ebbda6b89de633261ee5bb0bae7ecdf6150cb0934cb4` |
| 1091 | BUY | 7 | SWAP → LOOP | 25655535 | `0x48560fa471e4e559b1b9b5cb2f016322ec99afc0b2a4dbbd221adf2554496b63` |
| 1092 | SELL | 10 | PUSH → EMPTY | 25655536 | `0xe85e9603815a0670e05e31ae2e7b2239fabd77bcabf91dd1678c1534a17a8c1f` |
| 1093 | BUY | 10 | EMPTY → PUSH | 25655537 | `0xd39b021edf68a9539f4dfba03f174d4af5dafdb4d4529558a0fa9f8302a39bfd` |
| 1094 | SELL | 7 | LOOP → SWAP | 25655539 | `0xb1e678d6eb355c520d4ed9051948b10d3bef9dfc22852da2e1e7e4abc956ddec` |
| 1095 | SELL | 14 | EMPTY → LOOP | 25655552 | `0x3a2210873c21f9d109260a5f8d19e6852651d97ff4e3220492eef57c4ad0be2b` |
| 1096 | BUY | 0 | LOOP → EMPTY | 25655565 | `0x6d03d3f61940d9d2f0db55efc647181def8551cd8c05fe293834434463bf4bb2` |
| 1097 | SELL | 7 | SWAP → PUSH | 25655565 | `0x009705809bd0fdd33ad6602d667a64f3802bcf8b33ae24c932e48bf833002ff6` |
| 1098 | BUY | 1 | LOOP → EMPTY | 25655566 | `0x0492c571e5f10e9cc7bcefe8a938b55e8271fee3288d3c7f0397aab8f1d047e7` |
| 1099 | BUY | 13 | LOOP → EMPTY | 25655582 | `0x89a1ebf7e40e9937eb6985342616c295457c549921cf79fbc4f5b553a00f895c` |
| 1100 | BUY | 6 | PUSH → SWAP | 25655584 | `0x8a0885b2792ede482eb2adf90db9c277ba2a23d9e831e6fdd3ffb6021bce592a` |
| 1101 | SELL | 13 | EMPTY → LOOP | 25655584 | `0x0ec22f76d41a44b20f14c73ad90e40f28f0a77ca07ff8b8e128486acfd348447` |
| 1102 | SELL | 8 | EMPTY → LOOP | 25655584 | `0x573038a358fcd76bcee4e1ecd54a92ef8d149ad522c7e107562e8e32c6b56bc2` |
| 1103 | SELL | 10 | PUSH → EMPTY | 25655585 | `0x98e8c9c19936271da8099abbd41b84820f37a72b10108c12584150ae3fb3b0eb` |
| 1104 | SELL | 14 | LOOP → SWAP | 25655587 | `0x30052334af354ee4701bbe625e386b15785155b93a46d8f978515e04b4736dd4` |
| 1105 | SELL | 6 | SWAP → PUSH | 25655593 | `0xdeda40dd28caf4aa1d06bbef6fc9c86fa364646c1f5cc929feae4c94f5db8aba` |
| 1106 | BUY | 9 | LOOP → EMPTY | 25655594 | `0x4f5e095ec3dd1adbfab3755d5fe5a6590b28c8c027d49d3dcb469df262f632b5` |
| 1107 | BUY | 5 | PUSH → SWAP | 25655594 | `0x0e10093547750bbe9556b696e50d865ba61e5f3934ee05f745bd9b87a3d6c02d` |
| 1108 | SELL | 14 | SWAP → PUSH | 25655594 | `0xebeaa98e9077ba502cf8887eddcdededed45c999d26355dfd26ac909540ac838` |
| 1109 | BUY | 0 | EMPTY → PUSH | 25655595 | `0xae6168dabe3dbfb11893c5b99c01c39c62e154d30cad466072584f9ecb529f2b` |
| 1110 | BUY | 0 | PUSH → SWAP | 25655597 | `0x3b53ae8fb9952779933c8445912ee7e34ae3cb0788fbbf1a73cb523b268f1348` |
| 1111 | BUY | 9 | EMPTY → PUSH | 25655600 | `0x9073004f275393730de18c2c2b288b1cf3ca050d4649e40fd553c577a438ed88` |
| 1112 | SELL | 6 | PUSH → EMPTY | 25655602 | `0x2976d1e71ca6eb2a7a569ea80741fa745e0bbf66bd301c8c491d1b6872b305ed` |
| 1113 | BUY | 0 | SWAP → LOOP | 25655603 | `0xba24a399d0847a92021b6cb1c0eb1d129fc6570415aad9d21b34da741755e15a` |
| 1114 | BUY | 13 | LOOP → EMPTY | 25655626 | `0xd4cf1490bae058e00c253fc20f612d4e496fd5c1dd53ee6dbb611d571b9c97cc` |
| 1115 | BUY | 13 | EMPTY → PUSH | 25655629 | `0x6a486b553b62e2bb56de02c4aa5396d30523d6bb3fc2e4de1d923fb0f5c626c8` |
| 1116 | BUY | 5 | SWAP → LOOP | 25655631 | `0x073158d13bc7ecb6d657bf264de8714908eeab6a01f60d42871649219e900d48` |
| 1117 | BUY | 9 | PUSH → SWAP | 25655631 | `0xee82ff84a2b78be3259e3f8b3471e5841f7b26cad1099666ec14ac288c22fbac` |
| 1118 | BUY | 0 | LOOP → EMPTY | 25655645 | `0xa8ab25962aeaf4e33b6fc84ca26fdfc3a9e40d7746d2d5ebd1c3b36a82cb2220` |
| 1119 | BUY | 0 | EMPTY → PUSH | 25655655 | `0x3e601811eaa37c2e7cc2c350d5e536086231100f06b8060a74f41e5a0385cd0e` |
| 1120 | BUY | 9 | SWAP → LOOP | 25655662 | `0x08795702c0346ab5667972bc8e20bc98a9a4477238d3ba0fee8991c4b0d54c6b` |
