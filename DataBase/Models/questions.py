from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.orm import sessionmaker

from .base import Base


class Question(Base):
    __tablename__ = 'questions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    exam_id = Column(Integer, ForeignKey('exams.id'), nullable=False)
    question_title = Column(String(255), nullable=False)
    option1 = Column(String(200), nullable=False)
    option2 = Column(String(200), nullable=False)
    option3 = Column(String(200), nullable=False)
    option4 = Column(String(200), nullable=False)
    correct_option = Column(String(200), nullable=False)

    
    exam = relationship('Exam', back_populates='questions')
    user_answers = relationship('UserAnswer', back_populates='question')
