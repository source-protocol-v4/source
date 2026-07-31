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

Two files sit alongside the release folders and are refreshed whenever a new release is mirrored:

| File | What it is |
| --- | --- |
| [`latest.json`](latest.json) | the newest release, at a fixed path — handy for scripts and badges |
| [`HISTORY.md`](HISTORY.md) | every release in one table, oldest first |

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
