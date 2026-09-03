import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Maximize, MousePointer, RotateCcw, MessageSquare, X, Menu, MoreHorizontal } from 'lucide-react';
import { playSelect } from '../utils/audio';

export default function SideToolbar({ onNewRound, onGiveFeedback }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [presenterMode, setPresenterMode] = useState(true);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* Top Right Hamburger Menu Button [≡] */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => { playSelect(); setIsOpen(!isOpen); }}
        className="fixed top-5 right-5 z-50 w-11 h-11 rounded-xl bg-[#ff6f3c] text-white flex items-center justify-center shadow-lg hover:bg-[#e65c2b] transition-all"
      >
        {isOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
      </motion.button>

      {/* Floating Side Toolbar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-20 right-6 z-50 flex flex-col items-center bg-[#152e3c]/90 border border-white/10 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md gap-3 w-14"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <X size={18} />
            </button>

            <div className="w-8 h-[1px] bg-white/10 my-0.5" />

            {/* Mute Button */}
            <button 
              onClick={() => { setIsMuted(!isMuted); }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white hover:bg-white/15'}`}
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Fullscreen Button */}
            <button 
              onClick={toggleFullscreen}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isFullscreen ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white hover:bg-white/15'}`}
              title="Toggle Fullscreen"
            >
              <Maximize size={18} />
            </button>

            {/* Presenter Mode Switch */}
            <button 
              onClick={() => setPresenterMode(!presenterMode)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${presenterMode ? 'bg-[#ff6f3c] text-white shadow-md' : 'bg-white/5 text-white/50 hover:bg-white/15'}`}
              title="Presenter Mode"
            >
              <MousePointer size={18} />
            </button>

            {/* Optional New Round trigger */}
            {onNewRound && (
              <button 
                onClick={() => { setIsOpen(false); onNewRound(); }}
                className="w-10 py-3 rounded-full bg-[#ff6f3c] text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center shadow-lg my-1 hover:bg-[#e65c2b] transition-all"
                style={{ writingMode: 'vertical-rl' }}
              >
                New Round
              </button>
            )}

            {/* Optional Give Feedback trigger */}
            {onGiveFeedback && (
              <button 
                onClick={() => { setIsOpen(false); onGiveFeedback(); }}
                className="w-10 py-3 rounded-full bg-[#ff6f3c] text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center shadow-lg my-1 hover:bg-[#e65c2b] transition-all"
                style={{ writingMode: 'vertical-rl' }}
              >
                Feedback
              </button>
            )}

            <div className="w-8 h-[1px] bg-white/10 my-0.5" />

            <button 
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-xl bg-[#ff6f3c]/20 text-[#ff6f3c] flex items-center justify-center hover:bg-[#ff6f3c]/30 transition-all"
            >
              <MoreHorizontal size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
