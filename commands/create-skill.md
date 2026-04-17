---
name: create-skill
description: Interview the user, draft a new skill from training plus project context, show the draft, refine, then write .claude/skills/<name>/SKILL.md
---

# /create-skill

Create a new skill in `.claude/skills/<name>/SKILL.md`.

**You (Claude) write the file directly. Do NOT call any external script.**

## Flow

Follow these four phases in order. Do not skip any.

### Phase 1. Interview

Ask these questions **one at a time**. Wait for each answer before asking the next. Do not batch them.

1. **Skill name**, kebab-case, short. (e.g., `rust-debugger`, `api-changelog`, `react-test-writer`)
2. **Trigger phrases**. Example user phrases that should activate this skill. Ask for 3–5.
3. **Expected output shape**. What does the skill produce? A diagnosis, a file, a refactor plan, etc. One sentence.
4. **Bundled resources**. Does this skill need bundled scripts, reference docs, or templates alongside SKILL.md? If yes, ask which and let the user describe them. Default: none.

Do **not** ask the user to write the skill's instructions. The body is your job in Phase 3.

### Phase 2. Project context scan

Before drafting, read files that will inform the skill body:

- If the skill name or triggers reference a language (rust, python, typescript, etc.), read that language's top-level config: `Cargo.toml`, `pyproject.toml`, `package.json`, `tsconfig.json`.
- Read at least one representative source file from the project to understand style, testing setup, and existing libraries.
- If the user mentioned a specific tool or library in their triggers, grep for its usage in the project.

Keep the scan focused. Do not read the whole repo.

If no files are relevant, skip this phase and note it in the draft presentation.

### Phase 3. Draft

Produce the full SKILL.md body using:

- The metadata from Phase 1 (for the frontmatter).
- Your training knowledge (for the substantive steps).
- Project-specific findings from Phase 2 (for tailoring).

Use this structure:

```markdown
---
name: <skill-name>
description: <when to trigger, what it produces, one sentence>
triggers:
  - "<phrase 1>"
  - "<phrase 2>"
  - "<phrase 3>"
---

# <Skill Display Name>

<One-paragraph statement of what the skill does and when it applies.>

## Flow

1. <Ordered steps Claude should follow when this skill activates.>
2. ...

## Output

<What Claude should produce when the skill completes.>

## Do not

<Common mistakes or scope creep to avoid.>
```

**Present the full draft to the user.** Do not write to disk yet.

### Phase 4. Refine and write

After showing the draft:

- If the user requests edits, revise the draft and show the updated version.
- Repeat until the user either approves explicitly ("looks good", "write it", "approve") or aborts.
- On explicit approval: write the file to `.claude/skills/<skill-name>/SKILL.md`.
- If bundled resources were requested in Phase 1, create them in the same directory.
- On abort: write nothing.

## Example

See `.claude/skills/debug/SKILL.md` for a well-formed example. Pattern-match on its structure, not its domain.
