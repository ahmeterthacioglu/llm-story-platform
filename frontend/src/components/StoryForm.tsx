import React, { useState } from 'react';
import { storyAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import './StoryForm.css';

interface StoryFormProps {
  onSuccess: (storyId: number) => void;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSuccess }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Lütfen bir konu girin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await storyAPI.generateStory({ topic: topic.trim() });
      setTopic('');
      onSuccess(response.story_id);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        'Hikaye oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Hikaye oluşturuluyor... Bu işlem birkaç dakika sürebilir." />;
  }

  return (
    <div className="story-form">
      <h2>Yeni Hikaye Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">Hikaye Konusu:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Örnek: Uzayda yaşayan arkadaş bir robot"
            maxLength={200}
            disabled={isLoading}
            required
          />
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <button type="submit" disabled={isLoading || !topic.trim()}>
          {isLoading ? 'Oluşturuluyor...' : 'Hikaye Oluştur'}
        </button>
      </form>
    </div>
  );
};

export default StoryForm;