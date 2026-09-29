import { motion } from 'framer-motion';
import { Clock, ArrowLeft } from 'lucide-react';
import { reportGummyGumCancel } from '../lib/gummygumSession';

// context "lobby": idle in the waiting room. "game": abandoned mid-race with nobody connected for hours.
export default function SessionExpiredModal({ isHost, context = 'lobby', hubUrl }) {
  const handleHostRehost = async () => {
    // No-op if the abandoned-game path already reported (it clears the stored session).
    await reportGummyGumCancel();
    window.location.href = hubUrl || 'https://gummygum.app';
  };

  const handleClose = () => {
    try {
      window.close();
    } catch {
      // ignore
    }
  };

  let message;
  if (context === 'game') {
    message = isHost
      ? 'This race was abandoned mid-game with nobody connected for several hours, so it has been ended. You can return to GummyGum to launch a fresh session.'
      : 'This race was ended after being abandoned for several hours. Thank you for being here. You can safely close this tab now.';
  } else {
    message = isHost
      ? 'This session was inactive in the lobby for more than 20 minutes and has expired. You can return to GummyGum to launch a fresh session.'
      : 'This session has expired due to inactivity. Thank you for being here. You can safely close this tab now.';
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative bg-[#122430] border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center select-none"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#f5a623]/20 border border-[#f5a623]/30 text-[#f5a623] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#f5a623]/10">
          <Clock size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Session Expired</h3>
        <p className="text-white/60 text-sm leading-relaxed mb-6">{message}</p>

        {isHost ? (
          <button
            type="button"
            onClick={handleHostRehost}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#091521] font-bold text-sm inline-flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            Return to GummyGum to Rehost
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 active:scale-95 transition-all cursor-pointer"
          >
            Close Tab
          </button>
        )}
      </motion.div>
    </div>
  );
}
