from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    role = db.Column(db.Enum("teacher", "student"), nullable=False)  # Role options

    user_answers = db.relationship('UserAnswer', back_populates='user')
    results = db.relationship('Result', back_populates='user')
    
    
    def __repr__(self):
        return f"User(name={self.name!r}, email={self.email!r}, role={self.role!r})"
    
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
