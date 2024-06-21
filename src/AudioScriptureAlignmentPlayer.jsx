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
  const [alignedTokens, setAlignedTokens] = useState({ audio: [], source: [] });
  const [hoveredAlignment, setHoveredAlignment] = useState(null);
  const audioRef = useRef(null);
  const alignmentsRef = useRef(null);

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
    if (alignedTokens.audio.includes(token.id)) return;
    setSelectedAudioTokens((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token],
    );
  };

  const handleSourceTokenClick = (token) => {
    if (alignedTokens.source.includes(token.id)) return;
    setSelectedSourceTokens((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token],
    );
  };

  const createAlignment = () => {
    if (!selectedAudioTokens.length) {
      return;
    }

    const newAlignment = {
      id: alignments.length + 1,
      audioTokens: selectedAudioTokens.sort((a, b) => a.idx - b.idx),
      sourceTokens: selectedSourceTokens.sort((a, b) => a.idx - b.idx),
    };

    setAlignments([...alignments, newAlignment]);
    setAlignedTokens((prev) => ({
      audio: [...prev.audio, ...selectedAudioTokens.map((t) => t.id)],
      source: [...prev.source, ...selectedSourceTokens.map((t) => t.id)],
    }));
    setSelectedAudioTokens([]);
    setSelectedSourceTokens([]);
  };

  const isCreateAlignmentDisabled =
    selectedAudioTokens.length === 0 || selectedSourceTokens.length === 0;

  const handleTokenHover = (tokenId, tokenType) => {
    const alignment = alignments.find(
      (a) =>
        (tokenType === "audio" &&
          a.audioTokens.some((t) => t.id === tokenId)) ||
        (tokenType === "source" &&
          a.sourceTokens.some((t) => t.id === tokenId)),
    );
    setHoveredAlignment(alignment);
    if (alignment && alignmentsRef.current) {
      const alignmentElement = alignmentsRef.current.querySelector(
        `[data-alignment-id="${alignment.id}"]`,
      );
      if (alignmentElement) {
        alignmentElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  };

  const isTokenHighlighted = (tokenId, tokenType) => {
    return (
      hoveredAlignment &&
      ((tokenType === "audio" &&
        hoveredAlignment.audioTokens.some((t) => t.id === tokenId)) ||
        (tokenType === "source" &&
          hoveredAlignment.sourceTokens.some((t) => t.id === tokenId)))
    );
  };

  const getTokenClassName = (token, isAudioToken) => {
    let classes = "cursor-pointer ";

    if (isAudioToken) {
      if (selectedAudioTokens.includes(token)) {
        classes += "bg-blue-200 "; // Selected state
      } else if (alignedTokens.audio.includes(token.id)) {
        classes += "bg-gray-200 cursor-not-allowed "; // Aligned state
      } else if (activeAudioTokens.includes(token)) {
        classes += "bg-yellow-200 "; // Current playback state
      }
    } else {
      if (selectedSourceTokens.includes(token)) {
        classes += "bg-green-200 "; // Selected state
      } else if (alignedTokens.source.includes(token.id)) {
        classes += "bg-gray-200 cursor-not-allowed "; // Aligned state
      }
    }

    if (isTokenHighlighted(token.id, isAudioToken ? "audio" : "source")) {
      classes += "bg-purple-200 "; // Highlighted state (on hover)
    }

    return classes.trim();
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
                className={getTokenClassName(token, true)}
                onClick={() => handleAudioTokenClick(token)}
                onMouseEnter={() => handleTokenHover(token.id, "audio")}
                onMouseLeave={() => setHoveredAlignment(null)}
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
                className={getTokenClassName(token, false)}
                onClick={() => handleSourceTokenClick(token)}
                onMouseEnter={() => handleTokenHover(token.id, "source")}
                onMouseLeave={() => setHoveredAlignment(null)}
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
          className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center ${
            isCreateAlignmentDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
          disabled={isCreateAlignmentDisabled}
        >
          <Check className="mr-2" /> Create Alignment
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Alignments</h2>
        <div className="border p-2 h-40 overflow-y-auto" ref={alignmentsRef}>
          {alignments.map((alignment) => (
            <div
              key={alignment.id}
              className={`mb-2 p-2 rounded ${hoveredAlignment === alignment ? "bg-purple-100" : "bg-gray-100"}`}
              data-alignment-id={alignment.id}
            >
              <div className="text-sm text-gray-500 mb-1">#{alignment.id}</div>
              <div className="font-semibold">
                {alignment.audioTokens.map((t) => t.value).join(" ")}
              </div>
              <div
                className="font-semibold"
                style={{ fontFamily: "SBL Hebrew, serif" }}
              >
                {alignment.sourceTokens.map((t) => t.text).join(" ")}
              </div>{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioScriptureAlignmentPlayer;
