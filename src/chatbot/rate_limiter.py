"""
Simple in-memory rate limiter for the chat endpoint.

Not a distributed/production-grade limiter (it's per-process, in
memory, and resets on restart) -- but for a single-instance demo
deployment, this is exactly the right amount of complexity: it stops
one runaway client (a stuck retry loop, a bug in a testing script, or
someone hammering the endpoint) from burning through API credits,
without needing Redis or any other extra infrastructure.

If this project is ever deployed with multiple worker processes, this
would need to move to a shared store (Redis, a DB table, etc.) -- the
`check` function is the one place that would need to change.
"""

import time
from collections import defaultdict, deque
from typing import Deque, Dict

# key -> timestamps of recent requests, oldest first
_requests: Dict[str, Deque[float]] = defaultdict(deque)

DEFAULT_MAX_REQUESTS = 15
DEFAULT_WINDOW_SECONDS = 60


class RateLimitExceeded(Exception):
    def __init__(self, retry_after_seconds: float):
        self.retry_after_seconds = retry_after_seconds
        super().__init__(
            f"Rate limit exceeded. Try again in {retry_after_seconds:.0f}s."
        )


def check(
    key: str,
    max_requests: int = None,
    window_seconds: int = None,
) -> None:
    """
    Raises RateLimitExceeded if `key` (e.g. a session id or client IP)
    has made more than `max_requests` calls in the last `window_seconds`.
    Otherwise records this call and returns normally.
    """

    if max_requests is None:
        max_requests = DEFAULT_MAX_REQUESTS

    if window_seconds is None:
        window_seconds = DEFAULT_WINDOW_SECONDS

    now = time.monotonic()
    window = _requests[key]

    while window and now - window[0] > window_seconds:
        window.popleft()

    if len(window) >= max_requests:
        retry_after = window_seconds - (now - window[0])
        raise RateLimitExceeded(max(retry_after, 1))

    window.append(now)
