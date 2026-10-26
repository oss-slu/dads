#!/usr/bin/env python3
"""Compare live API responses against committed golden files."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

_SCRIPTS_DIR = Path(__file__).resolve().parent
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))

from capture_golden import fetch_case
from golden_common import first_diff, load_cases, prepare_snapshot, read_expected


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
        help="Check only these case names (repeatable)",
    )
    args = parser.parse_args()

    cases = load_cases()
    if args.case:
        wanted = set(args.case)
        cases = [case for case in cases if case["name"] in wanted]

    failures = 0
    for case in cases:
        name = case["name"]
        status, body = fetch_case(args.base_url, case)
        actual = prepare_snapshot(
            status,
            body,
            compact_large=case.get("compact_large", False),
        )
        expected = read_expected(name)
        if actual["status_code"] != expected["status_code"]:
            print(f"{name}: status {actual['status_code']} != {expected['status_code']}")
            failures += 1
            continue
        diff = first_diff(expected["body"], actual["body"])
        if diff:
            print(f"{name}: {diff}")
            failures += 1
        else:
            print(f"{name}: ok")

    if failures:
        print(f"\n{failures} case(s) failed.", file=sys.stderr)
        return 1
    print(f"\nAll {len(cases)} case(s) matched.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
