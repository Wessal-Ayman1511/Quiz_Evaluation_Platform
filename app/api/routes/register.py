from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.security import check_password_hash
from app import db
from app.models.users import User
import re  

auth_bp = Blueprint('auth_bp', __name__)

VALID_ROLES = ['student', 'teacher']

def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None

def is_valid_password(password):
    return len(password) >= 8 and any(char.isdigit() for char in password) and any(char.isalpha() for char in password)

def is_valid_name(name):
    if not all(char.isalpha() or char.isspace() for char in name):
        return False
    return 2 <= len(name) <= 50


@auth_bp.route('/api/register', methods=['POST'])
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












# from flask import Blueprint, render_template, request, redirect, url_for, flash
# from werkzeug.security import check_password_hash
# from app import db
# from app.models.users import User

# auth_bp = Blueprint('auth_bp', __name__)


# @auth_bp.route('/register', methods=['GET', 'POST'])
# def register():
#     if request.method == 'POST':
#         name = request.form['name']
#         email = request.form['email']
#         password = request.form['password']
#         role = request.form['role']

#         # Check if the email is already registered
#         existing_user = User.query.filter_by(email=email).first()

#         if existing_user:
            
#             flash('Email already registered! <a href="' + url_for('app_views.login') + '">Log in</a>.', 'danger')
#             return redirect(url_for('auth_bp.register'))



#         # Create a new user
#         new_user = User(name=name, email=email, role=role)
#         new_user.set_password(password)

#         # Add user to the database
#         db.session.add(new_user)
#         db.session.commit()

#         flash('Registration successful! Please log in.', 'success')
#         return redirect(url_for('app_views.login'))  # Redirect to the login page

#     return render_template('register.html')
