import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTitle, setTrackTitle] = useState('Track Title');
  const [artist, setArtist] = useState('Artist Name');
  const audio = new Audio('https://goa4ever.ilovemijgun.com:8443/stream');

  useEffect(() => {
    if (isPlaying) {
      // Здесь вы можете добавить логику для обновления названия трека и исполнителя
      // Например, получить данные с сервера или использовать метаданные потока
      const updateTrackInfo = () => {
        setTrackTitle('New Track Title');
        setArtist('New Artist');
      };
      
      // Пример: обновление информации о треке каждые 30 секунд
      const intervalId = setInterval(updateTrackInfo, 30000);

      return () => clearInterval(intervalId);
    }
  }, [isPlaying]);

  const handlePlay = () => {
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error("Error playing the audio: ", error);
    });
  };

  return (
    <div className="App">
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
