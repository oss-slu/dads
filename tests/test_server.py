"""Unit tests for the /health endpoint."""

from unittest.mock import MagicMock

from dads.app import create_app


def test_health_returns_ok_status():
    mock_connector = MagicMock()
    mock_connector.is_connection_active.return_value = True
    app = create_app(connector=mock_connector)
    client = app.test_client()
    response = client.get('/health')

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert data["db"] is True


def test_health_reconnects_when_db_was_down():
    mock_connector = MagicMock()
    mock_connector.is_connection_active.side_effect = [False, True]
    client = create_app(connector=mock_connector).test_client()

    response = client.get('/health')

    mock_connector.connect.assert_called_once()
    assert response.get_json() == {"status": "ok", "db": True}