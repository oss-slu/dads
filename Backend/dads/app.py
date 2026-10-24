"""Flask application wiring for DADS."""

import uuid
import traceback

from flask import Flask, jsonify
from flask_cors import CORS

from dads.connectors.postgres import PostgresConnector

app = Flask(__name__)
CORS(app, origins='*')

connector = PostgresConnector()


@app.errorhandler(Exception)
def handle_error(e):
    error_id = str(uuid.uuid4())[:8]
    print(f"--- ERROR {error_id} ---")
    traceback.print_exc()
    response = {
        "error": "A server error occurred. Please report this ID if the issue persists.",
        "error_id": error_id
    }
    return jsonify(response), 500


from dads.api import routes  # noqa: F401,E402
