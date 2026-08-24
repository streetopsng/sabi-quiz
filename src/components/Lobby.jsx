import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, X } from 'lucide-react';
import CarAvatar from './CarAvatar';
import VectorDecor from './VectorDecor';
import SideToolbar from './SideToolbar';
import { useGame } from '../context/GameContext';
import { playSelect } from '../utils/audio';
import { VEHICLES } from '../constants';

export default function Lobby() {
  const { 
    navigate, gameCode, player, setPlayer, opponents, startRace, 
    isHost, cancelGame, kickPlayer 
  } = useGame();

  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const copyLink = () => {
    playSelect();
    const link = `${window.location.origin}?pin=${gameCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activePlayers = opponents.filter(o => o._joined).length + (isHost ? 0 : 1);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0e1f29] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      <VectorDecor variant="teal" />
      <SideToolbar />

      {/* TOP HEADER */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-6 pt-6 flex flex-col items-center">
        <div 
          onClick={() => navigate('home')}
          className="cursor-pointer text-[36px] font-black text-[#f5a623] drop-shadow-md tracking-tight mb-1"
        >
          sabi
        </div>
      </header>

      {/* MAIN LOBBY CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-4xl w-full mx-auto">
        
        {/* HOST LOBBY VIEW (MATCHES MOCKUP 3) */}
        {isHost ? (
          <div className="w-full flex flex-col items-center gap-6">
            
            {/* TOP ROW: SCAN TO JOIN & JOIN BY PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              
              {/* Left Card: Scan to Join */}
              <div className="bg-[#122834]/90 border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl backdrop-blur-md">
                <div className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Scan to join</div>
                
                {/* SVG QR Code Simulation */}
                <div className="w-32 h-32 bg-white p-2 rounded-2xl mb-4 shadow-md flex items-center justify-center">
                  <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-black">
                    <rect x="10" y="10" width="25" height="25" fill="black" />
                    <rect x="65" y="10" width="25" height="25" fill="black" />
                    <rect x="10" y="65" width="25" height="25" fill="black" />
                    <rect x="45" y="45" width="10" height="10" fill="black" />
                    <rect x="65" y="65" width="25" height="25" fill="black" />
                    <rect x="45" y="15" width="10" height="20" fill="black" />
                    <rect x="15" y="45" width="20" height="10" fill="black" />
                  </svg>
                </div>

                <button
                  onClick={copyLink}
                  className="px-6 py-2.5 rounded-full bg-[#ff6f3c] text-white text-xs font-extrabold uppercase tracking-wide border border-white/40 shadow-lg hover:bg-[#e65c2b] transition-all cursor-pointer flex items-center gap-2"
                >
                  {copied ? <>Copied! <Check size={14} /></> : <>Copy Shareable Link <Copy size={14} /></>}
                </button>
              </div>

              {/* Right Card: Join by Pin */}
              <div className="bg-[#122834]/90 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md">
                <div className="text-sm font-bold text-white/80 uppercase tracking-wider mb-1">Join by Pin</div>
                <div className="text-xs font-semibold text-white/50 mb-4">Go to GummyGum.app</div>
                
                {/* Large Colorful PIN Display */}
                <div className="text-5xl font-black tracking-widest bg-gradient-to-r from-white via-pink-400 to-cyan-400 bg-clip-text text-transparent my-2">
                  {gameCode}
                </div>
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
                    Share the PIN or QR code to let players enter...
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
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              The game will begin shortly!
            </h2>

            {/* Circular Avatar Container with Red Circle Background & Tap to Change */}
            <div className="relative mb-6 cursor-pointer group" onClick={() => setShowAvatarPicker(true)}>
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-red-600 border-4 border-white/20 flex flex-col items-center justify-center overflow-hidden shadow-2xl relative">
                <CarAvatar src={player.vehicle} color={player.color} className="w-24 h-24 md:w-28 md:h-28" />
                <div className="absolute bottom-0 inset-x-0 bg-red-800/80 py-1.5 text-center text-white text-xs font-bold uppercase tracking-wider">
                  Tap to Change
                </div>
              </div>
            </div>

            {/* Player's Chosen Nickname */}
            <div className="text-3xl font-black text-white tracking-wide mb-8">
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
