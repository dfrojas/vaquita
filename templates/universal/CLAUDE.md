# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## Stack

{{STACK}}

## Commands

- Test: `{{TEST_CMD}}`
- Build: `{{BUILD_CMD}}`

## Context & Memory Protocol

- At session start, check if `.claude/checkpoint.md` exists. Read it first if
  it does. If the task is already complete, delete it and inform the user.
- Update `.claude/checkpoint.md` after completing each major step. Do not wait
  until context limit.
- As you approach your token budget limit, save current progress to
  `.claude/checkpoint.md` before the context window refreshes.
- Never stop a task early due to token budget concerns.
- When closing a completed task, extract non-obvious decisions and workarounds
  to `.claude/memory/decisions.md` before deleting checkpoint.md.
- Never delete or overwrite `.claude/memory/decisions.md`. Only append to it.

## Rules

See `.claude/rules/` for always-on rules (universal) and language-scoped rules.

## Skills

See `.claude/skills/` for task-triggered skills.

## Hooks

See `.claude/hooks/hooks.json` for configured hooks. `health-sentinel.sh` runs
at session start to verify hook health. `bash-security.sh` warns on dangerous
shell commands.
