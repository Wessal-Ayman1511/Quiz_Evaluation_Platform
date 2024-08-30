from flask import request, jsonify
from app.models.exams import Exam
from app import db
from app.api import app_views  # Import the single blueprint instance


# Create a new exam
@app_views.route('/api/exams', methods=['POST'])
def create_exam():
    data = request.json

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    title = data.get('title')
    code = data.get('code')

    if not title or not code:
        return jsonify({'error': 'Title and code are required'}), 400


    existing_exam = Exam.query.filter_by(code=code).first()
    if existing_exam:
        return jsonify({'error': 'Exam with this code already exists'}), 400

    new_exam = Exam(title=title, code=code)

    db.session.add(new_exam)
    db.session.commit()

    return jsonify({'message': 'Exam created successfully', 'exam_id': new_exam.id}), 201
# Retrieve all exams
@app_views.route('/api/exams', methods=['GET'])
def get_exams():
    exams = Exam.query.all()
    exams_list = [
        {
            'id': exam.id,
            'title': exam.title,
            'code': exam.code
        }
        for exam in exams
    ]

    return jsonify(exams_list), 200
# Retavie the content of Exam by exam name
@app_views.route('/api/exams/<string:exam_name>', methods=['GET'])
def get_exam_by_name(exam_name):
    exam = Exam.query.filter_by(title=exam_name).first()

    if not exam:
        return jsonify({'error': 'Exam not found'}), 404
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
                'correct_option': question.correct_option
            }
            for question in exam.questions
        ]
    }

    return jsonify(exam_details), 200
#update existing exam
@app_views.route('/api/exams/<int:exam_id>', methods=['PUT'])
def update_exam(exam_id):
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404
    data = request.get_json()

    title = data.get('title')
    code = data.get('code')

    if title:
        exam.title = title
    if code:
        exam.code = code
        
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Exam updated successfully'}), 200
#delete specific Exam
@app_views.route('/api/exams/<int:exam_id>', methods=['DELETE'])
def delete_exam(exam_id):
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404
    try:
        db.session.delete(exam)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify({'message': 'Exam deleted successfully'}), 200
