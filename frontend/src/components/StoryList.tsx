import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StoryListItem } from '../types/story';
import { storyAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import './StoryList.css';

const StoryList: React.FC = () => {
  const [stories, setStories] = useState<StoryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching stories...');
      const storiesData = await storyAPI.getStories();
      console.log('Stories received:', storiesData);
      
      // Ensure we always have an array
      setStories(Array.isArray(storiesData) ? storiesData : []);
    } catch (err: any) {
      console.error('Error fetching stories:', err);
      setError('Hikayeler yüklenirken bir hata oluştu.');
      setStories([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Tarih bilinmiyor';
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Hikayeler yükleniyor..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={fetchStories} className="retry-button">
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="story-list">
      <h1>Hikayeler</h1>
      
      {!stories || stories.length === 0 ? (
        <div className="empty-state">
          <p>Henüz hiç hikaye oluşturulmamış.</p>
          <p>İlk hikayeyi oluşturmak için yukarıdaki formu kullanın!</p>
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map((story) => (
            <Link 
              key={story.id} 
              to={`/story/${story.id}`} 
              className="story-card-link"
            >
              <div className="story-card">
                <h3 className="story-title">{story.title || 'İsimsiz Hikaye'}</h3>
                <p className="story-topic">
                  <strong>Konu:</strong> {story.topic || 'Konu belirtilmemiş'}
                </p>
                <p className="story-date">
                  {formatDate(story.created_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryList;