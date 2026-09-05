import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';
import { useGame } from '../context/GameContext';

const TRIVIA_TIPS = [
  "⚡ Speed counts! Answer quickly to earn extra bonus points.",
  "🔥 Keep your streak alive to multiply your round points!",
  "👀 Stay sharp — double check the answers before time runs out!",
  "🏆 Consistency is key to climbing to the top of the podium.",
  "🎯 Focus on accuracy — wrong answers reset your streak!"
];

export default function LoadingScreen({ message }) {
  const { currentQ, gameQuestions, gameRef } = useGame();
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TRIVIA_TIPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const totalQuestions = gameQuestions?.length || 12;
  const nextQNum = (currentQ ?? 0) + 1; // 1-indexed for display
  const isFinal = nextQNum > totalQuestions;

  const displayMessage = message || 
    gameRef?.current?.loadingMessage || 
    (isFinal 
      ? 'Calculating Final Standings...' 
      : `Get Ready for Round ${nextQNum} of ${totalQuestions}...`);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#183944] text-white flex flex-col items-center justify-between p-6 overflow-hidden select-none font-poppins">
      {/* Radial Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-[#FF8A3D]/15 rounded-full blur-[160px]" />
      </div>

      {/* Top Header with sabi Brand Logo */}
      <header className="relative z-10 pt-4 flex flex-col items-center">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-tr from-[#FFD166] via-white to-white bg-clip-text text-transparent drop-shadow-md">
          sabi
        </span>
      </header>

      {/* Center Spinner & Message */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4 max-w-lg">
        {/* Animated Dual-tone Ring Spinner */}
        <Spinner size="lg" variant="circle" />
        
        {/* Main Loading Message */}
        <motion.h2
          key={displayMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 text-xl sm:text-2xl font-bold text-white tracking-wide"
        >
          {displayMessage}
        </motion.h2>

        {/* Dynamic Trivia Tip Pill */}
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm text-white/80 font-medium backdrop-blur-sm max-w-sm"
        >
          {TRIVIA_TIPS[tipIndex]}
        </motion.div>

        {/* Bouncing Dots */}
        <div className="mt-6">
          <Spinner variant="dots" />
        </div>
      </main>

      {/* Footer GummyGum Badge */}
      <footer className="relative z-10 pb-4 text-center">
        <img
          src="/assets/figma/gummygum_footer_badge.png"
          alt="GummyGum"
          className="h-6 object-contain opacity-70"
        />
      </footer>
    </div>
  );
}
