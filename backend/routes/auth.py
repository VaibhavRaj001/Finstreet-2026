from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models.user import User
import jwt
import datetime
import os

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # basic validation
    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # check if user exists
    if User.find_by_email(email):
        return jsonify({"error": "User already exists"}), 409

    # hash password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # create user
    User.create(name, email, hashed_password)

    return jsonify({"message": "Signup successful"}), 201



@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.find_by_email(email)

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    payload = {
        "user_id": user["id"],
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }

    token = jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token
    }), 200


from middlewares.auth_middleware import token_required

@auth_bp.route("/profile", methods=["GET"])
@token_required
def profile():
    return jsonify({
        "message": "Protected route accessed",
        "user": request.user
    }), 200
