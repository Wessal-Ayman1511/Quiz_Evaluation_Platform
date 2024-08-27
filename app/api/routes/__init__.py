from flask import Blueprint

# Create the Blueprint instance
app_views = Blueprint('app_views', __name__, url_prefix='/api/')


from api.routes.exams_routes import *
from api.routes.questions_routes import *
from api.routes.results_routes import *
from api.routes.users_rouutes import *
from api.routes.usersAnswers_routes import *
