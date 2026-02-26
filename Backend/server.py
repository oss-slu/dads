"""
Module Dcstring: This file manages interactions
between frontend and backend
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from postgres_connector import PostgresConnector
import uuid
import traceback

app = Flask(__name__)
CORS(app, origins='*')

connector = PostgresConnector()

@app.errorhandler(Exception)
def handle_error(e, custom_message="An unexpected server error occurred."):
    error_id = str(uuid.uuid4())[:8]
    print(f"--- ERROR {error_id} ---")
    traceback.print_exc()
    response = {
        "error": "A server error occurred. Please report this ID if the issue persists.",
        "error_id": error_id
    }
    return jsonify(response), 500

@app.route('/get_family', methods=['POST'])
def get_family():
    target = request.get_json()
    data = connector.get_family(target['id'])
    return jsonify(data)

# return all dynamical systems
@app.route('/get_all_systems', methods=['POST', 'GET'])
def data1():
    data = connector.get_all_systems()
    return jsonify(data)

# expects json with attribute 'label' and value as the label of the system
@app.route('/get_system', methods=['POST', 'GET'])
def data2():
    target = request.get_json()
    data = connector.get_system(target['id'])
    return jsonify(data)

# expects json with attribute 'labels' and value as list of labels
@app.route('/get_selected_systems', methods=['POST', 'GET'])
def data3():
    target = request.get_json()
    data = connector.get_selected_systems(target['labels'])
    return jsonify(data)

# expects json describing filters, returns the systems that satisfy filters
# example call json data that would return systems with degree of 2 and 3,
# dimension = 4: {'degree': [2,3], 'N': [4]}
@app.route('/get_filtered_systems', methods=['POST', 'GET'])
def data4():
    filters = request.get_json()
    results, stats = connector.get_filtered_systems(filters)
    data = {
        'results': results,
        'statistics': stats
    }
    return jsonify(data)

# expects json describing filters, returns stats on the systems that
# satisfy those filters in an array
@app.route('/get_statistics', methods=['POST', 'GET'])
def data5():
    filters = request.get_json()
    data = connector.get_statistics(filters)
    return jsonify(data)

@app.route('/get_all_families', methods=['POST', 'GET'])
def data6():
    data = connector.get_all_families()
    return jsonify(data)

@app.route('/get_rational_periodic_data', methods=['POST', 'GET'])
def data7():
    function_id = request.get_json()['function_id']
    data = connector.get_rational_periodic_data(function_id)
    return jsonify(data)

@app.route('/get_label', methods=['POST', 'GET'])
def data8():
    function_id = request.get_json()['function_id']
    label = connector.get_label(function_id)
    return jsonify({'label': label})

@app.route('/get_graph_data', methods=['POST', 'GET'])
def data9():
    graph_id = request.get_json()['graph_id']
    data = connector.get_graph_data(graph_id)
    return jsonify(data)

@app.route('/get_graph_metadata', methods=['POST'])
def get_graph_metadata():
    graph_id = request.get_json().get('graph_id')
    if graph_id is None:
        return jsonify({'error': 'graph_id is required'}), 400
    metadata = connector.get_graph_metadata(graph_id)
    return jsonify(metadata)
    
if __name__ == '__main__':
    app.run()
