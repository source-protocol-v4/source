# SOURCE v0.60

Finalized release 60 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.60 |
| Revision | 1952 |
| Packed state | `0x78e14ee3` |
| Source Hash | `0xc341bb5ae253cd5bd060b04f45b5d959f27e1510514f6a6a9d82c41520a30653` |
| Previous Source Hash | `0x5aeeb8c1e512a4a20579a9e27bc912e05e5f640f4b76d8ae672e01b29927eb3b` |
| Buys | 23 |
| Sells | 9 |
| Changes | 32 |
| Finalized block | 25657705 |
| Finalization tx | `0x554cfb91ffcc3aa8c8d0c5397bf20f7f56d0807f8bfdffc6ebc5d025f52d426f` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | LOOP |
| 1 | EMPTY |
| 2 | SWAP |
| 3 | LOOP |
| 4 | SWAP |
| 5 | LOOP |
| 6 | EMPTY |
| 7 | PUSH |
| 8 | PUSH |
| 9 | EMPTY |
| 10 | SWAP |
| 11 | LOOP |
| 12 | EMPTY |
| 13 | SWAP |
| 14 | LOOP |
| 15 | PUSH |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 1921 | BUY | 11 | SWAP → LOOP | 25657532 | `0x4073f5153318f8b6525a631f36de2693d0012a482f400a544b21fdb9377b3961` |
| 1922 | BUY | 9 | LOOP → EMPTY | 25657541 | `0xa671ddd04f5db42f9613438377f6c88150805cc8da43437937c58c9bc3427386` |
| 1923 | SELL | 13 | PUSH → EMPTY | 25657544 | `0x6e62132326a37443a367609f666a30c1a496e133f13366e0438d892f20ed47a3` |
| 1924 | BUY | 1 | SWAP → LOOP | 25657547 | `0x06ea31fb8b191584f94481df75d0e5333725f730494258eaac8c3b98c292fcc9` |
| 1925 | BUY | 7 | SWAP → LOOP | 25657548 | `0xe979ad3a2e61db2a3cd611fa370ee99580e7215aed17b5a249ff5cd32f6f5b50` |
| 1926 | BUY | 14 | SWAP → LOOP | 25657554 | `0xbc9289869914a6bc395c5f4736c11d46361faf6d9d340e1334ba02ebd017f87e` |
| 1927 | SELL | 13 | EMPTY → LOOP | 25657557 | `0xc1ae9b846ddf5ad965432ac3fdef863afdcc4acc5af1b1fd5785bfb9574866db` |
| 1928 | BUY | 5 | LOOP → EMPTY | 25657557 | `0xf35452659571caf455f8d3120a5dfbb70b49d87baac7544f2390e3e33eea7cd3` |
| 1929 | SELL | 4 | LOOP → SWAP | 25657558 | `0x3ca485cbcf05fe2b6c3d469070d4d8bb85e6a843cb8af9ae5f40654f3631b4ee` |
| 1930 | BUY | 7 | LOOP → EMPTY | 25657558 | `0x626102a2e61cfd6ed6ab413c1eacdc11cca227a8e1d678df98dbc41aacce8b3a` |
| 1931 | BUY | 15 | EMPTY → PUSH | 25657560 | `0xb2fd5f6200b9d134d07428a29bbe408af4d9f07f7732d0f186f84b97e4a236cc` |
| 1932 | BUY | 8 | LOOP → EMPTY | 25657564 | `0xc1b8adc618fca840f62b443283d196c1da666fca5ee804609740a15577e761d9` |
| 1933 | SELL | 6 | LOOP → SWAP | 25657564 | `0xe73f719eb6a691bb12bb7c1466a45022e085c3c0053bbfebe753e3698b53e4e5` |
| 1934 | SELL | 5 | EMPTY → LOOP | 25657589 | `0xf3e488d0b589110a65d3b6ee104c01c9d31b810595027dba4397b6972fe05471` |
| 1935 | SELL | 9 | EMPTY → LOOP | 25657594 | `0xf2daea2c50e6101dde5046b7225b6d1d6a1e434c67401179cfac991c23d74e9c` |
| 1936 | BUY | 9 | LOOP → EMPTY | 25657620 | `0xc7604ec4c7da38afa55bcf063d138ecc43bab7c2b2c298629175a909c244e3b8` |
| 1937 | BUY | 7 | EMPTY → PUSH | 25657628 | `0x11bfac93843d42aab587c8eedc7b6bc99c4a011cdf77c325e292e8f050a6ca29` |
| 1938 | BUY | 8 | EMPTY → PUSH | 25657631 | `0xae1b4ced7c91621d44af5d68f1de00cebcac0d325de818dd02c35ee356cc1495` |
| 1939 | BUY | 0 | EMPTY → PUSH | 25657650 | `0xf5aa00047f0dd138a97b621dfe630c717a6622cd539f8fc42e7890a9d7c563f5` |
| 1940 | BUY | 1 | LOOP → EMPTY | 25657650 | `0x039ef0acebfe0f5756be07ed454c429c808649ef46db5d3906384851c2199a2d` |
| 1941 | BUY | 2 | EMPTY → PUSH | 25657650 | `0x8cdd7650834c17d08e6706f7a915ccfdf184d932e3b835e5da5a5d451eb5fe9c` |
| 1942 | SELL | 13 | LOOP → SWAP | 25657650 | `0xe09cef2ff0cf40322c5cecdd5fef8a010c41b611aa816601099d210cf8030be0` |
| 1943 | BUY | 0 | PUSH → SWAP | 25657654 | `0x70947d6c3b27aca1d9b19dcdc6b7dee50cd30614450dc18d9dd302ad0cf3d658` |
| 1944 | BUY | 6 | SWAP → LOOP | 25657654 | `0x82fbe4afa161e02d1fd252bab5123db986d34eceb8d658598d964f1b9fbd65a9` |
| 1945 | BUY | 6 | LOOP → EMPTY | 25657663 | `0x9dfa7c9ba53254bfd1e9c173f3594b6673c4a9cc90a884d7837339690a912ae6` |
| 1946 | SELL | 7 | PUSH → EMPTY | 25657678 | `0x1668bec3470ee8d2b4a1d633f23c9a343ec2ba88b3ec8bc60b1172baa2581414` |
| 1947 | BUY | 12 | LOOP → EMPTY | 25657681 | `0x8b4ae35e5078d295e3cd0747849b7eb4c0564df0fed2991c766d041a0e0627c9` |
| 1948 | BUY | 7 | EMPTY → PUSH | 25657683 | `0x5a03264cc18c4b5bfe162b31ef279237085117ee7b4bb2cbfdc276e8271eacc4` |
| 1949 | BUY | 2 | PUSH → SWAP | 25657690 | `0xca3ba7aa3ae8734fc317c4460f50df870f03bf7564b82e46921a7350379fc3b8` |
| 1950 | BUY | 3 | LOOP → EMPTY | 25657692 | `0x8d074ca2396fa2ca1239be29c1cee67658c34e37c0c062d6cf6df082944c5fe1` |
| 1951 | SELL | 3 | EMPTY → LOOP | 25657693 | `0x99c740fcc857b5e7c58b2e29f9595d4a05fbdc37f7111fb97f21e1b461f0d534` |
| 1952 | BUY | 0 | SWAP → LOOP | 25657705 | `0x554cfb91ffcc3aa8c8d0c5397bf20f7f56d0807f8bfdffc6ebc5d025f52d426f` |
