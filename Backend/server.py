from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from PostgresConnector import getAllSystems, getFilteredSystems, getSystem, getSelectedSystems

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000","*"])

# return all dynamical systems
@app.route("/getAllSystems", methods=['POST', 'GET'])
def data1():
    data = getAllSystems()
    return jsonify(data)


# expects json with attribute 'label' and value as the label of the system
@app.route("/getSystem", methods=['POST', 'GET'])
def data2():
    input = request.get_json()
    data = getSystem(input['label'])
    return jsonify(data)

# expects json with attribute 'labels' and value as list of labels
@app.route("/getSelectedSystems", methods=['POST', 'GET'])
def data3():
    input = request.get_json()
    data = getSelectedSystems(input['labels'])
    return jsonify(data)

# expects json describing filters, returns the systems that satisfy filters
# example call json data that would return systems with degree of 2 and 3, dimension = 4: {"degree": [2,3], "N": [4]}
@app.route("/getFilteredSystems", methods=['POST', 'GET'])
def data4():
    filters = request.get_json()
    data = getFilteredSystems(filters)
    return jsonify(data)


if __name__ == "__main__":
    app.run()
