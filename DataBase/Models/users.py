from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from .base import Base


class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    password = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    role = Column(Enum("teacher", "student"), nullable=False)  # Role options

    user_answers = relationship('UserAnswer', back_populates='user')
    results = relationship('Result', back_populates='user')
