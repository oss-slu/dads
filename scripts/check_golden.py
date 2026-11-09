#!/usr/bin/env python3
"""Compare live API responses against committed golden files."""

from __future__ import annotations

import argparse
import sys
import urllib.error
from pathlib import Path

_SCRIPTS_DIR = Path(__file__).resolve().parent
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))

from golden_common import (
    add_golden_cli_args,
    fetch_case,
    first_diff,
    format_connection_error,
    prepare_snapshot,
    read_expected,
    resolve_cases_for_cli,
)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    add_golden_cli_args(parser)
    args = parser.parse_args()
    cases, exit_code = resolve_cases_for_cli(args)
    if exit_code != 0 or cases is None:
        return exit_code

    failures = 0
    for case in cases:
        name = case["name"]
        try:
            status, body = fetch_case(args.base_url, case)
        except urllib.error.URLError:
            print(format_connection_error(args.base_url), file=sys.stderr)
            return 1
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
