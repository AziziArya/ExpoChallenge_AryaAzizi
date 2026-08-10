"""
Shared test fixtures.

Hermetic-environment guard
---------------------------
backend/app.py calls load_dotenv() at import time. python-dotenv's
load_dotenv() defaults to override=False, meaning it only fills in
environment variables that are NOT already present -- it never
clobbers a value that's already set.

We use that to our advantage here: the block below runs at *module
import time* of this conftest, which pytest always does before it
imports/collects any test module in this directory. That means
OPENAI_API_KEY is already present (forced to "") in os.environ before
backend.app (and therefore load_dotenv()) is ever imported for the
first time in the test session -- so load_dotenv() finds the var
already set and leaves it alone, regardless of what value (real or
otherwise) sits in a local .env on disk.

Without this, only the *first* test in the session that imports
backend.app would see load_dotenv() actually fire and pull a real key
out of .env into os.environ for the rest of the process -- a subtle,
import-order-dependent flake that a per-test monkeypatch.delenv alone
can't fully prevent (delenv can't stop a not-yet-imported module from
loading the key right back in).

An empty string is deliberately used rather than deleting the key:
`if not api_key` in llm_client.generate_reply() treats "" exactly like
"unset", so this reproduces the "no key configured" contract that
tests such as test_chat.py rely on (chatbot_mode == "error"), without
ever needing to touch the developer's real .env file.

Any test that needs a specific key (fake or real) still sets it
explicitly with monkeypatch.setenv(...) inside the test -- see the
existing pattern in tests/test_llm_client.py. The autouse fixture below
additionally resets OPENAI_API_KEY back to "" before every test, so a
test that sets a key doesn't leak it into the next one.
"""

import os

import pytest

os.environ.setdefault("OPENAI_API_KEY", "")
os.environ["OPENAI_API_KEY"] = ""


@pytest.fixture(autouse=True)
def _no_ambient_openai_key(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "")
