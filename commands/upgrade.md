---
name: upgrade
description: Diff the current .claude/ against the latest plugin templates and selectively apply updates. Never auto-overwrites.
---

# /vaquita:upgrade

Compare the current `.claude/` against the latest plugin templates and let the
user pick which files to update.

## What to do

1. Run the plan step via the Bash tool:

   ```
   CLAUDE_PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}" npx tsx "${CLAUDE_PLUGIN_ROOT}/src/index.ts" upgrade plan
   ```

   Output is JSON of the shape:

   ```
   {
     "changes": [
       { "target": "<path>", "source": "<abs>", "status": "new" | "changed", "diff": "<text>" },
       ...
     ],
     "unchangedCount": <number>
   }
   ```

   If the script exits non-zero (e.g., no `.claude/` exists), relay the error and stop.

2. If `changes` is empty, tell the user everything is up to date and stop.

3. For each entry in `changes`, present it to the user:
   - Show the file path and status (`new` or `changed`).
   - Show a short preview of the diff (first ~20 lines). Offer to show the full diff on request.
   - Ask: **apply**, **skip**, or **view full diff**?
   - If the user requests the full diff, show it and re-ask.
   - Record the user's apply/skip decision per file.

4. Once decisions are collected, apply the accepted files in one call:

   ```
   CLAUDE_PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}" npx tsx "${CLAUDE_PLUGIN_ROOT}/src/index.ts" upgrade apply <path1> <path2> ...
   ```

   Quote each path. If no files were accepted, skip this step.

5. Print a summary:
   - Applied: list of paths.
   - Skipped: list of paths.
   - Unchanged: `unchangedCount` from the plan.

## Rules

- Do not edit `.claude/` files yourself. The script handles writes.
- Do not apply files the user didn't explicitly accept. There is no "apply all."
- If the user aborts midway, apply only what was accepted before the abort.
- `settings.json` is deliberately excluded from the upgrade surface. Its merge is narrow and handled only by `/vaquita:init`.
