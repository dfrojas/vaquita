# vaquita

Claude Code plugin that scaffolds an opinionated `.claude/` directory for any project.

Run `/vaquita:init` inside Claude Code and get a complete setup: `CLAUDE.md`,
rules, skills, agents, hooks, and a memory protocol — for universal plus
TypeScript, Python, and Rust out of the box.

## Commands

| Command | What it does |
|---|---|
| `/vaquita:init` | Scaffold `.claude/` in the current project. Skips files that already exist. |
| `/vaquita:upgrade` | Diff the target `.claude/` against the latest templates and selectively apply updates. Never auto-overwrites. |
| `/vaquita:create-skill` | Interview you, draft a skill body from Claude's knowledge + project context, show the draft, write on approval. |
| `/vaquita:create-agent` | Same, for subagents under `.claude/agents/`. |
| `/vaquita:create-rule` | Same, for rules under `.claude/rules/<scope>/`. |

## Install

### Persistent install (use from any project)

From any Claude Code session:

```
/plugin marketplace add /Users/Diego.Rojas/Documents/personal/opensource/vaquita
/plugin install vaquita@vaquita --scope user
```

Replace the path with wherever you cloned the repo. The `--scope user` flag
makes the plugin available in every project you open.

Claude Code copies the plugin to `~/.claude/plugins/cache/` on install, so
edits to your source don't propagate automatically. To pick up updates after
changes to the repo:

```
/plugin uninstall vaquita
/plugin install vaquita@vaquita --scope user
```

Node 18+ must be on your `PATH` — the plugin runs `npx tsx` on first use,
which fetches `tsx` once (a few seconds).

### Local dev mode (for iterating on the plugin itself)

```
claude --plugin-dir /path/to/vaquita
```

Inside the session, `/reload-plugins` picks up edits to plugin files without
restart. This only applies to the current session.

## How it works

- `/vaquita:init` and `/vaquita:upgrade` run `src/index.ts` via `npx tsx`.
  The script handles all file I/O deterministically: template copy, variable
  interpolation, settings merge, skip-existing, and upgrade diffing.
- `/vaquita:create-skill`, `/vaquita:create-agent`, `/vaquita:create-rule` do
  **not** call the script. Claude interviews you for metadata, drafts the body
  using its own knowledge plus a scan of your project, shows the draft, and
  writes the file only after you explicitly approve.

See `openspec/changes/vaquita-v1/` for the full design spec.

## Generated layout

```
.claude/
  CLAUDE.md                          # with canonical Context & Memory Protocol
  memory/
    decisions.md                     # append-only
    automemory/
  rules/
    universal/{no-early-stop,memory-protocol,ask-before-create}.md
    typescript/style.md
    python/style.md
    rust/style.md
  skills/
    debug/SKILL.md
    review/SKILL.md
    planning/SKILL.md
    typescript/testing/SKILL.md
    python/testing/SKILL.md
    rust/testing/SKILL.md
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
      health-sentinel.sh             # validates hooks.json at SessionStart
      bash-security.sh               # warns on dangerous bash at PreToolUse
settings.json                        # autoMemoryDirectory key merged, never overwritten
```

## License

MIT. See `LICENSE`.
