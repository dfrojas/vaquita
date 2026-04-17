---
name: python-style
scope: python
glob: "**/*.py"
description: Python style defaults. Type hints, dataclasses, no wildcard imports, narrow exceptions
---

# Python Style

Apply to all `.py` files.

## Rules

- **Type hints on all public functions.** Private helpers may omit them when types are obvious from one-line bodies.
- **Use `from __future__ import annotations`** at the top of files that use forward references or newer syntax on older Python.
- **Dataclasses over dict-with-convention.** If a dict has a fixed shape, it should be a `@dataclass` or `TypedDict`.
- **No wildcard imports (`from x import *`).** Hides provenance and breaks linters.
- **Narrow exception handling.** `except Exception:` only when you genuinely do not know the failure mode. Prefer `except SpecificError:`. Never bare `except:`.
- **f-strings for interpolation.** No `%` formatting. No `str.format` unless the template is parameterized at runtime.
- **pathlib over os.path.** `Path(...)` everywhere new. Only use `os.path` when interfacing with a library that expects strings.
- **No mutable default arguments.** Use `None` + in-body assignment.
- **Follow project formatter.** If `ruff`, `black`, or `pyright` is configured, run them before declaring work done.
