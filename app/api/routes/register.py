from flask import Blueprint, render_template, request, redirect, url_for, flash,  jsonify
from werkzeug.security import check_password_hash
from app import db
from app.models.users import User

auth_bp = Blueprint('auth_bp', __name__)


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

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            'message': f'Email already registered!'
        }), 400

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
