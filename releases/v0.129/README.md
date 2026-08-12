# SOURCE v0.129

Finalized release 129 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.129 |
| Revision | 4160 |
| Packed state | `0x3b533dbe` |
| Source Hash | `0x62622e6a8a1592921a039f2aac4ac8a628da9440d727a3b85dfa09dbe1eef6d0` |
| Previous Source Hash | `0x4066c329ef5fcc841dc63e5d0c37a4702e14ac125e8cd6ac49b48dbac26c89a4` |
| Buys | 12 |
| Sells | 20 |
| Changes | 32 |
| Finalized block | 25737742 |
| Finalization tx | `0x95a28b0f4b0c2fb9a04511c2988c59ac11e487551a531e7bf5312f1c458d8e66` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | SWAP |
| 1 | LOOP |
| 2 | LOOP |
| 3 | SWAP |
| 4 | PUSH |
| 5 | LOOP |
| 6 | LOOP |
| 7 | EMPTY |
| 8 | LOOP |
| 9 | EMPTY |
| 10 | PUSH |
| 11 | PUSH |
| 12 | LOOP |
| 13 | SWAP |
| 14 | LOOP |
| 15 | EMPTY |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 4129 | BUY | 12 | SWAP → LOOP | 25709713 | `0x38f2cee260563d4f27832030ec359172296fa9f7191f5f2c75a2016477cd1bec` |
| 4130 | BUY | 5 | PUSH → SWAP | 25710044 | `0xcb5524a5449808c2554a97a462267fa5ec0d81360e5605dfad33b387a7eb755e` |
| 4131 | BUY | 6 | LOOP → EMPTY | 25710593 | `0x6106468004ff0901c08e8b85bbbffc3dae59b7cebc6959efd5c88f03b5c310c9` |
| 4132 | BUY | 1 | SWAP → LOOP | 25711306 | `0xcc74af7c26009c6860e2ab597415becc65b6d7f7b675bbad9d3908af49ab70c8` |
| 4133 | SELL | 8 | SWAP → PUSH | 25711985 | `0xc9f80a3bf65d868b4cc2bba64082fc1b403236313a853a30ee83e8b305dd5884` |
| 4134 | SELL | 11 | SWAP → PUSH | 25711987 | `0xfa37b477834aae3b2fdf6c24ec4ac0d60a9a4e5cb6408c7caaffd173c64ab923` |
| 4135 | SELL | 11 | PUSH → EMPTY | 25714362 | `0x1d064bf1857b029619b8a02318c022cfb348dd80c1fcc623194fed13a806a04a` |
| 4136 | SELL | 8 | PUSH → EMPTY | 25714765 | `0x4643083aa0fcec9be39ca5b77c408742962eaedda7ddfbb619ac06987ed8e6e4` |
| 4137 | SELL | 15 | PUSH → EMPTY | 25718203 | `0xb8a231f9fcac2503c4b2aeb320c0592d9759b22aac3ea0b8c4f1028a80ac2a7e` |
| 4138 | BUY | 0 | SWAP → LOOP | 25718289 | `0xcd14b532f067c8b498c9cf457e9c33f36876155c433e23d2e7aee9b5c62e090d` |
| 4139 | SELL | 2 | SWAP → PUSH | 25719474 | `0x59c723ace12606691878e5c2f8a2da47399afaf41000e780fb85558d6c8f74e1` |
| 4140 | SELL | 0 | LOOP → SWAP | 25721209 | `0x10fac91760ebe34d4302ab72d896e100e914cca20b3de7fcd86d0db2b98634f9` |
| 4141 | SELL | 0 | SWAP → PUSH | 25721860 | `0x7c3fc7d1f156d90480b37900388465a86d1e360f39b558395c6dc442065ce4d0` |
| 4142 | SELL | 7 | SWAP → PUSH | 25722032 | `0x06008bc995df1ff45dd563776809a430fb2da981e6a29cba7b5fb50633c45deb` |
| 4143 | SELL | 9 | EMPTY → LOOP | 25722629 | `0x7c37adbac21ad2b6ff930c507cb970a01a4c020c63226983be68dbec60cbe654` |
| 4144 | SELL | 13 | LOOP → SWAP | 25723670 | `0x0bcfe28daa2a6585b2a102c8666f5698434ca6ea01b87122d79242d664f48973` |
| 4145 | SELL | 7 | PUSH → EMPTY | 25723671 | `0x1232c7f85756809cd9f20fef818be55d8c52a35edd2d1e043f7a7e738f750d3e` |
| 4146 | SELL | 2 | PUSH → EMPTY | 25723873 | `0x32d48b8558a1fa1c2fad87ab7fc35dbac42e201a889342a60cefc2ff8c7c7349` |
| 4147 | SELL | 6 | EMPTY → LOOP | 25724161 | `0x1828162eca42879b36a1b22d7e480900f0eeae7ccc6ae46a35dc07770959683a` |
| 4148 | SELL | 0 | PUSH → EMPTY | 25724657 | `0xe3dd4245bffcf2a74f769fe9229cd51f798e3a202f1a91c3c3c84fbc12610a2c` |
| 4149 | BUY | 2 | EMPTY → PUSH | 25724725 | `0xdea041ce695e0c777350917b9fd8c4bac593342ba715c1a09c12ca5211b0037c` |
| 4150 | SELL | 2 | PUSH → EMPTY | 25724981 | `0x469f2419e48e67517a52bc7166b3b51f95c5a260f23e18b6dddeb1307fb72914` |
| 4151 | SELL | 2 | EMPTY → LOOP | 25725299 | `0x3fae98a9f454418cdd1d91c5d1006cec01f386996a7d537f9990986d84a3cb06` |
| 4152 | SELL | 8 | EMPTY → LOOP | 25725543 | `0x6d5518d1af0acf7b27057117c0f131bdfd50dd3bb8c21d88a0501677858b1969` |
| 4153 | BUY | 10 | PUSH → SWAP | 25727068 | `0x494fb8fb7faf213c55b07a71b794617cb921b4107be209bdd42dafe0e6a5f459` |
| 4154 | BUY | 0 | EMPTY → PUSH | 25728397 | `0x5f7255fe49d8bf6dd5ba52d59882e30b385bea1dd881f174cf0ba1b70185d881` |
| 4155 | BUY | 9 | LOOP → EMPTY | 25728397 | `0xa3af3100bd097c9b79e415fd0696e78807db536d3903a1a2d3edbbdac47db466` |
| 4156 | BUY | 11 | EMPTY → PUSH | 25728397 | `0xa3af3100bd097c9b79e415fd0696e78807db536d3903a1a2d3edbbdac47db466` |
| 4157 | SELL | 3 | LOOP → SWAP | 25732506 | `0xf77e082d5d943d604b29864d26aff22ec81987ef95e553cbbff5228ebf7ca16d` |
| 4158 | SELL | 10 | SWAP → PUSH | 25733986 | `0xc25c1a0a4103320418c8816f7dcf96e98b630ad3fd0c2e6d2cecb863d7373707` |
| 4159 | BUY | 0 | PUSH → SWAP | 25736018 | `0x0673f40bc63ec27e3f3b114de624c015af4d7f55c5162025889ae2d2cd5c7c99` |
| 4160 | BUY | 5 | SWAP → LOOP | 25737742 | `0x95a28b0f4b0c2fb9a04511c2988c59ac11e487551a531e7bf5312f1c458d8e66` |
