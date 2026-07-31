# SOURCE v0.3

Finalized release 3 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.3 |
| Revision | 128 |
| Packed state | `0xe4b255f1` |
| Source Hash | `0xba7076ab5cd7ccf50374e6eae7c15824662c9d37c1b7b83e3f82165af8c40d43` |
| Previous Source Hash | `0x73752dcb1fa3aa22eb8748686964ba679e42b978328276a939edbf797d1c07c5` |
| Buys | 18 |
| Sells | 14 |
| Changes | 32 |
| Finalized block | 25654630 |
| Finalization tx | `0x8e759eaf3d1c851b902e23825e5ea78dd4b2d3142716e7bb630442eef4d8855f` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | EMPTY |
| 2 | LOOP |
| 3 | LOOP |
| 4 | PUSH |
| 5 | PUSH |
| 6 | PUSH |
| 7 | PUSH |
| 8 | SWAP |
| 9 | EMPTY |
| 10 | LOOP |
| 11 | SWAP |
| 12 | EMPTY |
| 13 | PUSH |
| 14 | SWAP |
| 15 | LOOP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 97 | SELL | 13 | LOOP → SWAP | 25654625 | `0x8b732d984e47527284cedcd652d66c1d672973a7c81511aab7ab02f60dea4e35` |
| 98 | SELL | 0 | LOOP → SWAP | 25654625 | `0xad35950796f44c4e42d7f3fa571c8849035c5d9981d644edb642d62df362c3a2` |
| 99 | BUY | 10 | LOOP → EMPTY | 25654625 | `0x215d174bb0a86a76bb2397b6013fe54887692bc4f65510431c1dd617eaf1509e` |
| 100 | BUY | 9 | LOOP → EMPTY | 25654625 | `0x57acb0d57e41bee88898086d25aa99677504a00f2f0c97bd6aca686999d4fec4` |
| 101 | SELL | 0 | SWAP → PUSH | 25654625 | `0x38f0f116557a5a315efb196f7603f07c215448c64adadd9eb9e906d04beaa612` |
| 102 | BUY | 11 | EMPTY → PUSH | 25654625 | `0x13b0157640bdaa35436960ba51e54af9170507e12a96032979f417ff38bdd6cc` |
| 103 | BUY | 12 | LOOP → EMPTY | 25654626 | `0x61e8f4a96cf2e923e7c261a80e217a7dc21d506bc53e5d942851fe2701dbc61a` |
| 104 | BUY | 13 | SWAP → LOOP | 25654626 | `0xad2d25dbc497076114a5cbf468f5af96dc778dbc47def05816fcdabab7b092c2` |
| 105 | BUY | 11 | PUSH → SWAP | 25654626 | `0x6225789bb988e1a9cd908e9d3c5c42efdfabb6f100396e7c40c092b0df3bc49f` |
| 106 | BUY | 10 | EMPTY → PUSH | 25654626 | `0xe919f6cca2fdd73b7f2d25004b4f8aea9b0a36e29b1bf7b0ba088fe7f30160d8` |
| 107 | BUY | 15 | SWAP → LOOP | 25654626 | `0x6fe837cfc0c3ee9275c2acd92043bc3d736e905468b43b4d475d731d15d2a1a0` |
| 108 | SELL | 5 | LOOP → SWAP | 25654626 | `0x31df5bbc0e318fc03087579788ed9d4b86c27ea14bdd8093d1af3406e0bed291` |
| 109 | BUY | 13 | LOOP → EMPTY | 25654627 | `0xf3319e91df2454eeab55fd2b753b0921735a0f344aba0b6121a07a99d1348f62` |
| 110 | BUY | 5 | SWAP → LOOP | 25654627 | `0x9c652be499658126c1e34bf0935d82ef0e6a821cf2649dba4a238ba765b1cea7` |
| 111 | BUY | 13 | EMPTY → PUSH | 25654627 | `0xb444524b762893a4c46563a05292cb22cba3bc9100cbb7f7c001abb56f71d390` |
| 112 | BUY | 1 | EMPTY → PUSH | 25654628 | `0xa4bda878251bcd3bd88f34f2ffac2f9c811ca35fcb5ae95064ecf5d30a69e4d5` |
| 113 | SELL | 1 | PUSH → EMPTY | 25654628 | `0x9940463b4b5fb0e7482b15e7fe1384f691fb05a685f875f2d7fefcc1228663a4` |
| 114 | BUY | 5 | LOOP → EMPTY | 25654628 | `0x93687490da289a9a3b2a2062e6eb7905f6868919b3c425990c83cec0dc8a0ca3` |
| 115 | BUY | 1 | EMPTY → PUSH | 25654628 | `0x6426cf3af2b6f6166186767bb3a7adc3141af0a9874fdbed2ab1c9d41a80961b` |
| 116 | SELL | 1 | PUSH → EMPTY | 25654628 | `0x6b278cedd7139513657dc60412a99c4e412da7ee00971f994f1a7fa136792f5c` |
| 117 | SELL | 10 | PUSH → EMPTY | 25654628 | `0x601ea5dbfa37434c5ed2e1e33accb31c7068d6eebbcdf8c819a5fd7ffde97263` |
| 118 | SELL | 10 | EMPTY → LOOP | 25654629 | `0x205a17738e60e883f676bb1c0e3f6241d9a6ae1f23cd4c468a8ae621dee0d716` |
| 119 | SELL | 4 | SWAP → PUSH | 25654629 | `0x371dc8be7da56cbeb54e12e60a4d4af23d0e3599f2e87ade79c50f3640b709b4` |
| 120 | SELL | 3 | PUSH → EMPTY | 25654629 | `0x8e6efdec9d81d62525a1b5f64fe2168cd91be2d00c9a15e378dea128f2e6d8f6` |
| 121 | BUY | 14 | PUSH → SWAP | 25654629 | `0x1b0d001a979f91027742fb3fe8e13fff0ea2e97c8fdbf95302882a4df1c56e81` |
| 122 | SELL | 6 | LOOP → SWAP | 25654629 | `0xf136535cb64b3cc644b077237153c3d6968eadcd6b53ea0ed5cbad22e8a56335` |
| 123 | BUY | 15 | LOOP → EMPTY | 25654630 | `0xf6c1c08c928f8c48b4055a7399f6048b636adaa5b6f40398e6932c904000f8a9` |
| 124 | BUY | 8 | PUSH → SWAP | 25654630 | `0x46f2ce09edca3b22cca64e04099ceb0a70de0c87dc85fddaf3881b77d58714a3` |
| 125 | SELL | 15 | EMPTY → LOOP | 25654630 | `0xc321baa77bfa6cabe9115027f6c347353f46f37f859533bac21ba9576b7de950` |
| 126 | BUY | 5 | EMPTY → PUSH | 25654630 | `0xf7574e03099d4def411a8732c1d078ecabff4e54ed98288d3c5855f6d804b71a` |
| 127 | SELL | 3 | EMPTY → LOOP | 25654630 | `0xe329e81ec37476bce4099558c4751dbf744f06a23a6b695da717f54592ec8f51` |
| 128 | SELL | 6 | SWAP → PUSH | 25654630 | `0x8e759eaf3d1c851b902e23825e5ea78dd4b2d3142716e7bb630442eef4d8855f` |
