from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)

    # Register blueprints
    from app.api.routes.login import app_views
    from app.api.routes.register import auth_bp
    # app.register_blueprint(app_views, url_prefix='/api')
    # app.register_blueprint(auth_bp,  url_prefix='/api')
    app.register_blueprint(app_views)
    app.register_blueprint(auth_bp)
   




    return app
