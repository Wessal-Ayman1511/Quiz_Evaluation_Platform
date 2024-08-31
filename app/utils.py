import re
from app.models.exams import Exam
from app.models.questions import Question
from app.models.results import Result
from app.models.users import User
from app.models.usersAnswers import UserAnswer
from app import db

# i used it in route
def get_exam_results(exam_id, user_id):
    result = Result.query.filter_by(
        exam_id=exam_id,
        student_id=user_id
    ).first()
    
    if not result:
        return None
    
    return {
        'exam_id': result.exam_id,
        'student_id': result.student_id,
        'score': result.score
    }



# i used it to help me in submit route for student
def get_student(user_id):
    return User.query.get(user_id)

def get_exam(exam_id):
    return Exam.query.get(exam_id)

# is this question in the exam?
def validate_answers(exam_id, answers):
    question_ids = [answer.get('question_id') for answer in answers]
    return all(Question.query.filter_by(id=qid, exam_id=exam_id).first() for qid in question_ids)

def save_student_answers(user_id, answers):
    for answer in answers:
        question_id = answer.get('question_id')
        selected_answer = answer.get('selected_answer')
        
        user_answer = UserAnswer.query.filter_by(
            question_id=question_id,
            student_id=user_id
        ).first()
        
        if user_answer:
            user_answer.selected_answer = selected_answer
        else:
            user_answer = UserAnswer(
                question_id=question_id,
                student_id=user_id,
                selected_answer=selected_answer
            )
            db.session.add(user_answer)

def calculate_score(exam_id, user_id):
    score = 0
    total_score = 0
    questions = Question.query.filter_by(exam_id=exam_id).all()

    for question in questions:
        total_score += 1
        user_answer = UserAnswer.query.filter_by(
            question_id=question.id,
            student_id=user_id
        ).first()

        if user_answer and user_answer.selected_answer == question.correct_option:
            score += 1

    return score, total_score

def save_or_update_result(exam_id, user_id, score):
    result = Result.query.filter_by(
        exam_id=exam_id,
        student_id=user_id
    ).first()

    if result:
        result.score = score
    else:
        result = Result(
            exam_id=exam_id,
            student_id=user_id,
            score=score
        )
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
