import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import CarAvatar from './CarAvatar';
import { useGame } from '../context/GameContext';
import { GUMMY_AVATARS } from '../constants';

export default function FleetSelection() {
  const { navigate, player, setPlayer } = useGame();

  const [selectedV, setSelectedV] = useState(Math.max(0, GUMMY_AVATARS.findIndex(a => a.url === player.vehicle)));

  const handleConfirm = () => {
    setPlayer(p => ({
      ...p,
      vehicle: GUMMY_AVATARS[selectedV].url
    }));
    navigate('lobby');
  };

  return (
    <motion.div 
      className="flex flex-col md:flex-row h-full max-w-[430px] md:max-w-4xl mx-auto relative md:items-center md:gap-16 overflow-hidden md:overflow-visible"
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <div className="flex flex-col md:w-[350px] shrink-0 z-10">
        <div className="pt-8 md:pt-0 px-5.5 flex items-center gap-3.5 mb-8">
          <button
            onClick={() => navigate('lobby')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-white/20 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="text-[11px] tracking-[2px] uppercase text-muted">Your avatar</div>
            <div className="text-[20px] font-bold mt-0.5">Choose your avatar</div>
          </div>
        </div>

        <div className="w-[180px] h-[180px] md:w-[280px] md:h-[280px] rounded-full flex items-center justify-center text-[80px] md:text-[120px] border-[3px] border-white/15 mx-auto relative overflow-hidden bg-white/[0.03] backdrop-blur-sm shadow-2xl transition-colors duration-500">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={selectedV}
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0, y: -20 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="z-10 drop-shadow-xl"
            >
              <CarAvatar src={GUMMY_AVATARS[selectedV].url} className="w-[160px] h-[160px] md:w-[250px] md:h-[250px] rounded-full" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden md:block pt-10 px-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleConfirm}
            className="w-full p-[18px] rounded-2xl bg-amber text-[#1a1a00] text-[16px] font-extrabold tracking-[0.5px] uppercase border-none cursor-pointer shadow-[0_4px_20px_rgba(245,166,35,0.3)] flex items-center justify-center gap-2"
          >
            Lock in my avatar <Check size={18} strokeWidth={3} />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar z-10 w-full h-full pt-8 pb-[100px] md:pb-8">

        <div className="px-5.5 md:px-0">
          <div className="text-[12px] text-muted tracking-[1px] uppercase mb-4">Avatar</div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-3 pb-4">
            {GUMMY_AVATARS.map((a, i) => (
              <motion.div
                key={a.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedV(i)}
                className={`aspect-square bg-white/[0.03] backdrop-blur-md border-[2px] rounded-2xl flex items-center justify-center cursor-pointer transition-colors shadow-sm
                  ${i === selectedV ? 'border-amber bg-amber/10' : 'border-white/10 hover:border-white/30'}
                `}
              >
                <CarAvatar src={a.url} className="w-full h-full p-1.5 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full p-5 pt-10 bg-gradient-to-t from-[#16213E] via-[#16213E]/90 to-transparent z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleConfirm}
            className="w-full p-[18px] rounded-xl bg-amber text-[#1a1a00] text-[16px] font-extrabold tracking-[0.5px] uppercase border-none cursor-pointer shadow-[0_4px_20px_rgba(245,166,35,0.3)] flex items-center justify-center gap-2"
          >
            Lock in my avatar <Check size={18} strokeWidth={3} />
          </motion.button>
        </div>
      </div>

    </motion.div>
  );
}
