# SOURCE v0.57

Finalized release 57 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.57 |
| Revision | 1856 |
| Packed state | `0x53d259da` |
| Source Hash | `0xd153b144100360cc67803c5c41831c543fbdf6c533aa2f8c57b0364da071b646` |
| Previous Source Hash | `0x5c5a2dfb63f0ca292b65a869b42408f305bfbdf1b491ffb7dd0939b8f0c45f06` |
| Buys | 16 |
| Sells | 16 |
| Changes | 32 |
| Finalized block | 25656970 |
| Finalization tx | `0x8218ccc4821736d9438c54780c15bacba4564a1d72d3c14d45672863e129121b` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | SWAP |
| 1 | SWAP |
| 2 | PUSH |
| 3 | LOOP |
| 4 | PUSH |
| 5 | SWAP |
| 6 | PUSH |
| 7 | PUSH |
| 8 | SWAP |
| 9 | EMPTY |
| 10 | PUSH |
| 11 | LOOP |
| 12 | LOOP |
| 13 | EMPTY |
| 14 | PUSH |
| 15 | PUSH |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 1825 | SELL | 0 | LOOP → SWAP | 25656888 | `0x5b4dd46b8800aff201b8e0ce6886b8400d7265f0d5585839e609bc767e442a6e` |
| 1826 | BUY | 6 | SWAP → LOOP | 25656895 | `0x65c0bcfe8b0a0f01f341cbe1bc4111e312cc50a941f09a4d5e89a5c95d6b9d01` |
| 1827 | BUY | 6 | LOOP → EMPTY | 25656896 | `0x98c2e05334174adc816b2e2272339861ccc7f24530a6aaa274ba8794c184b87a` |
| 1828 | BUY | 13 | SWAP → LOOP | 25656900 | `0x5568554021c462bcb614ca8126c9ddcd3473ba668061ce52b4edffaa709d0538` |
| 1829 | SELL | 3 | PUSH → EMPTY | 25656902 | `0x2d41135465dab426ca671944fee9db014b8e3652a8c2fbb8138a31b59bd22a18` |
| 1830 | BUY | 12 | PUSH → SWAP | 25656904 | `0x117a3069102198b51b6c729dbe595cb4e1d186ff8bb1dd04f9728208d8c726f6` |
| 1831 | BUY | 6 | EMPTY → PUSH | 25656906 | `0x0d95c83a4906f8c5922b98a5e230ab4b4553aafc309247ed8088b38758c8f821` |
| 1832 | SELL | 5 | LOOP → SWAP | 25656906 | `0xbf74fced4db682eede6f1ad155fb4a507ee0aaf94057c781e6db1ce6b80e8f9f` |
| 1833 | SELL | 3 | EMPTY → LOOP | 25656906 | `0x72d784b3d95eb3ff675d1895e09cf15eac0f299cb98763e6f41b4a75d43a6e2c` |
| 1834 | BUY | 15 | PUSH → SWAP | 25656906 | `0x965efcbd039c70ece7ff8dbc1c2bf10d5f6d11b47d211a04a59dfb2c0a60bd1c` |
| 1835 | SELL | 1 | EMPTY → LOOP | 25656906 | `0x7a7d29ce39c3cd7a99b16bd8fd6a2135741a09eaa0e1036df5660ed5dd41b1c0` |
| 1836 | BUY | 0 | SWAP → LOOP | 25656906 | `0xb4998c287e4f56b39f9a8e33240e07251951da44cca6cb0c184f87ece00cd3b6` |
| 1837 | SELL | 0 | LOOP → SWAP | 25656907 | `0x81c24530b93c21882467a46bc3239bacdc610eef714f8c23ca8ca8d2e9749c15` |
| 1838 | SELL | 10 | LOOP → SWAP | 25656908 | `0x080bbf3a3a325290452e684bbddc1683daf33ab136581064cf6d4df5de492adb` |
| 1839 | BUY | 4 | PUSH → SWAP | 25656908 | `0xaeb46dc5a7ba232c004caf04de4481a7d61e6831677c30b9495dc6e68709a9a1` |
| 1840 | SELL | 14 | PUSH → EMPTY | 25656908 | `0x2415b7a61f1fc8fdc5f57aa76e6f76cd5a28b87ea44c369fb317f57198cea0f0` |
| 1841 | BUY | 5 | SWAP → LOOP | 25656908 | `0xe42626294a25fcac7e46adc210f6ef5f3acd8587cb38e5e9e9dd370f4e4263fa` |
| 1842 | BUY | 12 | SWAP → LOOP | 25656911 | `0x209cd7449d2bce0ef6c7cc45247c3ff4a73039a647a50dbf63f5eb9e32c97e64` |
| 1843 | SELL | 8 | LOOP → SWAP | 25656917 | `0xaf372db3186bbb968988da21d198434dbde23e1ee781af20ab7d6bcc239fc38f` |
| 1844 | BUY | 14 | EMPTY → PUSH | 25656933 | `0xb9e1df323697f73a9ae938b92eef019e8e7dafe4e57baf55f94967725369d4dd` |
| 1845 | BUY | 7 | EMPTY → PUSH | 25656937 | `0xc4e8ec35b10c6be36d164bb27fea481754ce4e2a458d9aef3e994c46dfb4d6a1` |
| 1846 | SELL | 5 | LOOP → SWAP | 25656938 | `0x946229d75dccf1bcb9b1950a90ac832ebc34c0d97e0a204288e765549eaa7501` |
| 1847 | SELL | 6 | PUSH → EMPTY | 25656938 | `0xfdc559647fe203a23e74fa1ba7601954ea7104ebab80bd2d41be6d219c7c7905` |
| 1848 | BUY | 6 | EMPTY → PUSH | 25656939 | `0x1c87d6867c3675a85ce02bb6507b57baa7c5911e164ab132d78a15f697e3a7cb` |
| 1849 | BUY | 13 | LOOP → EMPTY | 25656943 | `0xf24ebec73242ece7740e1b8fdd0e68e68709a76b5a05e6b9f515ac605e577d30` |
| 1850 | SELL | 3 | LOOP → SWAP | 25656947 | `0xca9f3d2ba8d0abff3d65e960587659e7b2cb48750f66bf123db2682f385188b4` |
| 1851 | SELL | 15 | SWAP → PUSH | 25656947 | `0x4e39315b3100a2190b5bcf203e8291f3c69a697d181291e9751397956d6b546e` |
| 1852 | BUY | 3 | SWAP → LOOP | 25656948 | `0xacbc1d756e2a9283d151f139caa447be9cae3c7c156ed4b5e2d86cc50f4ed7e3` |
| 1853 | BUY | 2 | EMPTY → PUSH | 25656948 | `0xbd9e5d8237af04051ef624d53fb9e4f18a0191d1436dc20f4af76df69a440f0d` |
| 1854 | SELL | 1 | LOOP → SWAP | 25656951 | `0xb72659d60c8a67d6d2312487e0f85b0c7e98604ac5fc1ca2074731f6cbdc0f01` |
| 1855 | SELL | 10 | SWAP → PUSH | 25656968 | `0x83256c53dbd6bf495aea13c136c61a2f7119aade7bc7feb9164a8c5443728ed0` |
| 1856 | SELL | 4 | SWAP → PUSH | 25656970 | `0x8218ccc4821736d9438c54780c15bacba4564a1d72d3c14d45672863e129121b` |
