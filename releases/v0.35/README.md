# SOURCE v0.35

Finalized release 35 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.35 |
| Revision | 1152 |
| Packed state | `0x5b0a2251` |
| Source Hash | `0xa3911318b8ab937aa0d82bcb96ba80638e758e2d87d6ec2e4f6049baa7ff61dc` |
| Previous Source Hash | `0x63dd6ca7ebd5950266173fdb21622f2afe2dca048ef7d556271686af3f9579d9` |
| Buys | 14 |
| Sells | 18 |
| Changes | 32 |
| Finalized block | 25655832 |
| Finalization tx | `0x06889e810ecad549062659acf78b53baedc9e874f76d7a82162454d683fb35bb` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | EMPTY |
| 2 | PUSH |
| 3 | PUSH |
| 4 | SWAP |
| 5 | EMPTY |
| 6 | SWAP |
| 7 | EMPTY |
| 8 | SWAP |
| 9 | SWAP |
| 10 | EMPTY |
| 11 | EMPTY |
| 12 | LOOP |
| 13 | SWAP |
| 14 | PUSH |
| 15 | PUSH |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 1121 | BUY | 11 | LOOP → EMPTY | 25655669 | `0x3be14de9dcbc74a738175cca5c8e7e1ad09db992e429115a4231c5868b165ba5` |
| 1122 | BUY | 0 | PUSH → SWAP | 25655673 | `0x3c6f7e4ea9741c4306e4ac22b5227694c99f1ed0152f09358d196c3b48b3685f` |
| 1123 | BUY | 6 | EMPTY → PUSH | 25655673 | `0x06b0c0948ea7871b423ac7308507eb61166b7c6c05adf7f73a88e5b7eff3d2b1` |
| 1124 | BUY | 6 | PUSH → SWAP | 25655685 | `0xe5244e38ec3d01b936624d7cc32a402586a6fad1db990da21e10023d31b3e5c6` |
| 1125 | SELL | 4 | SWAP → PUSH | 25655697 | `0xfd6b3b813508c423c8f265f3de85e180fe730cba143332d0d6b18851871c8deb` |
| 1126 | SELL | 1 | EMPTY → LOOP | 25655699 | `0x1e3d18b28ccb3abc5094df4c5eff8ce258e2d75451e2a7bb8e11ad1d6a90d410` |
| 1127 | SELL | 8 | LOOP → SWAP | 25655701 | `0xb1b20bc8412d34fc8c92aa5aa4fc9ba6be6552637a3cbb75349b00728975257f` |
| 1128 | SELL | 11 | EMPTY → LOOP | 25655703 | `0x4ab02a771f72c6ee3d59bc27c0d2982f6c4f8ba017a07e1b5215ad3a25a024d4` |
| 1129 | BUY | 4 | PUSH → SWAP | 25655707 | `0xec126dd3634012adeba3b3fedab91c0ab08a0952c2910b3a51fb4bf428a8c1c9` |
| 1130 | SELL | 15 | EMPTY → LOOP | 25655712 | `0x2fc5e0a1896eb244cc94d2bb5b70e399fa99d80b69c6b1efea2143f65fd826c1` |
| 1131 | SELL | 1 | LOOP → SWAP | 25655725 | `0x6404182d2cf5b92cb816a4063975eeceb975b8bc342d1ba4fc631a1f013166ea` |
| 1132 | SELL | 3 | EMPTY → LOOP | 25655726 | `0x5b7dc91f41b401980d45565bb3a9777686d97998cfd957f4b5fba59be878e893` |
| 1133 | BUY | 11 | LOOP → EMPTY | 25655730 | `0x9eafed90fc84fcc94cfd092324b2647b4dbce0ad2c8ff060cad789a1875c53f0` |
| 1134 | BUY | 8 | SWAP → LOOP | 25655732 | `0xeff77503fab58a33811f36952b100aca5b7920c37586526fcd98d53b7548f214` |
| 1135 | BUY | 11 | EMPTY → PUSH | 25655734 | `0x95482ee1fe68a9c69179acb099e31d774603adb21640e2267e45ddb08933c944` |
| 1136 | BUY | 15 | LOOP → EMPTY | 25655740 | `0xf5053f4eebf83b2bfb7d552127fd96c8d3dfac9c3814abfc9ebbb9c730b2859c` |
| 1137 | SELL | 3 | LOOP → SWAP | 25655742 | `0x33d5d31e29b6665ca51d384563e5a28bf01b8a7a5c7f8c6386692cf0ee52d81f` |
| 1138 | BUY | 13 | PUSH → SWAP | 25655745 | `0x6d8decba5705009267df09928302cdb362957ff688790fc4508aecbeea39757f` |
| 1139 | SELL | 5 | LOOP → SWAP | 25655764 | `0xce1992902d2f757339dbf9b9cbe57bb556df57ed7f5a49a350a2c51f0b4fdf40` |
| 1140 | SELL | 9 | LOOP → SWAP | 25655780 | `0x6c913dfd0b5b9cabd1425266fe72d58fcbd106841f19e12fb0c6908ddd939812` |
| 1141 | SELL | 11 | PUSH → EMPTY | 25655781 | `0x60fc76f8855e867bbad60e2fbec36bee35ce94702e052fecde607d0f970c5048` |
| 1142 | BUY | 5 | SWAP → LOOP | 25655783 | `0xecd1b1861fb3c3453ec3057e5ecdf2b6473e7d46c90c88baab386f02bfae7f26` |
| 1143 | BUY | 5 | LOOP → EMPTY | 25655787 | `0x78a89d61f782e72b4d5de9393e37cb2e98a32ce44622aa20c57d8b7321beab4a` |
| 1144 | BUY | 15 | EMPTY → PUSH | 25655788 | `0x57b6f2824c60a02fd7a23219e960619ba91acd86764a75f001a2533c77944e2d` |
| 1145 | SELL | 7 | PUSH → EMPTY | 25655789 | `0x905bd58fb587f3e4bc230db710eafea3c6d8c15e7e6801ba3718a25bb0deea4b` |
| 1146 | BUY | 13 | SWAP → LOOP | 25655791 | `0xee4ebedabe0f069528a868874aea3f403d27663cc5ed9bca9593946e3b985f8a` |
| 1147 | SELL | 8 | LOOP → SWAP | 25655824 | `0x55678e0cd5e3bc2ab7fa78b8d29f9fb6d563612b386f8eddeae9db180130f2ed` |
| 1148 | SELL | 0 | SWAP → PUSH | 25655825 | `0x852af0bd27f1438933886440f1fc3a5c7f43dfd0f5a7f9d8e181298e36b1d109` |
| 1149 | SELL | 13 | LOOP → SWAP | 25655826 | `0xfbd967d46e09c93cf4a6704b5a523a95a5c84919af835f34eea11be9c2a1337d` |
| 1150 | SELL | 3 | SWAP → PUSH | 25655827 | `0xd95716750b1ffefb36ebb695da509082994dc768737fa793fb725b24da00b3d5` |
| 1151 | SELL | 1 | SWAP → PUSH | 25655831 | `0xb56f9afdd057b5f918e594de85446cc871e65948e774267dfb986eebe05ffb5e` |
| 1152 | SELL | 1 | PUSH → EMPTY | 25655832 | `0x06889e810ecad549062659acf78b53baedc9e874f76d7a82162454d683fb35bb` |
