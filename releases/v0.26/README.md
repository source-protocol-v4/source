# SOURCE v0.26

Finalized release 26 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.26 |
| Revision | 864 |
| Packed state | `0xe9e54662` |
| Source Hash | `0x7f989d6f70fff6ccf7bfac6721b749f2926ad103299c5c3f6463e30171af44e5` |
| Previous Source Hash | `0xfe0687b8ebfb42141a03c7d3b2a7095201cc10f80c43d03b05164c8c9d447402` |
| Buys | 15 |
| Sells | 17 |
| Changes | 32 |
| Finalized block | 25654956 |
| Finalization tx | `0xd78198098c4189a8ab10cb359733dffad0ebf291f7c7590cf7fdece170c7b78f` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | SWAP |
| 1 | EMPTY |
| 2 | SWAP |
| 3 | PUSH |
| 4 | SWAP |
| 5 | PUSH |
| 6 | EMPTY |
| 7 | PUSH |
| 8 | PUSH |
| 9 | PUSH |
| 10 | SWAP |
| 11 | LOOP |
| 12 | PUSH |
| 13 | SWAP |
| 14 | SWAP |
| 15 | LOOP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 833 | SELL | 9 | SWAP → PUSH | 25654922 | `0x003efcf59ca8c8b3f103dba3fe63b68b3d7c1087e33fea070ef1ebcbbe99a7b4` |
| 834 | SELL | 2 | PUSH → EMPTY | 25654922 | `0x12dfafb1e2b92e7aa8184b8fc724ea0a9d3a99d2dcccf2a0ee94b1065d66ee17` |
| 835 | SELL | 14 | LOOP → SWAP | 25654922 | `0xc1cdbd3a949e7f853cb240c57d1b94c2c073fab8a8ccec67232d45a8a29c9d5d` |
| 836 | BUY | 11 | SWAP → LOOP | 25654922 | `0x22be934e6bbc0c18c9c2691de3809f77c84267659bc3422908a5a7a593475cc6` |
| 837 | BUY | 13 | PUSH → SWAP | 25654922 | `0x89ffb601ba22a9555f0e38ac85d1210d3663a2d19ea8c8fd5188b8575d99fac6` |
| 838 | SELL | 15 | LOOP → SWAP | 25654923 | `0x79a5856476e8b1ec8ee13ae9b3ce982866a38ddd6d05eba6f7e4b0fac013c662` |
| 839 | BUY | 15 | SWAP → LOOP | 25654923 | `0x2ccaae0bfa0c5dc2e0b92886e8cd968e5c50b7b6783b5e934e5953de92b36674` |
| 840 | BUY | 8 | LOOP → EMPTY | 25654923 | `0x9f0cefd9269b07f9f4a62a4fcd8cf339464406c7457dfb2f68f3c1b1498051e5` |
| 841 | BUY | 2 | EMPTY → PUSH | 25654924 | `0x056f87c45440e136635eae61f6ecf920a8c24be6bfaf43770242a655f6cfc179` |
| 842 | BUY | 7 | EMPTY → PUSH | 25654924 | `0xd0e324f445ecf03ba0272dd79e2e250165f6e810df3d3eea3ae7bde4659b0969` |
| 843 | BUY | 4 | EMPTY → PUSH | 25654925 | `0x5f75aa303d37c1e9eed7a7b3f32655de0b700307c9fed5c04ca3f0bbb5e89348` |
| 844 | SELL | 6 | PUSH → EMPTY | 25654929 | `0xa68dd8c9b66cace9ad5ba5488424d5edb3cbcbb97c0bef7063b2ae16bf45c714` |
| 845 | BUY | 9 | PUSH → SWAP | 25654929 | `0xee76a3791d8ec26e4be624a7642f5345d0cdb16d2ee242d86144847a749c1992` |
| 846 | BUY | 13 | SWAP → LOOP | 25654931 | `0x2e3c703eb6e9bbc3062f4e8ddf39e39c9354baea948a48a0e14eb82b057ed063` |
| 847 | BUY | 14 | SWAP → LOOP | 25654934 | `0x51e1ad6b7383efc91112a12522d69fa869da750d910a4ab644c3b3034a70cd3b` |
| 848 | SELL | 12 | SWAP → PUSH | 25654936 | `0xd5f5014e738b3443252989cd3beaeea240892a14167167b31877a6f468171bb6` |
| 849 | BUY | 8 | EMPTY → PUSH | 25654938 | `0xe01abd31f8b47f6ac8ab3050ca929ea31d3942f989ada4625e90e87a94d03cc2` |
| 850 | BUY | 2 | PUSH → SWAP | 25654939 | `0x6b9dc8e7d4c0a06e375c57a329257ea70a88e1421fccc6331e4b084041f1e124` |
| 851 | SELL | 1 | PUSH → EMPTY | 25654939 | `0xc5baf5aad9604d828d4f449d64b304c07e9feb8f0c692033ecab6b4dbaa33324` |
| 852 | SELL | 0 | LOOP → SWAP | 25654941 | `0x83b84bd6301b39b127e4ca7ede03fc4fa295b343a27591f157b2587697c80eaa` |
| 853 | SELL | 8 | PUSH → EMPTY | 25654943 | `0xfbbdc7d63115a33a87a7fe26162ee370a90ed472ec1aefc2b23dd7ea94d82840` |
| 854 | SELL | 14 | LOOP → SWAP | 25654949 | `0x015dc3254df040a1589c69b8b53ba005ea72f790f306f7d702e16f71ca37fe3c` |
| 855 | BUY | 6 | EMPTY → PUSH | 25654952 | `0xc24ff6480a979d7c6f202a7e919678b0693d971e1a89e03cc0d6073272fcc161` |
| 856 | SELL | 9 | SWAP → PUSH | 25654953 | `0xc9e99b806299f50de581e8ecdf561b6cc08627694c3a6e5d260d0c07ca126c3d` |
| 857 | SELL | 15 | LOOP → SWAP | 25654953 | `0x7d2c6eeefce2b07bac3a8402eb1361d66a3dc66ad82833694bfb6a35d7b7225b` |
| 858 | SELL | 4 | PUSH → EMPTY | 25654953 | `0x2563d1b9c149de92e5c5ddebe18783b54176d9f7c25532adc246b698defedfbd` |
| 859 | BUY | 8 | EMPTY → PUSH | 25654954 | `0x05fb31c720dcb8d6d7c20f66ff27d9c1f2612c9dadf83d2a9addd7e43e6c3270` |
| 860 | SELL | 4 | EMPTY → LOOP | 25654954 | `0x4661f773a8ac1520dbb8e7f91f3cd4a9f9c73ffff413efea3f516e1ccecf57d6` |
| 861 | SELL | 6 | PUSH → EMPTY | 25654954 | `0x14b21dbee7ab008891d5649f6e2ffa9a0a6045fafe9a0145478c6295c6c72d46` |
| 862 | SELL | 13 | LOOP → SWAP | 25654956 | `0x4526f64085fc8cbd3abc2f890242f21404e09e1becf6f93065c26e6a5d1fffaf` |
| 863 | SELL | 4 | LOOP → SWAP | 25654956 | `0x7d5bacaddc46890ab8893d105368c6725b90a559f66f15d8452c69f8abfed4c5` |
| 864 | BUY | 15 | SWAP → LOOP | 25654956 | `0xd78198098c4189a8ab10cb359733dffad0ebf291f7c7590cf7fdece170c7b78f` |
