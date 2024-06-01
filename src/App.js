import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = new Audio('https://goa4ever.ilovemijgun.com:8443/stream');

  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Goa4Ever Radio</h1>
        <p>Now Playing:</p>
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </header>
    </div>
  );
};

export default App;
