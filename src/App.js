import React, { useState, useEffect } from 'react';
// Импортируем React и хуки useState и useEffect для управления состоянием и побочными эффектами
import './App.css';
// Импортируем файл стилей App.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Импортируем компонент иконок FontAwesome
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
// Импортируем конкретные иконки faPlay и faPause из FontAwesome
import AudioPlayer from './components/AudioPlayer';
// Импортируем компонент AudioPlayer из папки components
import { METADATA_URL } from './config';
// Импортируем URL для получения метаданных из файла конфигурации

function App() {
  // Используем хук useState для создания состояния isPlaying, trackTitle и artist
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTitle, setTrackTitle] = useState(null);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    // Функция для получения метаданных
    const fetchMetadata = async () => {
      try {
        // Запрашиваем метаданные с указанного URL
        const response = await fetch(METADATA_URL);
        // Парсим ответ в формате JSON
        const data = await response.json();
        // Обновляем состояние названия трека и исполнителя
        setTrackTitle(data.track || '');
        setArtist(data.artist || '');
      } catch (error) {
        // Логируем ошибку, если запрос не удался
        console.error('Error fetching metadata:', error);
      }
    };

    // Вызываем функцию для получения метаданных
    fetchMetadata();
    // Устанавливаем интервал для обновления метаданных каждые 30 секунд
    const intervalId = setInterval(fetchMetadata, 30000);
    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  // Функция для переключения состояния воспроизведения
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="App">
      {/* Контейнер для отображения информации о треке */}
      <div id="track-container">
        <div className="track-info">
          {/* Отображаем название трека и исполнителя, если они заданы */}
          {trackTitle && artist ? (
            <>
              <div className="track-title">{trackTitle}</div>
              <div className="artist-name">{artist}</div>
            </>
          ) : null}
        </div>
      </div>
      {/* Контейнер для кнопки воспроизведения/паузы */}
      <div className="play-container">
        {/* Иконка воспроизведения/паузы, которая переключает состояние при клике */}
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} onClick={handlePlayPause} className="play-icon" />
      </div>
      {/* Компонент AudioPlayer, которому передается состояние isPlaying */}
      <AudioPlayer isPlaying={isPlaying} />
    </div>
  );
}

export default App;
// Экспортируем компонент App по умолчанию
