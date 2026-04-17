<!-- LOGO -->
<h1>
<p align="center">
  <img src="assets/logo.png" alt="Logo" width="200">
  <br>Vaquita
</h1>
  <p align="center">
    Provider-agnostic plugin that scaffolds an opinionated agent-config directory for any project. Currently ships for Claude Code.
    <br />
    <a href="#about">About</a>
    ·
    <a href="#install">Install</a>
    ·
    <a href="#commands">Commands</a>
    ·
    <a href="CONTRIBUTING.md">Contributing</a>
    ·
    <a href="DEVELOPING.md">Developing</a>
  </p>
</p>

## About

vaquita is a plugin that scaffolds a complete agent-config directory in one
command: top-level guide, rules, skills, agents, hooks, and a memory protocol,
for universal plus TypeScript, Python, and Rust out of the box.

The first version targets **Claude Code** (and generates a `.claude/`
directory with `CLAUDE.md`). The design is deliberately provider-agnostic,
so future versions will scaffold for other agent frameworks too. See the
roadmap below.

Run `/vaquita:init` inside Claude Code and you get a sensible, opinionated
starting point that you can then tune to your project. `/vaquita:upgrade`
diffs your local `.claude/` against the latest templates and applies updates
selectively. It never auto-overwrites.

vaquita also ships commands for authoring new skills, agents, and rules.
Those commands interview you, draft a body using Claude's knowledge plus a
scan of your project, show the draft, and write on explicit approval.

## Install

From any Claude Code session:

```
/plugin marketplace add /path/to/vaquita
/plugin install vaquita@vaquita --scope user
```

Requires Node 18+ on your `PATH` (the plugin runs `npx tsx` on first use).

## Commands

| Command | What it does |
|---|---|
| `/vaquita:init` | Scaffold `.claude/` in the current project. Skips files that already exist. |
| `/vaquita:upgrade` | Diff the target `.claude/` against the latest templates and selectively apply updates. Never auto-overwrites. |
| `/vaquita:create-skill` | Interview you, draft a skill body from Claude's knowledge + project context, show the draft, write on approval. |
| `/vaquita:create-agent` | Same, for subagents under `.claude/agents/`. |
| `/vaquita:create-rule` | Same, for rules under `.claude/rules/<scope>/`. |

## Roadmap and Status

vaquita is usable today and ships an opinionated scaffold for TypeScript,
Python, and Rust. The rough plan for what's next:

|  #  | Step                                                                 | Status |
| :-: | -------------------------------------------------------------------- | :----: |
|  1  | Opinionated `.claude/` scaffold for TypeScript, Python, Rust         |   ✅   |
|  2  | Template upgrade with diff-and-apply, never auto-overwrite           |   ✅   |
|  3  | Interactive `create-skill` / `create-agent` / `create-rule`          |   ✅   |
|  4  | MCP server scaffolding, common servers pre-configured                |   ❌   |
|  5  | Choose language(s) at init, skip the ones you don't use              |   ❌   |
|  6  | More languages out of the box (Go, Java, Ruby, Swift, …)             |   ❌   |
|  7  | Multi-provider support (Codex, Gemini CLI, Cursor rules, …)          |   ❌   |
|  8  | Interactive init wizard, pick skills/agents/rules a la carte         |   ❌   |
|  9  | Publish to the Claude Code marketplace                               |   ❌   |

## Contributing and Developing

If you have ideas, issues, or would like to contribute to vaquita through
pull requests, please check out [CONTRIBUTING.md](CONTRIBUTING.md). Those who
want to get involved with vaquita's development should also read
[DEVELOPING.md](DEVELOPING.md) for more technical details.

## License

MIT. See `LICENSE`.
