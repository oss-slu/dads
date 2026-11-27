"""Serve a built React app alongside the Flask API."""

from pathlib import Path

from flask import request, send_from_directory
from werkzeug.exceptions import NotFound


def register_static(app, folder):
    """Serve build files and let React handle otherwise unmatched GET routes."""
    folder = Path(folder).resolve()

    @app.before_request
    def serve_frontend():
        if request.method not in ("GET", "HEAD"):
            return None
        # Flask registers its own /static route, which also matches React assets.
        if request.endpoint != "static" and not isinstance(request.routing_exception, NotFound):
            return None

        if request.path != "/":
            try:
                return send_from_directory(folder, request.path.lstrip("/"))
            except NotFound:
                pass

        return send_from_directory(folder, "index.html")
