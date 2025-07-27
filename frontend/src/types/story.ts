export interface StoryQuestion {
    question: string;
    options: string[];
    correct_answer: number;
  }
  
  export interface Story {
    id: number;
    title: string;
    content: string;
    topic: string;
    questions: StoryQuestion[];
    model_used: string;
    created_at: string;
    updated_at?: string;
  }
  
  export interface StoryListItem {
    id: number;
    title: string;
    topic: string;
    created_at: string;
  }
  
  export interface StoryCreateRequest {
    topic: string;
  }
  
  export interface StoryGenerationResponse {
    message: string;
    story_id: number;
  }