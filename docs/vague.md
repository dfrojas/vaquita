# Vaquita — Project Specification

## Purpose

Scaffold Claude Code configuration for any project. Run `/vaquita-init` inside
Claude Code and it generates a complete, opinionated `.claude/` directory with
CLAUDE.md, rules, skills, agents, hooks, and memory structure.

Future scope: support other AI coding assistants (OpenAI Codex, Gemini CLI)
via additional templates (vaquita-openai, vaquita-gemini, etc.).

---

## How it works

- Entry point: CC plugin slash command `/vaquita-init`
- The command calls a TypeScript script via bash tool: `npx tsx src/index.ts`
- The TS script detects the stack, copies templates, interpolates variables, and writes files
- Claude does NOT generate file contents — the TS script does deterministically
- `/create-skill`, `/create-agent`, `/create-rule` also call the TS script after
  interviewing the user — Claude never writes these files directly

---

## What it generates in the target project

    .claude/
      CLAUDE.md
      memory/
        decisions.md
        automemory/
      rules/
        universal/
          no-early-stop.md
          memory-protocol.md
          ask-before-create.md
        <language>/
          style.md
      skills/
        debug/SKILL.md
        review/SKILL.md
        planning/SKILL.md
        <language>/
          testing/SKILL.md
      agents/
        explorer.md
        reviewer.md
      commands/
        create-skill.md
        create-agent.md
        create-rule.md
      hooks/
        hooks.json
        scripts/
          health-sentinel.sh
          bash-security.sh
    settings.json

---

## Plugin repo structure

    vaquita/
      .claude-plugin/
        plugin.json
      commands/
        vaquita-init.md
        create-skill.md
        create-agent.md
        create-rule.md
      src/
        index.ts
      templates/
        universal/
          CLAUDE.md
          settings.json
          memory/
            decisions.md
          rules/
            no-early-stop.md
            memory-protocol.md
            ask-before-create.md
            _template/
              rule.md
          skills/
            debug/SKILL.md
            review/SKILL.md
            planning/SKILL.md
            _template/
              SKILL.md
          agents/
            explorer.md
            reviewer.md
            _template/
              agent.md
          hooks/
            hooks.json
            scripts/
              health-sentinel.sh
              bash-security.sh
        python/
          rules/
            style.md
          skills/
            testing/SKILL.md
        typescript/
          rules/
            style.md
          skills/
            testing/SKILL.md
        rust/
          rules/
            style.md
          skills/
            testing/SKILL.md

---

## Stack detection

- `pyproject.toml` found → python
- `package.json` found → typescript
- `Cargo.toml` found → rust
- None found → universal only
- Multiple found → generate all matching stacks, report what was generated

---

## Template interpolation variables

### vaquita-init templates

- `{{PROJECT_NAME}}` — from directory name
- `{{STACK}}` — detected stack(s)
- `{{TEST_CMD}}` — detected test command
- `{{BUILD_CMD}}` — detected build command

### /create-skill template variables

- `{{SKILL_NAME}}` — name of the skill
- `{{DESCRIPTION}}` — when to trigger and what it does (frontmatter description)
- `{{TRIGGER}}` — example user phrases that activate it
- `{{OUTPUT}}` — expected output format
- `{{BUNDLED_RESOURCES}}` — scripts or references needed (optional)

### /create-agent template variables

- `{{AGENT_NAME}}` — name of the agent
- `{{MODEL}}` — claude-haiku, claude-sonnet, etc.
- `{{PURPOSE}}` — what the agent does in one sentence
- `{{INSTRUCTIONS}}` — detailed behavior instructions

### /create-rule template variables

- `{{RULE_NAME}}` — name of the rule
- `{{GLOB}}` — path glob this rule applies to (empty = always-on)
- `{{DESCRIPTION}}` — what Claude must or must not do

---

## Canonical CLAUDE.md Context & Memory Protocol

Every generated CLAUDE.md must include this section verbatim:

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

---

## /create-skill, /create-agent, /create-rule behavior

All three follow the same pattern:

1. Interview — ask these questions one at a time, wait for answers before proceeding:
   - /create-skill: skill name, trigger phrases, expected output, bundled resources needed?
   - /create-agent: agent name, model, purpose, key behaviors
   - /create-rule: rule name, glob scope, what Claude must or must not do

2. Draft — call TS script to interpolate the relevant _template/ file with collected
   answers, show the result to the user before writing anything

3. Confirm — explicit user approval required before writing

4. Write — write to the correct path:
   - Skills: .claude/skills/<name>/SKILL.md
   - Agents: .claude/agents/<name>.md
   - Rules: .claude/rules/<scope>/<name>.md

Claude never writes these files directly. Always goes through the TS script.

---

## Hooks

- `health-sentinel.sh` — SessionStart hook. Checks all registered hooks are alive.
  Prints a single status line. No context injection.

- `bash-security.sh` — PreToolUse Bash hook. Warns on dangerous commands
  (rm -rf, drop database, force push, etc.). Does not block by default.

---

## settings.json behavior

- If settings.json already exists, merge autoMemoryDirectory into it. Do not overwrite.
- Always set autoMemoryDirectory to .claude/memory/automemory.

---

## If .claude/ already exists

- Skip files that already exist.
- Report exactly what was skipped and what was written.
- Never overwrite existing CLAUDE.md, decisions.md, or any user-created files.

---

## Architectural decisions already made

- CC plugin, not standalone CLI — user is already inside Claude Code
- npx tsx — no build step required
- Claude never generates template content — TS script is always deterministic
- decisions.md is append-only, written by Claude at task close
- checkpoint.md is created during task, deleted on completion after extracting to decisions.md
- health-sentinel.sh prints status only — no context injection
- bash-security.sh warns only — does not block by default
- settings.json is merged, not overwritten
- Existing .claude/ files are skipped, never overwritten
- Multi-stack projects: generate all detected stacks, report what was generated

---

## Open questions for explore phase

1. Should vaquita-init.md call src/index.ts directly via `npx tsx` or via an npm
   script defined in package.json?

2. How does the TS script receive the target project path — current working directory
   or a --path flag?

3. Should plugin.json explicitly declare the commands or does Claude Code discover
   them automatically from the commands/ directory?

4. What variables should be exposed in the skill, agent, and rule templates beyond
   what is listed above?

5. Should /create-skill and siblings call the TS script for interpolation, or is
   direct file writing from Claude acceptable given the template constrains the structure?