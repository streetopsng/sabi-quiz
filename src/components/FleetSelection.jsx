import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { VEHICLES, COLORS } from '../constants';

export default function FleetSelection() {
  const { navigate, player, setPlayer } = useGame();
  
  // Local state for the selection process
  const [selectedV, setSelectedV] = useState(VEHICLES.findIndex(v => v.icon === player.vehicle));
  const [selectedC, setSelectedC] = useState(COLORS.findIndex(c => c === player.color));

  const handleConfirm = () => {
    setPlayer(p => ({
      ...p,
      vehicle: VEHICLES[selectedV].icon,
      color: COLORS[selectedC]
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
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none opacity-20" style={{ backgroundColor: COLORS[selectedC] }} />

      {/* LEFT COLUMN (Desktop) / TOP (Mobile) */}
      <div className="flex flex-col md:w-[350px] shrink-0 z-10">
        <div className="pt-8 md:pt-0 px-5.5 flex items-center gap-3.5 mb-8">
          <button 
            onClick={() => navigate('lobby')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-white/20 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="text-[11px] tracking-[2px] uppercase text-muted">Your vehicle</div>
            <div className="text-[20px] font-bold mt-0.5">Choose your ride</div>
          </div>
        </div>

        <div className="w-[180px] h-[180px] md:w-[280px] md:h-[280px] rounded-full flex items-center justify-center text-[80px] md:text-[120px] border-[3px] mx-auto relative overflow-hidden bg-white/[0.03] backdrop-blur-sm shadow-2xl transition-colors duration-500" style={{ borderColor: COLORS[selectedC] }}>
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at center, ${COLORS[selectedC]}, transparent)` }} />
          <AnimatePresence mode="popLayout">
            <motion.div
              key={selectedV}
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0, y: -20 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="z-10 drop-shadow-xl"
            >
              <img src={VEHICLES[selectedV].icon} alt="vehicle" className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] object-contain drop-shadow-2xl z-10" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Only: Lock In Button */}
        <div className="hidden md:block pt-10 px-4">
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={handleConfirm}
            className="w-full p-[18px] rounded-2xl bg-amber text-[#1a1a00] text-[16px] font-extrabold tracking-[0.5px] uppercase border-none cursor-pointer shadow-[0_4px_20px_rgba(245,166,35,0.3)] flex items-center justify-center gap-2"
          >
            Lock in my vehicle <Check size={18} strokeWidth={3} />
          </motion.button>
        </div>
      </div>

      {/* RIGHT COLUMN (Desktop) / BOTTOM (Mobile) */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar z-10 w-full h-full pt-8 pb-[100px] md:pb-8">
        
        <div className="px-5.5 md:px-0">
          <div className="text-[12px] text-muted tracking-[1px] uppercase mb-4">Vehicle Model</div>
          
          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto md:overflow-visible pb-4 no-scrollbar -mx-5.5 px-5.5 md:mx-0 md:px-0">
            {VEHICLES.map((v, i) => (
              <motion.div 
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedV(i)}
                className={`min-w-[84px] h-[96px] bg-white/[0.03] backdrop-blur-md border-[2px] rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-sm
                  ${i === selectedV ? 'bg-amber/10' : 'border-white/10 hover:border-white/30'}
                `}
                style={{ borderColor: i === selectedV ? COLORS[selectedC] : undefined }}
              >
                <img src={v.icon} alt={v.name} className="w-12 h-12 object-contain drop-shadow-md" />
                <div className="text-[11px] font-medium text-white/80">{v.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-6 px-5.5 md:px-0">
          <div className="text-[12px] text-muted tracking-[1px] uppercase mb-4">Racing Colour</div>
          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
            {COLORS.map((c, i) => (
              <motion.div 
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedC(i)}
                className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full cursor-pointer border-[3px] transition-all shadow-md mx-auto
                  ${i === selectedC ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'}
                `}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Only: Fixed Lock In Button */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-5 pt-10 bg-gradient-to-t from-[#16213E] via-[#16213E]/90 to-transparent z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={handleConfirm}
            className="w-full p-[18px] rounded-xl bg-amber text-[#1a1a00] text-[16px] font-extrabold tracking-[0.5px] uppercase border-none cursor-pointer shadow-[0_4px_20px_rgba(245,166,35,0.3)] flex items-center justify-center gap-2"
          >
            Lock in my vehicle <Check size={18} strokeWidth={3} />
          </motion.button>
        </div>
      </div>

    </motion.div>
  );
}
