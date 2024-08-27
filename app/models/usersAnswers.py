from app import db

class UserAnswer(db.Model):
    __tablename__ = 'user_answers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    selected_answer = db.Column(db.String(255), nullable=False)


    question = db.relationship('Question', back_populates='user_answers')
    user = db.relationship('User', back_populates='user_answers')
    
    
    
    
