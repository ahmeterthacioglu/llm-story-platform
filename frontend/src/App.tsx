import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail';
import StoryForm from './components/StoryForm';
import './index.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStorySuccess = (storyId: number) => {
    // Refresh the story list and navigate to the new story
    setRefreshKey(prev => prev + 1);
    navigate(`/story/${storyId}`);
  };

  return (
    <div className="homepage">
      <header className="app-header">
        <h1>📚 Madlen Hikaye Platformu</h1>
        <p>Yapay zeka ile kişiselleştirilmiş hikayeler oluşturun ve okuyun</p>
      </header>
      
      <main>
        <StoryForm onSuccess={handleStorySuccess} />
        <StoryList key={refreshKey} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story/:id" element={<StoryDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;