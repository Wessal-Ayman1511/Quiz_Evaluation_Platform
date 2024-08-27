from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.orm import sessionmaker
from .base import Base

class Exam(Base):
    __tablename__ = 'exams'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    questions = relationship('Question', back_populates='exam')
    code = Column(String(50), nullable=False, unique=True)
    
    questions = relationship('Question', back_populates='exam')
    results = relationship('Result', back_populates='exam')
