from flask import request, jsonify
from app.models.exams import Exam
from app.models.questions import Question
from app import db
from app.api import app_views  
from app.models.users import User
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from app.utils import *


# Create a new exam
@app_views.route('/api/exams', methods=['POST'])
@jwt_required()  
def create_exam():
    current_user = get_jwt_identity() 
    user = User.query.get(current_user)  
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized. Only teachers can create exams.'}), 403

    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    title = data.get('title')
    code = data.get('code')
    teacher_id = get_jwt_identity()

    if not title or not code:
        return jsonify({'error': 'Title and code are required'}), 400

    existing_exam = Exam.query.filter_by(code=code).first()
    if existing_exam:
        return jsonify({'error': 'Exam with this code already exists'}), 400

    new_exam = Exam(title=title, code=code, teacher_id=teacher_id)

    db.session.add(new_exam)
    db.session.commit()

    return jsonify({'message': 'Exam created successfully', 'exam_id': new_exam.id}), 201


# retrieve all exams for logged in teacher 
@app_views.route('/api/teacherDashboard', methods=['GET'])
@jwt_required()
def teacherDashboard():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)  
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403

    teacher_id = user.id
    exams = Exam.query.filter_by(teacher_id=teacher_id).all()
    
    exams_list = []
    for exam in exams:
            total_score = calculate_total_score(exam.id)
            participants = get_number_of_participants(exam.id)
            exams_list.append({
                'id': exam.id,
                'title': exam.title,
                'code': exam.code,
                'teacher_id': exam.teacher_id,
                'created_at': exam.created_at.strftime('%Y-%m-%d'),
                'total_score': total_score,
                "participants": participants
            })


    return jsonify(exams_list), 200


# Retavie the content of Exam by exam id
@app_views.route('/api/exams/<int:exam_id>', methods=['GET'])
def exam_content(exam_id):
    exam = Exam.query.filter_by(id=exam_id).first()

    if not exam:
        return jsonify({'error': 'Exam not found'}), 404
    exam_details = {
        'id': exam.id,
        'title': exam.title,
        'code': exam.code,
        'teacher_id': exam.teacher_id,
        'created_at': exam.created_at,
        'questions': [
            {
                'id': question.id,
                'question_title': question.question_title,
                'option1': question.option1,
                'option2': question.option2,
                'option3': question.option3,
                'option4': question.option4,
                'correct_option': question.correct_option,
                'mark': question.mark
            }
            for question in exam.questions
        ]
    }

    return jsonify(exam_details), 200


#update existing exam
@app_views.route('/api/exams/<int:exam_id>', methods=['PUT'])
@jwt_required()
def update_exam(exam_id):
    current_user_id = get_jwt_identity()
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404
    user = User.query.get(current_user_id)
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403
    data = request.get_json()

    title = data.get('title')
    code = data.get('code')
    teacher_id = get_jwt_identity()

    if title:
        exam.title = title
    if code:
        exam.code = code
    if teacher_id:
        exam.teacher_id = teacher_id
        
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Exam updated successfully'}), 200


#delete specific Exam
@app_views.route('/api/exams/<int:exam_id>', methods=['DELETE'])
@jwt_required()
def delete_exam(exam_id):
    current_user_id = get_jwt_identity()
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404

    user = User.query.get(current_user_id)
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403
    try:
        db.session.delete(exam)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Exam deleted successfully'}), 200


# add question to specific exam
@app_views.route('/api/exams/<int:exam_id>/questions', methods=['POST'])
@jwt_required()
def add_question_to_exam(exam_id):
    # Get the JWT claims to check the user's role
    claims = get_jwt()

    if claims.get('role') != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403

    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404

    data = request.get_json()
    question_title = data.get('question_title')
    option1 = data.get('option1')
    option2 = data.get('option2')
    option3 = data.get('option3')
    option4 = data.get('option4')
    correct_option = data.get('correct_option')
    mark = data.get('mark')

    if not all([question_title, option1, option2, option3, option4, correct_option, mark]):
        return jsonify({'error': 'Missing required fields'}), 400

    new_question = Question(
        exam_id=exam_id,
        question_title=question_title,
        option1=option1,
        option2=option2,
        option3=option3,
        option4=option4,
        correct_option=correct_option,
        mark=mark
    )

    try:
        db.session.add(new_question)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'id': new_question.id}), 201


# update specific question in specific exam
@app_views.route('/api/exams/<int:exam_id>/questions/<int:question_id>', methods=['PUT'])
@jwt_required()
def update_question(exam_id, question_id):
    # Get the JWT claims to check the user's role
    claims = get_jwt()

    if claims.get('role') != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403

    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404

    question = Question.query.filter_by(id=question_id, exam_id=exam_id).first()
    if not question:
        return jsonify({'error': 'Question not found'}), 404

    data = request.get_json()
    question_title = data.get('question_title')
    option1 = data.get('option1')
    option2 = data.get('option2')
    option3 = data.get('option3')
    option4 = data.get('option4')
    correct_option = data.get('correct_option')
    mark = data.get('mark')

    # Update the question fields
    if question_title:
        question.question_title = question_title
    if option1:
        question.option1 = option1
    if option2:
        question.option2 = option2
    if option3:
        question.option3 = option3
    if option4:
        question.option4 = option4
    if correct_option:
        question.correct_option = correct_option
    if mark:
        question.mark = mark

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Question updated successfully'}), 200


# delete specific question in specific exam
@app_views.route('/api/exams/<int:exam_id>/questions/<int:question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(exam_id, question_id):
    # Get the JWT claims to check the user's role
    claims = get_jwt()

    if claims.get('role') != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403

    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404

    question = Question.query.filter_by(id=question_id, exam_id=exam_id).first()
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    # Delete all user answers associated with the question
    user_answers = UserAnswer.query.filter_by(question_id=question_id).all()
    for answer in user_answers:
        db.session.delete(answer)

    try:
        db.session.delete(question)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Question deleted successfully'}), 200


# participants info
@app_views.route('/api/examParticipants/<int:exam_id>', methods=['GET'])
@jwt_required()
def get_exam_participants(exam_id):
    current_user_id = get_jwt_identity()
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404

    # get the result for each student
    results = (
        db.session.query(Result)
        .join(User, Result.student_id == User.id)
        .filter(Result.exam_id == exam_id)
        .order_by(Result.student_id, Result.date_taken.desc())
        .all()
    )

    # remove duplicate result and take the last trial
    latest_results = {}
    for result in results:
        if result.student_id not in latest_results:
            latest_results[result.student_id] = result
    participants_details = [
        {
            'student_name': User.query.get(result.student_id).name,
            'score': result.score,
            'duration': result.duration,
            'date_taken': result.date_taken.strftime('%Y-%m-%d')
        }
        for result in latest_results.values()
    ]

    return jsonify(participants_details), 200
