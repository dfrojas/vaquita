---
name: typescript-testing
description: Write, run, or debug TypeScript/JavaScript tests. Trigger when the user mentions tests, vitest, jest, or test failures in a TS/JS context.
triggers:
  - "write a test for"
  - "run the tests"
  - "test is failing"
  - "add test coverage"
---

# TypeScript Testing

## Flow

1. **Detect the runner.** Check `package.json` `scripts` and `devDependencies` for `vitest`, `jest`, or `node --test`. Use whichever is present.
2. **Find existing tests.** Look for `*.test.ts`, `*.spec.ts`, or files under `test/` / `__tests__/`. Pattern-match on the project's existing shape.
3. **Assert behavior, not implementation.** Test what the function promises externally. Avoid testing private helpers directly.
4. **Prefer table-driven tests** for multiple input cases over many separate `test(...)` blocks that differ only in input values.
5. **Run the test** you just wrote before declaring it complete.

## Output

- The test file, in the project's existing style.
- Output of the test run, confirming pass.
- If it didn't pass, root cause plus fix.

## Do not

- Add test infra (coverage reporters, matchers) the user did not request.
- Mock a real dependency just to make the test pass. That hides regressions.
- Use `any` in test types. Tests are code too.
