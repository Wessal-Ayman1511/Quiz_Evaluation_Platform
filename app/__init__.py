from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)

    # Register blueprints
    from app.api.routes.login import app_views
<<<<<<< HEAD
    from app.api.routes.register import auth_bp
    # app.register_blueprint(app_views, url_prefix='/api')
    # app.register_blueprint(auth_bp,  url_prefix='/api')
    app.register_blueprint(app_views)
    app.register_blueprint(auth_bp)
   
    
    
=======
    app.register_blueprint(app_views, url_prefix='/api')
>>>>>>> 765c0e967d02fdd591584cefcd0c63e814b99409

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
