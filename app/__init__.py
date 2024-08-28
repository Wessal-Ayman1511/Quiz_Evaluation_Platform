
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow


db = SQLAlchemy()
ma = Marshmallow()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    ma.init_app(app)
    
    from app.api.routes.login import app_views
    app.register_blueprint(app_views, url_prefix='/api')
    # app.register_blueprint(app_views)
   
    
    

    # from .models.users import User
    
    # app.register_blueprint(user_routes.bp)
    # app.register_blueprint(exam_routes.bp)
    # app.register_blueprint(result_routes.bp)
    #app.register_blueprint(app_views)
    # from app.api.routes import users_routes
    # from app.api.routes import app_views as api_bp
    # app.register_blueprint(api_bp)


    return app
