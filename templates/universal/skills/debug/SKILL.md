---
name: debug
description: Diagnose a failing test, crash, or unexpected behavior. Trigger when the user asks to debug, investigate a bug, or explain why something fails.
triggers:
  - "debug this"
  - "why is this failing"
  - "investigate this error"
  - "what's wrong with"
---

# Debug

Systematic diagnosis of a failing test, crash, or unexpected behavior.

## Flow

1. **Reproduce**. Run the exact command or scenario that fails. Capture the full error output. Do not guess from description alone.
2. **Isolate**. Narrow the failure to the smallest input, step, or code path that still reproduces it.
3. **Hypothesize**. State one or two specific hypotheses about the cause. Rank by likelihood.
4. **Test the top hypothesis**. Make a minimal observation (add a log, inspect state, check an assumption) that would confirm or rule it out.
5. **Fix only the identified cause**. Do not refactor surrounding code. Do not add defensive checks for scenarios you did not observe.
6. **Verify**. Re-run the original failing command. Confirm success. Run adjacent tests to catch regressions.

## Output

- The root cause in one sentence.
- The minimal fix.
- What you verified, and what you did NOT verify (e.g., "I did not test the Windows codepath").

## Do not

- Patch symptoms without understanding the cause.
- Add try/catch to swallow the error "just in case."
- Rewrite unrelated code encountered along the way.
