# Releases

One folder per sealed SOURCE release. Open any of them and start with its `README.md` — it renders
as a page right here on GitHub.

Folders are named `v0.0`, `v0.1`, `v0.2` and so on. **Numbering starts at 0**, so the first release
is `v0.0`.

## What a release is

The SOURCE contract carries a program of sixteen instructions. Every large trade rewrites one of
them — a buy moves an instruction forward, a sell moves it back. After thirty-two changes the
program is sealed and becomes a release, permanently recorded on the blockchain.

Release `0` covers the first thirty-two changes, release `1` the next thirty-two, and so on.

These files sit alongside the release folders and are refreshed whenever a new release is mirrored:

| File | What it is |
| --- | --- |
| [`latest.json`](latest.json) | the newest release, at a fixed path — handy for scripts and badges |
| [`HISTORY.md`](HISTORY.md) | every release in one table, oldest first |
| [`STATS.md`](STATS.md) | tallies across every change: slots, buys/sells, traders |
| [`program.svg`](program.svg) | the current program as an image |

<!-- SOURCE:BEGIN -->

**122 releases mirrored.** Newest first.

| Release | Program | Revision | Buys/Sells | Block |
| --- | --- | --- | --- | --- |
| [v0.121](v0.121/) | `▓░█░█▒░▒▒▒█░▓▓▒▓` | 3904 | 18/14 | 25679644 |
| [v0.120](v0.120/) | `█▒░▓▒░░░▓▒░▒███▓` | 3872 | 18/14 | 25678412 |
| [v0.119](v0.119/) | `▓▓█░▓█░█░▓▓░▓█▒▒` | 3840 | 12/20 | 25677255 |
| [v0.118](v0.118/) | `█▓░▓▒▓░▒░▒▒▒▒█▓▓` | 3808 | 14/18 | 25675722 |
| [v0.117](v0.117/) | `▒░████▓░░██▒▓██░` | 3776 | 19/13 | 25674417 |
| [v0.116](v0.116/) | `▒▓▓░█▓▒▒░▓▒█░██░` | 3744 | 26/6 | 25674012 |
| [v0.115](v0.115/) | `█▒░██▒░░░░░░▓▓▒░` | 3712 | 19/13 | 25673421 |
| [v0.114](v0.114/) | `▒▒▒▓▓▒▒░░▒▒░▒▒█▓` | 3680 | 20/12 | 25673091 |
| [v0.113](v0.113/) | `░▓█▓▓▒█▓▒▓█████▒` | 3648 | 23/9 | 25672428 |
| [v0.112](v0.112/) | `▓▒█▒▒▒▓░░░░▓░▒▒▒` | 3616 | 16/16 | 25672228 |
| [v0.111](v0.111/) | `░▓█▓░▒█░░▓░▒█▒░▓` | 3584 | 19/13 | 25672113 |
| [v0.110](v0.110/) | `█▒▒█░▓▓▒▒░▒▒░█░█` | 3552 | 19/13 | 25671649 |
| [v0.109](v0.109/) | `▒▓█░░▓▓░▓░▒▒░▒▓█` | 3520 | 27/5 | 25671125 |
| [v0.108](v0.108/) | `░██▓░▒▓▓░█▓▒▒░░▓` | 3488 | 23/9 | 25670990 |
| [v0.107](v0.107/) | `░▒▒▓█▒▒░▒▓▒▓███░` | 3456 | 22/10 | 25670816 |
| [v0.106](v0.106/) | `▓░▒░▓▒▒▓▓▒██░█▓▒` | 3424 | 18/14 | 25670651 |
| [v0.105](v0.105/) | `▒░██░█▒▒▓█░▒▒█░▓` | 3392 | 25/7 | 25669568 |
| [v0.104](v0.104/) | `░░▓▓▓█▒█▓▒▓▒░█░░` | 3360 | 14/18 | 25669363 |
| [v0.103](v0.103/) | `██▒░███░▒▒█░█▒░▒` | 3328 | 21/11 | 25668759 |
| [v0.102](v0.102/) | `█▒░█▓▓█▒▒▒░▓▓░░█` | 3296 | 13/19 | 25668697 |

<sub>102 older releases not shown — see [HISTORY.md](HISTORY.md) for the full list.</sub>

<!-- SOURCE:END -->

## What is in each folder

| File | What it is |
| --- | --- |
| `README.md` | the release in plain language — **start here** |
| `source.src` | the sixteen instructions, one per line |
| `release.json` | the release's key facts, machine-readable |
| `changes.json` | all thirty-two changes, in the order they happened |
| `proof.json` | where to find this release on the blockchain |

### `source.src`

The final program, one line per slot:

```
00: PUSH
01: SWAP
02: EMPTY
...
15: LOOP
```

Lines starting with `#` are a header noting the release, its state and its hash.

### `changes.json`

The thirty-two changes that produced the release, each with the trade direction (`BUY` or `SELL`),
which slot changed, what the instruction was before and after, and the transaction it happened in.

You can spot-check any of them: a `BUY` always moves an instruction forward through
`EMPTY → PUSH → SWAP → LOOP → EMPTY`, and a `SELL` always moves it back.

### `proof.json`

The transaction, block and event that sealed the release — enough to find it on Etherscan or any
other block explorer and confirm it independently.

## Where these files come from

They are generated from Ethereum, never written by hand. A release is saved only after all
thirty-two of its changes have been replayed from scratch and the result matches what the contract
sealed — the program, the counters and the chained hash all have to agree exactly. If anything
disagrees, nothing is written.

Releases already here are never rewritten.

See the [main README](../README.md) for what this mirror is.
