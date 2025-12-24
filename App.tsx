
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Countdown from './components/Countdown';
import BirthdayReveal from './components/BirthdayReveal';
import FloatingBackground from './components/FloatingBackground';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  // Set target date to exactly 2 minutes (120,000ms) from now
  const [targetDate] = useState(() => new Date(Date.now() + 2 * 60 * 1000));

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 animate-gradient overflow-hidden">
      <FloatingBackground />
      <MusicPlayer start={isRevealed} />
      
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Countdown 
              targetDate={targetDate} 
              onUnlock={() => setIsRevealed(true)} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 overflow-hidden" 
          >
            <BirthdayReveal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
