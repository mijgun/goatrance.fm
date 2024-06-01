import React, { useRef } from 'react';
import './App.css';

function App() {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.src = 'https://goa4ever.ilovemijgun.com:8443/stream';
      audioRef.current.play().catch(error => {
        console.error("Error playing the audio: ", error);
      });
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Goa4Ever Radio</h1>
        <audio ref={audioRef} controls />
        <div>
          <button onClick={handlePlay}>Play</button>
          <button onClick={handlePause}>Pause</button>
        </div>
      </header>
    </div>
  );
}

export default App;
