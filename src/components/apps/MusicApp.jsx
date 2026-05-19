import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

/**
 * Music App - System Music Application
 */
const MusicApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  const tracks = [
    { id: '1', title: 'Unstoppable', src: '/audio/unstoppable.mp3' },
  ];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying, currentTrack, volume]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-black flex flex-col">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <Music size={20} className="text-red-500" />
          <h1 className="text-lg font-semibold text-white">Music</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Music size={64} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{tracks[currentTrack].title}</h2>
          <p className="text-neutral-400 mb-8">{isPlaying ? 'Playing' : 'Paused'}</p>

          {/* Player Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={() => setCurrentTrack((i) => (i - 1 + tracks.length) % tracks.length)}
              className="p-2 hover:bg-white/10 rounded-lg text-white"
            >
              <SkipBack size={24} />
            </button>
            <button
              onClick={() => setIsPlaying((v) => !v)}
              className="p-3 bg-white text-black rounded-full hover:bg-opacity-90"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={() => setCurrentTrack((i) => (i + 1) % tracks.length)}
              className="p-2 hover:bg-white/10 rounded-lg text-white"
            >
              <SkipForward size={24} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
            <Volume2 size={18} className="text-neutral-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1"
            />
          </div>

          <audio ref={audioRef} src={tracks[currentTrack].src} />
        </div>
      </div>
    </div>
  );
};

export default MusicApp;
