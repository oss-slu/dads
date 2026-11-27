"""Test serving the React build alongside the API."""

from flask import Flask, jsonify

from static_site import register_static


def test_register_static(tmp_path):
    (tmp_path / "index.html").write_text("<html>DynaBase</html>", encoding="utf-8")
    assets = tmp_path / "static" / "js"
    assets.mkdir(parents=True)
    (assets / "main.js").write_text("console.log('DynaBase')", encoding="utf-8")

    app = Flask(__name__)

    @app.get("/health")
    def health():
        return jsonify(db=True)

    @app.post("/get_family")
    def get_family():
        return jsonify(id=1)

    register_static(app, tmp_path)
    client = app.test_client()

    assert client.get("/static/js/main.js").data == b"console.log('DynaBase')"
    for route in ("/", "/system/11", "/families"):
        response = client.get(route)
        assert response.status_code == 200
        assert response.data == b"<html>DynaBase</html>"
    assert client.get("/health").get_json() == {"db": True}
    assert client.post("/get_family").get_json() == {"id": 1}
    assert client.get("/get_family").status_code == 405
