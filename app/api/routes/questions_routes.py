from flask import request, jsonify
from app.models.exams import Exam
from app.models.questions import Question
from app.api import app_views
from app import db

# add question to specific exam
@app_views.route('/api/exams/<int:exam_id>/questions', methods=['POST'])
def add_question_to_exam(exam_id):
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
    if not all([question_title, option1, option2, option3, option4, correct_option]):
        return jsonify({'error': 'Missing required fields'}), 400
    new_question = Question(
        exam_id=exam_id,
        question_title=question_title,
        option1=option1,
        option2=option2,
        option3=option3,
        option4=option4,
        correct_option=correct_option
    )
    try:
        db.session.add(new_question)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Question added successfully'}), 201
# update specific question in specific exam
@app_views.route('/api/exams/<int:exam_id>/questions/<int:question_id>', methods=['PUT'])
def update_question(exam_id, question_id):
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


    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Question updated successfully'}), 200
# delete specific question in specific exam
@app_views.route('/api/exams/<int:exam_id>/questions/<int:question_id>', methods=['DELETE'])
def delete_question(exam_id, question_id):
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'error': 'Exam not found'}), 404
    question = Question.query.filter_by(id=question_id, exam_id=exam_id).first()
    if not question:
        return jsonify({'error': 'Question not found'}), 404

    try:
        db.session.delete(question)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    return jsonify({'message': 'Question deleted successfully'}), 200
