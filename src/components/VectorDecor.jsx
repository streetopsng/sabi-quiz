import { motion } from 'framer-motion';

export default function VectorDecor({ showConfetti = false, variant = 'teal' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Teal Gradient or Navy Gradient */}
      {variant === 'teal' ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b5e65] via-[#16444c] to-[#0e202b]" />
      ) : variant === 'dark' ? (
        <div className="absolute inset-0 bg-[#0a101d]" />
      ) : null}

      {/* Target Arrow Icon Top Left */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-6 left-6 md:top-12 md:left-12 w-24 h-24 md:w-36 md:h-36"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-red-500">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" />
          <circle cx="50" cy="50" r="28" stroke="#ffffff" strokeWidth="6" />
          <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="6" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
          <line x1="80" y1="20" x2="40" y2="60" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <path d="M72 16 L84 16 L84 28" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Briefcase Icon Top Right */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-10 right-10 md:top-16 md:right-16 w-20 h-16 md:w-32 md:h-24"
      >
        <div className="w-full h-full bg-[#2a1a08] border-2 border-[#5c3a19] rounded-xl relative shadow-2xl">
          <div className="w-12 h-6 border-2 border-[#5c3a19] border-b-0 rounded-t-lg absolute -top-6 left-1/2 -translate-x-1/2" />
          <div className="w-4 h-5 bg-amber-500 rounded-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow" />
        </div>
      </motion.div>

      {/* Thinking Emoji / Mascot Mid Left */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-1/3 left-4 md:left-12 w-14 h-14 md:w-20 md:h-20 opacity-30"
      >
        <div className="w-full h-full rounded-full bg-amber-400 border-2 border-amber-600 flex flex-col items-center justify-center relative shadow-lg">
          <div className="flex gap-2 mb-1">
            <div className="w-3 h-3 bg-black rounded-full border border-white" />
            <div className="w-3 h-3 bg-black rounded-full border border-white" />
          </div>
          <div className="w-6 h-2 border-t-2 border-black rounded-t-full" />
          <div className="absolute -bottom-2 -left-2 text-xs">🤔</div>
        </div>
      </motion.div>

      {/* Checklist Icon Mid Right */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 right-4 md:right-12 w-14 h-20 md:w-20 md:h-28 bg-[#fef3c7] border-2 border-amber-700 rounded-lg p-2 shadow-xl"
      >
        <div className="w-6 h-3 bg-amber-800 rounded-t-md mx-auto -mt-4 mb-2" />
        <div className="space-y-2">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm" /><div className="h-1.5 bg-amber-900/40 flex-1 rounded" /></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm" /><div className="h-1.5 bg-amber-900/40 flex-1 rounded" /></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm" /><div className="h-1.5 bg-amber-900/40 flex-1 rounded" /></div>
        </div>
      </motion.div>

      {/* Light Bulb Bottom Left */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute bottom-8 left-6 md:bottom-12 md:left-16 w-20 h-24 opacity-30"
      >
        <div className="w-16 h-16 bg-amber-300 rounded-full border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center text-2xl font-bold">
          💡
        </div>
      </motion.div>

      {/* Mascot with Magnifying Glass Bottom Center */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-20 md:w-40 md:h-28 opacity-25 flex flex-col items-center"
      >
        <div className="text-4xl">🔍📖</div>
      </motion.div>

      {/* Confetti Rain Layer (Optional) */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-4 rounded-full"
              style={{
                backgroundColor: ['#ff6b4a', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'][i % 6],
                top: `${(i * 4) % 100}%`,
                left: `${(i * 7) % 100}%`,
                transform: `rotate(${i * 25}deg)`
              }}
              animate={{
                y: [0, 40, 0],
                opacity: [0.3, 0.8, 0.3],
                rotate: [i * 25, i * 25 + 180, i * 25 + 360]
              }}
              transition={{ repeat: Infinity, duration: 3 + (i % 3), ease: "linear" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
