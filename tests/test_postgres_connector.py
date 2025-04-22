"""Unit tests for postgres_connector module."""

from postgres_connector import PostgresConnector
from unittest.mock import MagicMock, patch

COMMON_MOCK_CONFIG = {
    "dbname": "test",
    "user": "test",
    "password": "test",
    "host": "localhost",
}


@patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
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

    mock_cur.execute.assert_any_call("SELECT * FROM functions_dim_1_NF")
    assert result[0]["name"] == "System1"
    assert result[1]["name"] == "System2"


@patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect", side_effect=Exception("fail"))
def test_get_all_systems_connection_failure(
    mock_connect, mock_config
):  # pylint: disable=unused-argument
    connector = PostgresConnector()
    connector.connection = MagicMock()
    result = connector.get_all_systems()
    assert result == []


@patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_get_system(mock_connect, mock_config):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    mock_cur = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cur
    mock_cur.fetchone.return_value = {
        "sigma_one": "a",
        "sigma_two": "b",
        "ordinal": 1,
        "function_id": 123,
    }

    connector = PostgresConnector()
    connector.connection = mock_conn
    result = connector.get_system("Label1")
    assert result["modelLabel"] == "1.a.b.1"


@patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
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


@patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
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


@patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
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


# @patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
# @patch("psycopg2.connect")
# def test_get_statistics(mock_connect, mock_config):
#     mock_conn = mock_connect.return_value
#     mock_cur = MagicMock()
#     mock_conn.cursor.return_value = mock_cur
#     mock_cur.fetchall.side_effect = [
#         [(10,)],  # Maps
#         [(2.5,)],  # AUT
#         [(5,)],  # PCF
#         [(3.0,)],  # Average Height
#         [(100,)]  # Average Resultant
#     ]

#     connector = PostgresConnector()
#     result = connector.get_statistics("WHERE degree IN (2) AND N IN (4)")
#     assert len(result) == 13
#     assert result[1] == 2.5     # AUT
#     assert result[2] == 5       # PCF
#     assert result[3] == 3.0     # Avg Heighta
#     # assert result[4][0][0] == 100  # Average Resultant


@patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_get_statistics_empty_lists(
    mock_connect, mock_config
):  # pylint: disable=unused-argument
    mock_conn = mock_connect.return_value
    mock_cur = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cur

    mock_cur.fetchall.side_effect = [[(0,)], [(0,)], [(0,)], [(0,)]] + [[]] * 9
    mock_cur.fetchone.return_value = (0, 0)

    connector = PostgresConnector()
    connector.connection = mock_conn
    result = connector.get_statistics("")
    assert result[0] == 0
    assert result[1] == 0
    assert result[2] == 0
    assert result[3] == 0


@patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_build_where_text(mock_connect, mock_config):  # pylint: disable=unused-argument
    connector = PostgresConnector()
    connector.connection = mock_connect.return_value

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

    where_clause = connector.build_where_text(filters)
    expected = (
        " WHERE dimension IN (2) AND degree IN (3, 4) AND is_polynomial"
        " IN (True) AND is_Chebyshev IN (False) AND is_Newton IN (True) "
        "AND is_pcf IN (True) AND CAST(automorphism_group_cardinality AS "
        "integer) IN (5) AND CAST(base_field_degree AS integer) IN (2)"
    )
    assert where_clause == expected


@patch("postgres_connector.load_config", return_value=COMMON_MOCK_CONFIG)
@patch("psycopg2.connect")
def test_build_where_text_empty(
    mock_connect, mock_config
):  # pylint: disable=unused-argument
    connector = PostgresConnector()
    connector.connection = mock_connect.return_value
    assert connector.build_where_text({}) == ""
