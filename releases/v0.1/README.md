# SOURCE v0.1

Finalized release 1 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.1 |
| Revision | 64 |
| Packed state | `0x8ec2211d` |
| Source Hash | `0x2b5d0ec6817bf39e04a59447ad36f8669facb93d181cea5ae31a4013ca11e56a` |
| Previous Source Hash | `0x67147b713f593396ce49894d7ec5515e40567758bfc477d1e34311f89a311572` |
| Buys | 20 |
| Sells | 12 |
| Changes | 32 |
| Finalized block | 25654611 |
| Finalization tx | `0x2675127ecbb4fcfaf603e697a138eb30e3f41ba3f297344de5deeed074f309ff` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | LOOP |
| 2 | PUSH |
| 3 | EMPTY |
| 4 | PUSH |
| 5 | EMPTY |
| 6 | SWAP |
| 7 | EMPTY |
| 8 | SWAP |
| 9 | EMPTY |
| 10 | EMPTY |
| 11 | LOOP |
| 12 | SWAP |
| 13 | LOOP |
| 14 | EMPTY |
| 15 | SWAP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 33 | SELL | 5 | EMPTY → LOOP | 25654579 | `0xb65a9b21827b1beb7c16d65d3242c139db83c2e9455c40cc7c2043c4b797033a` |
| 34 | BUY | 2 | EMPTY → PUSH | 25654580 | `0x911afa490a4590ac38e6630e3b1d334e43ab486cec3679de977de07f61641a30` |
| 35 | BUY | 4 | LOOP → EMPTY | 25654582 | `0x3fe9909882acbb83b558f299a2ca53bef836bea351e4dfcc105db6cbab2b6bbe` |
| 36 | SELL | 1 | PUSH → EMPTY | 25654583 | `0x315caca82d8333cdd87dc3f12e39b241792ee1b8a75dc6190bb05fd18a41abe2` |
| 37 | BUY | 9 | SWAP → LOOP | 25654585 | `0x33ddd3721abfbf8a2208bfc484f8fa5b5d85ae4a71f245efe39823b4f4c76d37` |
| 38 | BUY | 9 | LOOP → EMPTY | 25654586 | `0xb10fec9f6c96bfd8395bb24b4d6a96f958b4449e4516af6520e1569a3423afe4` |
| 39 | BUY | 5 | LOOP → EMPTY | 25654587 | `0xd1a07043555809d1a3f86579686103e82a42bb9745376e1a78a31b9c7b17e5c1` |
| 40 | SELL | 3 | PUSH → EMPTY | 25654588 | `0x96aa48fc44e7f896927bf29671d81dddddd4a45b314449b64d020dd7b137890b` |
| 41 | BUY | 11 | SWAP → LOOP | 25654588 | `0xc4ae8cacd300c1b9d23910dacdaa0987986ce1aefe7adbf22818f0a88e5db9be` |
| 42 | SELL | 12 | PUSH → EMPTY | 25654590 | `0x1c1b56d368c15fe8889277f12381a35d54abc1af87c11c4586ac55a6470f5082` |
| 43 | BUY | 6 | EMPTY → PUSH | 25654590 | `0x800bae2e36bf9a004e4fe733d8656039272708fa79069107b7fbdd2ec97aae63` |
| 44 | BUY | 10 | EMPTY → PUSH | 25654591 | `0xd5f487057705c1281d40ecba5981b76d23b0cd8eb7b55a792065e846f69bd9d9` |
| 45 | BUY | 12 | EMPTY → PUSH | 25654593 | `0xd3d32dec014a5f23f3e42a952b93f88b0f764fc93d69bb8396bf227098f430a4` |
| 46 | BUY | 15 | PUSH → SWAP | 25654595 | `0x6cc3eedd03cf249f5d3d7b2fcef601395e44229cd6dafa9a0b43f44bd71db84b` |
| 47 | BUY | 14 | PUSH → SWAP | 25654598 | `0x21f6f116a03ff0a1d1c93d27741bbe39a48318c73cf05acc972269c86e3daa1d` |
| 48 | BUY | 6 | PUSH → SWAP | 25654599 | `0xdb7092890e9b72a6f513ddf304d851ed6cd5be71289fb20d9cceac9d59dacad1` |
| 49 | SELL | 14 | SWAP → PUSH | 25654599 | `0xea7585938003d33e19792e8e25c32402c7f4fe9941ca6125da2f03a33e33ed4a` |
| 50 | SELL | 1 | EMPTY → LOOP | 25654600 | `0x76521ce9ed6153c1793a27e52e992aeebe16e1dfb50f0452fd11e8552e1307d0` |
| 51 | BUY | 3 | EMPTY → PUSH | 25654600 | `0x20181cfa0aeeb8d2c0e26104c4c47296c0423e71c0dc4edf171c9df1f88bf4d9` |
| 52 | SELL | 3 | PUSH → EMPTY | 25654600 | `0xc5bde4559661e0a8df7097c621cae60bec6b7cdfa576458332d5b20e7988de4a` |
| 53 | SELL | 15 | SWAP → PUSH | 25654604 | `0x524f74e263e1d05e2ed462424bda7cadc7e6b6b764355d61bea4bb2aaf53c7d2` |
| 54 | BUY | 15 | PUSH → SWAP | 25654606 | `0x25a68797e5db956f7738aa7d28fa384d31477157d585bc2206ede9c4eff910fd` |
| 55 | SELL | 15 | SWAP → PUSH | 25654606 | `0x2c0df34506d5b1056c549eb6ff416d93695d8be3aa8ce264400ffc87252c5781` |
| 56 | SELL | 10 | PUSH → EMPTY | 25654606 | `0xd390f27382545461a0f8943efbbe26065bf5a0aca60ebebcf708175a643817f5` |
| 57 | BUY | 7 | SWAP → LOOP | 25654608 | `0xd96d19f61603c9cad87c96837512a947463671d0a31a2a9df98e21ad1c759caf` |
| 58 | BUY | 12 | PUSH → SWAP | 25654608 | `0x5482e7b95bb5de7751a0fb92ed70cf57d0a50c0250578e7f15fcd1126288215d` |
| 59 | SELL | 2 | PUSH → EMPTY | 25654609 | `0x0fd929dc61f4985625f984c0757fd2d1f93ba0cc263ecd7b37286e2c82d7903c` |
| 60 | BUY | 4 | EMPTY → PUSH | 25654609 | `0x129dc03dab5e5a75c56cdd267c07472eb4533f372ad19b6e7e719c6d8c47f4f5` |
| 61 | BUY | 7 | LOOP → EMPTY | 25654611 | `0xc76dd3b15153fb16aa27143b77843da8110d64945f7ac7098ac50c1f73af322e` |
| 62 | SELL | 14 | PUSH → EMPTY | 25654611 | `0x9f62e094a77f0805187d129cc00280d6e88eb9d745771929780ea43ec528152b` |
| 63 | BUY | 15 | PUSH → SWAP | 25654611 | `0x1708201126cc992de0d1b484671595eed357644ac229dfe84171e95283c09e8e` |
| 64 | BUY | 2 | EMPTY → PUSH | 25654611 | `0x2675127ecbb4fcfaf603e697a138eb30e3f41ba3f297344de5deeed074f309ff` |
