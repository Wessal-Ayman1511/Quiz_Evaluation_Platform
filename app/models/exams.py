from app import db
from datetime import datetime

class Exam(db.Model):
    __tablename__ = 'exams'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    questions = db.relationship('Question', back_populates='exam', cascade='all, delete-orphan') 
    results = db.relationship('Result', back_populates='exam')
    teacher = db.relationship('User', back_populates='exams')
