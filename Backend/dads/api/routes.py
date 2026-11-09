"""HTTP route handlers for the DADS API."""

from flask import current_app, jsonify, request

from dads.constants import CONNECTOR_CONFIG_KEY


def get_connector():
    return current_app.config[CONNECTOR_CONFIG_KEY]


def register_routes(application):
    @application.route('/get_family', methods=['POST'])
    def get_family():
        target = request.get_json()
        data = get_connector().get_family(target['id'])
        return jsonify(data)

    @application.route('/get_all_systems', methods=['POST', 'GET'])
    def data1():
        data = get_connector().get_all_systems()
        return jsonify(data)

    @application.route('/get_system', methods=['POST', 'GET'])
    def data2():
        target = request.get_json()
        data = get_connector().get_system(target['id'])
        return jsonify(data)

    @application.route('/get_selected_systems', methods=['POST', 'GET'])
    def data3():
        target = request.get_json()
        data = get_connector().get_selected_systems(target['labels'])
        return jsonify(data)

    @application.route('/get_filtered_systems', methods=['POST', 'GET'])
    def data4():
        filters = request.get_json()
        results, stats = get_connector().get_filtered_systems(filters)
        data = {
            'results': results,
            'statistics': stats
        }
        return jsonify(data)

    @application.route('/get_statistics', methods=['POST', 'GET'])
    def data5():
        filters = request.get_json()
        connector = get_connector()
        where_sql, params = connector.build_where_text(filters)
        data = connector.get_statistics(where_sql, params)
        return jsonify(data)

    @application.route('/get_all_families', methods=['POST', 'GET'])
    def data6():
        data = get_connector().get_all_families()
        return jsonify(data)

    @application.route('/get_filtered_families', methods=['POST'])
    def get_filtered_families():
        filters = request.get_json()
        data = get_connector().get_filtered_families(filters)
        return jsonify(data)

    @application.route('/get_rational_periodic_data', methods=['POST', 'GET'])
    def data7():
        function_id = request.get_json()['function_id']
        data = get_connector().get_rational_periodic_data(function_id)
        return jsonify(data)

    @application.route('/get_label', methods=['POST', 'GET'])
    def data8():
        function_id = request.get_json()['function_id']
        label = get_connector().get_label(function_id)
        return jsonify({'label': label})

    @application.route('/get_graph_data', methods=['POST', 'GET'])
    def data9():
        graph_id = request.get_json()['graph_id']
        data = get_connector().get_graph_data(graph_id)
        return jsonify(data)

    @application.route('/get_graph_metadata', methods=['POST'])
    def get_graph_metadata():
        graph_id = request.get_json().get('graph_id')
        if graph_id is None:
            return jsonify({'error': 'graph_id is required'}), 400
        metadata = get_connector().get_graph_metadata(graph_id)
        return jsonify(metadata)

    @application.route('/health', methods=['GET'])
    def health():
        connector = get_connector()
        return jsonify({"status": "ok", "db": connector.is_connection_active()}), 200
