import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import { Photo } from '../types';

// The 6 source images provided
const sourceImages = [
  { url: 'https://i.ibb.co/23HfQsDr/IMG-8260.jpg', caption: 'IMG-8260' },
  { url: 'https://i.ibb.co/tTNWjYDb/IMG-8259.jpg', caption: 'IMG-8259' },
  { url: 'https://i.ibb.co/Tqh64dDx/IMG-7828.jpg', caption: 'IMG-7828' },
  { url: 'https://i.ibb.co/DPKgv2yn/IMG-7831.jpg', caption: 'IMG-7831' },
  { url: 'https://i.ibb.co/rK7gs8CF/IMG-8258.jpg', caption: 'IMG-8258' },
  { url: 'https://i.ibb.co/nsRCBW4F/IMG-8257.jpg', caption: 'IMG-8257' },
];

// Generate photos list without duplication
const generatePhotos = () => {
  return sourceImages.map((img, index) => ({
    id: index,
    url: img.url,
    caption: img.caption,
    // Random rotation between -6 and 6 degrees for the scattered look
    rotation: Math.random() * 12 - 6,
    // Random vertical offset for natural irregularity
    yOffset: Math.random() * 20
  }));
};

const Gallery: React.FC = () => {
  const photos = useMemo(() => generatePhotos(), []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 perspective-1000">
      <h3 className="text-4xl md:text-6xl text-rose-900 text-center mb-20 script-font drop-shadow-sm opacity-90">
        Moments
      </h3>
      
      {/* Masonry Layout using CSS Columns - Adjusted for fewer images */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-8 space-y-8 px-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="break-inside-avoid mb-8 pt-4">
             <PolaroidCard photo={photo} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface PolaroidCardProps {
  photo: Photo & { rotation: number; yOffset: number };
  index: number;
}

const PolaroidCard: React.FC<PolaroidCardProps> = ({ photo, index }) => {
  const ref = useRef<HTMLDivElement>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXRel = e.clientX - rect.left;
    const mouseYRel = e.clientY - rect.top;
    const xPct = (mouseXRel / width) - 0.5;
    const yPct = (mouseYRel / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Scroll Animation Variants
  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 100, 
      rotate: 0,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: photo.yOffset, 
      rotate: photo.rotation, // Settle into the random rotation
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
        duration: 0.8,
        delay: index * 0.15 // Simple staggered delay based on index
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "100px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.1, 
        rotate: 0, 
        zIndex: 50,
        transition: { duration: 0.2 }
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer w-full bg-white p-3 pb-8 shadow-md hover:shadow-2xl hover:shadow-rose-200/50 transition-shadow duration-300 rounded-sm"
    >
      <div 
        className="w-full overflow-hidden bg-gray-100 relative aspect-[3/4]"
        style={{ transform: "translateZ(20px)" }}
      >
        <img 
            src={photo.url} 
            alt="Memory" 
            className="w-full h-full object-cover select-none"
            loading="lazy"
        />
        
        {/* Shine Effect */}
        <div 
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ mixBlendMode: 'overlay' }}
        />
      </div>
    </motion.div>
  );
};

export default Gallery;