"""Flask application factory for DADS."""

import traceback
import uuid

from flask import Flask, jsonify
from flask_cors import CORS

from dads.api.routes import register_routes
from dads.connectors.postgres import PostgresConnector
from dads.constants import CONNECTOR_CONFIG_KEY


def create_app(connector=None):
    """Build the Flask app, optionally injecting a database connector for tests."""
    application = Flask(__name__)
    CORS(application, origins="*")
    if connector is None:
        connector = PostgresConnector()
    application.config[CONNECTOR_CONFIG_KEY] = connector

    @application.errorhandler(Exception)
    def handle_error(e):
        error_id = str(uuid.uuid4())[:8]
        print(f"--- ERROR {error_id} ---")
        traceback.print_exc()
        response = {
            "error": "A server error occurred. Please report this ID if the issue persists.",
            "error_id": error_id,
        }
        return jsonify(response), 500

    register_routes(application)
    return application
