import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Story } from '../types/story';
import { storyAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import './StoryDetail.css';

const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStory(parseInt(id));
    }
  }, [id]);

  const fetchStory = async (storyId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const storyData = await storyAPI.getStory(storyId);
      setStory(storyData);
      setSelectedAnswers(new Array(storyData.questions.length).fill(-1));
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Hikaye bulunamadı.');
      } else {
        setError('Hikaye yüklenirken bir hata oluştu.');
      }
      console.error('Error fetching story:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (showResults) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitAnswers = () => {
    if (selectedAnswers.includes(-1)) {
      alert('Lütfen tüm soruları cevaplayın.');
      return;
    }
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers(new Array(story!.questions.length).fill(-1));
    setShowResults(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScore = () => {
    if (!story) return { correct: 0, total: 0 };
    
    let correct = 0;
    story.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    
    return { correct, total: story.questions.length };
  };

  if (isLoading) {
    return <LoadingSpinner message="Hikaye yükleniyor..." />;
  }

  if (error || !story) {
    return (
      <div className="error-container">
        <p className="error-text">{error || 'Hikaye bulunamadı.'}</p>
        <Link to="/" className="back-link">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const score = getScore();

  return (
    <div className="story-detail">
      <div className="story-header">
        <Link to="/" className="back-button">← Hikayelere Dön</Link>
        <h1>{story.title}</h1>
        <div className="story-meta">
          <p><strong>Konu:</strong> {story.topic}</p>
          <p><strong>Oluşturulma:</strong> {formatDate(story.created_at)}</p>
          <p><strong>Model:</strong> {story.model_used}</p>
        </div>
      </div>

      <div className="story-content">
        <h2>Hikaye</h2>
        <div className="story-text">
          {story.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="questions-section">
        <h2>Anlama Soruları</h2>
        
        {showResults && (
          <div className="score-display">
            <h3>Sonuç: {score.correct} / {score.total}</h3>
            <p className={`score-message ${score.correct === score.total ? 'perfect' : score.correct >= score.total * 0.7 ? 'good' : 'needs-improvement'}`}>
              {score.correct === score.total 
                ? 'Mükemmel! Tüm soruları doğru cevapladınız.' 
                : score.correct >= score.total * 0.7 
                  ? 'İyi iş! Çoğu soruyu doğru cevapladınız.'
                  : 'Hikayeyi tekrar okuyarak daha iyi anlayabilirsiniz.'}
            </p>
          </div>
        )}

        <div className="questions">
          {story.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question">
              <h4>Soru {questionIndex + 1}: {question.question}</h4>
              <div className="options">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswers[questionIndex] === optionIndex;
                  const isCorrect = optionIndex === question.correct_answer;
                  const showCorrectAnswer = showResults && isCorrect;
                  const showWrongAnswer = showResults && isSelected && !isCorrect;
                  
                  return (
                    <label 
                      key={optionIndex} 
                      className={`option ${isSelected ? 'selected' : ''} ${showCorrectAnswer ? 'correct' : ''} ${showWrongAnswer ? 'wrong' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={optionIndex}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                        disabled={showResults}
                      />
                      <span className="option-text">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="quiz-actions">
          {!showResults ? (
            <button 
              onClick={handleSubmitAnswers} 
              className="submit-button"
              disabled={selectedAnswers.includes(-1)}
            >
              Cevapları Kontrol Et
            </button>
          ) : (
            <button onClick={resetQuiz} className="reset-button">
              Tekrar Dene
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;