import React, { useState, useEffect, useRef } from "react";
import { PlayCircle, PauseCircle, SkipForward, SkipBack } from "lucide-react";

const AudioScripturePlayer = ({ audioTokens, audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTokens, setActiveTokens] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const updateActiveTokens = () => {
      const currentTimeMs = currentTime * 1000;
      const active = audioTokens.filter(
        (token) =>
          token.audioRanges[0]?.start <= currentTimeMs &&
          token.audioRanges[0]?.end >= currentTimeMs,
      );
      setActiveTokens(active);
    };

    updateActiveTokens();
  }, [currentTime, audioTokens]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const skipForward = () => {
    audioRef.current.currentTime += 5;
  };

  const skipBackward = () => {
    audioRef.current.currentTime -= 5;
  };

  const handleTokenClick = (token) => {
    if (token.audioRanges[0]) {
      audioRef.current.currentTime = token.audioRanges[0].start / 1000;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="flex justify-center space-x-4 mb-4">
        <button onClick={skipBackward}>
          <SkipBack />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
        </button>
        <button onClick={skipForward}>
          <SkipForward />
        </button>
      </div>
      <div className="text-lg leading-relaxed">
        {audioTokens.map((token, index) => (
          <span
            key={token.id}
            className={`cursor-pointer ${activeTokens.includes(token) ? "bg-yellow-200" : ""}`}
            onClick={() => handleTokenClick(token)}
          >
            {token.value}
            {token.skipSpaceAfter ? "" : " "}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AudioScripturePlayer;
