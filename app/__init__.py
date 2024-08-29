from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)

    # Register blueprints
    from app.api.routes.login import app_views
    app.register_blueprint(app_views, url_prefix='/api')

    # Import models to ensure they are registered
    from .models.users import User
    from .models.questions import Question
    from .models.results import Result
    from .models.exams import Exam
    from .models.usersAnswers import UserAnswer

    # Create database tables
    with app.app_context():
        db.create_all()

    return app
