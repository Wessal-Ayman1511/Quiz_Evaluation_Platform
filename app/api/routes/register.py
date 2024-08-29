from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('registration.html')

@app.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    role = request.form.get('role')
    
    # Process the registration data (e.g., save to a database)
    # For now, we will just print the data to the console
    print(f"Name: {name}, Email: {email}, Password: {password}, Role: {role}")
    
    # Redirect to a confirmation page based on role
    if role == 'teacher':
       return "Welcome to the Teacher's Home Page!"
    elif role == 'student':
        return "Welcome to the Student's Home Page!"
    else:
        return redirect(url_for('error'))
