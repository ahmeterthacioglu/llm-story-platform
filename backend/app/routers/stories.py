from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import json

from app.database import get_db
from app.models.story import Story
from app.schemas.story import StoryCreate, StoryResponse, StoryListItem, StoryGenerationResponse
from app.services.llm_service import llm_service

router = APIRouter(prefix="/api/stories", tags=["stories"])

@router.get("/", response_model=List[StoryListItem])
async def get_stories(db: AsyncSession = Depends(get_db)):
    """Get all stories (list view)"""
    try:
        result = await db.execute(
            select(Story.id, Story.title, Story.topic, Story.created_at)
            .order_by(Story.created_at.desc())
        )
        stories = result.all()
        
        return [
            StoryListItem(
                id=story.id,
                title=story.title,
                topic=story.topic,
                created_at=story.created_at
            )
            for story in stories
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch stories: {str(e)}"
        )

@router.get("/{story_id}", response_model=StoryResponse)
async def get_story(story_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific story with full details"""
    try:
        result = await db.execute(select(Story).where(Story.id == story_id))
        story = result.scalar_one_or_none()
        
        if not story:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Story not found"
            )
        
        return StoryResponse.model_validate(story)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch story: {str(e)}"
        )

@router.post("/generate", response_model=StoryGenerationResponse)
async def generate_story(
    story_request: StoryCreate,
    db: AsyncSession = Depends(get_db)
):
    """Generate a new story using LLM"""
    try:
        # Generate story using LLM service
        llm_response = await llm_service.generate_story(story_request.topic)
        
        # Convert questions to JSON format for database storage
        questions_json = [
            {
                "question": q.question,
                "options": q.options,
                "correct_answer": q.correct_answer
            }
            for q in llm_response.questions
        ]
        
        # Create new story record
        new_story = Story(
            title=llm_response.title,
            content=llm_response.content,
            topic=story_request.topic,
            questions=questions_json,
            model_used=llm_service.model
        )
        
        db.add(new_story)
        await db.commit()
        await db.refresh(new_story)
        
        return StoryGenerationResponse(
            message="Story generated successfully",
            story_id=new_story.id
        )
        
    except ValueError as e:
        # LLM service errors
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate story: {str(e)}"
        )