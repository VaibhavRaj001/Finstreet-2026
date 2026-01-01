from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models.user import User
from utils.token_utils import generate_token
from utils.email_utils import send_email
import jwt, datetime, os, hashlib

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

#SIGNUP 
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    if User.find_by_email(email):
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode()
    raw, hashed = generate_token()

    User.create(name, email, hashed_password, hashed)

    link = f"http://localhost:5000/api/auth/verify-email/{raw}"
    send_email(email, "Verify Email", link)

    return jsonify({"message": "Signup successful. Verify email."}), 201


#VERIFY EMAIL
@auth_bp.route("/verify-email/<token>", methods=["GET"])
def verify_email(token):
    hashed = hashlib.sha256(token.encode()).hexdigest()
    User.verify_email(hashed)
    return jsonify({"message": "Email verified successfully"})


#LOGIN 
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.find_by_email(email)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not user["is_verified"]:
        return jsonify({"error": "Verify email first"}), 403

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    payload = {
        "user_id": user["id"],
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }

    token = jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")
    return jsonify({"token": token})


#FORGOT PASSWORD 
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    email = request.json.get("email")
    user = User.find_by_email(email)

    if not user:
        return jsonify({"message": "If email exists, link sent"})

    raw, hashed = generate_token()
    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)

    User.save_reset_token(email, hashed, expiry)

    link = f"http://localhost:5000/api/auth/reset-password/{raw}"
    send_email(email, "Reset Password", link)

    return jsonify({"message": "Password reset link sent"})


#RESET PASSWORD 
@auth_bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    new_password = request.json.get("password")
    hashed_token = hashlib.sha256(token.encode()).hexdigest()
    hashed_password = bcrypt.generate_password_hash(new_password).decode()

    if User.reset_password(hashed_token, hashed_password):
        return jsonify({"message": "Password reset successful"})
    return jsonify({"error": "Invalid or expired token"}), 400
