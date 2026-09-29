import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function SessionEnded() {
  const { sessionEndedCompleted } = useGame();
  return (
    <div className="h-[100dvh] w-full bg-[#091521] text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="max-w-sm w-full text-center space-y-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#f5a623]/20 border border-[#f5a623]/30 text-[#f5a623] flex items-center justify-center mx-auto shadow-lg shadow-[#f5a623]/10">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-xl font-bold">{sessionEndedCompleted ? 'Thanks for playing' : 'This session has ended'}</h1>
        <p className="text-white/60 text-sm">
          {sessionEndedCompleted
            ? 'The game is complete and the host has closed the session. You can close this tab now.'
            : 'The host ended this session. You can close this tab now.'}
        </p>
      </motion.div>
    </div>
  );
}
