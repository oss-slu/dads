#!/usr/bin/env python3
"""Capture golden API responses from a running backend."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

_SCRIPTS_DIR = Path(__file__).resolve().parent
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))

from golden_common import load_cases, prepare_snapshot, write_expected


def fetch_case(base_url: str, case: dict) -> tuple[int, object]:
    url = base_url.rstrip("/") + case["route"]
    method = case.get("method", "POST").upper()
    body = case.get("body", {})
    data = json.dumps(body).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            raw = response.read().decode("utf-8")
            status = response.status
    except urllib.error.HTTPError as error:
        status = error.code
        raw = error.read().decode("utf-8")
    try:
        parsed = json.loads(raw) if raw else None
    except json.JSONDecodeError:
        parsed = raw
    return status, parsed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--base-url",
        default="http://127.0.0.1:5000",
        help="Backend base URL (default: http://127.0.0.1:5000)",
    )
    parser.add_argument(
        "--case",
        action="append",
        help="Capture only these case names (repeatable)",
    )
    args = parser.parse_args()

    cases = load_cases()
    if args.case:
        wanted = set(args.case)
        cases = [case for case in cases if case["name"] in wanted]
        if not cases:
            print("No matching cases.", file=sys.stderr)
            return 1

    for case in cases:
        status, body = fetch_case(args.base_url, case)
        snapshot = prepare_snapshot(
            status,
            body,
            compact_large=case.get("compact_large", False),
        )
        path = write_expected(case["name"], snapshot)
        print(f"wrote {path} (HTTP {status})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
