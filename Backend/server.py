from flask import Flask, jsonify, request
from flask_cors import CORS
from Connector import getAllSystems, getFilteredSystems, getSystem

app = Flask(__name__)
CORS(app)

@app.route("/getSystem", methods=['POST', 'GET'])
def data1():
    input = request.get_json()
    print(input)
    data = getSystem(input['label'])
    return jsonify(data)

@app.route("/getAllSystems", methods=['POST', 'GET'])
def data2():
    data = getAllSystems()
    return jsonify(data)

@app.route("/getFilteredSystems", methods=['POST', 'GET'])
def data3():
    filters = request.get_json()
    data = getFilteredSystems(filters)
    return jsonify(data)


if __name__ == "__main__":
    app.run()
