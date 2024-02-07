import pytest
from flask import json
from unittest.mock import patch
from server import app  

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

@patch('server.PostgresConnector')
def test_get_all_systems(MockConnector, client):
    mock_connector = MockConnector.return_value
    mock_connector.getAllSystems.return_value = [{'id': 1, 'name': 'System1'}, {'id': 2, 'name': 'System2'}]

    response = client.get('/getAllSystems')
    data = json.loads(response.data)

    assert response.status_code == 200
    assert len(data) == 2
    assert data[0]['name'] == 'System1'
    assert data[1]['name'] == 'System2'

@patch('server.PostgresConnector')
def test_get_system(MockConnector, client):
    mock_connector = MockConnector.return_value
    mock_connector.getSystem.return_value = [{'id': 1, 'name': 'SpecificSystem'}]

    response = client.post('/getSystem', json={'label': 'SpecificLabel'})
    data = json.loads(response.data)

    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['name'] == 'SpecificSystem'
@patch('server.PostgresConnector')
def test_get_selected_systems(MockConnector, client):
    mock_connector = MockConnector.return_value
    mock_connector.getSelectedSystems.return_value = [{'id': 1, 'name': 'SelectedSystem1'}]

    response = client.post('/getSelectedSystems', json={'labels': ['Label1', 'Label2']})
    data = json.loads(response.data)

    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['name'] == 'SelectedSystem1'

@patch('server.PostgresConnector')
def test_get_filtered_systems(MockConnector, client):
    mock_connector = MockConnector.return_value
    mock_connector.getFilteredSystems.return_value = [{'id': 3, 'name': 'FilteredSystem'}]

    response = client.post('/getFilteredSystems', json={'degree': [2, 3], 'N': [4]})
    data = json.loads(response.data)

    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['name'] == 'FilteredSystem'

@patch('server.PostgresConnector')
def test_get_statistics(MockConnector, client):
    mock_connector = MockConnector.return_value
    mock_connector.getStatistics.return_value = [{'count': 10, 'average_degree': 2.5}]

    response = client.post('/getStatistics', json={'degree': [2, 3], 'N': [4]})
    data = json.loads(response.data)

    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['count'] == 10
    assert data[0]['average_degree'] == 2.5