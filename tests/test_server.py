"""Unit tests for the /health endpoint."""
from unittest.mock import MagicMock, patch

from dads.app import create_app

MOCK_CONFIG = {"dbname": "test", "user": "test", "password": "test", "host": "localhost"}


@patch("dads.connectors.postgres.load_config", return_value=MOCK_CONFIG)
@patch("psycopg2.connect")
def test_health_returns_ok_status(mock_connect, mock_config):  # pylint: disable=unused-argument
    mock_connector = MagicMock()
    mock_connector.is_connection_active.return_value = True
    app = create_app(connector=mock_connector)
    client = app.test_client()
    response = client.get('/health')

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["db"] is True
