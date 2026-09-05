import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, QrCode } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playJoin, playSelect } from '../utils/audio';
import AvatarBadge from './AvatarBadge';
import { VEHICLES } from '../constants';

export default function JoinGame() {
  const { navigate, joinGameWithCode, setPlayer, player, showAlertModal } = useGame();
  
  // Step 1: PIN entry (#829:337 & #858:1222)
  // Step 2: Name & Avatar selection (#829:397 & #840:467)
  const [joinStep, setJoinStep] = useState(1);
  const [code, setCode] = useState(['', '', '', '', '']);
  const [playerName, setPlayerName] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const inputRefs = useRef([]);

  const handleBack = () => {
    playSelect();
    if (joinStep === 2) {
      setJoinStep(1);
    } else {
      navigate('home');
    }
  };

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
      showAlertModal("Please enter a valid 5-digit Game PIN", "Invalid PIN");
    }
  };

  const handleFinalJoin = () => {
    const fullCode = code.join('');
    if (playerName.trim()) {
      playJoin();
      setPlayer(p => ({ ...p, name: playerName.trim() }));
      joinGameWithCode(fullCode, playerName.trim());
    } else {
      showAlertModal("Please enter your nickname to continue!", "Nickname Required");
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#091521] text-white flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none font-poppins pb-10">
      {/* BACKGROUND AMBIENT RADIAL LIGHTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#7C3AED]/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[650px] h-[650px] bg-[#FF8A3D]/10 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] left-[-5%] w-[450px] h-[450px] bg-[#224552]/30 rounded-full blur-[120px]" />
      </div>

      {/* FLOATING 3D GRAPHICS (MATCHING FIGMA 829:337 & 829:397) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Left Light Bulb */}
        <motion.img
          src="/assets/figma/briefcase.png"
          alt="3D Light Bulb"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, 14, 0], rotate: [-1, 2, -1] }}
          transition={{
            opacity: { duration: 0.8 },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="hidden sm:block absolute left-[20px] lg:left-[55px] bottom-[25px] lg:bottom-[45px] w-[85px] sm:w-[105px] lg:w-[125px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
        />

        {/* Right Floating Element */}
        <motion.img
          src="/assets/figma/floating_right.png"
          alt=""
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 0.95, x: 0, y: [0, -12, 0], rotate: [1, -1.5, 1] }}
          transition={{
            opacity: { duration: 0.8, delay: 0.2 },
            y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="hidden sm:block absolute right-[15px] lg:right-[50px] bottom-[30px] lg:bottom-[50px] w-[130px] sm:w-[155px] lg:w-[185px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        />

        {/* Upper Right Thinking Emoji */}
        <motion.img
          src="/assets/figma/thinking_emoji.png"
          alt=""
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.9, scale: 1, y: [0, 10, 0], rotate: [0, -2, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3 },
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="hidden md:block absolute right-[50px] lg:right-[100px] top-[100px] w-[55px] lg:w-[70px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
        />
      </div>

      {/* TOP HEADER */}
      <header className="relative z-30 w-full max-w-[1240px] mx-auto px-6 pt-6 pb-2 flex items-center justify-between shrink-0">
        <button 
          onClick={handleBack}
          className="w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
          title="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <div 
          onClick={() => { playSelect(); navigate('home'); }}
          className="cursor-pointer text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-tr from-[#FFD166] via-white to-white bg-clip-text text-transparent drop-shadow-md"
        >
          sabi
        </div>
        <div className="w-11" />
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-6 max-w-4xl mx-auto w-full flex flex-col items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: PIN ENTRY (FIGMA 829:337 & 858:1222) */}
          {joinStep === 1 && (
            <motion.div
              key="joinStep1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-full text-center py-2 sm:py-4"
            >
              {/* 5 Digit Boxes */}
              <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center mb-5 sm:mb-7">
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
                    className="w-11 h-14 sm:w-13 sm:h-16 md:w-14 md:h-18 text-center text-2xl sm:text-3xl font-semibold uppercase rounded-xl border-[2.5px] sm:border-[3px] border-white bg-[#091521] text-white outline-none focus:border-[#FF7F36] focus:shadow-[0_0_15px_rgba(255,127,54,0.4)] transition-all shadow-lg"
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:gap-3.5 w-full max-w-[340px] sm:max-w-[380px]">
                {/* Join Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handlePinSubmit}
                  className="w-full h-[48px] sm:h-[54px] rounded-full bg-[#FF7F36] text-white text-base sm:text-lg font-semibold border-2 sm:border-[3px] border-white shadow-[0_6px_20px_rgba(255,127,54,0.35)] hover:bg-[#e66f2c] transition-all cursor-pointer flex items-center justify-center"
                >
                  <span>Join</span>
                </motion.button>

                {/* Scan QR Code Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => showAlertModal("Point your device camera at the host screen's QR code to join instantly!", "Scan QR Code")}
                  className="w-full h-[48px] sm:h-[54px] rounded-full border-2 sm:border-[3px] border-white bg-black/30 hover:bg-white/10 text-white text-base sm:text-lg font-semibold backdrop-blur-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <QrCode size={18} className="opacity-90" />
                  <span>Scan QR Code</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ENTER NAME & AVATAR (FIGMA 829:397 & 840:467) */}
          {joinStep === 2 && (
            <motion.div
              key="joinStep2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-full text-center py-2 sm:py-4"
            >
              {/* Circular Avatar Badge */}
              <div className="mb-6 sm:mb-8 flex justify-center">
                <AvatarBadge
                  src={player.vehicle}
                  color={player.color}
                  size="xl"
                  onClick={() => setShowAvatarPicker(true)}
                />
              </div>

              {/* Underline Input for Name */}
              <div className="w-full max-w-[340px] sm:max-w-[400px] mb-8 sm:mb-10">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-transparent border-b-[3px] sm:border-b-[4px] border-white text-center text-xl sm:text-2xl md:text-3xl font-medium text-white pb-2 sm:pb-3 outline-none placeholder:text-[#FFE5E5]/75 focus:border-[#FF7F36] transition-all"
                  autoFocus
                />
              </div>

              {/* Continue Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleFinalJoin}
                className="w-full max-w-[320px] sm:max-w-[380px] h-[50px] sm:h-[56px] rounded-full bg-[#FF7F36] text-white text-lg sm:text-xl font-semibold border-2 sm:border-[3px] border-white shadow-[0_6px_25px_rgba(255,127,54,0.4)] hover:bg-[#e66f2c] transition-all cursor-pointer flex items-center justify-center"
              >
                <span>Continue</span>
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-4 px-6 text-center text-white/40 text-xs font-normal">
        © Sabi Trivia Engine
      </footer>

      {/* AVATAR PICKER MODAL (MATCHING FIGMA 865:1288) */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/75 backdrop-blur-md" 
              onClick={() => setShowAvatarPicker(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.92, y: 20 }} 
              className="relative bg-[#0d1e2b] border-2 border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center z-10"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Choose Your Avatar</h3>
              <p className="text-sm text-white/60 mb-6">Select your racing vehicle for the scoreboard</p>
              
              {/* Vehicles Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 max-h-72 overflow-y-auto p-1.5 no-scrollbar mb-6">
                {VEHICLES.map((v, i) => {
                  const isSelected = player.vehicle === v.icon;
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        playSelect();
                        setPlayer(p => ({ ...p, vehicle: v.icon }));
                      }}
                      className={`relative p-3 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-[#FF7F36] bg-[#FF7F36]/15 shadow-[0_0_15px_rgba(255,127,54,0.4)]' 
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <img src={v.icon} alt={v.name} className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
                      <span className="text-[11px] font-semibold text-white/80 mt-1 truncate max-w-full">
                        {v.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FF7F36] text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <motion.button 
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowAvatarPicker(false)} 
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF8A3D] to-[#7C3AED] text-white font-bold text-lg shadow-lg cursor-pointer"
              >
                Confirm Avatar
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
