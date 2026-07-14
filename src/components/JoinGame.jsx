import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LogIn, KeyRound } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playJoin } from '../utils/audio';

export default function JoinGame() {
  const { navigate, joinGameWithCode, setPlayer } = useGame();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [playerName, setPlayerName] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const newCode = [...code];
    // Only allow alphanumeric uppercase
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Handle pasting a full code
    if (cleanValue.length > 1) {
      const chars = cleanValue.split('').slice(0, 6);
      chars.forEach((c, i) => {
        if (index + i < 6) newCode[index + i] = c;
      });
      setCode(newCode);
      const nextFocus = Math.min(index + chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newCode[index] = cleanValue;
    setCode(newCode);

    // Auto-advance
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleJoin = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6 && playerName.trim()) {
      playJoin();
      setPlayer(p => ({ ...p, name: playerName.trim() }));
      joinGameWithCode(fullCode, playerName.trim());
    }
  };

  const isComplete = code.join('').length === 6 && playerName.trim().length > 0;

  return (
    <motion.div 
      className="flex flex-col md:flex-row h-full max-w-[430px] md:max-w-4xl mx-auto relative md:items-center md:gap-16 overflow-hidden md:overflow-visible"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-amber/10 blur-[100px] rounded-full pointer-events-none" />

      {/* LEFT COLUMN (Desktop) / TOP (Mobile) */}
      <div className="flex flex-col md:w-[350px] shrink-0 z-10 md:text-left">
        <div className="pt-12 md:pt-0 px-5 flex items-center gap-3.5 mb-8">
          <button 
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-white/20 active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="text-[11px] tracking-[2px] uppercase text-amber font-semibold">Join the race</div>
            <div className="text-[20px] md:text-[28px] font-extrabold mt-0.5 tracking-tight text-white">Enter Game Code</div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center py-10 px-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="w-24 h-24 bg-amber/10 rounded-full flex items-center justify-center mb-6 border-[2px] border-amber/20 shadow-[0_0_30px_rgba(245,166,35,0.15)]">
            <KeyRound size={40} className="text-amber drop-shadow-md" />
          </div>
          <p className="text-center text-white/60 text-[15px] font-medium leading-relaxed">
            Get the 6-character game code from your Race Director to enter the lobby.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN (Desktop) / BOTTOM (Mobile) */}
      <div className="flex-1 flex flex-col z-10 w-full h-full pt-4 md:pt-0 pb-[100px] md:pb-0 justify-start md:justify-center px-5">
        
        <div className="glass-panel rounded-3xl p-6 md:p-10 flex flex-col items-center text-center">
          
          <div className="w-full mb-8">
            <div className="text-[13px] md:text-[15px] text-white/80 font-semibold mb-3 flex items-center justify-center gap-2">
               Your Nickname
            </div>
            <input 
              type="text" 
              placeholder="e.g. SpeedRacer" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full max-w-[280px] md:max-w-[320px] bg-black/20 border border-white/10 rounded-xl text-white text-[16px] md:text-[18px] py-4 px-5 text-center font-bold outline-none focus:border-amber/60 focus:bg-white/5 transition-all mx-auto block"
            />
          </div>

          <div className="text-[13px] md:text-[15px] text-white/80 font-semibold mb-3 flex items-center gap-2">
             Game Code
          </div>
          
          <div className="flex gap-2 md:gap-3 justify-center mb-8 w-full">
            {code.map((v, i) => (
              <motion.input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="text"
                maxLength={6}
                value={v}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                className={`w-[45px] h-[56px] md:w-[60px] md:h-[72px] text-center text-[24px] md:text-[32px] font-black uppercase rounded-xl border-[2px] outline-none transition-all
                  ${v ? 'bg-amber/10 border-amber text-amber shadow-[0_0_15px_rgba(245,166,35,0.15)]' : 'bg-black/30 border-white/10 text-white focus:border-amber/50 focus:bg-white/5'}
                `}
                whileFocus={{ scale: 1.05 }}
              />
            ))}
          </div>

          <motion.button 
            whileTap={isComplete ? { scale: 0.96 } : {}}
            disabled={!isComplete}
            onClick={handleJoin}
            className={`w-full p-[18px] md:p-[20px] rounded-2xl text-[16px] md:text-[18px] font-extrabold tracking-[1px] uppercase border-none transition-all flex items-center justify-center gap-2
              ${isComplete 
                ? 'bg-gradient-to-r from-amber to-[#e69b19] text-[#1a1a00] shadow-[0_8px_30px_rgba(245,166,35,0.3)] cursor-pointer hover:shadow-[0_8px_40px_rgba(245,166,35,0.5)]' 
                : 'bg-white/5 text-white/30 cursor-not-allowed'
              }
            `}
          >
            Enter Lobby <LogIn size={20} strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
