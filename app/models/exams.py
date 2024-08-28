from app import db

class Exam(db.Model):
    __tablename__ = 'exams'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(50), nullable=False, unique=True)
    
    questions = db.relationship('Question', back_populates='exam') 
    results = db.relationship('Result', back_populates='exam')
