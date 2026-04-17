---
name: no-early-stop
scope: universal
description: Never stop a task early due to token budget concerns
---

# No Early Stop

Never stop a task early due to token budget concerns.

If the token budget is approaching its limit, save progress to
`.claude/checkpoint.md` and keep going. The checkpoint-resume flow is designed
for exactly this case.

Stopping early because "the context is getting long" wastes the user's turn and
produces incomplete work. The correct response is to checkpoint and continue.
