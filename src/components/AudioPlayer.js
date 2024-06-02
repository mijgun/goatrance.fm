import React, { useRef, useState, useEffect } from 'react';
import { ICECAST_URL, METADATA_URL } from '../config';

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [metadata, setMetadata] = useState({ title: '', artist: '' });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(METADATA_URL);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
    const interval = setInterval(fetchMetadata, 30000); // обновление каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  const playAudio = () => {
    audioRef.current.play();
  };

  return (
    <div>
      <audio ref={audioRef} src={ICECAST_URL} controls />
      <button onClick={playAudio}>Play</button>
      <div>
        <h2>Now Playing:</h2>
        <p>{metadata.artist} - {metadata.title}</p>
      </div>
    </div>
  );
};

export default AudioPlayer;
