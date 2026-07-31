# SOURCE v0.16

Finalized release 16 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.16 |
| Revision | 544 |
| Packed state | `0x42870e39` |
| Source Hash | `0xcb28a5ba763d7eae0c23bfb1036fe1340caad5ca8373f8765628b07de61fcc92` |
| Previous Source Hash | `0xcab7d3d6392dc6209d11b4ba8a083a049276f02807e16cbd5f81ca10e988c423` |
| Buys | 19 |
| Sells | 13 |
| Changes | 32 |
| Finalized block | 25654793 |
| Finalization tx | `0xe3174c723423e998cbc82484b08ef64c02853871ead8a1576b9d6fb04a5efbac` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | SWAP |
| 2 | LOOP |
| 3 | EMPTY |
| 4 | SWAP |
| 5 | LOOP |
| 6 | EMPTY |
| 7 | EMPTY |
| 8 | LOOP |
| 9 | PUSH |
| 10 | EMPTY |
| 11 | SWAP |
| 12 | SWAP |
| 13 | EMPTY |
| 14 | EMPTY |
| 15 | PUSH |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 513 | SELL | 10 | PUSH → EMPTY | 25654775 | `0x1975cfbc01f274d62934940398c7c0c5a8dc2a7addaa0a7efcb74b7dbd6bfcb9` |
| 514 | BUY | 2 | PUSH → SWAP | 25654775 | `0x3ecf4653192cfb0759082fbf4a8a38304b19e6f3a263f77e994536d5cb7bbe21` |
| 515 | SELL | 12 | LOOP → SWAP | 25654777 | `0x985c93c4e8a2e2bd145d0f5f30bcbd5cc9f7b3fa26e8d7795536428e48430693` |
| 516 | BUY | 4 | PUSH → SWAP | 25654777 | `0x8c6ec1e88cf035db4f8c7900306c7a51d3c24ceae049e8fe1736843ba2eef4ca` |
| 517 | SELL | 0 | SWAP → PUSH | 25654777 | `0x5b30ad1d852d8951c2dc5c25b42500b9f77e6a580441b8dd9198816eead6ace9` |
| 518 | BUY | 4 | SWAP → LOOP | 25654777 | `0x0ab8e6bc7ccc91aa9d0d0acaffb388ef3306075e6783f035319206f2b34a835e` |
| 519 | BUY | 12 | SWAP → LOOP | 25654777 | `0xbb20812f672e811640b4647a23094cd96053ee3db307162eb4ab915d6630e123` |
| 520 | BUY | 14 | SWAP → LOOP | 25654779 | `0x7794eafeb526787ce96a382b46b4754e54826951277a2b3c9e7141ccbc841049` |
| 521 | SELL | 0 | PUSH → EMPTY | 25654779 | `0xe901dd827eccc23747f8e6ed5ee64b5ec813e5a6a6f4c4f944fd4085a3af1e41` |
| 522 | BUY | 14 | LOOP → EMPTY | 25654779 | `0xaf8b9c180461da52be774b1e56c191c5a7169d3550da49fdaf71b519202ad83a` |
| 523 | SELL | 1 | LOOP → SWAP | 25654781 | `0x77ca9598f55e415806a6b4ecf6e04b9af73ca3fbd882ca2ef11eaa52019b8e71` |
| 524 | BUY | 4 | LOOP → EMPTY | 25654781 | `0x4bea03b46cf9e116fd490eeaab4f977166999629e21e8bd006f076920d545a8a` |
| 525 | BUY | 3 | SWAP → LOOP | 25654781 | `0xc22c40df166c54388ea9578f99f4216367bae2b61c8a7342696f0c104059f171` |
| 526 | SELL | 11 | SWAP → PUSH | 25654783 | `0xe19b718e0647897f962ec5eafb9cc3eccc150ac615ba4a9a5de7229b48ed8dce` |
| 527 | BUY | 2 | SWAP → LOOP | 25654783 | `0x3fe0a4ef2b43832f86476c0a00fb095bf3e0c2e646a05e1262ab789339ebfc79` |
| 528 | BUY | 4 | EMPTY → PUSH | 25654783 | `0x743a066d1481fa6ab42791f0a4685c9c6bb16754cc3a8b86b0e054cc6c7fad11` |
| 529 | SELL | 13 | PUSH → EMPTY | 25654784 | `0x5a81237ea02929d7becf6c3559faa39b8de07d53c453adea066fcb77f0774f68` |
| 530 | SELL | 11 | PUSH → EMPTY | 25654785 | `0xa66bdafdcf40949c337427943bbaa34287372808b42770c76c7698371772463b` |
| 531 | SELL | 12 | LOOP → SWAP | 25654785 | `0xa7ed922ee6e19c7d3eda0f6c66833393e6ec73c818cf38ee78bb38dc2eac588a` |
| 532 | BUY | 9 | SWAP → LOOP | 25654786 | `0x2a53f383893817127804e4df6e5d4bdb13f3147f0957106ac5e94cfd26934566` |
| 533 | BUY | 5 | LOOP → EMPTY | 25654787 | `0xc8ede11e6cb53295f5b8b1049e665cb72feef6725c079c6a36ddf7d11892cb56` |
| 534 | SELL | 5 | EMPTY → LOOP | 25654788 | `0xc1b644c7936f89de0cd5960b1d2d6436a40561de9157291d6554f91b96e031e7` |
| 535 | SELL | 1 | SWAP → PUSH | 25654789 | `0xa76194e36e33258fdfe818b4f9034142efc35333e8e092b076ecdc0bd69b9410` |
| 536 | BUY | 15 | EMPTY → PUSH | 25654790 | `0x5fa932d9e964e9299de9f64905dfd3a54669902781bc5b38f6a32f45745a25f6` |
| 537 | SELL | 11 | EMPTY → LOOP | 25654790 | `0x099fe1dfb04c5f9e38b420fadf2ddf7eec5d55dad5ce89f31c70e3c139297b70` |
| 538 | BUY | 4 | PUSH → SWAP | 25654791 | `0x0f3f1dd1d2e72364039942f80aaea04aefd94fdc3096917478436c9f4bbbbd9c` |
| 539 | SELL | 11 | LOOP → SWAP | 25654791 | `0x310dc8382f950f572c8908b75959e5c89e3597007f135db64d5d468da39bbfd9` |
| 540 | BUY | 9 | LOOP → EMPTY | 25654792 | `0xbdab4ec199ba61c6fd2230258d1b81259b5643f1297734baad6081f6269357ba` |
| 541 | BUY | 0 | EMPTY → PUSH | 25654792 | `0x98da5ef31e905caba8876aeb024e13a04305baa52bd82e6ad29a3023df313d63` |
| 542 | BUY | 3 | LOOP → EMPTY | 25654792 | `0x5b2537254b176c40cef03011f4e7daf5f7575aece903d4d46309c077adb3271c` |
| 543 | BUY | 1 | PUSH → SWAP | 25654793 | `0x8802058f7631f1000136c0ae811ab3e4f57a111760c57416495ea1642354ab6d` |
| 544 | BUY | 9 | EMPTY → PUSH | 25654793 | `0xe3174c723423e998cbc82484b08ef64c02853871ead8a1576b9d6fb04a5efbac` |
