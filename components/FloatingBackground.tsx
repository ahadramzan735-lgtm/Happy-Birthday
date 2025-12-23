import React from 'react';
import { Heart } from 'lucide-react';

const FloatingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Abstract blurred orbs for color depth */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Floating Icons */}
      <div className="absolute top-[20%] left-[10%] text-pink-300 floating-element" style={{ animationDelay: '0s' }}>
        <Heart size={48} fill="currentColor" className="opacity-40" />
      </div>
      <div className="absolute top-[60%] right-[15%] text-rose-300 floating-element" style={{ animationDelay: '2s' }}>
        <Heart size={32} fill="currentColor" className="opacity-30" />
      </div>
      <div className="absolute bottom-[10%] left-[25%] text-purple-300 floating-element" style={{ animationDelay: '4s' }}>
        <Heart size={64} fill="currentColor" className="opacity-20" />
      </div>
      <div className="absolute top-[15%] right-[30%] text-pink-200 floating-element" style={{ animationDelay: '1.5s' }}>
        <div className="w-12 h-16 rounded-[50%] bg-current opacity-40"></div>
      </div>
      <div className="absolute bottom-[30%] right-[5%] text-indigo-200 floating-element" style={{ animationDelay: '3.5s' }}>
        <div className="w-16 h-20 rounded-[50%] bg-current opacity-30"></div>
      </div>
    </div>
  );
};

export default FloatingBackground;