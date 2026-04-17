---
name: create-rule
description: Interview the user, draft a new rule from training plus project context, show the draft, refine, then write .claude/rules/<scope>/<name>.md
---

# /create-rule

Create a new rule in `.claude/rules/<scope>/<name>.md`.

**You (Claude) write the file directly. Do NOT call any external script.**

## Flow

### Phase 1. Interview

Ask these questions **one at a time**. Wait for each answer.

1. **Rule name**, kebab-case.
2. **Scope**. Which folder under `.claude/rules/` does this live in?
   - `universal`, always-on.
   - `typescript`, `python`, `rust`, or other language name. Applies only in that language's files.
   - Custom scope is acceptable; it becomes a new subfolder.
3. **Glob**, optional. A path pattern (e.g., `src/**/*.ts`). Empty means the scope alone determines applicability.
4. **The rule itself**. A MUST or MUST NOT statement. One sentence. Be specific. (Examples: "MUST use `strict: true` in tsconfig"; "MUST NOT mock the database in integration tests")
5. **Why**. One sentence. The reason behind the rule. (This grounds edge-case judgment later.)

Do **not** ask the user to write additional rule prose. You expand it in Phase 3.

### Phase 2. Project context scan

- Grep for existing code that would obviously violate the proposed rule. If found, note it. The user may want to surface a companion task.
- Read the scope's existing rules (if any) to avoid contradictions.

### Phase 3. Draft

Produce the full rule.md body. Use this structure:

```markdown
---
name: <rule-name>
scope: <scope>
glob: <glob or empty>
description: <the rule, restated as a one-sentence description>
---

# <Rule Display Name>

<The rule, stated as a MUST or MUST NOT.>

## Why

<The reason from Phase 1, expanded to a short paragraph.>

## Apply when

<Specific conditions under which this rule fires.>

## Do not apply when

<Specific conditions where the rule should be set aside.>

## Examples (optional)

<Good and bad examples, if they clarify the rule.>
```

**Present the full draft.** Do not write yet.

### Phase 4. Refine and write

- Apply user edits until approval or abort.
- On approval: write `.claude/rules/<scope>/<rule-name>.md`.
- If the scope folder does not exist, create it.
- On abort: write nothing.

## Example

See `.claude/rules/universal/no-early-stop.md` for a well-formed example.
