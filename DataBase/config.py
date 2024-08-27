from sqlalchemy import create_engine
from Models.base import Base
from Models.usersAnswers import UserAnswer
from Models.exams import Exam
from Models.questions import Question
from Models.results import Result
from Models.users import User






engine = create_engine('mysql+mysqldb://wassola:wassola@localhost/QuizWhiz')


Base.metadata.create_all(engine)

print("All tables created successfully.")
