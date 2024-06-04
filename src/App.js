import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import AudioPlayer from './components/AudioPlayer';
import { fetchInitialMetadata } from './initialMetadata';
import FractalScene from './FractalScene'; // Импортируем наш новый компонент

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [artist, setArtist] = useState('');

  useEffect(() => {
    const loadMetadata = async () => {
      const initialMetadata = await fetchInitialMetadata();
      setTrackTitle(initialMetadata.track);
      setArtist(initialMetadata.artist);
    };

    loadMetadata();

    const intervalId = setInterval(loadMetadata, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="App">
      <FractalScene /> {/* Добавляем компонент WebGL сцены */}
      <div id="track-container">
        <div className="track-info">
          {trackTitle && artist ? (
            <>
              <div className="track-title">{trackTitle}</div>
              <div className="artist-name">{artist}</div>
            </>
          ) : (
            <div className="track-title">Loading...</div>
          )}
        </div>
      </div>
      <div className="play-container">
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} onClick={handlePlayPause} className="play-icon" />
      </div>
      <AudioPlayer isPlaying={isPlaying} />
    </div>
  );
}

export default App;
