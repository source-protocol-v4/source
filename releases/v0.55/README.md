# SOURCE v0.55

Finalized release 55 of the Living Source program, mirrored from Ethereum chain 1
and verified independently from the contract's own `SourceChanged` events.

| Field | Value |
| --- | --- |
| Release | v0.55 |
| Revision | 1792 |
| Packed state | `0x3ed5a27f` |
| Source Hash | `0x2f9240570a5279b58fefec87c67d0430a5ea909c9642d0b94489ebdd04f62706` |
| Previous Source Hash | `0x77bdbe7e1ddbe768797e17ab5afb3c81463f273dfb0f2b32a1f73d3776e5e49b` |
| Buys | 17 |
| Sells | 15 |
| Changes | 32 |
| Finalized block | 25656778 |
| Finalization tx | `0xc2edca8d5bf70a47801874030365c34e21b0ed050e84f00889c79d20113b4cb7` |
| Contract | `0x65c0E98a4fE050e64E16754119C76EEbd4E660cc` |
| Required confirmations | 20 |
| Verified | yes |

## Program

| Slot | Instruction |
| --- | --- |
| 0 | LOOP |
| 1 | LOOP |
| 2 | LOOP |
| 3 | PUSH |
| 4 | SWAP |
| 5 | EMPTY |
| 6 | SWAP |
| 7 | SWAP |
| 8 | PUSH |
| 9 | PUSH |
| 10 | PUSH |
| 11 | LOOP |
| 12 | SWAP |
| 13 | LOOP |
| 14 | LOOP |
| 15 | EMPTY |

## Changes

All 32 changes in blockchain order.

| Revision | Direction | Slot | Transition | Block | Transaction |
| --- | --- | --- | --- | --- | --- |
| 1761 | SELL | 8 | PUSH → EMPTY | 25656680 | `0x98e698d2e61247b906b04788d5a0fbfd490cfec2ffca3cc13f1c0cd9b7706d10` |
| 1762 | SELL | 7 | LOOP → SWAP | 25656684 | `0x9d8d97f5b3b0cd33004fadace873eff83aec54cc4b7812a5154c98b44ddcb87e` |
| 1763 | SELL | 13 | LOOP → SWAP | 25656685 | `0x995dee3c81aa3acf991a55a1aac5569876f631fb8ccf575acc9cb7170e4b7ea4` |
| 1764 | SELL | 13 | SWAP → PUSH | 25656688 | `0x51e6a38352c629dc60512795174de91de7db3e074e8b7a57abff3cb9def98ac2` |
| 1765 | SELL | 8 | EMPTY → LOOP | 25656689 | `0xe501996b6d3fdc37732516316256cdfd1f57ee1ca803ccd4c3e171276a0d69d6` |
| 1766 | SELL | 13 | PUSH → EMPTY | 25656691 | `0xbed49a54fe3f4a317e019e020805de7029f76e2108fc9e75abbf3445fb33bfd9` |
| 1767 | BUY | 12 | PUSH → SWAP | 25656691 | `0xcad4fd2c59f14ac3fff10fc5f375dc62de26e499f1e9b59f192a7dd281b72022` |
| 1768 | BUY | 14 | SWAP → LOOP | 25656695 | `0x4f97643dcea4a1505cc3c05c1c33e1b8cb536fcde3c47260920cf38f5f61e9ee` |
| 1769 | BUY | 7 | SWAP → LOOP | 25656699 | `0x11ae36069e3404855a04cc48f78b8bd76a48099587064dfbfc52efd9b706d762` |
| 1770 | SELL | 5 | PUSH → EMPTY | 25656720 | `0xd482d6d883b326bd0d2556f9966c00886b47f30e1c9b50f098ccc46f8b1bf572` |
| 1771 | BUY | 6 | EMPTY → PUSH | 25656720 | `0x91c208e944965a4a21ed17a7d449a9a178556395c1143ef26e1db9637af8b343` |
| 1772 | SELL | 7 | LOOP → SWAP | 25656721 | `0x31ada75b6fc64e94f3db989a49aa0d1f947f2398e4b9307bc95b6f186d8ab352` |
| 1773 | SELL | 0 | EMPTY → LOOP | 25656722 | `0xaa901b5cc404e4977a37772d4f26a3f72a11e6c1041aab47c06933b5eda76a4b` |
| 1774 | BUY | 10 | LOOP → EMPTY | 25656723 | `0x7cc0ba7e299653c7eb57e2f458e55c93de638784e7c2effdf090ee6c4a067cc5` |
| 1775 | BUY | 3 | EMPTY → PUSH | 25656724 | `0x4c6fcdd941e11d592c3a70c4068346905402736d81eda6ce24fce70503e7bfad` |
| 1776 | BUY | 9 | PUSH → SWAP | 25656724 | `0x1e16f59f60787475412c9a633ac6d524ed6ca4b67ba081ed85d2ed4a56441c57` |
| 1777 | BUY | 3 | PUSH → SWAP | 25656724 | `0x61486b0287453d95df4f8e9b1a78aedd4b7aae46d10d94d7e427a4eda782d2df` |
| 1778 | BUY | 6 | PUSH → SWAP | 25656724 | `0xfffb6b47eb6f27e4d2c18a760743cdd5f09602011e83e43122651fd8d2e7e3a1` |
| 1779 | SELL | 1 | EMPTY → LOOP | 25656725 | `0x5284afd3f1ced1911aa2360e8d80aa05a041818b46f0c9c92efe991df7f3fb12` |
| 1780 | BUY | 13 | EMPTY → PUSH | 25656725 | `0xec627d12c26635bb8e8639b9b67e5214e539cf1c2124663c0f1387faffa7d4ae` |
| 1781 | BUY | 13 | PUSH → SWAP | 25656726 | `0x2894242ed4923a6d834c68d1573be0fa2c94fefd187d7c8d36f6655f0f0ccaf4` |
| 1782 | BUY | 8 | LOOP → EMPTY | 25656728 | `0xeff42e50123018e71e6fed65e103fbb36df184d213aefb25b9b82bfefb731b47` |
| 1783 | BUY | 13 | SWAP → LOOP | 25656729 | `0xce5d27d7af268c947ae1deb2dd201418c3f5dc9649c8f7c88ea371e0f3961291` |
| 1784 | BUY | 7 | SWAP → LOOP | 25656736 | `0x1ff6ad03483933d3c35d2ca3da0d427bc90efbfbae946bf1bd77f93128a1ab3e` |
| 1785 | BUY | 10 | EMPTY → PUSH | 25656736 | `0xa5fc5b0467b1f0312e13eb82781bab4f9f9ccedea367940f6cfb3624153b2191` |
| 1786 | SELL | 3 | SWAP → PUSH | 25656737 | `0x2a21e946579169b651cfce06cc2a3088d1b593742bcd8db44721b42843ca7e1e` |
| 1787 | BUY | 8 | EMPTY → PUSH | 25656747 | `0xdb4d3a24fe751ffd3abf0b86b4190fd4e6813fb26df0506e9e775c8c978f029c` |
| 1788 | SELL | 9 | SWAP → PUSH | 25656760 | `0xcef395dc0adde120b050c5157f0d1f608e6bddc5326f786068efb592b41fe28d` |
| 1789 | SELL | 11 | PUSH → EMPTY | 25656763 | `0x5727a54bb98a271ee604ae20e428983890c81d5675b0dbeaa927994ecb5f31dd` |
| 1790 | BUY | 2 | SWAP → LOOP | 25656770 | `0x4000c6c39a1a0b3cecdc2c4ffda4e9f70bb3397275e4a79ee81c2938ac881728` |
| 1791 | SELL | 7 | LOOP → SWAP | 25656772 | `0x0ea7448ff17c94775b5587b10aef648418696c3e999b8802cee9fd5e90eb6862` |
| 1792 | SELL | 11 | EMPTY → LOOP | 25656778 | `0xc2edca8d5bf70a47801874030365c34e21b0ed050e84f00889c79d20113b4cb7` |
