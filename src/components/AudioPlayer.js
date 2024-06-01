import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState('');
  const [audio] = useState(new Audio('http://44.216.127.114:8000/stream'));

  useEffect(() => {
    audio.play();
    return () => {
      audio.pause();
    };
  }, [audio]);

  useEffect(() => {
    fetch('/api/current-track')
      .then(response => response.json())
      .then(data => {
        if (data && data.title) {
          setCurrentTrack(data.title);
        }
      });
  }, []);

  return (
    <div>
      <h2>Now Playing: {currentTrack}</h2>
      <button onClick={() => audio.play()}>Play</button>
      <button onClick={() => audio.pause()}>Pause</button>
    </div>
  );
};

export default AudioPlayer;
