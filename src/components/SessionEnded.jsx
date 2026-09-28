import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function SessionEnded() {
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
        <h1 className="text-xl font-bold">This session has ended</h1>
        <p className="text-white/60 text-sm">The host closed this race. You can close this tab now.</p>
      </motion.div>
    </div>
  );
}
