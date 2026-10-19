"""Unit tests for SQLite build helpers (no Postgres required)."""

import importlib.util
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATH = REPO_ROOT / "scripts" / "build_sqlite.py"


def _load_build_sqlite():
    spec = importlib.util.spec_from_file_location("build_sqlite", SCRIPT_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules["build_sqlite"] = module
    spec.loader.exec_module(module)
    return module


build_sqlite = _load_build_sqlite()


def test_pack_model_whole_null_returns_none():
    assert build_sqlite.pack_model(None, None, None, None, None) is None


def test_pack_model_partial_null_height():
    packed = build_sqlite.pack_model(
        [["1", "0", "1"], ["0", "0", "1"]],
        "1",
        [],
        None,
        "1.1.1.1",
    )
    data = json.loads(packed)
    assert data["height"] is None
    assert data["bad_primes"] == []


def test_pack_model_json_is_stable():
    first = build_sqlite.pack_model(
        [["4", "4", "4"], ["-2", "4", "3"]],
        "496",
        [2, 31],
        1.3862944,
        "1.1.1.1",
    )
    second = build_sqlite.pack_model(
        [["4", "4", "4"], ["-2", "4", "3"]],
        "496",
        [2, 31],
        1.3862944,
        "1.1.1.1",
    )
    assert first == second
    assert '"base_field_label":"1.1.1.1"' in first


def test_json_text_none():
    assert build_sqlite.json_text(None) is None


def test_bool_to_sqlite():
    assert build_sqlite.bool_to_sqlite(True) == 1
    assert build_sqlite.bool_to_sqlite(False) == 0
    assert build_sqlite.bool_to_sqlite(None) is None


def test_sha256_dump_matches_known_file():
    digest = build_sqlite.sha256_file(build_sqlite.DUMP_SQL_PATH)
    assert len(digest) == 64
    assert digest == digest.lower()


def test_sqlite_schema_creates_metadata_table():
    import sqlite3

    connection = sqlite3.connect(":memory:")
    build_sqlite.create_sqlite_schema(connection)
    tables = {
        row[0]
        for row in connection.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"
        )
    }
    assert "metadata" in tables
    assert "functions_dim_1_nf" in tables
    indexes = {
        row[0]
        for row in connection.execute(
            "SELECT name FROM sqlite_master WHERE type='index'"
        )
    }
    assert "idx_rational_preperiodic_function_id" in indexes
    assert "idx_rational_preperiodic_graph_id" in indexes
    connection.close()
