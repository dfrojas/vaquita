# Developing vaquita

This document covers working on vaquita itself — running it from a local
clone, iterating on plugin files, and understanding how the commands are
wired up.

## Local dev mode

For iterating on the plugin itself:

```
claude --plugin-dir /path/to/vaquita
```

Inside the session, `/reload-plugins` picks up edits to plugin files without
a restart. This only applies to the current session.

## Persistent install from a local clone

If you want vaquita available in every project while you develop:

```
/plugin marketplace add /path/to/vaquita
/plugin install vaquita@vaquita --scope user
```

Claude Code copies the plugin to `~/.claude/plugins/cache/` on install, so
edits to your source don't propagate automatically. To pick up updates after
changes to the repo:

```
/plugin uninstall vaquita
/plugin install vaquita@vaquita --scope user
```

## How it works

- `/vaquita:init` and `/vaquita:upgrade` run `src/index.ts` via `npx tsx`.
  The script handles all file I/O deterministically: template copy, variable
  interpolation, settings merge, skip-existing, and upgrade diffing.
- `/vaquita:create-skill`, `/vaquita:create-agent`, `/vaquita:create-rule` do
  **not** call the script. Claude interviews you for metadata, drafts the
  body using its own knowledge plus a scan of your project, shows the draft,
  and writes the file only after you explicitly approve.
