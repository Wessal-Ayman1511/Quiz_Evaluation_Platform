from sqlalchemy import create_engine
from Models.base import Base
from Models.UsersAnswers import UserAnswer
from Models.Exams import Exam
from Models.Questions import Question
from Models.Results import Result
from Models.Users import User



# Create the database engine
engine = create_engine('mysql+mysqldb://wassola:wassola@localhost/QuizWhiz')

# Create all tables
Base.metadata.create_all(engine)

print("All tables created successfully.")
