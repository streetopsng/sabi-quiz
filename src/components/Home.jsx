import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import VectorDecor from './VectorDecor';
import { playSelect } from '../utils/audio';

export default function Home() {
  const { navigate } = useGame();

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0a101d] text-white flex flex-col justify-between overflow-hidden font-sans select-none">
      {/* Background Decor */}
      <VectorDecor showConfetti={true} variant="dark" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 w-full px-4 sm:px-6 md:px-8 py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('home')}
          className="cursor-pointer flex items-center gap-2"
        >
          <span className="text-[32px] font-black tracking-tight text-[#f5a623] drop-shadow-md">
            sabi
          </span>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto my-auto py-12">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[12px] md:text-[13px] font-extrabold tracking-[3px] uppercase text-white/60 mb-6"
        >
          WORKPLACE TRIVAL. REAL CONNECTIONS
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[36px] sm:text-[54px] md:text-[64px] font-black leading-[1.1] tracking-tight mb-6"
        >
          Turn any moment <br />
          into a <span className="text-[#f75270]">shared</span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b55fe6] to-[#8000ff]">
            experience
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[15px] sm:text-[18px] text-white/70 max-w-2xl font-medium leading-relaxed mb-10"
        >
          Sabi is a fun, interactive way to bring your team together, boost knowledge and build a stronger workplace culture
        </motion.p>

        {/* Primary Call To Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { playSelect(); navigate('join'); }}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-[#ff6b4a] via-[#f75270] to-[#9333ea] text-white text-[16px] font-extrabold tracking-wide shadow-[0_8px_30px_rgba(247,82,112,0.4)] hover:shadow-[0_8px_40px_rgba(247,82,112,0.6)] transition-all cursor-pointer"
          >
            Join Game
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { playSelect(); navigate('create'); }}
            className="w-full sm:w-auto px-10 py-4 rounded-xl border border-white/20 bg-white/[0.03] text-white text-[16px] font-bold backdrop-blur-md hover:bg-white/[0.08] hover:border-white/40 transition-all cursor-pointer"
          >
            Host a Game
          </motion.button>
        </motion.div>
      </main>

      {/* FOOTER BADGE */}
      <footer className="relative z-10 py-6 px-6 text-center text-white/40 text-xs font-medium">
        © Sabi Trivia Engine · Built for High Performance Teams
      </footer>
    </div>
  );
}
