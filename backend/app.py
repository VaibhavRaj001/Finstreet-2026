from flask import Flask
from flask_cors import CORS
from routes.health import health_bp
from routes.db_test import db_bp
from flask_bcrypt import Bcrypt
from routes.auth import auth_bp

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)


app.register_blueprint(health_bp, url_prefix="/api")

app.register_blueprint(auth_bp, url_prefix="/api/auth")

if __name__ == "__main__":
    app.run(debug=True, port=5000)

