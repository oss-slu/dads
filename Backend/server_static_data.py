"""
Module Dockstring
Description of file:
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from static.test_dict import test_data
import csv

# old test server to use with static data

app = Flask(__name__)
CORS(app)


@app.route('/data', methods=['POST', 'GET'])
def data():
    with open('./static/test_data.csv', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        json_data = []

        for row in csv_reader:
            print(row)
            json_data.append(row)

        user = request.get_json()
        print(user)
    return jsonify(json_data)


@app.route('/filter_data', methods=['POST', 'GET'])
def filter_data():
    try:
        filters = request.get_json()

        filtered = []

        for item in test_data:
            add = True
            for fil in filters:
                if filters[fil] != []:
                    if (
                        filter in item and
                        str(item[fil]) not in str(filters[fil])
                        ):
                        add = False
                        break
            if add:
                filtered.append(item)

        return filtered

    except Exception as error:
        print('An exception occurred:', error)
        return

if __name__ == '__main__':
    app.run()
