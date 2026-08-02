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

**106 releases mirrored.** Newest first.

| Release | Program | Revision | Buys/Sells | Block |
| --- | --- | --- | --- | --- |
| [v0.105](v0.105/) | `▒░██░█▒▒▓█░▒▒█░▓` | 3392 | 25/7 | 25669568 |
| [v0.104](v0.104/) | `░░▓▓▓█▒█▓▒▓▒░█░░` | 3360 | 14/18 | 25669363 |
| [v0.103](v0.103/) | `██▒░███░▒▒█░█▒░▒` | 3328 | 21/11 | 25668759 |
| [v0.102](v0.102/) | `█▒░█▓▓█▒▒▒░▓▓░░█` | 3296 | 13/19 | 25668697 |
| [v0.101](v0.101/) | `▓▓░▒▓█░▓▒▓░█▒▒▒▒` | 3264 | 16/16 | 25668657 |
| [v0.100](v0.100/) | `▓▓▒▓▓███░▓▒░░▒█▒` | 3232 | 20/12 | 25668630 |
| [v0.99](v0.99/) | `▒▓██▓▓▒░░▒░▒▓░▓▓` | 3200 | 20/12 | 25668605 |
| [v0.98](v0.98/) | `░░░█░▓░░█▒░░░░▒░` | 3168 | 17/15 | 25668253 |
| [v0.97](v0.97/) | `░▒▒█▒░░░██▓░░▓░░` | 3136 | 18/14 | 25667871 |
| [v0.96](v0.96/) | `█░░██▒▓███▓░▓▓░▒` | 3104 | 19/13 | 25667317 |
| [v0.95](v0.95/) | `█░█░█▒█▓░█▓░▒░░▒` | 3072 | 20/12 | 25666877 |
| [v0.94](v0.94/) | `▓█▒▓░▓▓█░▓░▒░░▒█` | 3040 | 13/19 | 25666542 |
| [v0.93](v0.93/) | `██▓░██░█▒▓▓▒▒▒▒▓` | 3008 | 28/4 | 25666288 |
| [v0.92](v0.92/) | `█▓░█░▒░░▒░▒▒█░█▓` | 2976 | 19/13 | 25665930 |
| [v0.91](v0.91/) | `▓▒▓▓░░▒▓▒▒░░▒█▓░` | 2944 | 16/16 | 25665492 |
| [v0.90](v0.90/) | `▒█▓▓░▒▒██▓▓▒▒█▓█` | 2912 | 13/19 | 25665365 |
| [v0.89](v0.89/) | `▓░▒▒▒▒▓▒▒▒▒▒░░█░` | 2880 | 24/8 | 25664840 |
| [v0.88](v0.88/) | `▓░▒░▓░█░▒▒░▓░▓▓░` | 2848 | 17/15 | 25664647 |
| [v0.87](v0.87/) | `▓█▓▓▓▒▓█▓████░▓▒` | 2816 | 17/15 | 25664127 |
| [v0.86](v0.86/) | `█░█░▓▒██▒▒█░█▒█▒` | 2784 | 17/15 | 25663294 |

<sub>86 older releases not shown — see [HISTORY.md](HISTORY.md) for the full list.</sub>

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
