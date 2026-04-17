---
name: rust-style
scope: rust
glob: "**/*.rs"
description: Rust style defaults. No unwrap in non-test code, clippy-clean, narrow error types, no untested unsafe
---

# Rust Style

Apply to all `.rs` files.

## Rules

- **No `unwrap()` or `expect()` in non-test code** unless the invariant is proven by surrounding code and a comment explains why. Use `?` with a concrete error type.
- **Result types are specific.** Define a crate-level `Error` enum with variants. Do not return `Box<dyn Error>` from library code.
- **Clippy-clean.** Run `cargo clippy --all-targets -- -D warnings` before declaring work done. Fix, don't suppress, unless the lint is genuinely wrong for the case (and leave a comment).
- **No `#[allow(...)]` without a comment** explaining the specific reason.
- **`&str` over `String` for parameters** when borrowing is sufficient. Return `String` when ownership is transferred.
- **Iterators over manual loops** when they read naturally. Don't force `.iter().map().collect()` when a for-loop is clearer.
- **`unsafe` blocks require tests** that exercise the contract being upheld. Add a `// SAFETY:` comment stating the invariant.
- **Module organization matches directory structure.** Prefer `src/foo/mod.rs` + `src/foo/bar.rs` over deeply nested `mod { mod { } }` in one file.
- **Format with `cargo fmt`** before committing.
