import { motion } from 'framer-motion';
import { 
  TargetVector, BriefcaseVector, ThinkingEmojiVector, ClipboardVector, 
  BrainMascotVector, MascotBookVector, LightBulbVector, TrophyHandVector,
  GoldStarVector, Brain3DVector, FilmStripVector, ClapboardVector 
} from './VectorIcons';

export default function VectorDecor({ showConfetti = false, variant = 'teal' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Background Teal Gradient or Navy Gradient */}
      {variant === 'teal' ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b5e65] via-[#16444c] to-[#0e202b]" />
      ) : variant === 'dark' ? (
        <div className="absolute inset-0 bg-[#0a101d]" />
      ) : null}

      {/* 1. Target Arrow Icon Top Left */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-4 left-4 md:top-8 md:left-8 drop-shadow-xl"
      >
        <TargetVector className="w-24 h-24 md:w-36 md:h-36" />
      </motion.div>

      {/* 2. Leather Briefcase Top Right */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.22, scale: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="absolute top-6 right-6 md:top-10 md:right-10 drop-shadow-2xl"
      >
        <BriefcaseVector className="w-20 h-16 md:w-32 md:h-24" />
      </motion.div>

      {/* 3. Thinking Emoji with Glasses Mid Left */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-1/3 left-4 md:left-10 opacity-35"
      >
        <ThinkingEmojiVector className="w-16 h-16 md:w-22 md:h-22" />
      </motion.div>

      {/* 4. Checklist Clipboard Mid Right */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 right-4 md:right-10 opacity-30"
      >
        <ClipboardVector className="w-16 h-22 md:w-22 md:h-30" />
      </motion.div>

      {/* 5. Brain Mascot with Light Bulb Bottom Left */}
      <motion.div 
        animate={{ scale: [1, 1.06, 1], y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute bottom-8 left-4 md:bottom-12 md:left-12 opacity-35"
      >
        <BrainMascotVector className="w-16 h-16" />
      </motion.div>

      {/* 6. Mascot with Magnifying Glass & Book Bottom Center */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-30"
      >
        <MascotBookVector className="w-20 h-20" />
      </motion.div>

      {/* 7. Extra Extracted Vectors */}
      <div className="absolute top-1/4 right-1/4 opacity-20">
        <FilmStripVector className="w-8 h-12" />
      </div>
      <div className="absolute bottom-1/4 right-1/3 opacity-20">
        <ClapboardVector className="w-10 h-10" />
      </div>
      <div className="absolute top-1/3 right-12 opacity-25">
        <GoldStarVector className="w-8 h-8" />
      </div>
      <div className="absolute bottom-1/3 left-1/4 opacity-25">
        <TrophyHandVector className="w-16 h-20" />
      </div>

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
