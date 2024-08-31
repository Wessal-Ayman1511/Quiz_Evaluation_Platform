from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from app.models.users import User
from app.api import app_views
from datetime import timedelta 

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

        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))  

        return jsonify({'message': 'Login successful', 'role': user.role, 'access_token': access_token}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401
