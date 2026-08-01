# SOURCE v0.80

Finalized release 80 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.80 |
| Revision | 2592 |
| Packed state | `0x9a92dbde` |
| Source Hash | `0x24a556251485c7041e8a1872aa5fa7b1a93803b7bb4a038e4a4031ed3221181a` |
| Previous Source Hash | `0x7b560dddacd1ccf0f5aad9f48924def51259b31d3f454c3194ddd9035d8d5195` |
| Buys | 12 |
| Sells | 20 |
| Changes | 32 |
| Finalized block | 25661806 |
| Finalization tx | `0x1a9e2e343b10bf569b1da19c05d858d41ac9e7d2ed283fe215248f09a19f1eb2` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | SWAP |
| 1 | LOOP |
| 2 | PUSH |
| 3 | LOOP |
| 4 | LOOP |
| 5 | SWAP |
| 6 | PUSH |
| 7 | LOOP |
| 8 | SWAP |
| 9 | EMPTY |
| 10 | PUSH |
| 11 | SWAP |
| 12 | SWAP |
| 13 | SWAP |
| 14 | PUSH |
| 15 | SWAP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 2561 | SELL | 3 | PUSH → EMPTY | 25661357 | `0x1aee440fc3b50a4fad9af927d0019010f876e0b265a5fee4a3d2836e1b4202c2` |
| 2562 | BUY | 14 | SWAP → LOOP | 25661361 | `0x3479a4aa0b858e40616e10514deb6c7afcb991cc77e59be0df6f8eedbfee7045` |
| 2563 | SELL | 3 | EMPTY → LOOP | 25661361 | `0x386fdcca5d0ce7e3cf2737e3aa127341604837c68a64cca05b558685c4e5b6d8` |
| 2564 | BUY | 11 | PUSH → SWAP | 25661364 | `0x11fde6eeb96a2b289683b94b730fc266427438e51d9a21ecadd978a3a5818ed4` |
| 2565 | SELL | 6 | LOOP → SWAP | 25661371 | `0xb30c920716b83db1f90401718525a623351fee4c9ea24bf31dfae12f5420b36a` |
| 2566 | BUY | 5 | LOOP → EMPTY | 25661450 | `0x1ddb6df0c8c6b80c58bd8baeef7b80f9d7a6d81295c1c950669c6a29eef63dde` |
| 2567 | BUY | 14 | LOOP → EMPTY | 25661487 | `0x0b9e809c4d6673a5c5bcbf7d0970a79aef984a764b5eae05969e7e2b16167005` |
| 2568 | BUY | 11 | SWAP → LOOP | 25661491 | `0xca6bfe96f7e3cbcd79a3f698a551521892b4928360ab7c0523454fd7184ded35` |
| 2569 | BUY | 15 | SWAP → LOOP | 25661503 | `0x3bb88dc8b6280ee17acf4c1d1adbd609a1ab8cf5cccaff1398e62120bbc0d146` |
| 2570 | BUY | 7 | SWAP → LOOP | 25661516 | `0x269800bab8aa99360828bdc8f67e4027e8d72e4a8cc22ac158fd019ecc3d4ba9` |
| 2571 | SELL | 13 | PUSH → EMPTY | 25661532 | `0x833a94820f8e23cadfbd2bb9adfb1d9588eae4c56678823b3f7520825c84c2fb` |
| 2572 | BUY | 1 | LOOP → EMPTY | 25661555 | `0xb82c386ca1be2fb7ece2138d4c997cf4354831faa4521e22c177dc87dd4f6b34` |
| 2573 | SELL | 11 | LOOP → SWAP | 25661561 | `0x2366889f4b698678bc4d1eea7a0787547b99c3d57a58610e567da41fd65c3dab` |
| 2574 | BUY | 4 | SWAP → LOOP | 25661564 | `0xbc43e6957d48be8d4f140914bbbef680d443656f94a788bbf25181b3d030512b` |
| 2575 | SELL | 0 | LOOP → SWAP | 25661564 | `0x7cb71d03f186d0ec4f7cb382e2ee309a2c14924e9bb7d46146094f70524671a4` |
| 2576 | SELL | 5 | EMPTY → LOOP | 25661568 | `0xbdd95714f3de663e9322cff158879962c18392cda9f7d40bf9fa91bc992f8187` |
| 2577 | SELL | 2 | LOOP → SWAP | 25661569 | `0x1fd88bae645d4b4b69b112709be1a813d42def05d772a5852301374118d8ef52` |
| 2578 | SELL | 15 | LOOP → SWAP | 25661572 | `0x44b7cdcd0b4c1a624225de8c5ad7c08864fe8974c0de4965fee9e8a1a29e9a05` |
| 2579 | BUY | 7 | LOOP → EMPTY | 25661589 | `0x9433ecfc47d974e00b2fb2593dc9ee75b60c2a28ba0b95d0967303b87541a6eb` |
| 2580 | BUY | 0 | SWAP → LOOP | 25661595 | `0x4d781e6bfb4448b8d23c6539848f8a78accbd3356773cb26a19051ac7ef0828f` |
| 2581 | SELL | 1 | EMPTY → LOOP | 25661617 | `0xfd4891bffba8387c1bf451697ff1b94823d60c123eeeadd9449b37a186e8c9c3` |
| 2582 | SELL | 13 | EMPTY → LOOP | 25661635 | `0x90d96d2b96c2fe7635f9ff641ee43c1ab81b94042a868e27d42a11051529adb4` |
| 2583 | SELL | 2 | SWAP → PUSH | 25661642 | `0x30ed86a25620d448c5ca29ea9b0d75a2cf3fe5d3113d5f05e763ceb792343dbd` |
| 2584 | BUY | 14 | EMPTY → PUSH | 25661695 | `0x93795ca7b966d947cee2f74251440c671f5acb5641cccfd283670c4b101bce01` |
| 2585 | SELL | 8 | LOOP → SWAP | 25661709 | `0x42e0e14eab8b5bb4b14ae206317bbdfe323f6008a9f45f571346d7bc8d5e5fb2` |
| 2586 | SELL | 6 | SWAP → PUSH | 25661711 | `0xdc56fb3d65bce6a64f8e02c7f1ccf493bc615ab6da9ce50d82b32975eddbb457` |
| 2587 | SELL | 0 | LOOP → SWAP | 25661729 | `0x2ba6a5529a4aa2d45d9618b1bcacd734d6b3bb3f96eee77047649b702e6da2f0` |
| 2588 | SELL | 7 | EMPTY → LOOP | 25661730 | `0x935715e87c334fd3d66cb7ea6cf38b428a2a7d619725a021d29595bbe4864223` |
| 2589 | SELL | 9 | PUSH → EMPTY | 25661761 | `0xf2fe4227ff47ca507f533bf21336bc52d51f3c2391b3683074ac535f9d5eb126` |
| 2590 | SELL | 13 | LOOP → SWAP | 25661764 | `0x4994c9fe62154f5d12c81f4dc1ece9778ca4f3910bdf3fb7ac3dee7826d38be4` |
| 2591 | SELL | 10 | SWAP → PUSH | 25661765 | `0xc42afc9b8d4749e7383d505718ebef43cf6cc2e73432ee7d821523e328d5b678` |
| 2592 | SELL | 5 | LOOP → SWAP | 25661806 | `0x1a9e2e343b10bf569b1da19c05d858d41ac9e7d2ed283fe215248f09a19f1eb2` |
