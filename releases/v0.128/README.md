# SOURCE v0.128

Finalized release 128 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.128 |
| Revision | 4128 |
| Packed state | `0x7e92b5ea` |
| Source Hash | `0x4066c329ef5fcc841dc63e5d0c37a4702e14ac125e8cd6ac49b48dbac26c89a4` |
| Previous Source Hash | `0x3c1a68f5e1812aebe29b2fac934a2eee4813c3379e545393db14342940f4d032` |
| Buys | 16 |
| Sells | 16 |
| Changes | 32 |
| Finalized block | 25709216 |
| Finalization tx | `0xe37b2848d397378cece685dc979964bd98e9195f4f67a027afc15c383d54449e` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | SWAP |
| 1 | SWAP |
| 2 | SWAP |
| 3 | LOOP |
| 4 | PUSH |
| 5 | PUSH |
| 6 | LOOP |
| 7 | SWAP |
| 8 | SWAP |
| 9 | EMPTY |
| 10 | PUSH |
| 11 | SWAP |
| 12 | SWAP |
| 13 | LOOP |
| 14 | LOOP |
| 15 | PUSH |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 4097 | BUY | 3 | PUSH → SWAP | 25698206 | `0xc8275718f459769f4a43b4d2edf4cc46d32e3fbdb273b94c0b817795ed44509e` |
| 4098 | SELL | 7 | PUSH → EMPTY | 25698294 | `0x19fdcfb575b94dc425f9c27aa0687f9b43b9992cb5454488cb267c46ba292767` |
| 4099 | SELL | 6 | LOOP → SWAP | 25698301 | `0xc6429b8a1ca761ee8f890fb06da2755bbd38db4a6cbc365bd8f6d78c3be817df` |
| 4100 | BUY | 5 | EMPTY → PUSH | 25698302 | `0xa54f9be4d8b89ac596cc39724cb84182fb3f539e6ae9e7c629f46caad91c8ced` |
| 4101 | BUY | 14 | SWAP → LOOP | 25698323 | `0xf442ddecef7d7f5b7d68421f61207495b0a7625ebfc0f6354574fc78513e6777` |
| 4102 | BUY | 8 | PUSH → SWAP | 25698323 | `0xf442ddecef7d7f5b7d68421f61207495b0a7625ebfc0f6354574fc78513e6777` |
| 4103 | BUY | 3 | SWAP → LOOP | 25698338 | `0x2a1e138978b1a7c8d65829fb0be07733ed37de5fa36142f973051554a25ece52` |
| 4104 | BUY | 8 | SWAP → LOOP | 25698476 | `0x3addb86da4c5a5a79519f6eb886b494984f2223c4e3925a0f750f886b8bf10b9` |
| 4105 | SELL | 8 | LOOP → SWAP | 25698659 | `0x22bb5c202d80fea46558c786b5ef8583b7cd78367ef79fbcc889990ffb1bb6e9` |
| 4106 | SELL | 1 | SWAP → PUSH | 25699344 | `0x96d99e316eec3aa3cab8836cb2ff58e6014e16634e760f012debd605635a6f5c` |
| 4107 | SELL | 0 | EMPTY → LOOP | 25699415 | `0x3de5a20dc8e7eae88c1c6dde75f74779877197f8575235fc8574b7e60901f730` |
| 4108 | BUY | 12 | PUSH → SWAP | 25700576 | `0x8a0e85eb79a6d298ba3c878583eed9ad799f798379dd116efa3bcefcfc7f66fe` |
| 4109 | BUY | 7 | EMPTY → PUSH | 25700667 | `0x761f537b8c5aedaca02809d139f383c9e55ad34419a5ab1dc1584217e2387db0` |
| 4110 | SELL | 7 | PUSH → EMPTY | 25700870 | `0xbb956240bef16757a8d198e85ad689fb4adde476e12932606170bce8ff5d9f52` |
| 4111 | BUY | 9 | LOOP → EMPTY | 25700870 | `0x39ce34790e353a7288f8cb7b5dccde34cec617b122c3c3d83d14fd48718cf5e6` |
| 4112 | BUY | 3 | LOOP → EMPTY | 25700871 | `0x18d25a1aaa6ee74ccef898197f5c7568f509369337295d3c9c9c6faa9d42c6e1` |
| 4113 | BUY | 11 | PUSH → SWAP | 25701211 | `0xf1c0c1898edc279038a422ce6dc8d464f7d1921cec87f9d2f1d8937eb2045d42` |
| 4114 | SELL | 0 | LOOP → SWAP | 25702557 | `0xb3118914e449255f7bb215eff18213dc01e60291c70ec76742d95882ff9bebeb` |
| 4115 | SELL | 13 | EMPTY → LOOP | 25702983 | `0xd4a9efd06081c95a9e69e878b43e346693f1d7310fa9ac892041bfc888204ed2` |
| 4116 | BUY | 11 | SWAP → LOOP | 25703400 | `0x9138b52f13e0f0203e4c11d35a9e91eeaa5e4065b9ddbd0b83eb8d68179e57cd` |
| 4117 | SELL | 9 | EMPTY → LOOP | 25703405 | `0x5a051334a72162b27c455bcb99d09adfa2e7a7cb50a3ff109f7b081dba7623ca` |
| 4118 | SELL | 3 | EMPTY → LOOP | 25704153 | `0x5b2b870203fdf465357305e086b72a247e83c17e2cb2b551701ae770511ebf70` |
| 4119 | SELL | 2 | EMPTY → LOOP | 25705042 | `0xc4ceac72ba5377442900d92510a5de50e0e768a5c09d371a6f19d2343a8cd97d` |
| 4120 | BUY | 1 | PUSH → SWAP | 25705382 | `0x08c6e8ef96447358f34e27a64dfdb0ff4e8ff9f1a6646c6720861d61585df6b5` |
| 4121 | BUY | 5 | PUSH → SWAP | 25705880 | `0xb81f91e5df57a772802c81060b1ad9fbac631bf17514954234692381990b91f4` |
| 4122 | SELL | 7 | EMPTY → LOOP | 25705928 | `0xf8adb0a6e1cdf66a5fbc8301405bf69a9e2917fb515abc96d9b3826b8c327f04` |
| 4123 | BUY | 9 | LOOP → EMPTY | 25707437 | `0x312316754aafcd7b9818383ebb397158e8efeaa1e1c24c12e44be13d3129b8e3` |
| 4124 | SELL | 2 | LOOP → SWAP | 25707820 | `0x27bc66ac97be6d71ce43d862ee0b4f06406a33dd6c2fb54b0117118631ef86c4` |
| 4125 | BUY | 6 | SWAP → LOOP | 25707922 | `0x4eaf4e1e9da007a87681aa3e4969baf2f44e06b18fad9bfd236edc5a1acf4f7a` |
| 4126 | SELL | 11 | LOOP → SWAP | 25708988 | `0x39e72159b6ecf91bbe14fb586644a5c5641d9ffffaad967b0096f07ebad150f1` |
| 4127 | SELL | 7 | LOOP → SWAP | 25709216 | `0x682cd6d4af12f1b13be39d712bb02833a716ae4adfdebfe3a7ff88b77ea5f689` |
| 4128 | SELL | 5 | SWAP → PUSH | 25709216 | `0xe37b2848d397378cece685dc979964bd98e9195f4f67a027afc15c383d54449e` |
