import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const messages = [
  "My beautiful life 💞",
  "Happy Birthday 🎈",
  "May Allah bless you 🍀",
  "And give u many happiness 💕",
  "I loved you ❤️",
  "And I will always love u 🥺 ❤️",
  "Hope u have a great day today ❤️😘"
];

const LoveTree: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const treeCanvasRef = useRef<HTMLCanvasElement>(null);
  const animCanvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  const [timeTogether, setTimeTogether] = useState({ 
    years: 0,
    months: 0,
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0 
  });

  // Set start date to December 25, 2007
  // This calculates time together FROM this date
  const startDate = new Date('2007-12-25T00:00:00'); 

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      // Adjust for negative seconds
      if (seconds < 0) {
        minutes--;
        seconds += 60;
      }
      
      // Adjust for negative minutes
      if (minutes < 0) {
        hours--;
        minutes += 60;
      }

      // Adjust for negative hours
      if (hours < 0) {
        days--;
        hours += 24;
      }

      // Adjust for negative days
      if (days < 0) {
        months--;
        // Get days in the previous month to subtract correctly
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonthDate.getDate();
      }

      // Adjust for negative months
      if (months < 0) {
        years--;
        months += 12;
      }

      setTimeTogether({ years, months, days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tree Growth Effect
  useEffect(() => {
    if (!isInView || !treeCanvasRef.current) return;

    const canvas = treeCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = 500; 
    };
    setCanvasSize();

    // Start Position: 75% to the right, rooted at the bottom
    const startX = canvas.width * 0.75; 
    const startY = canvas.height; // Moved down to bottom (grounded)
    const branchLen = 90;
    const angle = -Math.PI / 2;

    const drawBranch = (x: number, y: number, len: number, ang: number, width: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      const endX = x + len * Math.cos(ang);
      const endY = y + len * Math.sin(ang);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = `rgb(${100 + Math.random() * 50}, ${60 + Math.random() * 30}, ${30 + Math.random() * 20})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.stroke();

      if (len > 8) { 
        setTimeout(() => {
            const subBranches = Math.random() > 0.5 ? 2 : 3;
            for(let i=0; i<subBranches; i++) {
                const rotation = (Math.random() - 0.5) * Math.PI / 2;
                drawBranch(endX, endY, len * (0.7 + Math.random() * 0.1), ang + rotation, width * 0.7);
            }
        }, 150); 
      } else {
        setTimeout(() => {
            // Draw larger cluster of pink hearts at the tips for denser look
            const heartCount = 6 + Math.floor(Math.random() * 6);
            for(let k=0; k < heartCount; k++) {
                drawHeart(
                    ctx, 
                    endX + (Math.random() * 30 - 15), 
                    endY + (Math.random() * 30 - 15), 
                    4 + Math.random() * 6
                );
            }
        }, 200 + Math.random() * 500);
      }
    };

    drawBranch(startX, startY, branchLen, angle, 10); 

  }, [isInView]);

  // Falling Petals Animation Effect
  useEffect(() => {
    if (!isInView || !animCanvasRef.current) return;
    const canvas = animCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = 500;
    };
    setCanvasSize();

    interface Petal {
        x: number;
        y: number;
        size: number;
        speed: number;
        drift: number;
        opacity: number;
        rotation: number;
        rotationSpeed: number;
    }

    const petals: Petal[] = [];
    const maxPetals = 60; // Increased count for fuller effect

    const createPetal = (): Petal => ({
        x: (Math.random() * canvas.width * 0.5) + (canvas.width * 0.45), // Spawn mostly on right side around tree
        y: -10,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 1 + 0.5,
        drift: Math.random() * 2 - 1,
        opacity: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
    });

    // Seed initial petals
    for(let i=0; i<20; i++) petals.push(createPetal());

    let animationFrameId: number;

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Add new petal occasionally
        if (petals.length < maxPetals && Math.random() < 0.04) {
            petals.push(createPetal());
        }

        petals.forEach((petal, index) => {
            petal.y += petal.speed;
            petal.x += Math.sin(petal.y * 0.01) + petal.drift * 0.2;
            petal.rotation += petal.rotationSpeed;

            if (petal.y > canvas.height) {
                petals[index] = createPetal();
            }

            // Draw Heart Petal
            ctx.save();
            ctx.translate(petal.x, petal.y);
            ctx.rotate(petal.rotation * Math.PI / 180);
            ctx.fillStyle = `rgba(255, ${160 + Math.random() * 50}, ${180 + Math.random() * 40}, ${petal.opacity})`;
            ctx.beginPath();
            const s = petal.size;
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
            ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        });

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView]);

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    // Vibrant Pink Colors
    ctx.fillStyle = `rgba(255, ${Math.random() * 60 + 100}, ${Math.random() * 60 + 140}, 0.9)`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
    ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
    ctx.fill();
    ctx.restore();
};

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-start pt-4 pb-10 overflow-hidden">
      
      {/* Time Together Clock with Years/Months/Days... */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="z-20 mb-8 w-full px-4"
      >
         <div className="glass-panel px-4 py-4 rounded-[2rem] flex flex-wrap justify-center gap-2 md:gap-5 text-rose-900 shadow-xl border border-rose-200/50 max-w-4xl mx-auto">
            <TimeUnit value={timeTogether.years} label="Years" />
            <Separator />
            <TimeUnit value={timeTogether.months} label="Months" />
            <Separator />
            <TimeUnit value={timeTogether.days} label="Days" />
            <Separator />
            <TimeUnit value={timeTogether.hours} label="Hours" />
            <Separator />
            <TimeUnit value={timeTogether.minutes} label="Mins" />
            <Separator />
            <TimeUnit value={timeTogether.seconds} label="Secs" />
         </div>
      </motion.div>

      {/* Content Container */}
      <div className="relative w-full max-w-6xl mx-auto h-[700px] md:h-[500px]">
        
        {/* Text Area - Position Adjusted Upward to 150px to align with tree foliage */}
        <div className="relative md:absolute top-24 md:top-[150px] md:left-24 z-20 w-full md:w-auto text-center md:text-left px-4 pointer-events-none">
            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 1.5 + 2, duration: 1 }}
                    className="mb-3"
                >
                    <span className="script-font text-2xl md:text-4xl text-rose-600 drop-shadow-sm font-medium block leading-normal">
                        {msg}
                    </span>
                </motion.div>
            ))}
        </div>

        {/* Tree Canvas */}
        <canvas 
            ref={treeCanvasRef} 
            className="absolute bottom-0 left-0 w-full h-[500px] md:h-full z-10"
        />
        
        {/* Animation Canvas */}
        <canvas 
            ref={animCanvasRef} 
            className="absolute bottom-0 left-0 w-full h-[500px] md:h-full z-15 pointer-events-none"
        />
      </div>

    </div>
  );
};

const TimeUnit: React.FC<{ value: number, label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center min-w-[55px] md:min-w-[70px]">
        <span className="text-xl md:text-3xl font-bold font-mono leading-none">{value}</span>
        <span className="text-[10px] md:text-xs uppercase tracking-wider mt-1 opacity-80">{label}</span>
    </div>
);

const Separator: React.FC = () => (
    <div className="hidden sm:block text-2xl font-light self-start mt-1 text-rose-400 opacity-60">:</div>
);

export default LoveTree;