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

**78 releases mirrored.** Newest first.

| Release | Program | Revision | Buys/Sells | Block |
| --- | --- | --- | --- | --- |
| [v0.77](v0.77/) | `▒░█░░░▒▒░█░█░▓▓░` | 2496 | 20/12 | 25660737 |
| [v0.76](v0.76/) | `░▒██████▓██▓▒▒█▓` | 2464 | 23/9 | 25660474 |
| [v0.75](v0.75/) | `░█░█░▓▓██▓░░░▓▒▒` | 2432 | 15/17 | 25660261 |
| [v0.74](v0.74/) | `▓▒░▓░██░▓▒▒░██▓▒` | 2400 | 17/15 | 25660064 |
| [v0.73](v0.73/) | `░▓░▒▒▓▓▒▓▒▓░░█░▒` | 2368 | 10/22 | 25659923 |
| [v0.72](v0.72/) | `█░▒██▒██▓▓░████▒` | 2336 | 23/9 | 25659848 |
| [v0.71](v0.71/) | `▓█▒▒▓▒▒▒░▓█░▓▓█░` | 2304 | 16/16 | 25659753 |
| [v0.70](v0.70/) | `░█░▒▓▒▒▒▒▒▒▒▓▒░░` | 2272 | 16/16 | 25659683 |
| [v0.69](v0.69/) | `░█▒▓▒█▓▓▒▒░▓▓▒█░` | 2240 | 22/10 | 25659621 |
| [v0.68](v0.68/) | `█▓██▓██▓█▒░█▓█▓▒` | 2208 | 19/13 | 25659541 |
| [v0.67](v0.67/) | `█▒▓█████▒▒▓▓░▓█▓` | 2176 | 17/15 | 25659374 |
| [v0.66](v0.66/) | `▓▓▓░██░░░░█▒░▓▓░` | 2144 | 12/20 | 25659043 |
| [v0.65](v0.65/) | `▓█▒░▒█▓█▓░███░▓░` | 2112 | 18/14 | 25658889 |
| [v0.64](v0.64/) | `▓▓██▓░██▓▒███░██` | 2080 | 21/11 | 25658825 |
| [v0.63](v0.63/) | `▓▒░▓▓▓▓▓█░██▓░██` | 2048 | 22/10 | 25658736 |
| [v0.62](v0.62/) | `░░█▓▓▓▒█▒█░▓█▒█░` | 2016 | 20/12 | 25658481 |
| [v0.61](v0.61/) | `█▒▓█▒░▓▓▒▓▓▒▓▒█░` | 1984 | 18/14 | 25658203 |
| [v0.60](v0.60/) | `█░▓█▓█░▒▒░▓█░▓█▒` | 1952 | 23/9 | 25657705 |
| [v0.59](v0.59/) | `░▓░████▓██▓▓█▒▓░` | 1920 | 15/17 | 25657532 |
| [v0.58](v0.58/) | `█▒░█▓░░▒█░▓░▓░▓█` | 1888 | 21/11 | 25657221 |

<sub>58 older releases not shown — see [HISTORY.md](HISTORY.md) for the full list.</sub>

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
