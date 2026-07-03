import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function Overlays() {
  const { flashColor, streakToast } = useGame();

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
    </>
  );
}
