import axios from 'axios';
import { Story, StoryListItem, StoryCreateRequest, StoryGenerationResponse } from '../types/story';

// Get API URL from environment variable or use default
const getApiBaseUrl = () => {
  // Check if we have the environment variable
  if (process.env.REACT_APP_API_URL) {
    console.log('Using API URL from env:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback URLs
  if (process.env.NODE_ENV === 'production') {
    console.log('Using production fallback URL');
    return 'https://llm-story-platform-production.up.railway.app';
  } else {
    console.log('Using development URL');
    return 'http://localhost:8000';
  }
};

const API_BASE_URL = getApiBaseUrl();
console.log('Final API Base URL:', API_BASE_URL);

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
    if (error.config?.url) {
      console.error('Failed URL:', error.config.url);
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    const fullUrl = `${config.baseURL || 'unknown'}${config.url || ''}`;
    console.log('Full URL:', fullUrl);
    return config;
  },
  (error) => {
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