from database.db import get_db_connection
import datetime

class User:

    @staticmethod
    def find_by_email(email):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        return user

    @staticmethod
    def create(name, email, password, verification_token):
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
        INSERT INTO users (name, email, password, email_verification_token)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (name, email, password, verification_token))
        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def verify_email(token):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE users
            SET is_verified=1, email_verification_token=NULL
            WHERE email_verification_token=%s
        """, (token,))
        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def save_reset_token(email, token, expiry):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE users
            SET reset_token=%s, reset_token_expiry=%s
            WHERE email=%s
        """, (token, expiry, email))
        conn.commit()
        cursor.close()
        conn.close()

    @staticmethod
    def reset_password(token, new_password):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE users
            SET password=%s, reset_token=NULL, reset_token_expiry=NULL
            WHERE reset_token=%s AND reset_token_expiry > %s
        """, (new_password, token, datetime.datetime.utcnow()))
        success = cursor.rowcount > 0
        conn.commit()
        cursor.close()
        conn.close()
        return success