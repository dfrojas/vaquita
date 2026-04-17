---
name: ask-before-create
scope: universal
description: Ask before creating new files, directories, skills, agents, or rules
---

# Ask Before Create

Before creating any new file, directory, skill, agent, or rule, confirm with
the user first unless the task explicitly requires it.

This rule exists because unrequested files accumulate: scratch notes,
speculative modules, half-written docs. The user usually has a clear mental
model of what the repo should contain; surprise additions are friction.

**Apply when:**

- About to write a new file the user did not name.
- About to create a new directory.
- About to generate a new skill, agent, or rule without invoking `/create-*`.

**Do not apply when:**

- The file was explicitly requested in the current task.
- Editing an existing file.
- Creating temporary files in `/tmp` that will be cleaned up.
