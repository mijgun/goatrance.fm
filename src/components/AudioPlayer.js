import React, { useRef, useEffect } from 'react';
import { ICECAST_URL, METADATA_URL } from '../config';

// Компонент AudioPlayer принимает пропс isPlaying, который указывает, воспроизводится ли аудио
const AudioPlayer = ({ isPlaying }) => {
  // Создаем ссылку на элемент audio
  const audioRef = useRef(null);

  useEffect(() => {
    // Функция для получения метаданных
    const fetchMetadata = async () => {
      try {
        // Запрашиваем метаданные с указанного URL
        const response = await fetch(METADATA_URL);
        // Парсим ответ в формате JSON
        await response.json();
      } catch (error) {
        // Логируем ошибку, если запрос не удался
        console.error('Error fetching metadata:', error);
      }
    };

    // Вызываем функцию для получения метаданных
    fetchMetadata();
    // Устанавливаем интервал для обновления метаданных каждые 30 секунд
    const interval = setInterval(fetchMetadata, 30000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Если isPlaying истина, начинаем воспроизведение аудио
    if (isPlaying) {
      audioRef.current.play();
    } else {
      // Иначе ставим аудио на паузу
      audioRef.current.pause();
    }
  }, [isPlaying]); // Эффект срабатывает при изменении isPlaying

  return (
    <div>
      {/* Элемент audio с источником из ICECAST_URL и ссылкой audioRef */}
      <audio ref={audioRef} src={ICECAST_URL} />
    </div>
  );
};

export default AudioPlayer;
