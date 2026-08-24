import { motion } from 'framer-motion';

export default function VectorDecor({ showConfetti = false, variant = 'teal' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Background Teal Gradient or Navy Gradient */}
      {variant === 'teal' ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b5e65] via-[#16444c] to-[#0e202b]" />
      ) : variant === 'dark' ? (
        <div className="absolute inset-0 bg-[#0a101d]" />
      ) : null}

      {/* 1. Target Arrow Icon Top Left (from asset image) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-4 left-4 md:top-8 md:left-8 w-24 h-24 md:w-36 md:h-36 drop-shadow-xl"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <circle cx="50" cy="50" r="40" stroke="#ef4444" strokeWidth="8" fill="#ef4444" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="28" stroke="#ffffff" strokeWidth="6" fill="#ffffff" fillOpacity="0.15" />
          <circle cx="50" cy="50" r="16" stroke="#ef4444" strokeWidth="6" fill="#ef4444" />
          <circle cx="50" cy="50" r="6" fill="#ffffff" />
          <line x1="82" y1="18" x2="42" y2="58" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
          <path d="M72 16 L84 16 L84 28" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* 2. Leather Briefcase Top Right (from asset image) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.22, scale: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="absolute top-6 right-6 md:top-10 md:right-10 w-20 h-16 md:w-32 md:h-24 drop-shadow-2xl"
      >
        <div className="w-full h-full bg-[#3a2212] border-2 border-[#6b4224] rounded-xl relative shadow-2xl">
          <div className="w-12 h-6 border-2 border-[#6b4224] border-b-0 rounded-t-lg absolute -top-6 left-1/2 -translate-x-1/2 bg-[#2d1a0e]" />
          <div className="w-5 h-6 bg-amber-500 rounded-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-inner border border-amber-600 flex items-center justify-center">
            <div className="w-1.5 h-2 bg-amber-900 rounded-xs" />
          </div>
        </div>
      </motion.div>

      {/* 3. Thinking Emoji with Glasses Mid Left (from asset image) */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-1/3 left-4 md:left-10 w-16 h-16 md:w-22 md:h-22 opacity-35"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-amber-600 flex flex-col items-center justify-center relative shadow-2xl">
          {/* Glasses */}
          <div className="flex gap-1.5 mb-1 z-10">
            <div className="w-4 h-4 bg-black/80 rounded-full border-2 border-black flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <div className="w-2 h-0.5 bg-black my-auto" />
            <div className="w-4 h-4 bg-black/80 rounded-full border-2 border-black flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          {/* Thinking hand */}
          <div className="text-xl font-bold">🤔</div>
        </div>
      </motion.div>

      {/* 4. Checklist Clipboard Mid Right (from asset image) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 right-4 md:right-10 w-16 h-22 md:w-22 md:h-30 bg-[#fef3c7] border-2 border-[#854d0e] rounded-xl p-2 shadow-2xl"
      >
        <div className="w-8 h-4 bg-[#78350f] rounded-t-md mx-auto -mt-4 mb-2 shadow" />
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">✓</div><div className="h-2 bg-[#78350f]/30 flex-1 rounded" /></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">✓</div><div className="h-2 bg-[#78350f]/30 flex-1 rounded" /></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">✓</div><div className="h-2 bg-[#78350f]/30 flex-1 rounded" /></div>
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">✓</div><div className="h-2 bg-[#78350f]/30 flex-1 rounded" /></div>
        </div>
      </motion.div>

      {/* 5. Brain Mascot with Light Bulb Bottom Left (from asset image) */}
      <motion.div 
        animate={{ scale: [1, 1.06, 1], y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute bottom-8 left-4 md:bottom-12 md:left-12 opacity-35 flex flex-col items-center"
      >
        <div className="relative">
          <div className="text-3xl animate-bounce">💡</div>
          <div className="text-4xl -mt-2">🧠</div>
        </div>
      </motion.div>

      {/* 6. Mascot with Magnifying Glass & Book Bottom Center (from asset image) */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-30 flex flex-col items-center"
      >
        <div className="text-4xl md:text-5xl drop-shadow-lg">🔍📖</div>
      </motion.div>

      {/* 7. Extra Decorative Assets from Image (Film Strip, Clapboard, Trophy, Brain) */}
      <div className="absolute top-1/4 right-1/4 opacity-15 text-2xl">🎞️</div>
      <div className="absolute bottom-1/4 right-1/3 opacity-15 text-2xl">🎬</div>
      <div className="absolute top-1/3 right-12 opacity-20 text-3xl">⭐</div>
      <div className="absolute bottom-1/3 left-1/4 opacity-20 text-3xl">🏆</div>

      {/* Confetti Rain Layer */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-4 rounded-full"
              style={{
                backgroundColor: ['#ff6b4a', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'][i % 6],
                top: `${(i * 3.5) % 100}%`,
                left: `${(i * 6.5) % 100}%`,
                transform: `rotate(${i * 25}deg)`
              }}
              animate={{
                y: [0, 45, 0],
                opacity: [0.3, 0.9, 0.3],
                rotate: [i * 25, i * 25 + 180, i * 25 + 360]
              }}
              transition={{ repeat: Infinity, duration: 2.5 + (i % 3), ease: "linear" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
