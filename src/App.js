import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import AudioPlayer from './components/AudioPlayer';
import FractalScene from './FractalScene';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [artist, setArtist] = useState('');

  useEffect(() => {
    let websocket;

    const connectWebSocket = () => {
      console.log('Connecting to WebSocket');
      websocket = new WebSocket('wss://stream.goatrance.fm');

      websocket.onopen = () => {
        console.log('Connected to WebSocket');
      };

      websocket.onmessage = (event) => {
        console.log('Message received from WebSocket', event.data);
        const data = JSON.parse(event.data);
        setTrackTitle(data.track);
        setArtist(data.artist);
      };

      websocket.onclose = (event) => {
        console.log(`Disconnected from WebSocket, code: ${event.code}, reason: ${event.reason}, wasClean: ${event.wasClean}`);
        setTimeout(connectWebSocket, 10000);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="App">
      <FractalScene />
      <div id="track-container">
        <div className="track-info">
          {trackTitle && artist && (
            <>
              <div className="track-title">{trackTitle}</div>
              <div className="artist-name">{artist}</div>
            </>
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
