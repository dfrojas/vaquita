---
name: rust-testing
description: Write, run, or debug Rust tests. Trigger when the user mentions tests, cargo test, or test failures in a Rust context.
triggers:
  - "write a test for"
  - "run the tests"
  - "test is failing"
  - "add test coverage"
---

# Rust Testing

## Flow

1. **Classify the test.**
   - **Unit tests** live in `#[cfg(test)] mod tests` at the bottom of the module they test.
   - **Integration tests** live in `tests/` at the crate root, using only the crate's public API.
   - Place the test correctly before writing it.
2. **Use `#[test]`** plus standard assertions (`assert_eq!`, `assert!`). If the project already uses `rstest` or `proptest`, match that style.
3. **Prefer `Result<(), E>` test signatures** so `?` works inside tests instead of many `.unwrap()` calls.
4. **Run precisely.** `cargo test --lib module::tests::name` for a single test. Use `-- --nocapture` when you need println output.
5. **For flaky or async tests**, inspect before retrying. Set `RUST_BACKTRACE=1` to get meaningful panics.

## Output

- Test in the correct location (unit vs integration).
- Command used to run it and its output confirming pass.
- On failure: root cause and fix.

## Do not

- Add dev-dependencies (tokio-test, mockall) the user did not request.
- Mark tests `#[ignore]` to make CI pass — diagnose and fix.
- Use `cargo test` with no arguments for a focused fix; it runs the whole suite and wastes time.
