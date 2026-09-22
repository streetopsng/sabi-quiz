import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playJoin, playSelect } from '../utils/audio';
import AvatarBadge from './AvatarBadge';
import { GUMMY_AVATARS } from '../constants';

// Shown to a GummyGum-invited participant right after their name/room code
// resolve, before they land in the waiting room — mirrors JoinGame's manual
// step-2 (name + avatar) so both paths give people a chance to pick an avatar.
export default function GgAvatarSetup() {
  const { player, setPlayer, ggSession, joinGameWithCode } = useGame();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleContinue = () => {
    if (joining) return;
    setJoining(true);
    playJoin();
    const email = (ggSession?.player?.email || '').toLowerCase().trim();
    if (email) {
      localStorage.setItem(`sabi_avatar_${email}`, player.vehicle);
      localStorage.setItem(`sabi_name_${email}`, player.name);
      if (ggSession?.roomCode) {
        localStorage.setItem(`sabi_joined_${ggSession.roomCode}_${email}`, 'true');
      }
    }
    joinGameWithCode(ggSession.roomCode, player.name, () => setJoining(false), ggSession.player?.email);
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#091521] text-white flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto select-none font-poppins px-4 py-10">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#7C3AED]/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[650px] h-[650px] bg-[#FF8A3D]/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full text-center max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">You're in!</h2>
        <p className="text-sm text-white/60 mb-6 sm:mb-8">Pick your avatar before you head to the waiting room.</p>

        <div className="mb-6 sm:mb-8 flex justify-center">
          <AvatarBadge
            src={player.vehicle}
            size="xl"
            onClick={() => setShowAvatarPicker(true)}
          />
        </div>

        <div className="w-full max-w-[340px] sm:max-w-[400px] mb-8 sm:mb-10">
          <input
            type="text"
            placeholder="Enter Name"
            value={player.name}
            onChange={(e) => setPlayer((p) => ({ ...p, name: e.target.value }))}
            className="w-full bg-transparent border-b-[3px] sm:border-b-[4px] border-white text-center text-xl sm:text-2xl md:text-3xl font-medium text-white pb-2 sm:pb-3 outline-none placeholder:text-[#FFE5E5]/75 focus:border-[#FF7F36] transition-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.96 }}
          disabled={joining || !player.name.trim()}
          onClick={handleContinue}
          className="w-full max-w-[320px] sm:max-w-[380px] h-[50px] sm:h-[56px] rounded-full bg-[#FF7F36] text-white text-lg sm:text-xl font-semibold border-2 sm:border-[3px] border-white shadow-[0_6px_25px_rgba(255,127,54,0.4)] hover:bg-[#e66f2c] transition-all cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{joining ? 'Joining…' : 'Continue to Waiting Room'}</span>
        </motion.button>
      </div>

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
              <p className="text-sm text-white/60 mb-6">Pick who represents you on the scoreboard</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 max-h-72 overflow-y-auto p-1.5 no-scrollbar mb-6">
                {GUMMY_AVATARS.map((a) => {
                  const isSelected = player.vehicle === a.url;
                  return (
                    <motion.div
                      key={a.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        playSelect();
                        setPlayer((p) => ({ ...p, vehicle: a.url }));
                      }}
                      className={`relative p-2 rounded-2xl border-2 cursor-pointer flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#FF7F36] bg-[#FF7F36]/15 shadow-[0_0_15px_rgba(255,127,54,0.4)]'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <img src={a.url} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" />
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
