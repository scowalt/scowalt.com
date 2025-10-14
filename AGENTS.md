# Agent Playbook

This repository expects AI/code-generation helpers to work within the existing
branching workflow powered by **[Git Town](https://www.git-town.com/)**.

## Required branching flow

- Always create new branches with `git town hack <branch-name>` so they are
  up-to-date with `main` and recorded in the branch hierarchy.
- Before pushing or opening a PR, run `git town sync` to pull the latest
  changes, clean up merged branches, and push your current branch.
- When you need to deliver work, ship through the standard PR process. If a
  branch is ready to merge locally, prefer `git town ship` to merge and clean
  up.

## Helpful Git Town commands

- `git town hack` – create a fresh feature branch from `main`.
- `git town sync` – update all local branches, rebasing/shipping changes as
  needed.
- `git town switch` – change branches via an interactive picker.
- `git town propose` – open a pull request for the current branch.
- `git town ship` – merge the current feature branch and delete it locally and
  remotely.

Advanced/stacked workflows use:

- `git town append` / `prepend` / `swap` – manage stacked branches by inserting
  or reordering.
- `git town continue` / `skip` / `undo` – resume or recover from interrupted
  Git Town commands.

Full documentation is available at:
https://www.git-town.com and via `git town help <command>`.
