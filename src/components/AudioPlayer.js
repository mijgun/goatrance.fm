import React, { useRef } from 'react';
import { ICECAST_URL } from '../config';

const AudioPlayer = () => {
  const audioRef = useRef(null);

  const playAudio = () => {
    audioRef.current.play();
  };

  return (
    <div>
      <audio ref={audioRef} src={ICECAST_URL} controls />
      <button onClick={playAudio}>Play</button>
    </div>
  );
};

export default AudioPlayer;
