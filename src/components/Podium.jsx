import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Home } from 'lucide-react';

export default function Podium() {
  const { player, opponents, navigate } = useGame();
  const allPlayers = [player, ...opponents.filter(o => o._joined)].sort((a, b) => b.score - a.score);

  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const cols = ['#F5A623', '#3B82F6', '#22C55E', '#EF4444', '#8B5CF6', '#F97316'];
    const pieces = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: cols[Math.floor(Math.random() * cols.length)],
      delay: Math.random() * 0.8,
      duration: 1 + Math.random() * 0.8
    }));
    setConfetti(pieces);
  }, []);

  const react = (e) => {
    e.currentTarget.style.transform = 'scale(1.3)';
    setTimeout(() => {
      e.target.style.transform = '';
    }, 200);
  };

  const podiumSlots = [
    { p: allPlayers[1], cls: 'bg-gradient-to-b from-[#e2e8f0] to-[#94a3b8] h-[80px] md:h-[120px]', medal: '🥈' },
    { p: allPlayers[0], cls: 'bg-gradient-to-b from-amber to-[#c47e10] h-[110px] md:h-[160px] shadow-[0_0_30px_rgba(245,166,35,0.4)] z-10', medal: '🥇' },
    { p: allPlayers[2], cls: 'bg-gradient-to-b from-[#d97706] to-[#92400e] h-[60px] md:h-[90px]', medal: '🥉' }
  ];

  return (
    <motion.div 
      className="flex flex-col md:flex-row h-full max-w-[430px] md:max-w-5xl mx-auto md:gap-12 md:py-10 bg-navy overflow-y-auto no-scrollbar"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* LEFT COLUMN (Desktop) / TOP (Mobile) */}
      <div className="flex flex-col items-center md:flex-1 shrink-0 w-full relative z-10">
        
        {/* Confetti Container */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl z-20">
          {confetti.map(c => (
            <motion.div
              key={c.id}
              className="absolute top-[-20px] w-[8px] h-[12px] md:w-[10px] md:h-[16px] rounded-[2px]"
              style={{ left: `${c.left}%`, backgroundColor: c.color }}
              initial={{ y: -50, rotate: 0, opacity: 1 }}
              animate={{ y: 500, rotate: 720, opacity: 0 }}
              transition={{ delay: c.delay, duration: c.duration, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="pt-6 md:pt-4 px-5 w-full text-center z-10">
          <div className="text-[12px] md:text-[14px] tracking-[2px] md:tracking-[4px] uppercase text-amber font-bold">Race complete</div>
          <h1 className="text-[28px] md:text-[40px] font-black text-white mt-1 drop-shadow-md">Final Standings</h1>
        </div>

        <div className="flex items-end justify-center gap-2 pt-8 md:pt-16 px-4 w-full z-10">
          {podiumSlots.map((slot, i) => {
            if (!slot.p) return null;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 md:gap-2">
                <motion.div 
                  className="text-[48px] md:text-[64px] drop-shadow-xl relative"
                  initial={{ opacity: 0, y: -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 + 0.3, type: "spring", damping: 15 }}
                >
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                  {slot.p.vehicle}
                </motion.div>
                <div className="text-[13px] md:text-[16px] font-bold text-center max-w-[100px] md:max-w-[120px] truncate text-white drop-shadow-md">{slot.p.name}</div>
                <div className="text-[10px] md:text-[12px] italic text-center max-w-[100px] md:max-w-[120px] leading-[1.3] truncate h-4 font-medium" style={{ color: slot.p.color }}>
                  {slot.p.banter}
                </div>
                <motion.div 
                  className={`w-[100px] md:w-[130px] rounded-t-xl flex items-center justify-center text-[24px] md:text-[32px] font-black text-white/90 border-t border-white/20 shadow-inner ${slot.cls}`}
                  initial={{ height: 0 }}
                  animate={{ height: slot.cls.match(/h-\[([^\]]+)\]/)[1] }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <span className="drop-shadow-md">{slot.medal}</span>
                </motion.div>
              </div>
            );
          })}
        </div>

        <motion.div 
          className="mx-5 mt-6 md:mt-10 text-[20px] md:text-[28px] font-black text-center leading-[1.3] text-transparent bg-clip-text bg-gradient-to-r from-amber to-[#e69b19] italic px-4 py-3 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 shadow-lg relative z-10"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
        >
          "{allPlayers[0].banter}"
        </motion.div>
      </div>

      {/* RIGHT COLUMN (Desktop) / BOTTOM (Mobile) */}
      <div className="flex flex-col md:w-[400px] shrink-0 md:h-full md:max-h-full md:overflow-hidden mt-6 md:mt-0 z-10 bg-black/20 md:bg-white/[0.02] md:border md:border-white/10 md:rounded-3xl md:shadow-2xl md:backdrop-blur-sm w-full">
        
        <div className="md:flex-1 overflow-visible md:overflow-y-auto px-5 md:px-6 py-4 md:py-6 w-full no-scrollbar">
          <div className="text-[11px] md:text-[13px] tracking-[2px] uppercase text-muted mb-4 md:mb-6 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber/80" /> Full results
          </div>
          <div className="flex flex-col gap-3 md:gap-4">
            {allPlayers.map((p, i) => (
              <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded-xl border transition-colors ${i === 0 ? 'bg-amber/10 border-amber/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                <div className={`w-6 text-[14px] font-black text-center ${i === 0 ? 'text-amber' : 'text-white/40'}`}>{i + 1}</div>
                <div className="text-[28px] drop-shadow-md">{p.vehicle}</div>
                <div className="flex-1 font-bold text-[15px]" style={{ color: p.color }}>{p.name}</div>
                <div className={`text-[16px] font-black ${i === 0 ? 'text-amber' : 'text-white/80'}`}>{Math.round(p.score)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 py-4 px-5 pb-8 md:pb-6 w-full bg-gradient-to-t from-navy via-navy/80 to-transparent shrink-0">
          <div className="flex gap-3 justify-center">
            {['🔥', '😂', '😱', '👏', '👑'].map((emoji, i) => (
              <div 
                key={i}
                onClick={react}
                className="text-[28px] md:text-[32px] bg-white/[0.05] border border-white/10 rounded-full w-[56px] h-[56px] md:w-[64px] md:h-[64px] flex items-center justify-center cursor-pointer transition-all shadow-md hover:bg-white/10 hover:border-white/30 hover:scale-110 active:scale-95"
              >
                {emoji}
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full p-[14px] rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[14px] tracking-[0.5px] uppercase cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <Home size={16} /> Return to Homepage
          </button>
        </div>

      </div>
    </motion.div>
  );
}
