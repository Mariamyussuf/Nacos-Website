import os
from flask import Flask, request, jsonify
import sqlite3
import re
from flask_cors import CORS

app = Flask(__name__)

# Use environment variable for CORS origin, default to localhost for development
CORS(app, resources={r"/api/*": {"origins": os.environ.get("CORS_ORIGIN", "http://localhost:3000")}})

DATABASE = "university.db"
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-fallback-key-change-in-production')


def query_db(query, args=(), one=False):
    conn = None
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(query, args)
        rv = cur.fetchall()
        conn.commit()
        return (rv[0] if rv else None) if one else rv
    except sqlite3.Error as e:
        app.logger.error(f"Database error: {e}")
        raise e
    finally:
        if conn:
            conn.close()


def init_db():
    """Initialize database tables."""
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()

    # Create subscribers table (the only table needed without login)
    cur.execute('''CREATE TABLE IF NOT EXISTS subscribers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')

    conn.commit()
    conn.close()


def is_valid_email(email):
    """Validate email format."""
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(regex, email) is not None


# ── Newsletter Subscription ──────────────────────────────────────────────────

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        email = data.get('email', '').strip()

        if not email:
            return jsonify({'error': 'Email is required'}), 400

        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        query_db("INSERT INTO subscribers (email) VALUES (?)", (email,))
        return jsonify({'message': 'Successfully subscribed!'}), 201

    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already subscribed'}), 400
    except sqlite3.Error:
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception:
        return jsonify({'error': 'An unexpected error occurred'}), 500


@app.route('/api/subscribers', methods=['GET'])
def get_subscribers():
    """List all subscribers (admin use only in production — add auth later)."""
    try:
        subscribers = query_db("SELECT * FROM subscribers")
        return jsonify([{
            'id': row[0],
            'email': row[1],
            'timestamp': row[2]
        } for row in subscribers]), 200
    except Exception:
        return jsonify({'error': 'Failed to fetch subscribers'}), 500


# ── Health Check ─────────────────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({'status': 'ok'}), 200


if __name__ == "__main__":
    init_db()
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
