import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  start: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ start }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Use the reliable archive.org download redirect link
    const audioUrl = 'https://archive.org/download/HappyBirthdayToYouPianoVersion/Happy%20Birthday%20to%20You%20%28Piano%20Version%29.mp3';
    
    audioRef.current = new Audio();
    audioRef.current.src = audioUrl;
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.crossOrigin = "anonymous";
    
    // Error handling
    audioRef.current.onerror = (e) => {
      console.error("Audio failed to load:", e);
      // Fallback or retry logic could go here if needed
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Attempt autoplay if start is true
    if (start && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          // Autoplay was prevented.
          // User must interact with the page first.
          console.log("Autoplay prevented (waiting for user interaction):", error);
          setIsPlaying(false);
        });
      }
    }
  }, [start]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!start) return null;

  return (
    <button
      onClick={togglePlay}
      className="fixed bottom-6 right-6 z-50 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-rose-200 text-rose-600 hover:bg-white hover:scale-110 transition-all duration-300 group"
      aria-label={isPlaying ? "Mute music" : "Play music"}
      title={isPlaying ? "Mute" : "Play Music"}
    >
      {isPlaying ? (
        <Volume2 size={24} className="group-hover:text-rose-800" />
      ) : (
        <VolumeX size={24} className="text-gray-400 group-hover:text-rose-600" />
      )}
      
      {/* Equalizer animation hint when playing */}
      {isPlaying && (
        <span className="absolute -top-1 -right-1 flex gap-0.5 h-3 items-end">
          <span className="w-1 bg-rose-400 rounded-full animate-[bounce_1s_infinite]"></span>
          <span className="w-1 bg-rose-400 rounded-full animate-[bounce_1.2s_infinite]"></span>
          <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.8s_infinite]"></span>
        </span>
      )}
    </button>
  );
};

export default MusicPlayer;