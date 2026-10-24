"""Shared helpers for golden API snapshot capture and check."""

from __future__ import annotations

import hashlib
import json
from copy import deepcopy
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
CASES_PATH = REPO_ROOT / "tests" / "golden" / "cases.json"
EXPECTED_DIR = REPO_ROOT / "tests" / "golden" / "expected"

LARGE_RESULT_THRESHOLD = 500
PREVIEW_ROW_COUNT = 20
FLOAT_DECIMALS = 6


def load_cases() -> list[dict[str, Any]]:
    with CASES_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def _round_floats(value: Any) -> Any:
    if isinstance(value, float):
        return round(value, FLOAT_DECIMALS)
    if isinstance(value, dict):
        return {key: _round_floats(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_round_floats(item) for item in value]
    return value


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


def _sort_row_lists(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: _sort_row_lists(item) for key, item in value.items()}
    if isinstance(value, list):
        if value and all(isinstance(item, (dict, list)) for item in value):
            try:
                return sorted([_sort_row_lists(item) for item in value], key=_row_sort_key)
            except TypeError:
                pass
        return [_sort_row_lists(item) for item in value]
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
    return _strip_unstable_fields(_sort_row_lists(_round_floats(deepcopy(body))))


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
