import React from 'react';

export default function CarAvatar({ src, color, className = "", alt = "vehicle" }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Base Image */}
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-contain z-10 drop-shadow-md" 
      />
      {/* Tint Overlay */}
      {color && (
        <div 
          className="absolute inset-0 z-20 pointer-events-none" 
          style={{
            backgroundColor: color,
            mixBlendMode: 'multiply',
            opacity: 0.85,
            maskImage: `url(${src})`,
            WebkitMaskImage: `url(${src})`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat'
          }} 
        />
      )}
    </div>
  );
}
