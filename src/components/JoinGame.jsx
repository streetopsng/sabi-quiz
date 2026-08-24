import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import VectorDecor from './VectorDecor';
import { playJoin, playSelect } from '../utils/audio';
import AvatarBadge from './AvatarBadge';

export default function JoinGame() {
  const { navigate, joinGameWithCode, setPlayer, player } = useGame();
  
  // Step 1: PIN entry, Step 2: Name & Avatar selection
  const [joinStep, setJoinStep] = useState(1);
  const [code, setCode] = useState(['', '', '', '', '']);
  const [playerName, setPlayerName] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const inputRefs = useRef([]);

  const handleDigitChange = (index, value) => {
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const newCode = [...code];

    if (cleanValue.length > 1) {
      const chars = cleanValue.split('').slice(0, 5);
      chars.forEach((c, i) => {
        if (index + i < 5) newCode[index + i] = c;
      });
      setCode(newCode);
      const nextFocus = Math.min(index + chars.length, 4);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newCode[index] = cleanValue;
    setCode(newCode);

    if (cleanValue && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePinSubmit = () => {
    const fullCode = code.join('');
    if (fullCode.length >= 5) {
      playSelect();
      setJoinStep(2);
    } else {
      alert("Please enter a valid 5-digit Game PIN");
    }
  };

  const handleFinalJoin = () => {
    const fullCode = code.join('');
    if (playerName.trim()) {
      playJoin();
      setPlayer(p => ({ ...p, name: playerName.trim() }));
      joinGameWithCode(fullCode, playerName.trim());
    } else {
      alert("Please enter your nickname!");
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0e1f29] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      <VectorDecor showConfetti={true} variant={joinStep === 1 ? 'dark' : 'teal'} />

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 py-6 max-w-xl mx-auto w-full flex flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: PIN ENTRY (MATCHES MOCKUP 4) */}
          {joinStep === 1 && (
            <motion.div
              key="joinStep1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-full text-center"
            >
              {/* 5 Outlined Digit Boxes */}
              <div className="flex gap-3 md:gap-4 justify-center mb-10">
                {code.map((v, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    maxLength={5}
                    value={v}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    className="w-14 h-20 md:w-16 md:h-24 text-center text-3xl md:text-4xl font-black uppercase rounded-2xl border-2 border-white bg-black/40 text-white outline-none focus:border-[#ff6f3c] focus:bg-white/10 transition-all shadow-xl"
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 w-full max-w-xs">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handlePinSubmit}
                  className="w-full py-4 rounded-full bg-[#ff6f3c] text-white text-lg font-extrabold uppercase tracking-wide border-2 border-white/80 shadow-[0_4px_25px_rgba(255,111,60,0.5)] hover:bg-[#e65c2b] transition-all cursor-pointer"
                >
                  Join
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => alert("Scan QR Code using your device camera!")}
                  className="w-full py-4 rounded-full border-2 border-white/80 bg-black/40 text-white text-base font-bold tracking-wide hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
                >
                  Scan QR Code
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ENTER NAME & AVATAR (MATCHES MOCKUP 5) */}
          {joinStep === 2 && (
            <motion.div
              key="joinStep2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-full text-center"
            >
              {/* Circular Avatar Badge matching Mockups */}
              <div className="mb-8 flex justify-center">
                <AvatarBadge
                  src={player.vehicle}
                  color={player.color}
                  size="lg"
                  onClick={() => setShowAvatarPicker(true)}
                />
              </div>

              {/* Clean White Underline Input for Name */}
              <div className="w-full max-w-sm mb-10">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white text-center text-2xl font-extrabold text-white py-3 px-4 outline-none placeholder:text-white/70 focus:border-[#ff6f3c] transition-all"
                  autoFocus
                />
              </div>

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleFinalJoin}
                className="w-full max-w-xs py-4 rounded-full bg-[#ff6f3c] text-white text-lg font-extrabold uppercase tracking-wide border-2 border-white/80 shadow-[0_4px_25px_rgba(255,111,60,0.5)] hover:bg-[#e65c2b] transition-all cursor-pointer"
              >
                Continue
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#152e3c] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-md w-full text-center z-10">
              <h3 className="text-xl font-bold text-white mb-4">Choose Your Vehicle Avatar</h3>
              <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2">
                {VEHICLES.map((v, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setPlayer(p => ({ ...p, vehicle: v.icon }));
                      setShowAvatarPicker(false);
                    }}
                    className={`p-2 rounded-2xl border cursor-pointer flex flex-col items-center hover:bg-white/10 transition-colors ${player.vehicle === v.icon ? 'border-amber-400 bg-white/10' : 'border-white/10'}`}
                  >
                    <img src={v.icon} alt={v.name} className="w-12 h-12 object-contain" />
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAvatarPicker(false)} className="mt-4 w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">Done</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
