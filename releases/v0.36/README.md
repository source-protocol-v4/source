# SOURCE v0.36

Finalized release 36 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.36 |
| Revision | 1184 |
| Packed state | `0xd3208a35` |
| Source Hash | `0x07201fe0516ca647a9a309e82e22e5d387f7f4776ac0e7d9b420a420bbfd7251` |
| Previous Source Hash | `0xa3911318b8ab937aa0d82bcb96ba80638e758e2d87d6ec2e4f6049baa7ff61dc` |
| Buys | 23 |
| Sells | 9 |
| Changes | 32 |
| Finalized block | 25655919 |
| Finalization tx | `0x89667ab836dbd7857004b926b280ba26177af0eb3d1f082adaaa070174df821e` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | PUSH |
| 1 | PUSH |
| 2 | LOOP |
| 3 | EMPTY |
| 4 | SWAP |
| 5 | SWAP |
| 6 | EMPTY |
| 7 | SWAP |
| 8 | EMPTY |
| 9 | EMPTY |
| 10 | SWAP |
| 11 | EMPTY |
| 12 | LOOP |
| 13 | EMPTY |
| 14 | PUSH |
| 15 | LOOP |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 1153 | SELL | 15 | PUSH → EMPTY | 25655834 | `0xe39ab3e47f0340e912acf3f567a5f074676797abdfe446a563b8777af3dd9637` |
| 1154 | SELL | 10 | EMPTY → LOOP | 25655836 | `0x5a73f81779abbb46ece74429174dc6ca0db7587adfb7a0c662dff3b4abd673c5` |
| 1155 | BUY | 7 | EMPTY → PUSH | 25655836 | `0x9bc31b07aed6973676be326a08ff37baf0178e43b3bff3d12bf8f6057bfb6272` |
| 1156 | BUY | 12 | LOOP → EMPTY | 25655836 | `0x3fb9c232237bc30662cc692d62843141e9dfb9ef3e52166f07516d33dbda03dd` |
| 1157 | BUY | 10 | LOOP → EMPTY | 25655837 | `0xe96559ff868ca2d6c25da32a5ed53dc6c3c737b935ae1f1a6fede73959d548e3` |
| 1158 | BUY | 5 | EMPTY → PUSH | 25655839 | `0x153918eb47b521199c5b4fdd3141553569a63e6498071be92380cc735a5ce684` |
| 1159 | BUY | 10 | EMPTY → PUSH | 25655839 | `0xb25a7c902ad9c5e40ebae6e3776e12f5c91393c6b44f3b13164acef8fdffe772` |
| 1160 | BUY | 0 | PUSH → SWAP | 25655839 | `0xce61d16db3ba22fc06e72c0883f3f3c0b2d48322a68df6442a96a8b0b22bbc22` |
| 1161 | BUY | 8 | SWAP → LOOP | 25655839 | `0x39dfaac02a7f2680b9e696f5f9623607922c7ede43c7c6b4c312fdfc43cd054e` |
| 1162 | BUY | 2 | PUSH → SWAP | 25655839 | `0x074e8988f149f176f4db17336f1bca8e1f6fdf48c35aa6b69d4c039df2e5e4fc` |
| 1163 | SELL | 2 | SWAP → PUSH | 25655840 | `0x78fb1a42a788b8a95b5d87f06e3fa174e8ea6cd70aff12a7e9dd3330aa3a7b96` |
| 1164 | BUY | 2 | PUSH → SWAP | 25655842 | `0x3973a3dbc5584c539bb754789bc4d3b8eb217e85fd281c44719cacaf1ba2e332` |
| 1165 | BUY | 1 | EMPTY → PUSH | 25655846 | `0x2eb3fc3e8e9ad75ccf9397f8d2b721350dba181d6bf074b9865869636de735de` |
| 1166 | BUY | 9 | SWAP → LOOP | 25655852 | `0x0d34065c46eecc4dc328def74a76063ef7ca4cd5fcf9df2d603dcc05bf46d743` |
| 1167 | SELL | 12 | EMPTY → LOOP | 25655856 | `0xbfe88eabcb63412844e88bca9497a956aaa023e8144495ed5e106f4a0d68feaa` |
| 1168 | BUY | 6 | SWAP → LOOP | 25655860 | `0x64436376f2c4793a2bbc71fbcefaa2c83c09b25730e179e880365f06d62f8a4e` |
| 1169 | BUY | 2 | SWAP → LOOP | 25655862 | `0xb79d59eac9a280db4371bb7da97ee2478b04e3aa3b2545b7e786f01bb413bf93` |
| 1170 | SELL | 12 | LOOP → SWAP | 25655864 | `0xc9107f499aa50a82cfc39e327f9ed50a74f2f3a7bad185e9ecc195affbda5ff8` |
| 1171 | SELL | 15 | EMPTY → LOOP | 25655864 | `0xe0698b8f724198467e225174a73dfbcbcb83e43b78b69f75a7f265ee90c3b064` |
| 1172 | BUY | 6 | LOOP → EMPTY | 25655865 | `0x550db3d5d04cbe8bc25f6bff93b106b4004ba8dc889bdb6434a56e4f4074affe` |
| 1173 | BUY | 10 | PUSH → SWAP | 25655866 | `0x7fa1883b497c58697bc98e561fe15d218722a0e79e938f538d975d826e6a7f51` |
| 1174 | BUY | 12 | SWAP → LOOP | 25655867 | `0x8576a1943879216cf799b5ded69b9ed844fa179fb343790386ddc096ec5fc9cf` |
| 1175 | SELL | 11 | EMPTY → LOOP | 25655869 | `0x370c081f59bbf4af27dc2f43f3203dc063490489d2adede15dc4595f12ff25ac` |
| 1176 | SELL | 0 | SWAP → PUSH | 25655873 | `0x3ad7da5d7ad55522d1c1d780fad8b29612e76c7e9d6b2dbfb1fef7298446f5ca` |
| 1177 | SELL | 3 | PUSH → EMPTY | 25655883 | `0x8ff4025f3337a700908a91f069b0094a73404bcdbc2e872bbcf34a277b415a31` |
| 1178 | BUY | 8 | LOOP → EMPTY | 25655887 | `0x8616feabb262addabc3e31e44d9be589d204a6f0ac016abcf2469066fbae0e9c` |
| 1179 | BUY | 11 | LOOP → EMPTY | 25655898 | `0x6f594acd5d594f53548482c79fc84221d822249c777cf25d206c55465c511801` |
| 1180 | BUY | 5 | PUSH → SWAP | 25655915 | `0xe8e7bf7ece2d275623b787f6e0a38672b2e9673da89946d1a650cb252852f10c` |
| 1181 | BUY | 7 | PUSH → SWAP | 25655916 | `0x63861be890fb82cf327e81164912e319862eb7e10271e46f1e46e73591372217` |
| 1182 | BUY | 13 | SWAP → LOOP | 25655918 | `0x904fb0c4192eafabc04a6a8a6d143ecf74630ee535b87add2c46c8faf6ef2067` |
| 1183 | BUY | 13 | LOOP → EMPTY | 25655919 | `0x4011f1e3a54dc9087210dae52799239e456d0fc522a2a8c99fd3de155a27d7f0` |
| 1184 | BUY | 9 | LOOP → EMPTY | 25655919 | `0x89667ab836dbd7857004b926b280ba26177af0eb3d1f082adaaa070174df821e` |
