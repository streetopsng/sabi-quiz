import { motion } from 'framer-motion';
import { 
  BriefcaseVector, ThinkingEmojiVector, ClipboardVector, 
  BrainMascotVector, MascotBookVector,
  GoldStarVector, FilmStripVector, ClapboardVector 
} from './VectorIcons';

export default function VectorDecor({ showConfetti = false, variant = 'teal' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Background Teal Gradient or Navy Gradient */}
      {variant === 'teal' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1b5e65] via-[#16444c] to-[#0e202b]" />
          <div className="absolute -top-24 left-1/4 w-[600px] h-[600px] bg-[#14b8a6]/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 w-[600px] h-[600px] bg-[#0284c7]/15 rounded-full blur-[140px] pointer-events-none" />
        </>
      ) : variant === 'dark' ? (
        <>
          <div className="absolute inset-0 bg-[#0a101d]" />
          <div className="absolute -top-24 left-1/4 w-[600px] h-[600px] bg-[#7033ff]/12 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 w-[600px] h-[600px] bg-[#f75270]/12 rounded-full blur-[140px] pointer-events-none" />
        </>
      ) : null}

      {/* 1. Realistic 3D Target Arrow Icon Top Left - Faded & Seamlessly Matched */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.22, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-4 left-4 md:top-8 md:left-8 z-0 pointer-events-none"
      >
        <img 
          src="/assets/target_arrow.jpg" 
          alt="Target Bullseye" 
          style={{ 
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)', 
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)' 
          }}
          className="w-28 h-28 md:w-40 md:h-40 object-contain rounded-full mix-blend-screen filter contrast-[0.9] brightness-[0.9]"
        />
      </motion.div>

      {/* 2. Leather Briefcase Top Right */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="absolute top-6 right-6 md:top-10 md:right-10 pointer-events-none"
      >
        <BriefcaseVector className="w-20 h-16 md:w-32 md:h-24" />
      </motion.div>

      {/* 3. Thinking Emoji with Glasses Mid Left */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-1/3 left-4 md:left-10 opacity-20 pointer-events-none"
      >
        <ThinkingEmojiVector className="w-16 h-16 md:w-22 md:h-22" />
      </motion.div>

      {/* 4. Checklist Clipboard Mid Right */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 right-4 md:right-10 opacity-20 pointer-events-none"
      >
        <ClipboardVector className="w-16 h-22 md:w-22 md:h-30" />
      </motion.div>

      {/* 5. Realistic 3D Light Bulb Bottom Left - Reduced size */}
      <motion.div 
        animate={{ scale: [1, 1.03, 1], y: [0, -4, 0], opacity: [0.18, 0.25, 0.18] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-0 pointer-events-none"
      >
        <img 
          src="/assets/light_bulb.jpg" 
          alt="Glowing Light Bulb" 
          style={{ 
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)', 
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)' 
          }}
          className="w-14 h-14 md:w-20 md:h-20 object-contain rounded-full mix-blend-screen filter contrast-[0.9] brightness-[0.9]"
        />
      </motion.div>

      {/* 6. Mascot with Magnifying Glass & Book Bottom Center */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none"
      >
        <MascotBookVector className="w-20 h-20" />
      </motion.div>

      {/* 7. Realistic 3D Hand Holding Trophy Bottom Right - Reduced size */}
      <motion.div 
        animate={{ y: [0, -6, 0], opacity: [0.2, 0.28, 0.2] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-0 pointer-events-none"
      >
        <img 
          src="/assets/trophy_hand.jpg" 
          alt="Golden Trophy" 
          style={{ 
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)', 
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)' 
          }}
          className="w-18 h-18 md:w-28 md:h-28 object-contain rounded-3xl mix-blend-screen filter contrast-[0.9] brightness-[0.9]"
        />
      </motion.div>

      {/* 8. Extra Extracted Vectors */}
      <div className="absolute top-1/4 right-1/4 opacity-15 pointer-events-none">
        <FilmStripVector className="w-8 h-12" />
      </div>
      <div className="absolute bottom-1/4 right-1/3 opacity-15 pointer-events-none">
        <ClapboardVector className="w-10 h-10" />
      </div>
      <div className="absolute top-1/3 right-12 opacity-18 pointer-events-none">
        <GoldStarVector className="w-8 h-8" />
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
