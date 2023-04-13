from flask import Flask, jsonify, request
from flask_cors import CORS
from static.test_dict import test_data
import csv

app = Flask(__name__)
CORS(app)


@app.route("/data", methods=['POST', 'GET'])
def data():
    with open('./static/test_data.csv', encoding='utf-8') as csv_file:
        csvReader = csv.DictReader(csv_file)

        jsonData = []

        for row in csvReader:
            print(row)
            jsonData.append(row)

        user = request.get_json()
        print(user)
    return jsonify(jsonData)




@app.route("/filterData", methods=['POST', 'GET'])
def filterData():
    try:
        user = request.get_json()
        print(user)
        print(user['dimension'])

        filtered = [d for d in test_data if int(d['N']) in user['dimension']]
        return filtered
    
    except Exception as error:
        print("An exception occurred:", error)
        return

if __name__ == "__main__":
    app.run()
