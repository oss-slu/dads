"""Unit tests for SQLite build helpers (no Postgres required)."""

import importlib.util
import json
import sqlite3
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


def test_resolve_data_version_default():
    assert build_sqlite.resolve_data_version(None) == build_sqlite.DEFAULT_DATA_VERSION


def test_resolve_data_version_accepts_dotted_form():
    assert build_sqlite.resolve_data_version("2026.11.2") == "2026.11.2"


def test_resolve_data_version_rejects_invalid():
    import pytest

    with pytest.raises(ValueError, match="Invalid data version"):
        build_sqlite.resolve_data_version("banana")


def test_resolve_data_version_rejects_invalid_month():
    import pytest

    with pytest.raises(ValueError, match="month must be 1-12"):
        build_sqlite.resolve_data_version("2026.13.1")


def test_resolve_data_version_rejects_zero_patch():
    import pytest

    with pytest.raises(ValueError, match="N must be at least 1"):
        build_sqlite.resolve_data_version("2026.1.0")


def test_resolve_data_version_rejects_zero_month():
    import pytest

    with pytest.raises(ValueError, match="month must be 1-12"):
        build_sqlite.resolve_data_version("2026.0.0")


def test_sqlite_row_count_mismatch_raises(monkeypatch, tmp_path):
    import pytest

    ini = tmp_path / "database.ini"
    ini.write_text("x", encoding="utf-8")
    dump = tmp_path / "dump.sql"
    dump.write_text("x", encoding="utf-8")
    monkeypatch.setattr(build_sqlite, "DATABASE_CONFIG", ini)
    monkeypatch.setattr(build_sqlite, "DUMP_SQL_PATH", dump)

    def fake_pg_counts(_pg_conn):
        return {table: 10 for table in build_sqlite.EXPORT_TABLES}

    def fake_sqlite_counts(_sqlite_conn):
        counts = {table: 10 for table in build_sqlite.EXPORT_TABLES}
        counts["citations"] = 9
        return counts

    monkeypatch.setattr(build_sqlite, "postgres_row_counts", fake_pg_counts)
    monkeypatch.setattr(build_sqlite, "sqlite_row_counts", fake_sqlite_counts)

    class DummyPgConn:
        def close(self):
            pass

    class DummySqliteConn:
        def commit(self):
            pass

        def close(self):
            pass

    def fake_connect_postgres():
        return DummyPgConn()

    def fake_sqlite_connect(_path):
        return DummySqliteConn()

    monkeypatch.setattr(build_sqlite, "connect_postgres", fake_connect_postgres)
    monkeypatch.setattr(build_sqlite.sqlite3, "connect", fake_sqlite_connect)
    monkeypatch.setattr(build_sqlite, "create_sqlite_schema", lambda _c: None)
    monkeypatch.setattr(
        build_sqlite,
        "copy_citations",
        lambda _p, _s: 10,
    )
    monkeypatch.setattr(build_sqlite, "copy_families", lambda _p, _s: 10)
    monkeypatch.setattr(build_sqlite, "copy_graphs", lambda _p, _s: 10)
    monkeypatch.setattr(build_sqlite, "copy_functions", lambda _p, _s: 10)
    monkeypatch.setattr(
        build_sqlite,
        "copy_rational_preperiodic",
        lambda _p, _s: 10,
    )
    monkeypatch.setattr(build_sqlite, "insert_metadata", lambda *_a, **_k: None)

    output = build_sqlite.REPOSITORY_ROOT / "data" / "exports" / "test_mismatch.sqlite"
    with pytest.raises(RuntimeError, match="Row count mismatch"):
        build_sqlite.build_sqlite(output)


def test_main_handles_sqlite_error(monkeypatch, capsys):
    def boom(*_args, **_kwargs):
        raise sqlite3.OperationalError("disk I/O error")

    monkeypatch.setattr(sys, "argv", ["build_sqlite.py"])
    monkeypatch.setattr(build_sqlite, "resolve_data_version", lambda _v: "2026.10.1")
    monkeypatch.setattr(build_sqlite, "build_sqlite", boom)

    assert build_sqlite.main() == 1
    assert "disk I/O error" in capsys.readouterr().err


def test_citations_label_is_unique_in_schema():
    import sqlite3

    connection = sqlite3.connect(":memory:")
    build_sqlite.create_sqlite_schema(connection)
    connection.execute(
        "INSERT INTO citations (label, id) VALUES ('a', 1)"
    )
    try:
        connection.execute(
            "INSERT INTO citations (label, id) VALUES ('a', 2)"
        )
        raised = False
    except sqlite3.IntegrityError:
        raised = True
    assert raised
    connection.close()


def test_temporary_output_path_suffix():
    output = Path("data/exports/dads.sqlite")
    assert build_sqlite.temporary_output_path(output) == Path(
        "data/exports/dads.sqlite.tmp"
    )


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
