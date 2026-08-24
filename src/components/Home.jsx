import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import VectorDecor from './VectorDecor';
import { playSelect } from '../utils/audio';
import { X, HelpCircle, Sparkles, CreditCard, LifeBuoy } from 'lucide-react';

export default function Home() {
  const { navigate } = useGame();
  const [activeTab, setActiveTab] = useState('Home');
  const [activeModal, setActiveModal] = useState(null);

  const handleNavClick = (tab) => {
    playSelect();
    setActiveTab(tab);
    if (tab !== 'Home') {
      setActiveModal(tab);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0a101d] text-white flex flex-col justify-between overflow-hidden font-sans select-none">
      {/* Background Decor */}
      <VectorDecor showConfetti={true} variant="dark" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('home')}
          className="cursor-pointer flex items-center gap-2"
        >
          <span className="text-[32px] font-black tracking-tight text-[#f5a623] drop-shadow-md">
            sabi
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold">
          {['Home', 'How it works', 'Features', 'Pricing', 'Supports'].map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className={`transition-colors cursor-pointer ${
                activeTab === item 
                  ? 'text-[#f5a623] font-bold' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('join')}
            className="text-[15px] font-bold text-white/80 hover:text-white transition-colors cursor-pointer hidden sm:block"
          >
            Log in
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { playSelect(); navigate('create'); }}
            className="px-6 py-3 rounded-xl bg-[#7033ff] text-white text-[15px] font-bold shadow-[0_4px_20px_rgba(112,51,255,0.4)] hover:bg-[#6020ef] transition-all cursor-pointer"
          >
            Host a Game
          </motion.button>
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

      {/* INFORMATIONAL MODALS FOR NAV LINKS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-[#152e3c] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full text-left z-10"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>

              {activeModal === 'How it works' && (
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                    <HelpCircle size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">How Sabi Works</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    1. **Host a Game**: HR admins or team leads configure a trivia room with custom topic packs & rules.<br/>
                    2. **Join via PIN/QR**: Team members enter the 5-digit PIN or scan the live QR code on any device.<br/>
                    3. **Live Competition**: Compete in real-time speed rounds with streak multipliers and live leaderboards!
                  </p>
                </div>
              )}

              {activeModal === 'Features' && (
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Sabi Features</h3>
                  <ul className="text-white/70 text-sm space-y-2 mb-4">
                    <li>⚡ **Instant PIN & QR Join**: Zero login required for players.</li>
                    <li>🔥 **Streak Multipliers & Bonus Rounds**: Reward consecutive correct answers.</li>
                    <li>📺 **Presenter & Team Modes**: Perfect for screen sharing or all-hands meetings.</li>
                    <li>📊 **Private HR-Safe Scoring**: Optional score privacy mode.</li>
                  </ul>
                </div>
              )}

              {activeModal === 'Pricing' && (
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <CreditCard size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Free & Open Access</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    Sabi is completely free for corporate team building and company events up to 50 active live players per room.
                  </p>
                </div>
              )}

              {activeModal === 'Supports' && (
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <LifeBuoy size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Support & Assistance</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    Need help setting up your team trivia session? Reach out to support or launch directly via GummyGum hub!
                  </p>
                </div>
              )}

              <button 
                onClick={() => setActiveModal(null)}
                className="w-full py-3 rounded-xl bg-[#ff6f3c] text-white font-bold uppercase tracking-wider text-sm shadow-lg hover:bg-[#e65c2b] transition-all"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
