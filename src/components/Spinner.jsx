import React from 'react';
import { motion } from 'framer-motion';

export default function Spinner({ size = 'md', variant = 'circle', className = '' }) {
  const sizeMap = {
    sm: { width: 32, height: 32, stroke: 3 },
    md: { width: 64, height: 64, stroke: 5 },
    lg: { width: 96, height: 96, stroke: 7 },
  };

  const { width, height, stroke } = sizeMap[size] || sizeMap.md;

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {['#FF8A3D', '#7C3AED', '#2DD4BF', '#F43F5E'].map((color, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut'
            }}
            style={{ backgroundColor: color }}
            className="w-3.5 h-3.5 rounded-full shadow-sm"
          />
        ))}
      </div>
    );
  }

  // Figma Variant 1: Dual-tone Gradient Ring Spinner
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="drop-shadow-[0_0_15px_rgba(124,58,237,0.45)]"
      >
        <defs>
          <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8A3D" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        
        {/* Background Track */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={stroke * 1.5}
        />

        {/* Animated Gradient Arc */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#spinnerGradient)"
          strokeWidth={stroke * 1.8}
          strokeDasharray="220"
          strokeDashoffset="120"
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
}
