from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.exams import Exam
from app.models.results import Result
from app.models.users import User
from app.models.usersAnswers import UserAnswer
from app.models.questions import Question
from app import db
from app.api import app_views
from app.utils import get_student, get_exam, validate_answers, save_student_answers, calculate_score, save_or_update_result, get_exam_results



# show available exams for logged in user
@app_views.route('/api/exams/available', methods=['GET'])
@jwt_required()
def get_available_exams():
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

  
    if user.role != 'student':
        return jsonify({'error': 'Only students can view available exams'}), 403

    taken_exam_ids = [result.exam_id for result in Result.query.filter_by(student_id=current_user_id).all()]


    available_exams = Exam.query.filter(Exam.id.notin_(taken_exam_ids)).all()


    available_exams_list = [{
        'id': exam.id,
        'title': exam.title,
        'code': exam.code
    } for exam in available_exams]

    return jsonify(available_exams_list), 200
# Exam contetn for student
@app_views.route('/api/exams/<int:exam_id>', methods=['GET'])
@jwt_required()
def get_exam_by_id(exam_id):
    # Get the current logged-in user's ID
    current_user_id = get_jwt_identity()

    # Retrieve the user by ID
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404

    # Check if the user is a student
    is_student = user.role == 'student'

    # Prepare exam details
    exam_details = {
        'id': exam.id,
        'title': exam.title,
        'code': exam.code,
        'questions': [
            {
                'id': question.id,
                'question_title': question.question_title,
                'option1': question.option1,
                'option2': question.option2,
                'option3': question.option3,
                'option4': question.option4,
                # Do not include correct_option if the user is a student
                **({'correct_option': question.correct_option} if not is_student else {})
            }
            for question in exam.questions
        ]
    }

    return jsonify(exam_details), 200
# submit answers for exam
@app_views.route('/api/exams/<int:exam_id>/submit', methods=['POST'])
@jwt_required()
def submit_exam(exam_id):
    current_user_id = get_jwt_identity()
    user = get_student(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.role != 'student':
        return jsonify({'error': 'Only students can submit answers'}), 403

    exam = get_exam(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404

    answers = request.json.get('answers')
    if not answers:
        return jsonify({'error': 'No answers provided'}), 400

    if not validate_answers(exam_id, answers):
        return jsonify({'error': 'Invalid question IDs provided'}), 400

    save_student_answers(current_user_id, answers)

    score, total_score = calculate_score(exam_id, current_user_id)

    save_or_update_result(exam_id, current_user_id, score)

    return jsonify({'message': 'Exam submitted successfully', 'score': score, 'total_score': total_score}), 200
#Get the results of a specific exam taken by the student.
@app_views.route('/api/results/<int:exam_id>', methods=['GET'])
@jwt_required()
def get_results(exam_id):
    user_id = get_jwt_identity()
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404
    result = get_exam_results(exam_id, user_id)
    if not result:
        return jsonify({'error': 'No results found for this exam'}), 404
    return jsonify(result), 200
