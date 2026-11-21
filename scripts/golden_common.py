"""Shared helpers for golden API snapshot capture and check."""

from __future__ import annotations

import hashlib
import json
import sys
import urllib.error
import urllib.request
from copy import deepcopy
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

_ALLOWED_BASE_HOSTS = frozenset({"127.0.0.1", "localhost", "::1"})

REPO_ROOT = Path(__file__).resolve().parents[1]
CASES_PATH = REPO_ROOT / "tests" / "golden" / "cases.json"
EXPECTED_DIR = REPO_ROOT / "tests" / "golden" / "expected"

LARGE_RESULT_THRESHOLD = 500
PREVIEW_ROW_COUNT = 20
FLOAT_DECIMALS = 6


def load_cases() -> list[dict[str, Any]]:
    with CASES_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def case_names() -> set[str]:
    return {case["name"] for case in load_cases()}


def _row_sort_key(row: Any) -> tuple:
    if isinstance(row, dict):
        for key in (
            "function_id",
            "graph_id",
            "family_id",
            "id",
            "modelLabel",
        ):
            if key in row:
                return (str(row[key]),)
        return (json.dumps(row, sort_keys=True, default=str),)
    if isinstance(row, list) and row:
        last = row[-1]
        try:
            return (int(last),)
        except (TypeError, ValueError):
            return (str(last),)
    return (repr(row),)


def _should_sort_root_list(body: Any) -> bool:
    if not isinstance(body, list) or not body:
        return False
    return all(isinstance(item, dict) for item in body)


def _normalize_tree(value: Any, *, sort_list: bool) -> Any:
    if isinstance(value, float):
        return round(value, FLOAT_DECIMALS)
    if isinstance(value, dict):
        return {
            key: _normalize_tree(item, sort_list=(key == "results"))
            for key, item in value.items()
        }
    if isinstance(value, list):
        items = [_normalize_tree(item, sort_list=False) for item in value]
        if sort_list and items:
            try:
                return sorted(items, key=_row_sort_key)
            except TypeError:
                pass
        return items
    return value


def _strip_unstable_fields(value: Any) -> Any:
    if isinstance(value, dict):
        return {
            key: _strip_unstable_fields(item)
            for key, item in value.items()
            if key != "error_id"
        }
    if isinstance(value, list):
        return [_strip_unstable_fields(item) for item in value]
    return value


def normalize_body(body: Any) -> Any:
    tree = _normalize_tree(deepcopy(body), sort_list=_should_sort_root_list(body))
    return _strip_unstable_fields(tree)


def _compact_large_results(body: Any) -> Any:
    if not isinstance(body, dict) or "results" not in body:
        return body
    results = body["results"]
    if not isinstance(results, list) or len(results) <= LARGE_RESULT_THRESHOLD:
        return body
    normalized_results = normalize_body(results)
    payload = json.dumps(normalized_results, sort_keys=True, default=str)
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    compact = dict(body)
    compact["results"] = {
        "row_count": len(results),
        "sha256": digest,
        "preview": normalized_results[:PREVIEW_ROW_COUNT],
    }
    return compact


def prepare_snapshot(status_code: int, body: Any, compact_large: bool = False) -> dict[str, Any]:
    normalized = normalize_body(body)
    if compact_large:
        normalized = _compact_large_results(normalized)
    return {"status_code": status_code, "body": normalized}


def snapshot_to_json(snapshot: dict[str, Any]) -> str:
    return json.dumps(snapshot, indent=2, sort_keys=True) + "\n"


def write_expected(case_name: str, snapshot: dict[str, Any]) -> Path:
    EXPECTED_DIR.mkdir(parents=True, exist_ok=True)
    path = EXPECTED_DIR / f"{case_name}.json"
    path.write_text(snapshot_to_json(snapshot), encoding="utf-8")
    return path


def read_expected(case_name: str) -> dict[str, Any]:
    path = EXPECTED_DIR / f"{case_name}.json"
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def first_diff(expected: Any, actual: Any, path: str = "") -> str | None:
    if type(expected) is not type(actual):
        return f"{path or 'root'}: type {type(expected).__name__} != {type(actual).__name__}"
    if isinstance(expected, dict):
        exp_keys = set(expected)
        act_keys = set(actual)
        if exp_keys != act_keys:
            missing = sorted(exp_keys - act_keys)
            extra = sorted(act_keys - exp_keys)
            return f"{path or 'root'}: keys differ (missing={missing}, extra={extra})"
        for key in sorted(exp_keys):
            nested = first_diff(expected[key], actual[key], f"{path}.{key}" if path else key)
            if nested:
                return nested
        return None
    if isinstance(expected, list):
        if len(expected) != len(actual):
            return f"{path}: list lengths {len(expected)} != {len(actual)}"
        for index, (exp_item, act_item) in enumerate(zip(expected, actual)):
            nested = first_diff(exp_item, act_item, f"{path}[{index}]")
            if nested:
                return nested
        return None
    if expected != actual:
        return f"{path}: {expected!r} != {actual!r}"
    return None


def format_connection_error(base_url: str) -> str:
    return f"Can't reach {base_url.rstrip('/')}, is server.py running?"


def validate_base_url(base_url: str) -> None:
    """Reject non-local base URLs (dev golden scripts only; guards SSRF scanners)."""
    parsed = urlparse(base_url.strip())
    if parsed.scheme not in ("http", "https"):
        raise ValueError(f"Unsupported URL scheme: {parsed.scheme!r}")
    host = (parsed.hostname or "").lower()
    if host not in _ALLOWED_BASE_HOSTS:
        raise ValueError(
            f"Base URL host must be localhost, 127.0.0.1, or ::1, not {host!r}"
        )


def validate_case_route(route: str) -> None:
    """Golden routes must be fixed relative paths from cases.json (no off-host requests)."""
    if not route or not route.startswith("/") or route.startswith("//"):
        raise ValueError(f"Invalid route {route!r}: must be an absolute path like /get_system")
    if "://" in route:
        raise ValueError(f"Invalid route {route!r}: must not contain a scheme")


def fetch_case(base_url: str, case: dict) -> tuple[int, object]:
    """POST/GET one golden case against a validated local backend URL."""
    validate_base_url(base_url)
    route = case.get("route", "")
    validate_case_route(route)
    joined = urljoin(base_url.rstrip("/") + "/", route.lstrip("/"))
    parsed = urlparse(joined)
    host = (parsed.hostname or "").lower()
    if host not in _ALLOWED_BASE_HOSTS:
        raise ValueError(f"Resolved URL left localhost: {joined!r}")

    method = case.get("method", "POST").upper()
    body = case.get("body", {})
    data = json.dumps(body).encode("utf-8")
    request = urllib.request.Request(
        joined,
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
        parsed_body = json.loads(raw) if raw else None
    except json.JSONDecodeError:
        parsed_body = raw
    return status, parsed_body


def add_golden_cli_args(parser) -> None:
    parser.add_argument(
        "--base-url",
        default="http://127.0.0.1:5000",
        help="Backend base URL (default: http://127.0.0.1:5000)",
    )
    parser.add_argument(
        "--case",
        action="append",
        help="Only these case names (repeatable)",
    )


def resolve_cases_for_cli(args) -> tuple[list[dict[str, Any]] | None, int]:
    """Validate --base-url and optional --case filter; return (cases, exit_code)."""
    try:
        validate_base_url(args.base_url)
    except ValueError as error:
        print(error, file=sys.stderr)
        return None, 1

    cases = load_cases()
    if not args.case:
        return cases, 0

    wanted = set(args.case)
    known = case_names()
    unknown = sorted(wanted - known)
    if unknown:
        print(f"Unknown case name(s): {', '.join(unknown)}", file=sys.stderr)
        return None, 1
    cases = [case for case in cases if case["name"] in wanted]
    if not cases:
        print("No matching cases.", file=sys.stderr)
        return None, 1
    return cases, 0


def rational_periodic_points_in_order(snapshot_body: Any) -> list[Any] | None:
    """Return rational_periodic_points from get_system-shaped dict, if present."""
    if not isinstance(snapshot_body, dict):
        return None
    points = snapshot_body.get("rational_periodic_points")
    if isinstance(points, list):
        return points
    return None
