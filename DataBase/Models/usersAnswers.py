from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.orm import sessionmaker

from .base import Base

class UserAnswer(Base):
    __tablename__ = 'user_answers'
    id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey('questions.id'), primary_key=True)
    student_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    selected_answer = Column(String(255), nullable=False)


    question = relationship('Question', back_populates='user_answers')
    user = relationship('User', back_populates='user_answers')
    
    
    
    
