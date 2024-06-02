import React, { useRef, useEffect } from 'react';
import { ICECAST_URL, METADATA_URL } from '../config';

const AudioPlayer = ({ isPlaying }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(METADATA_URL);
        await response.json();
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
    const interval = setInterval(fetchMetadata, 30000); // обновление каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div>
      <audio ref={audioRef} src={ICECAST_URL} />
    </div>
  );
};

export default AudioPlayer;
