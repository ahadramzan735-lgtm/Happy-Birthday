import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import Gallery from './Gallery';
import LoveTree from './LoveTree';
import { Heart, Gift, Sparkles } from 'lucide-react';

// Unified RevealText Component
const RevealText: React.FC<{ messages: string[]; delay?: number; className?: string }> = ({ messages, delay = 0, className = "" }) => {
  // Flatten messages into a sequence of words and breaks
  const sequence: ({ type: 'word', text: string } | { type: 'break' })[] = [];

  messages.forEach((msg, index) => {
    msg.split(" ").forEach(word => {
        if (word) sequence.push({ type: 'word', text: word });
    });
    // Add paragraph break
    if (index < messages.length - 1) {
        sequence.push({ type: 'break' });
    }
  });

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, 
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: { 
        opacity: 0, 
        y: 15, 
        filter: "blur(5px)" 
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={`flex flex-wrap ${className}`}
    >
      {sequence.map((item, i) => {
        if (item.type === 'break') {
            return <div key={`break-${i}`} className="basis-full h-6" />; 
        }
        return (
            <motion.span 
                key={i} 
                variants={child} 
                className="mr-1.5 mb-1 inline-block"
            >
                {item.text}
            </motion.span>
        );
      })}
    </motion.div>
  );
};

const BirthdayReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Parallax Transforms - Background moves slower than content
  const yBg1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yBg2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yBg3 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    // Initial explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#ffc0cb', '#ffd700', '#ffffff', '#ff69b4'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        zIndex: 100,
      });
      confetti({
        particleCount: 5,
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
  }, []);

  const triggerConfetti = () => {
    const sound = new Audio('https://archive.org/download/Pop_201608/Pop.mp3');
    sound.volume = 0.8;
    sound.crossOrigin = "anonymous";
    sound.play().catch(e => console.log("Sound blocked", e));

    const count = 500;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 100
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ffc0cb', '#ff69b4'] });
    fire(0.2, { spread: 60, colors: ['#ffffff', '#ffd700'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#ffc0cb', '#ff69b4', '#ffd700'] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#ffffff'] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ['#ffc0cb'] });
  };

  const birthdayMessages = [
    "I just wanted to tell you how much you mean to me. I’m honestly so grateful to have you in my life. You make everything feel lighter and happier just by being you.",
    "I love you so much, and I truly appreciate every little moment we share. You matter to me more than I can explain, and I feel lucky every day knowing you’re mine.",
    "I hope today brings you lots of smiles, love, and happiness — because that’s exactly what you deserve."
  ];

  return (
    <div ref={containerRef} className="h-full w-full relative z-10 overflow-y-auto scroll-smooth perspective-1000">
        
      {/* Parallax Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-[200vh] overflow-hidden">
        <motion.div style={{ y: yBg1, x: -50 }} className="absolute top-[10%] left-[5%] text-rose-200/40 blur-[2px]">
            <Heart size={150} fill="currentColor" />
        </motion.div>
        <motion.div style={{ y: yBg2, rotate: 15 }} className="absolute top-[35%] right-[8%] text-pink-200/30 blur-[1px]">
            <Heart size={200} fill="currentColor" />
        </motion.div>
        <motion.div style={{ y: yBg3, x: 50 }} className="absolute top-[60%] left-[15%] text-purple-200/30 blur-[3px]">
            <Sparkles size={120} />
        </motion.div>
        <motion.div style={{ y: yBg1, rotate: -10 }} className="absolute top-[80%] right-[20%] text-indigo-200/30 blur-[2px]">
            <Heart size={100} fill="currentColor" />
        </motion.div>
        {/* Soft Gradients */}
        <motion.div style={{ y: yBg2 }} className="absolute top-[20%] left-[30%] w-64 h-64 bg-pink-300/20 rounded-full blur-3xl" />
        <motion.div style={{ y: yBg1 }} className="absolute top-[60%] right-[30%] w-80 h-80 bg-purple-300/20 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-block p-3 rounded-full bg-white/30 backdrop-blur-sm mb-6 border border-white/50 shadow-xl">
             <Gift size={48} className="text-rose-600" />
          </div>
          <h1 className="text-6xl md:text-8xl text-rose-500 font-bold mb-2 drop-shadow-sm script-font">
            Happy Birthday!
          </h1>
          <h2 className="text-5xl md:text-7xl text-rose-600 font-medium mb-6 script-font drop-shadow-sm">
            Eliya
          </h2>
        </motion.div>

        {/* Message Card */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="w-full max-w-2xl"
        >
          <div className="glass-panel p-8 md:p-12 rounded-2xl md:rounded-[2rem] transform transition-transform duration-500 hover:scale-[1.01]">
            <div className="flex justify-center mb-6">
               <Heart className="text-rose-400 fill-rose-200 animate-pulse" size={40} />
            </div>
            
            <div className="min-h-[300px] text-lg md:text-xl text-gray-700 leading-relaxed font-light mb-8 text-left">
              <RevealText 
                messages={birthdayMessages} 
                delay={0.5} 
              />
            </div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 6, duration: 1 }}
                className="text-right text-rose-800 font-semibold script-font text-3xl"
            >
              Always yours,<br/>
              Aashir
            </motion.div>
          </div>
        </motion.div>

        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerConfetti}
            className="mt-12 px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium shadow-lg hover:shadow-rose-300/50 transition-all flex items-center justify-center gap-2 select-none"
        >
            Celebration Blast
        </motion.button>
      </div>

      {/* Gallery Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="pt-20 mb-20 relative z-10"
      >
        <Gallery />
      </motion.div>

      {/* Love Tree & Text Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10"
      >
        <LoveTree />
      </motion.div>
    </div>
  );
};

export default BirthdayReveal;