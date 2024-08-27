from app import db


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    role = db.Column(db.Enum("teacher", "student"), nullable=False)  # Role options

    user_answers = db.relationship('UserAnswer', back_populates='user')
    results = db.relationship('Result', back_populates='user')
