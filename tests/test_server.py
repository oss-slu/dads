"""Unit tests for the /health endpoint."""
from unittest.mock import patch

MOCK_CONFIG = {"dbname": "test", "user": "test", "password": "test", "host": "localhost"}

with patch("postgres_connector.load_config", return_value=MOCK_CONFIG), \
     patch("psycopg2.connect"):
    from server import app


def test_health_returns_ok_status():
    client = app.test_client()
    response = client.get('/health')

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "ok"
    assert isinstance(data["db"], bool)
