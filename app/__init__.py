from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from app.api.routes import app_views

db = SQLAlchemy()
ma = Marshmallow()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    ma.init_app(app)

    # app.register_blueprint(user_routes.bp)
    # app.register_blueprint(exam_routes.bp)
    # app.register_blueprint(result_routes.bp)
    app.register_blueprint(app_views)

    return app
