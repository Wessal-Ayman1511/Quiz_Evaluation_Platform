import re
from app.models.exams import Exam
from app.models.questions import Question
from app.models.results import Result
from app.models.users import User
from app.models.results import Result
from app.models.usersAnswers import UserAnswer
from app import db
from datetime import datetime
from flask import jsonify
from sqlalchemy import func


def get_number_of_participants(exam_id):
    count = db.session.query(func.count(func.distinct(Result.student_id))).filter(
        Result.exam_id == exam_id
    ).scalar()

    return count


def calculate_total_score(exam_id):
    questions = Question.query.filter_by(exam_id=exam_id).all()
    total_score = sum(question.mark for question in questions)

    return total_score


#used in studentResults
def get_exam_results(exam_id, user_id):
    results = Result.query.filter_by(
        exam_id=exam_id,
        student_id=user_id
    ).all()
    
    if not results:
        return None
    
    all_results = []
    for result in results:
        all_results.append({
            'exam_id': result.exam_id,
            'student_id': result.student_id,
            'score': result.score,
            'date_taken': result.date_taken.strftime('%Y-%m-%d %H:%M:%S'), 
            'duration': result.duration
        })
    
    return all_results


def get_student(user_id):
    return User.query.filter_by(id=user_id, role='student').first()


def get_exam(exam_id):
    return Exam.query.get(exam_id)



# Used in submit Exam
def validate_answers(exam_id, answers):
    """Validate the answers against the exam's questions."""
    question_ids = {q.id for q in Question.query.filter_by(exam_id=exam_id).all()}
    submitted_ids = {answer['question_id'] for answer in answers}
    return submitted_ids.issubset(question_ids)
def save_student_answers(user_id, answers):
    """Save the student's answers."""
    for answer in answers:
        question_id = answer['question_id']
        selected_answer = answer['selected_answer']

        # Save or update the answer in the UserAnswer table
        user_answer = UserAnswer.query.filter_by(student_id=user_id, question_id=question_id).first()

        if user_answer:
            # Update existing answer
            user_answer.selected_answer = selected_answer
        else:
            # Add new answer
            new_user_answer = UserAnswer(student_id=user_id, question_id=question_id, selected_answer=selected_answer)
            db.session.add(new_user_answer)

    db.session.commit()
def calculate_score(exam_id, user_id, answers):
    """Calculate the score based on the student's answers."""
    score = 0
    total_score = 0

    for answer in answers:
        question = Question.query.get(answer['question_id'])
        if question:
            if question.correct_option == answer['selected_answer']:
                score += question.mark 
            total_score += question.mark

    return score, total_score
def save_result(exam_id, student_id, score, duration):
    result = Result(exam_id=exam_id, student_id=student_id, score=score, duration=duration, date_taken=datetime.utcnow())
    db.session.add(result)
    db.session.commit()


# validators
def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None
def is_valid_password(password):
    return len(password) >= 8 and any(char.isdigit() for char in password) and any(char.isalpha() for char in password)
def is_valid_name(name):
    if not all(char.isalpha() or char.isspace() for char in name):
        return False
    return 2 <= len(name) <= 50
