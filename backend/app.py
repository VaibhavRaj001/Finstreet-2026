from flask import Flask
from flask_cors import CORS
from routes.health import health_bp
from routes.db_test import db_bp


app = Flask(__name__)
CORS(app)
app.register_blueprint(db_bp, url_prefix="/api")
# register blueprints
app.register_blueprint(health_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5000)

