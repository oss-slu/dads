"""Unit tests for SqliteConnector."""

from __future__ import annotations

import importlib.util
import json
import sqlite3
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
BACKEND_ROOT = REPO_ROOT / "Backend"
SCRIPT_PATH = REPO_ROOT / "scripts" / "build_sqlite.py"


def _load_build_sqlite():
    spec = importlib.util.spec_from_file_location("build_sqlite", SCRIPT_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules["build_sqlite"] = module
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


build_sqlite = _load_build_sqlite()
sys.path.insert(0, str(BACKEND_ROOT))

from dads.connectors.sqlite import SqliteConnector  # noqa: E402 pylint: disable=wrong-import-position


@pytest.fixture(name="tiny_sqlite_path")
def tiny_sqlite_path_fixture(tmp_path):
    """Minimal dads.sqlite with one searchable system."""
    db_path = tmp_path / "tiny.sqlite"
    connection = sqlite3.connect(db_path)
    build_sqlite.create_sqlite_schema(connection)
    connection.execute(
        "INSERT INTO metadata (key, value) VALUES ('schema_version', ?)",
        ("2",),
    )
    model = json.dumps(
        {
            "coeffs": [["1", "0", "1"], ["0", "0", "1"]],
            "resultant": "1",
            "bad_primes": None,
            "height": 0.0,
            "base_field_label": "1.1.1.1",
        }
    )
    connection.execute(
        """
        INSERT INTO functions_dim_1_nf (
            function_id, degree, base_field_label, base_field_degree,
            sigma_one, sigma_two, ordinal, citations, family,
            original_model, monic_centered, reduced_model,
            newton_polynomial_coeffs, display_model,
            is_polynomial, is_chebyshev, is_newton, is_lattes, is_pcf,
            cp_cardinality, cp_field_of_defn, automorphism_group_cardinality,
            rational_twists, critical_portrait_graph_id
        ) VALUES (
            99, 2, '1.1.1.1', 1,
            'abc', 'def', 1, NULL, '[1]',
            ?, NULL, ?,
            NULL, 'original',
            1, 0, 0, 0, 0,
            2, '1.1.1.1', 1,
            NULL, NULL
        )
        """,
        (model, model),
    )
    connection.execute(
        """
        INSERT INTO graphs_dim_1_nf (
            graph_id, cardinality, edges, num_components,
            periodic_cycles, periodic_cardinality, preperiodic_components,
            positive_in_degree, max_tail, type
        ) VALUES (50, 0, '[]', 0, '[2]', 0, '[]', 0, 0, 1)
        """
    )
    connection.execute(
        """
        INSERT INTO rational_preperiodic_dim_1_nf (
            id, function_id, base_field_label, rational_periodic_points, graph_id
        ) VALUES (1, 99, '1.1.1.1', '[]', 50)
        """
    )
    connection.execute(
        """
        INSERT INTO families_dim_1_nf (
            family_id, name, degree, num_parameters,
            model_coeffs, model_resultant, base_field_label, base_field_degree,
            sigma_one, sigma_two, ordinal, citations, is_polynomial,
            num_critical_points, automorphism_group_cardinality
        ) VALUES (
            1, 'poly_deg_2', 2, 1, '[[\"1\",\"0\",\"t\"],[\"0\",\"0\",\"1\"]]',
            '1', '1.1.1.1', 1, 's1', 's2', 1, '[1]', 1, 2, 1
        )
        """
    )
    connection.commit()
    connection.close()
    return db_path


def test_schema_version_rejected(tmp_path):
    db_path = tmp_path / "bad.sqlite"
    connection = sqlite3.connect(db_path)
    build_sqlite.create_sqlite_schema(connection)
    connection.execute(
        "INSERT INTO metadata (key, value) VALUES ('schema_version', '1')"
    )
    connection.commit()
    connection.close()
    with pytest.raises(ValueError, match="schema_version"):
        SqliteConnector(db_path)


def test_get_system_and_family_filter(tiny_sqlite_path):
    connector = SqliteConnector(tiny_sqlite_path)
    system = connector.get_system(99)
    assert system["function_id"] == 99
    assert system["modelLabel"] == "1.abc.def.1"
    assert system["original_model"]["coeffs"] is not None

    where_sql, params = connector.build_where_text({"family": [1]})
    assert "json_each" in where_sql
    assert params == [1]

    results, count = connector.get_filtered_systems({"family": [1]})
    assert count == 1
    assert len(results) == 1
    assert results[0][-1] == 99


def test_degree_search(tiny_sqlite_path):
    connector = SqliteConnector(tiny_sqlite_path)
    results, count = connector.get_filtered_systems({"degree": [2]})
    assert count == 1
    assert len(results) == 1