---
name: typescript-style
scope: typescript
glob: "**/*.{ts,tsx}"
description: TypeScript style defaults — strict types, no any, named exports, narrow surface
---

# TypeScript Style

Apply to all `.ts` and `.tsx` files.

## Rules

- **Strict mode.** `strict: true` in `tsconfig.json`. No downgrades for individual files.
- **No `any`.** Use `unknown` + narrowing. If a third-party type is genuinely missing, add a minimal declaration rather than `any`.
- **No non-null assertions (`!`).** Prefer runtime checks and type guards. A `!` should only appear with a comment explaining the invariant.
- **Named exports over default exports.** Default exports hide rename refactors and break tree-shaking heuristics.
- **Narrow function signatures.** Accept the minimal type a function actually reads. `(user: { id: string })` beats `(user: User)` when only `id` is used.
- **Discriminated unions over optional fields.** Model states as `| { kind: "loading" } | { kind: "ready", data: T }`, not `{ data?: T, loading?: boolean }`.
- **No unused exports.** If a type or function is only used in one file, don't export it.
- **No barrel files (`index.ts` that re-exports everything).** They hurt build performance and hide import paths.
