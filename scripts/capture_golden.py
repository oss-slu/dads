#!/usr/bin/env python3
"""Capture golden API responses from a running backend."""

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
    format_connection_error,
    prepare_snapshot,
    resolve_cases_for_cli,
    write_expected,
)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    add_golden_cli_args(parser)
    args = parser.parse_args()
    cases, exit_code = resolve_cases_for_cli(args)
    if exit_code != 0 or cases is None:
        return exit_code

    for case in cases:
        try:
            status, body = fetch_case(args.base_url, case)
        except urllib.error.URLError:
            print(format_connection_error(args.base_url), file=sys.stderr)
            return 1
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
