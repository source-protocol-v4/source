# SOURCE v0.0

Finalized release 0 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.0 |
| Revision | 32 |
| Packed state | `0x5d8a8345` |
| Source Hash | `0x67147b713f593396ce49894d7ec5515e40567758bfc477d1e34311f89a311572` |
| Previous Source Hash | none (first release) |
| Buys | 24 |
| Sells | 8 |
| Changes | 32 |
| Finalized block | 25654577 |
| Finalization tx | `0x09b54f816d6f5bdfbc14e4b18b7b150dd459abf6c3824f1c88ba72aceca6b3de` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | PUSH |
| 2 | EMPTY |
| 3 | PUSH |
| 4 | LOOP |
| 5 | EMPTY |
| 6 | EMPTY |
| 7 | SWAP |
| 8 | SWAP |
| 9 | SWAP |
| 10 | EMPTY |
| 11 | SWAP |
| 12 | PUSH |
| 13 | LOOP |
| 14 | PUSH |
| 15 | PUSH |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 1 | BUY | 11 | EMPTY → PUSH | 25654563 | `0x50c9559e96a2dbbf113a3d93e3e30eea0ef4e8e23c7c918d9b52b2499417d952` |
| 2 | BUY | 12 | EMPTY → PUSH | 25654563 | `0x3faa5d864286abb75367fc3dfbf8f86e165b8de5640cfad6ece3c9cd4d1a209f` |
| 3 | BUY | 7 | EMPTY → PUSH | 25654563 | `0x575c4a6d471f8bb155fb8f0b9bf6864599353acd7b89f8d16814d5fb457b7cd9` |
| 4 | BUY | 10 | EMPTY → PUSH | 25654563 | `0xd92762b45495e0dad404704d2b640b0df59d8f1edbf9e7beba87831e7a886072` |
| 5 | BUY | 8 | EMPTY → PUSH | 25654563 | `0x6f39a1846366bbbfae7f10ee508e30f0fb00bb5161f2cd5d2aeb8c67607abdc3` |
| 6 | BUY | 0 | EMPTY → PUSH | 25654564 | `0xfb1b5d73b21aa1e193a6f2be7f7fa30be351cf8c4e9f059130ef7896e5c29626` |
| 7 | BUY | 8 | PUSH → SWAP | 25654564 | `0x142221e8e585e735e207f940ef4cce33a8be3b7e781ceb36f8c7430599ee2f86` |
| 8 | BUY | 9 | EMPTY → PUSH | 25654565 | `0xf814364ace91f28ea76c569b2175d047a8c13e744e78e161436270633e672603` |
| 9 | BUY | 13 | EMPTY → PUSH | 25654565 | `0x50e45584f632c2ea90b4894bc7891a067eb4d28c0195f2a63dd7928179b03c14` |
| 10 | BUY | 14 | EMPTY → PUSH | 25654565 | `0x381cb784bd9c7af1d6d45fad39f72d7bb4ce058f455458cc6082b7c41af563b0` |
| 11 | BUY | 11 | PUSH → SWAP | 25654565 | `0x374802348fd820bac8cf1ae5f5b48e0c268f1e0c09714e6e2b5641384d19a0f3` |
| 12 | BUY | 1 | EMPTY → PUSH | 25654565 | `0x238671b7a6777854a77e981e0cc2bf45f0e135846d437a61f49725e6a20f8f48` |
| 13 | BUY | 14 | PUSH → SWAP | 25654566 | `0x624f665305039369144a126eff7e3760c30eb547ed75a2dd7f8a8f8ad2886469` |
| 14 | BUY | 9 | PUSH → SWAP | 25654566 | `0x2c98dafa0271d80106b857ce86eed38a4b77d171f0f28b7e965e5ae0ea980d73` |
| 15 | BUY | 14 | SWAP → LOOP | 25654566 | `0x3cddd0190170beb7f81f12108c58f746cd31db74d9d6f3794d8e322ae1bcde02` |
| 16 | BUY | 15 | EMPTY → PUSH | 25654567 | `0x9b6ce57dda3851f00780f4575a01363ca4069490a0c5cba56f274a9757707de3` |
| 17 | SELL | 4 | EMPTY → LOOP | 25654567 | `0xc5a4e776add3b17fb8500261c45835866148f4f2b100f66afb79d2cac05e71aa` |
| 18 | BUY | 3 | EMPTY → PUSH | 25654568 | `0x84bcf58fe025012677ae7f1872f6fa3f8ec5926f744211832a6c57b94e731031` |
| 19 | BUY | 5 | EMPTY → PUSH | 25654569 | `0x36cc28d1a716a09bb903d52741c7a2cf0adf36c20e33ddfbbba04e1e5a69b284` |
| 20 | SELL | 0 | PUSH → EMPTY | 25654569 | `0x8bd29dcd54a982ca74daf149eeace5f6e149b30b5fecd5afc93ff8a65328c66d` |
| 21 | SELL | 14 | LOOP → SWAP | 25654569 | `0x40281f5568db566e2699851c66ee4d1698ff7661b6d5fe082253bd290fb4388b` |
| 22 | BUY | 2 | EMPTY → PUSH | 25654570 | `0x9b90648509750da434af41d6d989416face501dd38b6a9c21e505d532725b968` |
| 23 | SELL | 15 | PUSH → EMPTY | 25654570 | `0x6e6bde67386f3e648e38622cb148c12120f9d451ecd185079443512baaeba241` |
| 24 | SELL | 5 | PUSH → EMPTY | 25654570 | `0xd149080868af869f354ff7140044f9369012ee9cfdc94c3e1221f90229893f69` |
| 25 | SELL | 2 | PUSH → EMPTY | 25654571 | `0x63c46b7c4f38a5b815650dedd5ed83e866f43e7d05812ae555df6e8b1de8e497` |
| 26 | SELL | 14 | SWAP → PUSH | 25654571 | `0x42ed7ab78f582df56fd3833da82cf72377fa17ca8e7474676239210565a5fd3a` |
| 27 | SELL | 10 | PUSH → EMPTY | 25654574 | `0x50ec18e663f87ffe9728518da9db60d01638b0e19701597a1c601439d2291383` |
| 28 | BUY | 13 | PUSH → SWAP | 25654575 | `0xd16f0abd06991aca69dfcbbb7c453b347e7cc9e269955d1d97bebd2eb93693e6` |
| 29 | BUY | 7 | PUSH → SWAP | 25654575 | `0xb1a4f568fed8bc8667d59cb3658d0ae186517f33f0154d297162fb16cbd9273e` |
| 30 | BUY | 0 | EMPTY → PUSH | 25654576 | `0x7b87f1976b1307854d8c237b10307c1a5b66899fcb42202492325727bf84e731` |
| 31 | BUY | 15 | EMPTY → PUSH | 25654576 | `0xfe0f32863ecded25de44608dc84d57f3252599384996808e1ab2d27c1c635cbe` |
| 32 | BUY | 13 | SWAP → LOOP | 25654577 | `0x09b54f816d6f5bdfbc14e4b18b7b150dd459abf6c3824f1c88ba72aceca6b3de` |
