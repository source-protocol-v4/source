<p align="center">
  <img src="source_avatar_under_1mb.png" alt="SOURCE" width="220">
</p>

<h1 align="center">SOURCE — release mirror</h1>

<p align="center">
  <img alt="latest release" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsource-protocol-v4%2Fsource%2Fmain%2Freleases%2Flatest.json&query=%24.name&label=latest&color=e8637a">
  <img alt="releases sealed" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsource-protocol-v4%2Fsource%2Fmain%2Freleases%2Flatest.json&query=%24.totalReleases&label=releases&color=e8637a">
  <img alt="revision" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsource-protocol-v4%2Fsource%2Fmain%2Freleases%2Flatest.json&query=%24.revision&label=revision&color=e8637a">
  <img alt="sync status" src="https://github.com/source-protocol-v4/source/actions/workflows/sync-source.yml/badge.svg">
</p>

SOURCE is a token that carries a small program inside it — sixteen instructions that trading
rewrites. Every buy nudges one instruction forward, every sell nudges one back, and after
thirty-two changes the program is sealed into a permanent **release**.

This repository is a mirror of those releases. It reads them from Ethereum, checks them, and keeps
them here as plain files anyone can read.

## The program right now

<!-- SOURCE:BEGIN -->

Nothing sealed yet — this block fills in automatically with the current program once the first
release is mirrored.

<!-- SOURCE:END -->

## Why this exists

The program lives on the blockchain, which is the real source of truth — but reading it there means
running your own tooling. This repository does that work automatically and leaves the results in
the open, as ordinary text and JSON.

Nothing here is written by hand. Every file is generated from the blockchain and verified before it
is saved.

## The program

Each of the sixteen slots holds one of four instructions: `EMPTY`, `PUSH`, `SWAP` or `LOOP`.

They are symbols rather than a program that executes anything — the contract never reads them to
decide a fee, a balance or a permission. What matters is that the pattern is written by trading and
that anyone can check how it got there.

A **buy** moves a slot forward through the cycle `EMPTY → PUSH → SWAP → LOOP → EMPTY`.
A **sell** moves it backward through the same cycle. Which slot changes is decided by the
blockchain itself — no one picks it, and it can be reproduced by anyone replaying the chain.

Only trades of at least 25 SRC move the program. Smaller trades still pay their fee, but leave the
program alone.

## Browsing the releases

Look inside [`releases/`](releases/). There is one folder per release, named `v0.0`, `v0.1`, `v0.2`
and so on. Release numbering starts at **0**.

Each folder contains five files:

| File | What it is |
| --- | --- |
| `README.md` | the release in plain language — start here |
| `source.src` | the sixteen instructions, one per line |
| `release.json` | the release's key facts, machine-readable |
| `changes.json` | all thirty-two changes, in the order they happened |
| `proof.json` | where to find this release on the blockchain |

If you just want to look around, open any release's `README.md` — it renders as a page right here
on GitHub.

## How releases get here

A scheduled job runs every fifteen minutes. It reads any newly sealed release from Ethereum,
replays all thirty-two of its changes from scratch, and saves the files only if that replay matches
what the contract sealed — the program, the counters, the revision number and the chained hash all
have to agree, exactly.

If anything disagrees, nothing is written. A release is either fully verified or not here at all.

The job also waits for twenty blocks of confirmations before accepting a release, so a short-lived
reorganisation of the chain cannot leave a bad release behind.

Releases already here are never rewritten.

## A note on trust

This mirror **only reads**. It has no Ethereum private key, contains no code that could send a
transaction, and has no control over the SOURCE contract or anyone's tokens. The only thing it ever
writes is the release files in this repository.

The contract itself is in [`src/SOURCE.sol`](src/SOURCE.sol) and remains the authority on
everything described above. If this mirror and the blockchain ever disagree, the blockchain is
right.
