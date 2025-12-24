
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  start: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ start }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Piano version audio link
    const audioUrl = 'https://archive.org/download/HappyBirthdayToYouPianoVersion/Happy%20Birthday%20to%20You%20%28Piano%20Version%29.mp3';
    
    const audio = new Audio();
    audio.src = audioUrl;
    audio.loop = true;
    audio.volume = 0.5;
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    
    // Improved error handling to avoid [object Object]
    audio.onerror = () => {
      const error = audio.error;
      console.error("Audio Load Error:", {
        code: error?.code,
        message: error?.message,
        src: audioUrl
      });
    };

    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (start && audioRef.current) {
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.warn("Autoplay blocked or audio not ready. User interaction required:", error);
          setIsPlaying(false);
        }
      };
      playAudio();
    }
  }, [start]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Play failed:", e));
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
      
      {isPlaying && (
        <span className="absolute -top-1 -right-1 flex gap-0.5 h-3 items-end">
          <span className="w-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }}></span>
          <span className="w-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s' }}></span>
          <span className="w-1 bg-rose-400 rounded-full animate-bounce" style={{ animationDuration: '0.5s' }}></span>
        </span>
      )}
    </button>
  );
};

export default MusicPlayer;
