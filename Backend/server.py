from flask import Flask, jsonify, request
from flask_cors import CORS
from static.test_dict import test_data
import csv

app = Flask(__name__)
CORS(app)


@app.route("/data")
def index():
    with open('./static/test_data.csv', encoding='utf-8') as csv_file:
        csvReader = csv.DictReader(csv_file)

        jsonData = []

        for row in csvReader:
            print(row)
            jsonData.append(row)
    return jsonify(jsonData)


@app.route("/filterData", methods=['POST', 'GET'])
def login():

    try:
        print('hi')
        user = request.json
        print(user)
        return test_data
    except Exception as error:
        # handle the exception
        # An exception occurred: division by zero
        print("An exception occurred:", error)
        return


if __name__ == "__main__":
    app.run()
