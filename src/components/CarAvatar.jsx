import React from 'react';

export default function CarAvatar({ src, color, className = "", alt = "vehicle" }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Background Color Ambient Glow */}
      {color && (
        <div 
          className="absolute -inset-2 rounded-full z-0 opacity-50 blur-md pointer-events-none transition-all duration-300" 
          style={{ backgroundColor: color }}
        />
      )}
      
      {/* Ultra-Realistic Full-Color Car Image */}
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-contain z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]" 
      />
    </div>
  );
}
