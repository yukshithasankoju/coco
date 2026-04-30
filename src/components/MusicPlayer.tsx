import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';

// Free to use public domain ambient/synth style tracks from Wikimedia Commons
const TRACKS = [
  {
    title: "Neon Horizon 01",
    artist: "AI-Gen X-84",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Bumbac_-_Electro_zombie_%28electro%29.ogg",
    theme: "cyan",
    color: "text-cyan-400",
    bg: "bg-cyan-500"
  },
  {
    title: "Cyber City Vibes",
    artist: "Neural Net Audio",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/91/P_e_p_p_e_r_m_i_n_t_-_d_e_f_t_e_r_k_o_s.ogg",
    theme: "fuchsia",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500"
  },
  {
    title: "Grid Runner",
    artist: "Deep Dream Audio",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Tetris_theme.ogg",
    theme: "lime",
    color: "text-lime-400",
    bg: "bg-lime-500"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // Handle play/pause commands
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // use a catch here to avoid unhandled promise rejection if browser blocks autoplay
        audioRef.current.play().catch(e => {
           console.error("Audio playback blocked", e);
           setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  // Handle auto-skipping when song ends
  const handleEnded = () => {
    playNext();
  };

  // Keep track of time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setProgress(0);
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`relative w-full max-w-sm rounded-xl overflow-hidden border border-${currentTrack.theme}-500/30 bg-[#0a0f1d]/90 backdrop-blur-xl shadow-lg p-5 transition-colors duration-700 block mx-auto`}>
      {/* Glow effect based on track theme */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${currentTrack.bg} rounded-full filter blur-[100px] opacity-10 mix-blend-screen transition-colors duration-700`} />
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onError={(e) => console.log('Audio error', e)}
      />

      <div className="flex gap-4 items-center relative z-10 w-full mb-6">
        {/* Futuristic Album Art Cover */}
        <div className={`w-16 h-16 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-${currentTrack.theme}-500/40 relative shadow-inner`}>
           <div className={`absolute inset-0 bg-gradient-to-br from-black to-${currentTrack.theme}-900/40`}></div>
           <Disc3 className={`w-8 h-8 ${currentTrack.color} ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} drop-shadow-md relative z-10 opacity-80`} />
        </div>
        
        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <div className={`w-2 h-2 ${currentTrack.bg} rounded-full ${isPlaying ? 'animate-pulse' : 'opacity-50'} shadow-[0_0_8px_currentColor]`} />
             <p className={`text-xs font-mono tracking-widest uppercase ${currentTrack.color} opacity-80 text-shadow-sm truncate`}>
               {currentTrack.artist}
             </p>
          </div>
          <h3 className="text-lg font-bold text-white truncate drop-shadow-md">
            {currentTrack.title}
          </h3>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-800 rounded-full mb-5 overflow-hidden relative">
        <div 
          className={`h-full ${currentTrack.bg} rounded-full transition-all duration-150 relative shadow-[0_0_10px_currentColor]`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={toggleMute}
          className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={playPrev}
            className="p-2 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${currentTrack.bg} text-black hover:scale-105 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
            style={{ boxShadow: isPlaying ? `0 0 20px ${currentTrack.color === 'text-cyan-400' ? '#06b6d4' : currentTrack.color === 'text-fuchsia-400' ? '#ec4899' : '#84cc16'}80` : '' }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>
          
          <button 
            onClick={playNext}
            className="p-2 text-white/70 hover:text-white hover:scale-110 transition-all cursor-pointer"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        {/* Empty div for flex spacing balance */}
        <div className="w-8" />
      </div>
    </div>
  );
}
