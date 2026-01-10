from flask import Blueprint, jsonify
from database.db import get_db_connection

db_bp = Blueprint("db", __name__)

@db_bp.route("/db-test", methods=["GET"])
def db_test():
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({"message": "Database connected successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
