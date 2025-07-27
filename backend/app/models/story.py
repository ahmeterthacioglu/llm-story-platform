from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base

class Story(Base):
    __tablename__ = "stories"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    content = Column(Text, nullable=False)
    topic = Column(String(200), nullable=False)  # Original topic provided by user
    questions = Column(JSON, nullable=False)  # List of comprehension questions
    model_used = Column(String(100), nullable=False)  # Which LLM model was used
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Story(id={self.id}, title='{self.title}', topic='{self.topic}')>"