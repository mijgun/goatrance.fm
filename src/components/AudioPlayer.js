import React, { useRef, useEffect } from 'react';
import { ICECAST_URL } from '../config';

const AudioPlayer = ({ isPlaying, trackTitle, artist }) => {
  const audioRef = useRef(null);

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
