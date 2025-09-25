from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from .database import Base
from sqlalchemy.orm import relationship

class Offer(Base):
    __tablename__ = 'offers'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    value_props = Column(Text, nullable=False)
    ideal_use_cases = Column(Text, nullable=False)

class Lead(Base):
    __tablename__ = 'leads'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    company = Column(String)
    industry = Column(String)
    location = Column(String)
    linkedin_bio = Column(Text)

    result = relationship("Result", back_populates="lead", uselist=False)

class Result(Base):
    __tablename__ = 'results'

    id = Column(Integer, primary_key=True, index=True)

    lead_id = Column(Integer, ForeignKey('leads.id'), unique=True, index=True, nullable=False)
    offer_id = Column(Integer, ForeignKey('offers.id'), nullable=False)

    lead = relationship("Lead", back_populates="result")

    name = Column(String)
    role = Column(String)
    company = Column(String)
    industry = Column(String)
    intent = Column(String)
    score = Column(Float)
    reasoning = Column(Text)
    rules_score = Column(Float)
    ai_points = Column(Float)

