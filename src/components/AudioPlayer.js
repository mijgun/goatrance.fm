import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState('');
  const [audio] = useState(new Audio('https://goa4ever.ilovemijgun.com/stream'));

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (e) {
        console.log('Autoplay was prevented, enabling manual play.');
      }
    };
    playAudio();
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
      })
      .catch(error => console.log('Error fetching current track:', error));
  }, []);

  const handlePlay = async () => {
    try {
      await audio.play();
    } catch (e) {
      console.log('Play button triggered but failed to start:', e);
    }
  };

  return (
    <div>
      <h2>Now Playing: {currentTrack}</h2>
      <button onClick={handlePlay}>Play</button>
      <button onClick={() => audio.pause()}>Pause</button>
    </div>
  );
};

export default AudioPlayer;
