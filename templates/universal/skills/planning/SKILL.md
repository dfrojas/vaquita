---
name: planning
description: Plan a non-trivial change before touching code. Trigger when the user describes a feature, refactor, or investigation that spans multiple files or modules.
triggers:
  - "plan this out"
  - "how should we approach"
  - "before I start coding"
  - "break this down"
---

# Planning

Plan a non-trivial change before implementation.

## Flow

1. **Restate the goal** — In one sentence, what does "done" look like? If unclear, ask.
2. **Map the surface** — List the files, modules, or systems that will be touched. Read the most important ones before planning — do not plan blind.
3. **Identify the risks** — What could go wrong? What assumptions are load-bearing? What does not yet have a test?
4. **Sketch the steps** — Order them so each step is verifiable on its own. Prefer small, shippable increments over a single big change.
5. **Flag decisions** — Call out choices that would benefit from user input before you lock them in (library choice, breaking change, data migration shape).

## Output

- Goal restatement
- File/module list
- Ordered step list
- Decisions that need user confirmation

## Do not

- Plan in isolation from the code. A plan written without reading the code is fiction.
- Produce vague steps like "implement feature." Each step should be small enough to verify.
- Build elaborate plans for trivial changes.
