
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
      <AnimatePresence mode="wait">
        {!isExpired ? (
          <motion.div
            key="countdown-active"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl text-rose-900 mb-12 font-light tracking-wide script-font"
            >
              Something magical is coming...
            </motion.h2>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass-panel p-8 md:p-12 rounded-3xl flex flex-wrap justify-center gap-4 md:gap-8 shadow-2xl border-white/60"
            >
              <TimeUnit value={timeLeft.days} label="Days" />
              <div className="hidden md:block text-5xl text-rose-400 font-thin self-center animate-pulse">:</div>
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <div className="hidden md:block text-5xl text-rose-400 font-thin self-center animate-pulse">:</div>
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
              <div className="hidden md:block text-5xl text-rose-400 font-thin self-center animate-pulse">:</div>
              <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="countdown-expired"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 1, bounce: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.h2 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1.05 }} 
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              className="text-4xl md:text-6xl text-rose-900 mb-12 font-medium script-font drop-shadow-sm"
            >
              The moment is here!
            </motion.h2>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(244, 63, 94, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onUnlock}
              className="group relative px-12 py-6 bg-white/60 hover:bg-white/80 text-rose-800 text-2xl font-semibold rounded-full shadow-2xl transition-all duration-300 backdrop-blur-md border-2 border-rose-200 animate-pulse"
            >
              <span className="relative z-10 flex items-center gap-4">
                Click to open the surprise
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </motion.div>
              </span>
              
              {/* Particle glow effect */}
              <div className="absolute inset-0 rounded-full bg-rose-200/20 blur-xl group-hover:bg-rose-300/30 transition-colors" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center mx-2 md:mx-0">
    <motion.div 
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
