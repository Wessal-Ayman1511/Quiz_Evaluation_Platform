from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.security import check_password_hash
from app import db
from app.models.users import User
from app.api import app_views
from app.utils import is_valid_email, is_valid_name, is_valid_password


VALID_ROLES = ['student', 'teacher']



@app_views.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not name or not email or not password or not role:
        return jsonify({'message': 'Please fill out all fields!'}), 400

    if not is_valid_email(email):
        return jsonify({'message': 'Invalid email format!'}), 400

 
    if not is_valid_password(password):
        return jsonify({'message': 'Password must be at least 8 characters long and include both letters and numbers!'}), 400

    # Validate name
    if not is_valid_name(name):
        return jsonify({'message': 'Name must be alphabetic and 2-50 characters long!'}), 400

    if role not in VALID_ROLES:
        return jsonify({'message': f'Role must be one of {VALID_ROLES}!'}), 400


    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already registered!'}), 400

    new_user = User(name=name, email=email, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Registration successful! Please log in.'}), 201
