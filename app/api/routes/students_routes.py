from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.exams import Exam
from app.models.results import Result
from app.models.users import User
from app.models.usersAnswers import UserAnswer
from app.models.questions import Question
from app import db
from app.api import app_views
from app.utils import *
from datetime import datetime



#Exam content for student
@app_views.route('/api/exam-content/<string:exam_code>', methods=['GET'])
@jwt_required()
def get_exam_for_student(exam_code):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    exam = Exam.query.filter_by(code=exam_code).first()
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404

    is_student = user.role == 'student'
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
                'mark': question.mark
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
    duration = request.json.get('duration')
    if not answers:
        return jsonify({'error': 'No answers provided'}), 400

    if not validate_answers(exam_id, answers):
        return jsonify({'error': 'Invalid question IDs provided'}), 400

    save_student_answers(current_user_id, answers)

    score, total_score = calculate_score(exam_id, current_user_id, answers)

    save_result(exam_id, current_user_id, score, duration)

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


# Retrieve all exams
@app_views.route('/api/exams', methods=['GET'])
def get_exams():
    exams = Exam.query.all()
    exams_list = [
        {
            'id': exam.id,
            'title': exam.title,
            'code': exam.code,
            'teacher_id': exam.teacher_id,
            'created_at': exam.created_at.strftime('%Y-%m-%d'),
            'total_score': calculate_total_score(exam.id)
        }
        for exam in exams
    ]

    return jsonify(exams_list), 200


@app_views.route('/api/student/results/latest', methods=['GET'])
@jwt_required()
def get_latest_results_for_student():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role != 'student':
        return jsonify({'error': 'Unauthorized access'}), 403

    all_results = db.session.query(Result).filter(
        Result.student_id == user.id
    ).order_by(
        Result.exam_id.asc(), Result.date_taken.desc()
    ).all()

    latest_results = {}
    for result in all_results:
        if result.exam_id not in latest_results:
            latest_results[result.exam_id] = result

    # Create the list of results with necessary details
    results_list = [
        {
            'exam_id': latest_results[exam_id].exam_id,
            'exam_title': latest_results[exam_id].exam.title,
            'score': latest_results[exam_id].score,
            'date_taken': latest_results[exam_id].date_taken.strftime('%Y-%m-%d'),
            'duration': latest_results[exam_id].duration
        }
        for exam_id in latest_results
    ]

    return jsonify(results_list), 200
