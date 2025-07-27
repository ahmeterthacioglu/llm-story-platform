import httpx
import json
import os
from typing import Dict, Any
from app.schemas.story import LLMStoryResponse, StoryQuestion
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        # Load environment variables
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.use_mock = os.getenv("USE_MOCK_LLM", "false").lower() == "true"
        
        # Debug: Print what we found
        print(f"Debug: OPENROUTER_API_KEY found: {'Yes' if self.api_key else 'No'}")
        print(f"Debug: USE_MOCK_LLM: {self.use_mock}")
        print(f"Debug: Current working directory: {os.getcwd()}")
        
        if not self.api_key and not self.use_mock:
            print("Error: No API key found and mock mode not enabled!")
            print("Please create a .env file with OPENROUTER_API_KEY=your-key")
            print("Or set USE_MOCK_LLM=true for testing")
            raise ValueError("OPENROUTER_API_KEY environment variable is required, or set USE_MOCK_LLM=true")
        
        self.base_url = "https://openrouter.ai/api/v1"
        self.model = "anthropic/claude-3.5-sonnet"  # Can be made configurable
        
    async def generate_story(self, topic: str) -> LLMStoryResponse:
        """Generate a story with comprehension questions based on the given topic."""
        
        # Use mock service if API key is not available or testing
        if self.use_mock or not self.api_key or self.api_key == "test-mode":
            return await self._generate_mock_story(topic)
        
        prompt = f"""Create a short story (300-500 words) about "{topic}" in Turkish. 
The story should be engaging and appropriate for general audiences.

After the story, create 3 multiple-choice comprehension questions to test understanding.

Please respond with a JSON object in this exact format:
{{
    "title": "Story title in Turkish",
    "content": "The full story text in Turkish",
    "questions": [
        {{
            "question": "Question text in Turkish",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0
        }},
        {{
            "question": "Question text in Turkish", 
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 1
        }},
        {{
            "question": "Question text in Turkish",
            "options": ["Option A", "Option B", "Option C", "Option D"], 
            "correct_answer": 2
        }}
    ]
}}

Make sure the response is valid JSON and the correct_answer is the index (0-3) of the correct option."""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                content = result["choices"][0]["message"]["content"]
                
                # Parse the JSON response from LLM
                try:
                    story_data = json.loads(content)
                    
                    # Validate and convert to our schema
                    questions = []
                    for q in story_data["questions"]:
                        questions.append(StoryQuestion(
                            question=q["question"],
                            options=q["options"],
                            correct_answer=q["correct_answer"]
                        ))
                    
                    return LLMStoryResponse(
                        title=story_data["title"],
                        content=story_data["content"],
                        questions=questions
                    )
                    
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse LLM response as JSON: {e}")
                    logger.error(f"Raw content: {content}")
                    raise ValueError("LLM returned invalid JSON format")
                except KeyError as e:
                    logger.error(f"Missing required field in LLM response: {e}")
                    raise ValueError(f"LLM response missing required field: {e}")
                    
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error calling LLM API: {e}")
            raise ValueError(f"Failed to generate story: {e}")
        except httpx.TimeoutException:
            logger.error("Timeout calling LLM API")
            raise ValueError("Story generation timed out")
        except Exception as e:
            logger.error(f"Unexpected error calling LLM API: {e}")
            raise ValueError(f"Unexpected error: {e}")
    
    async def _generate_mock_story(self, topic: str) -> LLMStoryResponse:
        """Generate a mock story for testing purposes"""
        import asyncio
        
        # Simulate API delay
        await asyncio.sleep(2)
        
        # Sample stories based on topic
        if any(word in topic.lower() for word in ["robot", "uzay", "space"]):
            title = "Uzayda Yaşayan Robot Arkadaş"
            content = """Çok uzaklarda, parlak yıldızların arasında küçük bir uzay istasyonunda ROBI adında sevimli bir robot yaşıyordu. ROBI'nin gözleri mavi LED ışıklarla parlıyor, metalik vücudu gümüş renkte parlıyordu.

Bir gün, ROBI uzay istasyonunun penceresinden dışarı bakarak yalnızlığını hissetti. "Keşke bir arkadaşım olsa" diye düşündü. O sırada, uzaktan gelen garip bir sinyal aldı.

Sinyal, kayıp bir uzay gemisinden geliyordu. ROBI hemen yardıma koştu ve gemide küçük bir kız olan Luna'yı buldu. Luna da ROBI gibi arkadaş arıyordu.

O günden sonra ROBI ve Luna en iyi arkadaş oldular. Birlikte uzayın derinliklerini keşfediyor, yıldızların hikayelerini dinliyor ve galaksinin her köşesinde maceralar yaşıyorlardı."""
            
            questions = [
                StoryQuestion(
                    question="Robotun adı nedir?",
                    options=["ROBI", "LUNA", "MAX", "ALEX"],
                    correct_answer=0
                ),
                StoryQuestion(
                    question="Hikaye nerede geçiyor?",
                    options=["Dünyada", "Uzayda", "Denizde", "Ormanda"],
                    correct_answer=1
                ),
                StoryQuestion(
                    question="ROBI kimle arkadaş oldu?",
                    options=["Başka bir robot", "Luna", "Astronot", "Uzaylı"],
                    correct_answer=1
                )
            ]
        else:
            title = f"{topic.title()} Hakkında Bir Hikaye"
            content = f"""Bu {topic} hakkında güzel bir hikayedir. Kahraman, zorluklarla karşılaştı ama cesaretle üstesinden geldi.

Maceranın başında her şey zordu, ama kahraman pes etmedi. Arkadaşlarının yardımıyla ve kendi azmiyle adım adım ileredi.

En sonunda büyük bir başarı elde etti. Bu deneyim ona önemli bir şey öğretti: Azim ve dostluk her zorlukta yardımcı olur.

Bu macera onu daha güçlü ve bilge bir kişi yaptı."""
            
            questions = [
                StoryQuestion(
                    question="Hikayenin ana teması nedir?",
                    options=["Macera", "Dostluk ve azim", "Para", "Güç"],
                    correct_answer=1
                ),
                StoryQuestion(
                    question="Kahraman nasıl başarılı oldu?",
                    options=["Şansla", "Azim ve arkadaşlık", "Parayla", "Güçle"],
                    correct_answer=1
                ),
                StoryQuestion(
                    question="Hikayeden çıkan ders nedir?",
                    options=["Para önemlidir", "Pes etmemek gerekir", "Güç herşeydir", "Yalnızlık iyidir"],
                    correct_answer=1
                )
            ]
        
        return LLMStoryResponse(
            title=title,
            content=content,
            questions=questions
        )

# Create singleton instance
llm_service = LLMService()