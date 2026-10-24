"""Unit tests for postgres_connector module."""

from unittest.mock import MagicMock, patch

import pytest
from psycopg2 import sql

from dads.connectors.postgres import PostgresConnector

COMMON_MOCK_CONFIG = {
    "dbname": "test",
    "user": "test",
    "password": "test",
    "host": "localhost",
}


@patch("dads.connectors.postgres.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_get_all_systems(mock_connect, mock_config):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    mock_cur = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cur
    mock_cur.fetchall.return_value = [("System1",), ("System2",)]
    mock_cur.description = [("name",)]

    connector = PostgresConnector()
    connector.connection = mock_conn
    result = connector.get_all_systems()

    executed = mock_cur.execute.call_args[0][0]
    assert "functions_dim_1_nf" in executed.as_string(mock_conn).lower()
    assert result[0]["name"] == "System1"
    assert result[1]["name"] == "System2"


@patch.object(PostgresConnector, "is_connection_active", return_value=True)
@patch("dads.connectors.postgres.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_get_all_systems_connection_failure(
    mock_connect, mock_config, mock_active
):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    mock_cur = MagicMock()
    mock_cur.execute.side_effect = Exception("db down")
    mock_conn.cursor.return_value.__enter__.return_value = mock_cur

    connector = PostgresConnector()
    connector.connection = mock_conn

    with pytest.raises(Exception, match="db down"):
        connector.get_all_systems()


@patch("dads.connectors.postgres.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_get_system(mock_connect, mock_config):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    mock_cur = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cur
    mock_cur.description = [
        ("sigma_one",),
        ("sigma_two",),
        ("ordinal",),
        ("function_id",),
    ]
    mock_cur.fetchone.return_value = ("a", "b", 1, 123)

    connector = PostgresConnector()
    connector.connection = mock_conn
    result = connector.get_system("Label1")
    assert result["modelLabel"] == "1.a.b.1"


@patch("dads.connectors.postgres.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_get_system_no_result(
    mock_connect, mock_config
):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    mock_cur = MagicMock()
    mock_cur.fetchone.return_value = None
    mock_conn.cursor.return_value.__enter__.return_value = mock_cur

    connector = PostgresConnector()
    connector.connection = mock_conn
    result = connector.get_system("nonexistent")
    assert result == {}


@patch("dads.connectors.postgres.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_get_selected_systems(
    mock_connect, mock_config
):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    mock_cur = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cur
    mock_cur.fetchall.return_value = [
        ("SelectedSystem1",),
        ("SelectedSystem2",),
    ]
    mock_cur.description = [("name",)]

    connector = PostgresConnector()
    connector.connection = mock_conn
    result = connector.get_selected_systems(["Label1", "Label2"])

    assert result[0]["name"] == "SelectedSystem1"
    assert result[1]["name"] == "SelectedSystem2"


@patch("dads.connectors.postgres.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_get_label_not_found(
    mock_connect, mock_config
):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    mock_cur = MagicMock()
    mock_cur.fetchone.return_value = None
    mock_conn.cursor.return_value.__enter__.return_value = mock_cur

    connector = PostgresConnector()
    connector.connection = mock_conn
    result = connector.get_label("unknown")
    assert result is None


@patch("dads.connectors.postgres.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_get_statistics_empty_where(
    mock_connect, mock_config
):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    mock_cur = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cur
    mock_cur.fetchone.return_value = (0,)

    connector = PostgresConnector()
    connector.connection = mock_conn
    result = connector.get_statistics(sql.SQL(""), [])
    assert result == 0


@patch("dads.connectors.postgres.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_build_where_text(mock_connect, mock_config):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    connector = PostgresConnector()
    connector.connection = mock_conn

    filters = {
        "dimension": [2],
        "degree": [3, 4],
        "is_polynomial": [True],
        "is_Lattes": [],
        "is_Chebyshev": [False],
        "is_Newton": [True],
        "is_pcf": [True],
        "customDegree": "",
        "customDimension": "",
        "automorphism_group_cardinality": "5",
        "base_field_label": "",
        "base_field_degree": "2",
        "indeterminacy_locus_dimension": "",
    }

    where_sql, params = connector.build_where_text(filters)
    assert where_sql != sql.SQL("")
    assert params == [2, 3, 4, True, False, True, True, "5", "2"]


@patch("dads.connectors.postgres.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_build_where_text_empty(
    mock_connect, mock_config
):  # pylint: disable=unused-argument
    connector = PostgresConnector()
    connector.connection = mock_connect.return_value
    where_sql, params = connector.build_where_text({})
    assert where_sql == sql.SQL("")
    assert params == []
