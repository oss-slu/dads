"""Tests for the family array filter (issue #347)."""

from unittest.mock import MagicMock, patch

import pytest
from psycopg2 import sql

from postgres_connector import PostgresConnector

COMMON_MOCK_CONFIG = {
    "dbname": "test",
    "user": "test",
    "password": "test",
    "host": "localhost",
}


@pytest.fixture(name="connector")
def connector_fixture():
    with patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG):
        with patch("psycopg2.connect"):
            instance = PostgresConnector()
            instance.connection = MagicMock()
            return instance


def test_build_where_family_single_id(connector):
    where_sql, params = connector.build_where_text({"family": [1]})
    mock_conn = connector.connection
    fragment = where_sql.as_string(mock_conn)
    assert "f.family &&" in fragment
    assert "int[]" in fragment
    assert params == [[1]]


def test_build_where_family_two_ids(connector):
    where_sql, params = connector.build_where_text({"family": [1, 2]})
    fragment = where_sql.as_string(connector.connection)
    assert "f.family &&" in fragment
    assert params == [[1, 2]]


def test_build_where_family_composed_sql(connector):
    where_sql, _params = connector.build_where_text({"family": [1]})
    assert isinstance(where_sql, sql.Composed)
    assert where_sql != sql.SQL("")
