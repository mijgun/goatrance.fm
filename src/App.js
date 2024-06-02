import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import AudioPlayer from './components/AudioPlayer';
import { METADATA_URL } from './config';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTitle, setTrackTitle] = useState(null);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(METADATA_URL);
        const data = await response.json();
        setTrackTitle(data.track || '');
        setArtist(data.artist || '');
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
    const intervalId = setInterval(fetchMetadata, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="App">
      <div id="track-container">
        <div className="track-info">
          {trackTitle && artist ? (
            <>
              <div className="track-title">{trackTitle}</div>
              <div className="artist-name">{artist}</div>
            </>
          ) : null}
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
