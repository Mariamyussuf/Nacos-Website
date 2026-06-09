from flask import Flask, request, jsonify
import sqlite3
import re
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})

DATABASE = "university.db"
app.config['SECRET_KEY'] = 'your-secret-key'  


def query_db(query, args=(), one=False):
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(query, args)
        rv = cur.fetchall()
        conn.commit()
        return (rv[0] if rv else None) if one else rv
    except sqlite3.Error as e:
        print(f"Database error: {e}")  # For debugging
        raise e
    finally:
        if conn:
            conn.close()

#  to initialize the database and table
def init_db():
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    
    # Create users table
    cur.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    matric_number TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    name TEXT NOT NULL,
                    level TEXT NOT NULL,
                    programme TEXT NOT NULL,
                    image_url TEXT)''')
    
    # Create subscribers table
    cur.execute('''CREATE TABLE IF NOT EXISTS subscribers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    
    conn.commit()
    conn.close()

#  for email validation
def is_valid_email(email):
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(regex, email) is not None


@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        query_db("INSERT INTO subscribers (email) VALUES (?)", (email,))
        return jsonify({'message': 'Successfully subscribed!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already subscribed'}), 400
    except sqlite3.Error as e:
        print(f"Database error: {e}")  # For debugging
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")  # For debugging
        return jsonify({'error': 'An unexpected error occurred'}), 500


@app.route('/api/subscribers', methods=['GET'])
def get_subscribers():
    try:
        subscribers = query_db("SELECT * FROM subscribers")
        return jsonify([{
            'id': row[0],
            'email': row[1],
            'timestamp': row[2]
        } for row in subscribers]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    print("Login attempt received")  # Debug print
    try:
        data = request.json
        matric_number = data.get('matricNumber')
        password = data.get('password')

        print(f"Login attempt for matric number: {matric_number}")  # Debug print

        if not matric_number or not password:
            return jsonify({'error': 'Please provide both matric number and password'}), 400

        # Query user from database
        user = query_db('SELECT * FROM users WHERE matric_number = ?', 
                       (matric_number,), one=True)

        if not user:
            print(f"No user found with matric number: {matric_number}")  # Debug print
            return jsonify({'error': 'Invalid credentials'}), 401

        if not check_password_hash(user['password'], password):
            print("Invalid password")  # Debug print
            return jsonify({'error': 'Invalid credentials'}), 401

       
        token = jwt.encode({
            'user_id': user['id'],
            'matric_number': user['matric_number'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])

        print("Login successful")  # Debug print

        return jsonify({
            'token': token,
            'user': {
                'name': user['name'],
                'matricNumber': user['matric_number'],
                'level': user['level'],
                'programme': user['programme'],
                'currentSession': '2023/2024',
                'image': user['image_url'] if user['image_url'] else None
            }
        }), 200

    except Exception as e:
        print(f"Login error: {e}")  
        return jsonify({'error': str(e)}), 500


def is_valid_matric_number(matric_number):
    pattern = r'^(202[2-4])/\d{5}$'  # Only accepts years 2022-2024
    return bool(re.match(pattern, matric_number))

def add_test_users():
    try:
        # Database
        test_users = [
            {
                'matric_number': '2022/12345',
                'password': 'password123',
                'name': 'John Doe',
                'level': '300',
                'programme': 'Computer Science'
            },
            {
                'matric_number': '2022/54321',
                'password': 'password123',
                'name': 'Jane Smith',
                'level': '300',
                'programme': 'Information Technology'
            },
            {
                'matric_number': '2023/10001',
                'password': 'password123',
                'name': 'Alice Johnson',
                'level': '200',
                'programme': 'Computer Science'
            },
            {
                'matric_number': '2023/10002',
                'password': 'password123',
                'name': 'Bob Wilson',
                'level': '200',
                'programme': 'Cybersecurity'
            },
            {
                'matric_number': '2023/10003',
                'password': 'password123',
                'name': 'Carol Brown',
                'level': '200',
                'programme': 'Information Technology'
            },
            {
                'matric_number': '2024/20001',
                'password': 'password123',
                'name': 'David Lee',
                'level': '100',
                'programme': 'Computer Science'
            },
            {
                'matric_number': '2024/20002',
                'password': 'password123',
                'name': 'Emma Davis',
                'level': '100',
                'programme': 'Information Technology'
            },
            {
                'matric_number': '2024/20003',
                'password': 'password123',
                'name': 'Frank Miller',
                'level': '100',
                'programme': 'Cybersecurity'
            },
            {
                'matric_number': '2024/20004',
                'password': 'password123',
                'name': 'Grace Taylor',
                'level': '100',
                'programme': 'Computer Science'
            },
            {
                'matric_number': '2024/20005',
                'password': 'password123',
                'name': 'Henry White',
                'level': '100',
                'programme': 'Information Technology'
            }
        ]
        for user in test_users:
            password_hash = generate_password_hash(user['password'])
            
            query_db('''INSERT OR REPLACE INTO users 
                        (matric_number, password, name, level, programme) 
                        VALUES (?, ?, ?, ?, ?)''',
                    (user['matric_number'], 
                     password_hash,
                     user['name'],
                     user['level'],
                     user['programme']))
            
            print(f"Test user created successfully: {user['matric_number']}")
        
    except sqlite3.Error as e:
        print(f"Error adding test users: {e}")


@app.route('/api/debug/users', methods=['GET'])
def debug_users():
    if app.debug:  
        try:
            users = query_db("SELECT matric_number, name, level, programme FROM users")
            return jsonify([{
                'matric_number': user['matric_number'],
                'name': user['name'],
                'level': user['level'],
                'programme': user['programme']
            } for user in users])
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Not available in production'}), 403

if __name__ == "__main__":
    init_db()
    add_test_users() 
    app.run(host='0.0.0.0', port=5000, debug=True)
