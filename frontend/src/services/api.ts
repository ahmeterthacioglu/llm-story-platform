import axios from 'axios';
import { Story, StoryListItem, StoryCreateRequest, StoryGenerationResponse } from '../types/story';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'llm-story-platform-production.up.railway.app'  // Your Railway backend URL
  : 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const storyAPI = {
  // Get all stories (list)
  getStories: async (): Promise<StoryListItem[]> => {
    const response = await api.get('/stories/');
    return response.data;
  },

  // Get specific story by ID
  getStory: async (id: number): Promise<Story> => {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  // Generate new story
  generateStory: async (request: StoryCreateRequest): Promise<StoryGenerationResponse> => {
    const response = await api.post('/stories/generate', request);
    return response.data;
  },
};

export default api;