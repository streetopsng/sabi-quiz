import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { AlertCircle } from 'lucide-react';

export default function Overlays() {
  const { flashColor, streakToast, alertModal, closeAlertModal } = useGame();

  return (
    <>
      <AnimatePresence>
        {flashColor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`fixed inset-0 pointer-events-none z-[99] ${flashColor === 'green' ? 'bg-green/25' : 'bg-red/20'}`}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {streakToast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: -20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1.05, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: -10, x: '-50%' }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="fixed top-[76px] left-1/2 bg-[#ff6b35] text-white text-[13px] font-bold py-2 px-5 rounded-full z-[100] whitespace-nowrap shadow-lg shadow-[#ff6b35]/20"
          >
            {streakToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL CONFIRMATION / ALERT MODAL */}
      <AnimatePresence>
        {alertModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (alertModal.onConfirm) alertModal.onConfirm();
                closeAlertModal();
              }}
              className="absolute inset-0 bg-black/65 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 15 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative bg-[#122430] border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center z-10 select-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#f5a623]/20 border border-[#f5a623]/30 text-[#f5a623] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#f5a623]/10">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                {alertModal.title || 'Notice'}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">
                {alertModal.message}
              </p>
              {alertModal.cta ? (
                <a href={alertModal.cta.url} className="block">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff6b4a] via-[#f75270] to-[#9333ea] text-white font-extrabold text-[15px] uppercase tracking-wider shadow-[0_6px_20px_rgba(247,82,112,0.4)] hover:shadow-[0_6px_25px_rgba(247,82,112,0.6)] transition-all cursor-pointer"
                  >
                    {alertModal.cta.text}
                  </motion.button>
                </a>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    if (alertModal.onConfirm) alertModal.onConfirm();
                    closeAlertModal();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff6b4a] via-[#f75270] to-[#9333ea] text-white font-extrabold text-[15px] uppercase tracking-wider shadow-[0_6px_20px_rgba(247,82,112,0.4)] hover:shadow-[0_6px_25px_rgba(247,82,112,0.6)] transition-all cursor-pointer"
                >
                  Got it
                </motion.button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
