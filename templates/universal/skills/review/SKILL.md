---
name: review
description: Review code for correctness, clarity, and scope creep. Trigger when the user asks for a code review, second opinion on a change, or before-commit check.
triggers:
  - "review this"
  - "look over this change"
  - "second opinion"
  - "is this ready to merge"
---

# Review

Review a set of changes against correctness, clarity, and scope.

## Focus areas

1. **Correctness** — Does it do what it claims? Are edge cases handled where they need to be (not where they don't)? Any off-by-one, null, concurrency hazards?
2. **Scope** — Does the diff do only what the task required? Flag unrelated refactors, speculative abstractions, or added features.
3. **Clarity** — Are names honest? Is control flow easy to follow? Are there comments explaining WHAT when the code should be self-evident? Are there comments missing where WHY is non-obvious?
4. **Tests** — Do the tests assert the behavior that actually matters, or just exercise the code path?
5. **Security** — Any user input reaching a shell, SQL, filesystem, or URL? Any secrets logged?

## Output

Group feedback by severity:

- **Must fix** — correctness bugs, security issues, scope creep.
- **Should fix** — clarity issues that will cost time later.
- **Consider** — style or alternative approaches. Take or leave.

## Do not

- Repeat what linters and type checkers already caught.
- Request changes for personal style preferences without justification.
- Review code the user didn't ask you to review.
