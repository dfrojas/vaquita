---
name: memory-protocol
scope: universal
description: Follow the Context & Memory Protocol defined in CLAUDE.md for checkpoints and decisions
---

# Memory Protocol

Follow the Context & Memory Protocol in the root `CLAUDE.md`.

Operational rules:

- At session start, always check for `.claude/checkpoint.md`. Read it first if present.
- Update `.claude/checkpoint.md` after each major step, not only under pressure.
- When closing a task, extract non-obvious decisions to `.claude/memory/decisions.md` before deleting `checkpoint.md`.
- `.claude/memory/decisions.md` is append-only. Never delete or rewrite entries.

If this file and `CLAUDE.md` disagree, `CLAUDE.md` wins.
