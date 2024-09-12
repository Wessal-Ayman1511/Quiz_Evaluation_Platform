from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    jwt = JWTManager(app)

    
    from app.api import app_views
    app.register_blueprint(app_views)
    
    
    from app.models import User
    from app.models import Exam
    from app.models import Question
    from app.models import Result
    from app.models import UserAnswer


    with app.app_context():
        db.create_all()

    return app
