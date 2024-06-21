import React, { useState, useEffect, useRef } from "react";
import {
  PlayCircle,
  PauseCircle,
  SkipForward,
  SkipBack,
  Check,
} from "lucide-react";

const AudioScriptureAlignmentPlayer = ({
  audioTokens,
  sourceTokens,
  audioSrc,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeAudioTokens, setActiveAudioTokens] = useState([]);
  const [selectedAudioTokens, setSelectedAudioTokens] = useState([]);
  const [selectedSourceTokens, setSelectedSourceTokens] = useState([]);
  const [alignments, setAlignments] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const updateActiveTokens = () => {
      const currentTimeMs = currentTime * 1000;
      const active = audioTokens.filter(
        (token) =>
          token.audioRanges[0]?.start <= currentTimeMs &&
          token.audioRanges[0]?.end >= currentTimeMs,
      );
      setActiveAudioTokens(active);
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

  const handleAudioTokenClick = (token) => {
    setSelectedAudioTokens((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token],
    );
  };

  const handleSourceTokenClick = (token) => {
    setSelectedSourceTokens((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token],
    );
  };

  const createAlignment = () => {
    if (selectedAudioTokens.length === 0 || selectedSourceTokens.length === 0) {
      alert("Please select at least one audio token and one source token.");
      return;
    }

    const newAlignment = {
      id: alignments.length + 1,
      audioTokens: selectedAudioTokens,
      sourceTokens: selectedSourceTokens,
    };

    setAlignments([...alignments, newAlignment]);
    setSelectedAudioTokens([]);
    setSelectedSourceTokens([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">English Audio Tokens</h2>
          <div className="text-lg leading-relaxed border p-2 h-60 overflow-y-auto">
            {audioTokens.map((token) => (
              <span
                key={token.id}
                className={`cursor-pointer ${activeAudioTokens.includes(token) ? "bg-yellow-200" : ""} ${selectedAudioTokens.includes(token) ? "bg-blue-200" : ""}`}
                onClick={() => handleAudioTokenClick(token)}
              >
                {token.value}
                {token.skipSpaceAfter ? "" : " "}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Hebrew/Greek Source Tokens</h2>
          <div className="text-lg leading-relaxed border p-2 h-60 overflow-y-auto">
            {sourceTokens.map((token) => (
              <span
                key={token.id}
                className={`cursor-pointer ${selectedSourceTokens.includes(token) ? "bg-green-200" : ""}`}
                onClick={() => handleSourceTokenClick(token)}
              >
                {token.text}{" "}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={createAlignment}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Check className="mr-2" /> Create Alignment
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Alignments</h2>
        <div className="border p-2 h-40 overflow-y-auto">
          {alignments.map((alignment) => (
            <div key={alignment.id} className="mb-2 p-2 bg-gray-100 rounded">
              <strong>Alignment {alignment.id}:</strong>
              <br />
              English: {alignment.audioTokens.map((t) => t.value).join(" ")}
              <br />
              Source: {alignment.sourceTokens.map((t) => t.text).join(" ")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioScriptureAlignmentPlayer;
