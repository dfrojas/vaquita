---
name: create-agent
description: Interview the user, draft a new agent from training plus project context, show the draft, refine, then write .claude/agents/<name>.md
---

# /create-agent

Create a new subagent in `.claude/agents/<name>.md`.

**You (Claude) write the file directly. Do NOT call any external script.**

## Flow

Follow these four phases in order.

### Phase 1. Interview

Ask these questions **one at a time**. Wait for each answer.

1. **Agent name**, kebab-case.
2. **Model**. `claude-haiku-4-5` (fast read-only work), `claude-sonnet-4-6` (balanced), or `claude-opus-4-7` (complex reasoning). Default: haiku.
3. **One-sentence purpose**. What does this agent do?
4. **Key behaviors**. 2–5 high-level rules the agent should follow (e.g., "never writes code", "always reports file paths with line numbers").

Do **not** ask the user to write the agent's full instructions. The body is your job in Phase 3.

### Phase 2. Project context scan

Read files that will inform the agent's scope:

- If the purpose is language- or framework-specific, read relevant config files.
- Skim existing agents in `.claude/agents/` for tone and structure consistency.

### Phase 3. Draft

Produce the full agent.md body. Use this structure:

```markdown
---
name: <agent-name>
model: <model-id>
description: <one-sentence purpose, used by the main session to decide when to invoke this agent>
tools:
  - <tool>
  - <tool>
---

# <Agent Display Name>

<One-paragraph statement of role and scope.>

## Your job

<What the agent does. Concrete verbs.>

## Rules

<Bullet list of MUST / MUST NOT rules from Phase 1 interview, expanded.>

## Output shape

<What the agent produces at the end of its run.>
```

**Tool selection defaults**:
- Read-only agents: `Read`, `Grep`, `Glob`, `Bash`.
- Agents that edit: add `Edit`, `Write`.
- Never give an agent `Agent` (no recursive subagents).

**Present the full draft.** Do not write yet.

### Phase 4. Refine and write

- Apply user edits until approval or abort.
- On approval: **immediately call the Write tool** to create `.claude/agents/<agent-name>.md`. Do NOT print the draft again for copy-paste. Do NOT ask the user to save it themselves. Writing the file is the whole point of the command.
- After writing, report the created path in one short sentence.
- On abort: write nothing.

## Example

See `.claude/agents/explorer.md` and `.claude/agents/reviewer.md` for well-formed examples.
