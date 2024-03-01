from flask import Flask, request, Response
from flask_cors import CORS
from PostgresConnector import PostgresConnector
from flask_restful import Resource, Api
from DBConnector import DB_URL, db
from sqlalchemy import text
from models.users_model import User
from models.citation_model import CitationsModel
# from models.families_dim_nf_1_model import FamiliesDimNF1Model

app = Flask(__name__)
CORS(app, origins=["*", "http://frontend:3000"])
api = Api(app)
app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL
# connector = PostgresConnector()
db.init_app(app)


class Users(Resource):
    
    def get(self):
        record = CitationsModel(label = "BFHJY2018",
                                authors = ['Robert Benedetto', 'Xander Faber', 'Benjamin Hutz', 'Jamie Juul', 'Yu Yasafuku'],
                                journal = 'Research in Number Theory',
                                year = 2017,
                                citation = "Robert Benedetto, Xander Faber, Benjamin Hutz, Jamie Juul, Yu Yasafuku. A large arboreal Galois representation for a cubic postcritically finite polynomial.",
                                mathscinet = "MR3736808")
        db.session.add(record)
        db.session.commit()
        # res = FamiliesDimNF1Model.query.all()
        res = CitationsModel.query.all()
        for i in res:
            print(i)
        return {"data" : "hello"}

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
api.add_resource(Users, "/users")


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug = True)
