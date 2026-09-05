import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { playSelect } from '../utils/audio';

export default function Home() {
  const { navigate } = useGame();

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#091521] text-white flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none font-poppins pb-8">
      {/* BACKGROUND AMBIENT RADIAL LIGHTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#7C3AED]/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[650px] h-[650px] bg-[#FF8A3D]/12 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] left-[-5%] w-[450px] h-[450px] bg-[#224552]/40 rounded-full blur-[120px]" />
      </div>

      {/* FLOATING 3D GRAPHICS (CRISP, UNBLURRED & PROPORTIONATELY SIZED) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glowing Light Bulb with Confetti (Left Mid Position, Balanced Size) */}
        <motion.img
          src="/assets/figma/floating_left.png"
          alt="Glowing Light Bulb"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 0.95, x: 0, y: [0, -12, 0], rotate: [0, 1.5, 0] }}
          transition={{
            opacity: { duration: 0.7 },
            x: { duration: 0.7 },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="block absolute left-[-10px] sm:left-2 lg:left-8 top-[38%] -translate-y-1/2 w-[85px] sm:w-[110px] lg:w-[135px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
        />

        {/* Hand Holding Golden Trophy Cup with Confetti (Right Bottom Position, Balanced Size) */}
        <motion.img
          src="/assets/figma/floating_right.png"
          alt="Golden Trophy Cup"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 0.95, x: 0, y: [0, -14, 0], rotate: [0, -1.5, 0] }}
          transition={{
            opacity: { duration: 0.7, delay: 0.15 },
            x: { duration: 0.7, delay: 0.15 },
            y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="block absolute right-[-10px] sm:right-4 lg:right-10 bottom-6 sm:bottom-10 lg:bottom-12 w-[130px] sm:w-[165px] lg:w-[200px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
        />

        {/* Upper Right Thinking Emoji */}
        <motion.img
          src="/assets/figma/thinking_emoji.png"
          alt="Thinking Emoji"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.9, scale: 1, y: [0, 10, 0], rotate: [0, -2, 0] }}
          transition={{
            opacity: { duration: 0.7, delay: 0.25 },
            scale: { duration: 0.7, delay: 0.25 },
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="hidden md:block absolute right-8 sm:right-16 lg:right-24 top-[100px] sm:top-[115px] w-[50px] sm:w-[65px] lg:w-[75px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
        />
      </div>

      {/* TOP NAVIGATION BAR - ONLY "SABI" BRAND NAME */}
      <header className="relative z-30 w-full max-w-[1240px] mx-auto px-6 pt-4 sm:pt-6 pb-2 flex items-center justify-between">
        <div
          onClick={() => { playSelect(); navigate('home'); }}
          className="cursor-pointer flex items-center group"
        >
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-tr from-[#FFD166] via-white to-white bg-clip-text text-transparent drop-shadow-md group-hover:scale-105 transition-transform">
            sabi
          </span>
        </div>
      </header>

      {/* MAIN HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-[950px] mx-auto py-3 sm:py-6 my-auto">
        {/* Eyebrow Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-white/90 drop-shadow mb-2 sm:mb-3"
        >
          WORKPLACE TRIVIA. REAL CONNECTIONS
        </motion.div>

        {/* Main Title with Gradient Emphasis */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.12] tracking-tight text-white mb-3 sm:mb-4 max-w-[850px] drop-shadow-2xl"
        >
          Turn any moment <br className="hidden sm:inline" />
          into a{' '}
          <span className="bg-gradient-to-r from-[#FF8A3D] via-[#a855f7] to-[#7C3AED] bg-clip-text text-transparent">
            shared experience
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs sm:text-base md:text-lg text-white/80 max-w-[650px] font-normal leading-relaxed mb-6 sm:mb-8 drop-shadow"
        >
          Sabi is a fun, interactive way to bring your team together, boost knowledge and build a stronger workplace culture
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full max-w-sm sm:max-w-none"
        >
          {/* Join Game Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { playSelect(); navigate('join'); }}
            className="w-full sm:w-[220px] h-[52px] sm:h-[58px] rounded-xl bg-gradient-to-r from-[#FF8A3D] to-[#7C3AED] text-white text-base sm:text-lg font-semibold shadow-[0_8px_25px_rgba(255,138,61,0.35)] hover:shadow-[0_12px_35px_rgba(124,58,237,0.5)] transition-all cursor-pointer flex items-center justify-center"
          >
            <span>Join Game</span>
          </motion.button>

          {/* Host a Game Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { playSelect(); navigate('create'); }}
            className="w-full sm:w-[220px] h-[52px] sm:h-[58px] rounded-xl border border-white/80 bg-transparent hover:bg-white/10 text-white text-base sm:text-lg font-semibold backdrop-blur-sm transition-all cursor-pointer flex items-center justify-center"
          >
            <span>Host a Game</span>
          </motion.button>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-3 px-6 text-center text-white/40 text-xs font-normal">
        © Sabi Trivia Engine · Workplace Trivia & Real Connections
      </footer>
    </div>
  );
}
