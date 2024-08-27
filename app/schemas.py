from app import ma
from app.models import User, Exam, Result, Question, UserAnswer

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

class ExamSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Exam

class ResultSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Result

class ResultSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Question

class ResultSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserAnswer
