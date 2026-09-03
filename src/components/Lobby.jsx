import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailCheck, X, ArrowLeft } from 'lucide-react';
import AvatarBadge from './AvatarBadge';
import CarAvatar from './CarAvatar';
import VectorDecor from './VectorDecor';
import SideToolbar from './SideToolbar';
import { useGame } from '../context/GameContext';
import { playSelect } from '../utils/audio';
import { VEHICLES } from '../constants';

export default function Lobby() {
  const { 
    navigate, player, setPlayer, opponents, startRace,
    isHost, cancelGame, kickPlayer 
  } = useGame();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const activePlayers = opponents.filter(o => o._joined).length + (isHost ? 0 : 1);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0e1f29] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      <VectorDecor variant="teal" />
      <SideToolbar />

      {/* TOP HEADER */}
      <header className="relative z-20 w-full px-4 sm:px-6 md:px-8 pt-5 pb-1 flex items-center justify-between shrink-0">
        <button 
          onClick={() => { playSelect(); navigate('home'); }}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
          title="Back to Homepage"
        >
          <ArrowLeft size={20} />
        </button>
        <div 
          onClick={() => navigate('home')}
          className="cursor-pointer text-[32px] font-black text-[#f5a623] drop-shadow-md tracking-tight"
        >
          sabi
        </div>
        <div className="w-10" />
      </header>

      {/* MAIN LOBBY CONTENT */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-6 max-w-4xl w-full mx-auto flex flex-col items-center justify-start">
        
        {/* HOST LOBBY VIEW (MATCHES MOCKUP 3) */}
        {isHost ? (
          <div className="w-full flex flex-col items-center gap-6">
            
            {/* TOP ROW: INVITE STATUS */}
            <div className="w-full max-w-2xl bg-[#122834]/90 border border-white/10 rounded-3xl p-6 flex items-center gap-4 shadow-2xl backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-[#ff6f3c]/15 border border-[#ff6f3c]/30 text-[#ff6f3c] flex items-center justify-center shrink-0">
                <MailCheck size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">Invites already sent</div>
                <div className="text-xs text-white/50 mt-0.5">Your team got their join link by email the moment you started this session — no need to share anything else.</div>
              </div>
            </div>

            {/* MIDDLE ROW: PLAYERS GRID CARD */}
            <div className="w-full max-w-2xl bg-[#122834]/90 border border-white/10 rounded-3xl p-6 text-center shadow-2xl backdrop-blur-md">
              <div className="text-base font-bold text-white/90 mb-1">{activePlayers}/10 Players</div>
              <div className="text-xs text-white/50 mb-6">Waiting for players</div>

              {/* Joined Players Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-48 overflow-y-auto p-2">
                {opponents.map((o, idx) => (
                  <div key={idx} className="relative flex flex-col items-center p-2 rounded-2xl bg-white/5 border border-white/10">
                    <button
                      onClick={() => kickPlayer(o.sessionId)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                    >
                      <X size={12} />
                    </button>
                    <CarAvatar src={o.vehicle} color={o.color} className="w-12 h-12" />
                    <span className="text-xs font-bold text-white truncate max-w-[70px] mt-1">{o.name}</span>
                  </div>
                ))}

                {activePlayers === 0 && (
                  <div className="col-span-full py-4 text-xs text-white/40 italic">
                    Waiting for your team to open their invite…
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM ACTION: START BUTTON */}
            <div className="w-full max-w-2xl flex gap-4">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { playSelect(); startRace(); }}
                className="flex-1 py-4 rounded-full bg-[#ff6f3c] border-2 border-white/80 text-white text-lg font-extrabold uppercase tracking-wide shadow-[0_4px_30px_rgba(255,111,60,0.5)] hover:bg-[#e65c2b] transition-all cursor-pointer"
              >
                Start
              </motion.button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-4 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        ) : (
          /* PLAYER WAITING LOBBY VIEW (MATCHES MOCKUP 6) */
          <div className="flex flex-col items-center justify-center w-full text-center max-w-md">
            
            {/* Sub-header Text */}
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8">
              The game will begin shortly!
            </h2>

            {/* Circular Avatar Badge matching Mockups */}
            <div className="mb-6 flex justify-center">
              <AvatarBadge
                src={player.vehicle}
                color={player.color}
                size="lg"
                onClick={() => setShowAvatarPicker(true)}
              />
            </div>

            {/* Player's Chosen Nickname */}
            <div className="text-2xl font-black text-white tracking-wide mb-8">
              {player.name || 'Contestant'}
            </div>

          </div>
        )}

      </main>

      {/* FOOTER GUMMYGUM BADGE */}
      <footer className="relative z-10 py-4 px-6 flex justify-end">
        <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 rounded-xl text-amber-400 font-bold text-xs">
          <span>🤝 GummyGum</span>
        </div>
      </footer>

      {/* CANCEL MODAL FOR HOST */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#152e3c] border border-red-500/30 p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center z-10">
              <h3 className="text-xl font-bold text-white mb-2">Cancel Session?</h3>
              <p className="text-sm text-white/60 mb-6">This will close the lobby for all connected contestants.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold">Go Back</button>
                <button onClick={() => { setShowCancelModal(false); cancelGame(); }} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg">Cancel Room</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AVATAR PICKER MODAL */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#152e3c] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-md w-full text-center z-10">
              <h3 className="text-xl font-bold text-white mb-4">Choose Your Avatar</h3>
              <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2">
                {VEHICLES.map((v, i) => (
                  <div key={i} onClick={() => { setPlayer(p => ({ ...p, vehicle: v.icon })); setShowAvatarPicker(false); }} className={`p-2 rounded-2xl border cursor-pointer flex flex-col items-center hover:bg-white/10 ${player.vehicle === v.icon ? 'border-amber-400 bg-white/10' : 'border-white/10'}`}>
                    <img src={v.icon} alt={v.name} className="w-12 h-12 object-contain" />
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAvatarPicker(false)} className="mt-4 w-full py-3 rounded-xl bg-white/10 text-white font-bold">Done</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
