import React, { useState, useEffect } from 'react';
import './App.css';
import './FractalBackground.css';
import { ICECAST_URL, METADATA_URL } from './config';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTitle, setTrackTitle] = useState('Track Title');
  const [artist, setArtist] = useState('Artist Name');
  const audio = new Audio(ICECAST_URL);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(METADATA_URL);
        const data = await response.json();
        setTrackTitle(data.title);
        setArtist(data.artist);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    if (isPlaying) {
      fetchMetadata();

      const intervalId = setInterval(fetchMetadata, 30000);

      return () => clearInterval(intervalId);
    }
  }, [isPlaying]);

  useEffect(() => {
    const panels = document.querySelectorAll('#anim_panel_1, #anim_panel_2, #anim_panel_3');
    panels.forEach(panel => {
      const duration = Math.random() * 60 + 20 + 's';
      const translateX = Math.random() * 2000 - 1000 + 'px';
      const translateY = Math.random() * 2000 - 1000 + 'px';
      const rotate = Math.random() * 360 + 'deg';
      const rotateSpeed = Math.random() * 100 + 50 + 's'; // Рандомная скорость вращения

      panel.style.animationDuration = duration;
      panel.style.animationName = `translate-rotate-${panel.id}`;
      panel.style.animationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';

      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(`
        @keyframes translate-rotate-${panel.id} {
          from {
            transform: translate(0, 0) rotate(0deg);
          }
          to {
            transform: translate(${translateX}, ${translateY}) rotate(${rotate});
          }
        }
      `, styleSheet.cssRules.length);
      styleSheet.insertRule(`
        @keyframes rotate-${panel.id} {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(${rotate});
          }
        }
      `, styleSheet.cssRules.length);
      panel.style.animation = `translate-rotate-${panel.id} ${duration} linear infinite, rotate-${panel.id} ${rotateSpeed} linear infinite`;
    });
  }, []);

  const handlePlay = () => {
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error("Error playing the audio: ", error);
    });
  };

  return (
    <div className="App">
      <div id="anim_base">
        <div id="anim_panel_1"></div>
        <div id="anim_panel_2"></div>
        <div id="anim_panel_3"></div>
      </div>
      <header className="app-header">
        <div className="track-info">
          <div>{trackTitle}</div>
          <div>{artist}</div>
        </div>
        {!isPlaying && <button className="play-button" onClick={handlePlay}>Play</button>}
      </header>
    </div>
  );
}

export default App;
