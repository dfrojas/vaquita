---
name: init
description: Scaffold a complete .claude/ configuration in the current project (universal + typescript + python + rust templates, settings.json, hooks).
---

# /vaquita:init

Scaffold `.claude/` configuration for the current project.

## What to do

1. Run the init script via the Bash tool:

   ```
   npx tsx "$CLAUDE_PLUGIN_ROOT/src/index.ts" init
   ```

   The first run may take 5–10 seconds while `tsx` is fetched.

2. Read the script's output. It reports:
   - Project name, detected stack, detected test/build commands.
   - Which files were written.
   - Which files were skipped because they already existed.
   - Whether `settings.json` was created, merged, or already set.

3. Summarize the result to the user in 3–5 lines. Mention:
   - How many files were written and how many were skipped.
   - Any blanks in `test_cmd` or `build_cmd` (suggest they edit `CLAUDE.md` to fill these in).
   - Suggest `/create-skill`, `/create-agent`, or `/create-rule` as next steps for customizing.

## Rules

- Do not write any files yourself for this command. The script handles all writes.
- If the script fails (non-zero exit), report the error verbatim and stop. Do not retry.
- If `CLAUDE_PLUGIN_ROOT` is not set, the script will exit with a diagnostic — relay it.
