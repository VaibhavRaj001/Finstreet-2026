from database.db import get_db_connection

class User:
    @staticmethod
    def find_by_email(email):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()
        return user

    @staticmethod
    def create(name, email, password):
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        INSERT INTO users (name, email, password)
        VALUES (%s, %s, %s)
        """
        cursor.execute(query, (name, email, password))
        conn.commit()

        cursor.close()
        conn.close()
