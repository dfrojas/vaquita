---
name: python-testing
description: Write, run, or debug Python tests. Trigger when the user mentions tests, pytest, or test failures in a Python context.
triggers:
  - "write a test for"
  - "run the tests"
  - "test is failing"
  - "add test coverage"
---

# Python Testing

## Flow

1. **Detect the runner.** Check `pyproject.toml` / `setup.cfg` for `pytest`. If absent, check for `unittest` usage. Prefer whichever the project already uses.
2. **Find existing tests.** Look in `tests/` or files named `test_*.py`. Pattern-match on the project's existing shape (fixtures, conftest.py, parametrize style).
3. **Use `pytest.parametrize`** for multiple input cases rather than many similar `def test_...` functions.
4. **Use fixtures** for shared setup instead of module-level globals.
5. **Assert behavior, not implementation.** Don't test private helpers in isolation if they're an implementation detail.
6. **Run the test** before declaring complete: `pytest path/to/test_file.py::test_name -v`.

## Output

- Test file in the project's existing style.
- Command that runs the new test and its output confirming pass.
- On failure: root cause and fix.

## Do not

- Add coverage tooling or plugins (pytest-xdist, pytest-mock) unless asked.
- Mock the module under test. Mock its collaborators instead.
- Use `assert` with side effects; assertions should be pure observations.
