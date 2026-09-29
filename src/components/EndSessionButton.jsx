import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playSelect } from '../utils/audio';

export default function EndSessionButton({ className = '' }) {
  const { isHost, cancelGame } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);
  const [ending, setEnding] = useState(false);

  if (!isHost) return null;

  const handleConfirm = async () => {
    if (ending) return;
    setEnding(true);
    await cancelGame();
  };

  return (
    <>
      <button
        onClick={() => { playSelect(); setShowConfirm(true); }}
        className={`h-11 px-4 rounded-full bg-red-500/90 hover:bg-red-500 border border-red-400/40 text-white text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_14px_rgba(239,68,68,0.35)] cursor-pointer ${className}`}
      >
        <LogOut size={18} />
        <span>End session</span>
      </button>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !ending && setShowConfirm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#152e3c] border border-red-500/30 p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center z-10">
              <h3 className="text-xl font-bold text-white mb-2">End this session?</h3>
              <p className="text-sm text-white/60 mb-6">Everyone will be removed and the session will close in GummyGum.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} disabled={ending} className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold cursor-pointer disabled:opacity-50">Go Back</button>
                <button onClick={handleConfirm} disabled={ending} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg cursor-pointer disabled:opacity-60">
                  {ending ? 'Ending...' : 'End session'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
