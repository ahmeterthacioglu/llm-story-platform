from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any
from datetime import datetime

class StoryQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int  # Index of correct answer (0-based)

class StoryCreate(BaseModel):
    topic: str = Field(..., min_length=3, max_length=200, description="Topic for story generation")

class StoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())
    
    id: int
    title: str
    content: str
    topic: str
    questions: List[Dict[str, Any]]
    model_used: str
    created_at: datetime
    updated_at: datetime | None = None

class StoryListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    topic: str
    created_at: datetime

class StoryGenerationResponse(BaseModel):
    message: str
    story_id: int

# LLM Response Schema (for internal use)
class LLMStoryResponse(BaseModel):
    title: str
    content: str
    questions: List[StoryQuestion]