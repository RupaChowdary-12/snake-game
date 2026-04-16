import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'NEON_DREAMS.exe', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CYBER_CITY.dat', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'DIGITAL_VOID.sys', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="neon-box p-6 flex flex-col gap-6 w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwgMjU1LCAyNTUsIDAuMSkiLz4KPC9zdmc+')] opacity-50"></div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col">
          <span className="text-xl text-[#FF00FF] neon-text-magenta mb-2 animate-pulse">&gt;&gt; AUDIO_STREAM</span>
          <span className="text-3xl font-bold text-[#00FFFF] neon-text truncate w-56" data-text={currentTrack.title}>
            {currentTrack.title}
          </span>
        </div>
        
        <div className="flex items-end gap-1.5 h-12">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`w-2 bg-[#00FFFF] shadow-[0_0_8px_#00FFFF] transition-all duration-75`}
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '10%',
                animation: isPlaying ? `bounce ${0.4 + i * 0.15}s infinite alternate` : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full h-3 bg-[#050505] border-2 border-[#00FFFF] relative z-10">
        <div 
          className="h-full bg-[#FF00FF] shadow-[0_0_10px_#FF00FF] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center z-10 mt-2">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-[#00FFFF] hover:text-[#FF00FF] transition-colors focus:outline-none"
        >
          {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
        </button>

        <div className="flex gap-6 items-center">
          <button 
            onClick={prevTrack}
            className="text-[#00FFFF] hover:text-[#FF00FF] transition-colors focus:outline-none"
          >
            <SkipBack size={36} />
          </button>
          <button 
            onClick={togglePlay}
            className="text-[#050505] bg-[#00FFFF] shadow-[0_0_15px_#00FFFF] hover:bg-[#FF00FF] hover:shadow-[0_0_15px_#FF00FF] p-3 transition-all focus:outline-none"
          >
            {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
          </button>
          <button 
            onClick={nextTrack}
            className="text-[#00FFFF] hover:text-[#FF00FF] transition-colors focus:outline-none"
          >
            <SkipForward size={36} />
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
}
