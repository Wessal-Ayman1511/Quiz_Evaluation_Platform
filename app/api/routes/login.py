from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from app.models.users import User

app_views = Blueprint('app_views', __name__)

@app_views.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid input format or no input data provided'}), 400

    name = data.get('name')
    password = data.get('password')


    if not name or not password:
        return jsonify({'error': 'Missing name or password'}), 400
    if len(name) < 2 or len(name) > 50:
        return jsonify({'error': 'Name must be between 2 and 50 characters'}), 400
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long'}), 400

    user = User.query.filter_by(name=name).first()


    if user and check_password_hash(user.password, password):
        if user.role == 'teacher':
            return jsonify({'message': 'Login successful', 'role': 'teacher'}), 200
        elif user.role == 'student':
            return jsonify({'message': 'Login successful', 'role': 'student'}), 200
        else:
            return jsonify({'error': 'Unknown role'}), 400
    else:
        return jsonify({'error': 'Invalid username or password'}), 401














# from flask import Blueprint, render_template, request, redirect, url_for, flash
# from werkzeug.security import check_password_hash
# from app import db
# from app.models.users import User

# app_views = Blueprint('app_views', __name__)

# @app_views.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         name = request.form['name']
#         password = request.form['password']

#         user = User.query.filter_by(name=name).first()

#         if user and check_password_hash(user.password, password):
#             if user.role == 'teacher':
#                 return render_template('teacher_dashboard.html')
#             elif user.role == 'student':
#                 return render_template('student_dashboard.html')
#         else:
#             flash('Invalid username or password ' '<a href="' + url_for('auth_bp.register') + '"> Sign Up</a>.', 'danger')
            
#             return render_template('login.html', error='Invalid username or password')

#     return render_template('login.html')
