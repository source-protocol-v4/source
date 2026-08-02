# SOURCE v0.90

Finalized release 90 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.90 |
| Revision | 2912 |
| Packed state | `0xed6bd4ad` |
| Source Hash | `0x2e6f35d1eac50f7607e92ac322801cb36656fc42d0109342a40c4f3c74c305aa` |
| Previous Source Hash | `0xe622073102b3f278cfeb6fc96d126cf71635fc6a06bd5afac871ce6b2f524cc7` |
| Buys | 13 |
| Sells | 19 |
| Changes | 32 |
| Finalized block | 25665365 |
| Finalization tx | `0xb17c393c7b03bb2a1402f337f8016574c5311694e799f3aeac5f2a2b93666cca` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | LOOP |
| 2 | SWAP |
| 3 | SWAP |
| 4 | EMPTY |
| 5 | PUSH |
| 6 | PUSH |
| 7 | LOOP |
| 8 | LOOP |
| 9 | SWAP |
| 10 | SWAP |
| 11 | PUSH |
| 12 | PUSH |
| 13 | LOOP |
| 14 | SWAP |
| 15 | LOOP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 2881 | SELL | 4 | PUSH → EMPTY | 25664902 | `0x543c04b43073e25177b36f98d6a9400f3aa292ab13604e6f7c45c946f253468d` |
| 2882 | SELL | 7 | PUSH → EMPTY | 25664903 | `0x06d8bc4a53b06fee7e9b3b46f03d4662b1e20559e2ce7e509f86193716bc6dbf` |
| 2883 | SELL | 5 | PUSH → EMPTY | 25664907 | `0xe94b18b6fb1d83d7854a153d2bdccbe5bcbc3dd04b81fedc5a464951deb52089` |
| 2884 | SELL | 1 | EMPTY → LOOP | 25664926 | `0x44a60995217563346b431a3ae736fdc89c9acaa5f28aa702883fde9e6be97b95` |
| 2885 | SELL | 0 | SWAP → PUSH | 25665000 | `0x0d8d7dc8c0eac4cc7032c8219ca016b0f1370692f8ea50d287de849cf7ac231a` |
| 2886 | SELL | 11 | PUSH → EMPTY | 25665019 | `0x72d1bb27b37615fbb5fb9e2ca709682153533eaccea1dccca9ef6fdbecb8fcc9` |
| 2887 | BUY | 13 | EMPTY → PUSH | 25665031 | `0xfefc855728ee158b5c541ca311b0749df472f867ec5556d1729b4e217061ba62` |
| 2888 | SELL | 6 | SWAP → PUSH | 25665031 | `0xa5848033443756b4f3c0c68751f9a8933d443b20c8bc3bbea2a13f1ac9cfcaf3` |
| 2889 | BUY | 5 | EMPTY → PUSH | 25665033 | `0xc52d21d006dfb08d7dd6f4b1f0ec02af552938f40394f50c721fdff96cee543c` |
| 2890 | SELL | 8 | PUSH → EMPTY | 25665034 | `0xaa51ddf59a3f8ea372aaf06cc041fecdf78bba3e8561a41ec5c36baec8afcc2a` |
| 2891 | BUY | 6 | PUSH → SWAP | 25665061 | `0x04ace6decac5b623e8214daf8f13bb98236976bac8b1fd49940b38c2e0d99bc3` |
| 2892 | BUY | 2 | PUSH → SWAP | 25665066 | `0xd70c4c77407b232122875086812bf1bea804d9e4e7ee55a4f57602cc0fcdb5ed` |
| 2893 | BUY | 3 | PUSH → SWAP | 25665072 | `0xb8e11dbb066dcf2851da293a81693af1f50c7f66eb2b0ffed45a43c58809d40f` |
| 2894 | BUY | 10 | PUSH → SWAP | 25665074 | `0x2150862613c86ca40cf534cb0fe96cf04edea1986864afa5059e06ff47be9084` |
| 2895 | SELL | 11 | EMPTY → LOOP | 25665128 | `0x4d97b0e0e2b3863995b7d5248b830248df1a1c83a5dc587b56af7323a8c828e3` |
| 2896 | SELL | 13 | PUSH → EMPTY | 25665129 | `0xc2d14a3a4a5053280fcdf0da789a01b0159e87587a24bd6664670d7a48ec01fb` |
| 2897 | SELL | 8 | EMPTY → LOOP | 25665130 | `0xf6d266ce6f12867886a5cec84b8f8b661ff67525261312aba7825a7c5fa57849` |
| 2898 | SELL | 10 | SWAP → PUSH | 25665149 | `0x293e7dacac807828301dd1e396d2bfae4786d30f68c0654ace57dfd2295fe81b` |
| 2899 | BUY | 11 | LOOP → EMPTY | 25665171 | `0x4060efb32300b0f096c0341fcd1b885299557ca8efb7d4295ae3c1693eb1a598` |
| 2900 | BUY | 2 | SWAP → LOOP | 25665190 | `0x69dc4f9eb41a2caceefdbb40674c86edcfdc8040407a57172e9624237913ffee` |
| 2901 | SELL | 7 | EMPTY → LOOP | 25665200 | `0x47c13c80ec5832551613f3844b8c8c475a959189a9596f4a711997a0bb4daaf2` |
| 2902 | BUY | 11 | EMPTY → PUSH | 25665223 | `0x2f71ccc4971097264f62ee8218a0105ae0d13b8925f0952c4e9c131f03d908a2` |
| 2903 | SELL | 14 | LOOP → SWAP | 25665231 | `0x706e7116879ac7c9c9b92b5bc3c8a8071de33bd309b4b64651502b21401186b8` |
| 2904 | BUY | 2 | LOOP → EMPTY | 25665234 | `0x013c6daa4bc15e232a7a035b03838e6b5d5ad352de4b45b90936c93ae3374a81` |
| 2905 | SELL | 15 | EMPTY → LOOP | 25665241 | `0x5ddabf886634433b5e62f8d31379321ed978be4f6ba8c25ba1c8fba13968dace` |
| 2906 | SELL | 13 | EMPTY → LOOP | 25665242 | `0xdeb51f3bcdd888eac70cbbaa47995548ae3832976f20debb0e2612216da2404c` |
| 2907 | BUY | 12 | EMPTY → PUSH | 25665297 | `0x779673b520c4b6ac9679b958a8fe996f9ba3b319f401006553e8cc5c795f55b8` |
| 2908 | SELL | 2 | EMPTY → LOOP | 25665322 | `0xf4282660c07dacdba4a1ad8c5e3332f57a797ed6f9d1bcb238d5bb6d81a2c846` |
| 2909 | BUY | 9 | PUSH → SWAP | 25665325 | `0x98c18a7297269038b31da13f9ecc5d4db87021d4f886a338c179eb22f740b967` |
| 2910 | BUY | 10 | PUSH → SWAP | 25665347 | `0xbf0aff98bec7f9887b036e8de06a14406617f1a39830ffe55e0e0553f92b0580` |
| 2911 | SELL | 2 | LOOP → SWAP | 25665360 | `0x39098692bd2aa25f259274defac4a5f0dc1b6fd5f2d746280cfdf4046b25db62` |
| 2912 | SELL | 6 | SWAP → PUSH | 25665365 | `0xb17c393c7b03bb2a1402f337f8016574c5311694e799f3aeac5f2a2b93666cca` |
