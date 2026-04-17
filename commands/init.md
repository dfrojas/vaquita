---
name: init
description: Scaffold a complete .claude/ configuration in the current project (universal + typescript + python + rust templates, settings.json, hooks).
---

# /vaquita:init

Scaffold `.claude/` configuration for the current project.

## What to do

1. **Draft a one-sentence project description first.** Before running the init script:
   - Read `README.md` at the project root if it exists. If it doesn't, read at most two top-level source/config files (e.g. `src/index.ts`, `src/main.py`, or the `[package] description` in `Cargo.toml`) to infer purpose.
   - Write a **one-sentence** description. Hard limit: 20 words. State what the project is, not what it does in detail. No marketing language, no adjectives like "powerful", "elegant", "robust".
   - If you cannot infer anything confidently, do not guess. Leave the description empty and the script will use its default placeholder.

2. Run the init script via the Bash tool, passing the description as a CLI arg:

   ```
   CLAUDE_PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}" npx tsx "${CLAUDE_PLUGIN_ROOT}/src/index.ts" init --description "<your one-sentence description>"
   ```

   If you drafted no description in step 1, omit the `--description` flag entirely.
   Escape any embedded double quotes in the description. The first run may take 5–10 seconds while `tsx` is fetched.

3. Read the script's output. It reports:
   - Project name, detected stack, detected test/build commands.
   - Which files were written.
   - Which files were skipped because they already existed.
   - Whether `settings.json` was created, merged, or already set.

4. Summarize the result to the user in 3–5 lines. Mention:
   - How many files were written and how many were skipped.
   - Any blanks in `test_cmd` or `build_cmd` (suggest they edit `CLAUDE.md` to fill these in).
   - **Next (optional)**: suggest `/create-skill`, `/create-agent`, or `/create-rule` for further customization.

## Rules

- Do not write any files yourself. The script handles all writes, including the description (via the `--description` arg).
- If the script fails (non-zero exit), report the error verbatim and stop. Do not retry.
- If `CLAUDE_PLUGIN_ROOT` is not set, the script will exit with a diagnostic. Relay it.
- Never expand the description beyond one sentence. If you feel the urge to add a second sentence, stop.
- If `.claude/CLAUDE.md` already exists, the script will skip it and your description will have no effect on this run. That's fine, report it and move on.
