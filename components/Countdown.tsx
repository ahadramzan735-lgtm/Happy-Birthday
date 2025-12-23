import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeLeft } from '../types';

interface CountdownProps {
  targetDate: Date;
  onUnlock: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, onUnlock }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    if (isExpired) {
        // Trigger sprinkles/confetti when time hits
        const duration = 5000;
        const end = Date.now() + duration;
        const colors = ['#ffc0cb', '#ffd700', '#ffffff', '#ff69b4'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
                zIndex: 100,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
                zIndex: 100,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }
  }, [isExpired]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-5xl text-rose-900 mb-8 font-light tracking-wide"
      >
        {isExpired ? (
          <motion.span 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1.1 }} 
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
          >
            The moment has arrived!
          </motion.span>
        ) : (
          "Something magical is coming..."
        )}
      </motion.h2>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ 
            y: -15,
            transition: { duration: 0.3, ease: "easeOut" }
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel p-8 md:p-12 rounded-3xl flex flex-wrap justify-center gap-4 md:gap-8 shadow-2xl border-white/60 cursor-pointer"
      >
        <TimeUnit value={timeLeft.days} label="Days" />
        <div className="hidden md:block text-5xl text-rose-400 font-thin self-center animate-pulse">:</div>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <div className="hidden md:block text-5xl text-rose-400 font-thin self-center animate-pulse">:</div>
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <div className="hidden md:block text-5xl text-rose-400 font-thin self-center animate-pulse">:</div>
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </motion.div>

      <div className="mt-12 h-20 flex items-center justify-center">
        {isExpired && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onUnlock}
              className="group relative px-8 py-4 bg-white/40 hover:bg-white/60 text-rose-800 text-xl font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm border border-white/50 animate-bounce"
            >
            <span className="relative z-10 flex items-center gap-2">
                Click for a Surprise
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
                </svg>
            </span>
            </motion.button>
        )}
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center mx-2 md:mx-0">
    <motion.div 
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(244, 63, 94, 0.2)" }}
      className="w-20 h-24 md:w-28 md:h-32 bg-white/50 rounded-xl flex items-center justify-center shadow-inner border border-white/60 overflow-hidden relative"
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="text-4xl md:text-6xl font-bold text-rose-600 font-mono absolute"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </motion.div>
    <span className="mt-4 text-sm md:text-base text-rose-800 font-medium tracking-widest uppercase">
      {label}
    </span>
  </div>
);

export default Countdown;