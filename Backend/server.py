from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from PostgresConnector import PostgresConnector
from flask_restful import Resource, Api

app = Flask(__name__)
CORS(app, origins=["*", "http://frontend:3000"])
api = Api(app)
connector = PostgresConnector()


class Data1(Resource):
    
    @staticmethod
    def controller():
        try:
            data = connector.getAllSystems()
            return data
        except Exception as err:
            return {"Message" : str(err)}, 400
    
    def get(self):
        return self.controller()
    
    def post(self):
        return self.controller()


# return all dynamical systems
# @app.route("/getAllSystems", methods=['POST', 'GET'])
# def data1():
#     data = connector.getAllSystems()
#     return jsonify(data)


# expects json with attribute 'label' and value as the label of the system
# @app.route("/getSystem", methods=['POST', 'GET'])
# def data2():
#     input = request.get_json()
#     data = connector.getSystem(input['label'])
#     return jsonify(data)

class Data2(Resource):
    
    @staticmethod
    def controller():
        try:
            input = request.get_json()
            data = connector.getSystem(input['label'])
            return data
        except Exception as err:
            return {"Message" : str(err)}, 400
    
    def get(self):
        return self.controller()
    
    def post(self):
        return self.controller()


# expects json with attribute 'labels' and value as list of labels
# @app.route("/getSelectedSystems", methods=['POST', 'GET'])
# def data3():
#     input = request.get_json()
#     data = connector.getSelectedSystems(input['labels'])
#     return jsonify(data)

class Data3(Resource):
    
    @staticmethod
    def controller():
        try:
            input = request.get_json()
            data = connector.getSelectedSystems(input['labels'])
            return data
        except Exception as err:
            return {"Message" : str(err)}, 400
    
    def get(self):
        return self.controller()
    
    def post(self):
        return self.controller()

# expects json describing filters, returns the systems that satisfy filters
# example call json data that would return systems with degree of 2 and 3, dimension = 4: {"degree": [2,3], "N": [4]}
# @app.route("/getFilteredSystems", methods=['POST', 'GET'])
# def data4():
#     filters = request.get_json()
#     results,stats = connector.getFilteredSystems(filters)
#     data = {
#         "results": results,
#         "statistics": stats
#     }
#     return jsonify(data)

class Data4(Resource):
    
    @staticmethod
    def controller():
        try:
            filters = request.get_json()
            results,stats = connector.getFilteredSystems(filters)
            data = {
                "results": results,
                "statistics": stats
            }
            return data
        except Exception as err:
            return {"Message" : str(err)}, 400
    
    def get(self):
        return self.controller()
    
    def post(self):
        return self.controller()


# expects json describing filters, returns stats on the systems that satisfy those filters in an array
# @app.route("/getStatistics", methods=['POST', 'GET'])
# def data5():
#     filters = request.get_json()
#     data = connector.getStatistics(filters)
#     return jsonify(data)

class Data5(Resource):
    
    @staticmethod
    def controller():
        try:
            filters = request.get_json()
            data = connector.getStatistics(filters)
            return data
        except Exception as err:
            return {"Message" : str(err)}, 400
    
    def get(self):
        return self.controller()
    
    def post(self):
        return self.controller()

api.add_resource(Data1, "/getAllSystems")
api.add_resource(Data2, "/getSystem")
api.add_resource(Data3, "/getSelectedSystems")
api.add_resource(Data4, "/getFilteredSystems")
api.add_resource(Data5, "/getStatistics")


if __name__ == "__main__":
    app.run()
