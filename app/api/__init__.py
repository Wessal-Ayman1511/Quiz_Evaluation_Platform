from flask import Blueprint

# Define a single blueprint for all routes
app_views = Blueprint('app_views', __name__)


from app.api.routes import register
from app.api.routes import login
