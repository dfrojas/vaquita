# Contributing to vaquita

Thanks for your interest in contributing! Ideas, bug reports, and PRs are
all welcome.

## Reporting issues

Open a GitHub issue with:

- What you ran (command, Claude Code version, Node version, OS).
- What you expected.
- What actually happened. Include relevant output from the session.

If it's a templating bug, a minimal reproduction (a small `.claude/` before
and after state) is enormously helpful.

## Proposing changes

Before writing code for a non-trivial change, please open an issue to
discuss it. vaquita's templates encode specific opinions about how a
`.claude/` directory should be structured — changes that alter those
opinions need a conversation first.

Small, uncontroversial contributions (typo fixes, clearer wording in a
template, a bug fix with an obvious root cause) don't need a prior issue.
Just send the PR.

## Pull request checklist

- Keep the scope tight. One logical change per PR.
- Run through `/vaquita:init` and `/vaquita:upgrade` in a throwaway project
  if you touched templates or the script.
- Update `README.md` or `DEVELOPING.md` if user-visible behavior changed.
- Don't commit generated `.claude/` output, personal configs, or editor
  droppings.

## Dev setup

See [DEVELOPING.md](DEVELOPING.md) for how to run vaquita from a local
clone, reload plugin files without restarting, and an overview of how the
commands are wired up.

## License

By contributing, you agree that your contributions will be licensed under
the MIT License (the same license as the project).
