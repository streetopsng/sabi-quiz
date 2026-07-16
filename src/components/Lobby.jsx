import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Users, MessageSquare, Flag, Copy, QrCode, X } from 'lucide-react';
import CarAvatar from './CarAvatar';
import { useGame } from '../context/GameContext';

export default function Lobby() {
  const { navigate, gameCode, player, setPlayer, opponents, startRace, isHost, cancelGame, kickPlayer, isSpectator } = useGame();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleBanterChange = (val) => {
    setPlayer(p => ({ ...p, banter: val }));
    setIsDropdownOpen(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activePlayers = opponents.filter(o => o._joined).length + 1; // +1 for player

  const banterOptions = [
    "This is already over.",
    "Don't embarrass yourself.",
    "I came here to win.",
    "Underestimate me — please.",
    "Quietly dangerous.",
    "I've been preparing for this.",
    "You should be worried.",
    "Let's make this interesting.",
    "No hard feelings.",
    "May the best driver win."
  ];

  return (
    <motion.div 
      className="flex flex-col md:flex-row h-full max-w-[430px] md:max-w-5xl mx-auto relative md:items-start md:pt-16 md:gap-10 overflow-hidden md:overflow-visible"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-amber/10 blur-[100px] rounded-full pointer-events-none" />

      {/* LEFT COLUMN (Desktop) / TOP & BOTTOM (Mobile) */}
      <div className="flex flex-col md:w-[360px] md:shrink-0 md:sticky md:top-16 z-20">
        
        {/* Header - Game Code & Players */}
        <div className="pt-10 md:pt-0 px-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] tracking-[2px] uppercase text-muted mb-1 flex items-center gap-1.5">
              <QrCode size={12} /> Game Code
            </div>
            <div 
              onClick={copyCode}
              className="flex items-center gap-3 bg-white/[0.04] border border-white/10 py-2 px-3 rounded-xl cursor-pointer hover:bg-white/[0.08] transition-colors active:scale-95"
            >
              <div className="text-[24px] font-extrabold tracking-[4px] text-amber leading-none">{gameCode}</div>
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={16} className="text-muted" />}
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="text-[11px] tracking-[2px] uppercase text-muted mb-1 flex items-center gap-1.5">
              Players <Users size={12} />
            </div>
            <div className="text-[24px] font-extrabold leading-none bg-white/[0.04] border border-white/10 py-2 px-4 rounded-xl text-white">
              <span className="text-amber">{activePlayers}</span>
              <span className="text-white/30 text-[18px]"> / 50</span>
            </div>
          </div>
        </div>

        {/* Action Bar (Pinned to bottom on mobile, inline on desktop) */}
        <div className="absolute md:relative bottom-0 left-0 w-full p-5 pt-10 md:pt-6 bg-gradient-to-t from-[#16213E] via-[#16213E]/90 to-transparent md:bg-none z-30">
          <div className="bg-white/[0.02] md:border md:border-white/10 md:rounded-2xl md:p-5 md:backdrop-blur-md">
            <div className="text-[11px] tracking-[2px] uppercase text-muted mb-2 flex items-center gap-1.5">
              <MessageSquare size={12} /> Your banter phrase
            </div>
            <div className="relative mb-4 md:mb-6">
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-black/20 border border-white/10 rounded-xl text-white text-[14px] py-3.5 px-4 cursor-pointer transition-colors hover:bg-white/5 hover:border-amber/50 flex items-center justify-between shadow-inner"
              >
                <span className={player.banter ? 'text-amber font-medium' : 'text-muted'}>
                  {player.banter || 'Choose a declaration...'}
                </span>
                <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }}>
                  <ChevronDown size={16} className="text-muted" />
                </motion.div>
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full md:top-full md:bottom-auto mb-2 md:mt-2 left-0 w-full bg-[#1A1A2E] border border-white/10 rounded-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="max-h-[220px] overflow-y-auto no-scrollbar py-2">
                        {banterOptions.map((opt, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleBanterChange(opt)}
                            className={`px-4 py-3.5 text-[14px] cursor-pointer flex items-center justify-between transition-colors
                              ${player.banter === opt ? 'bg-amber/10 text-amber font-medium' : 'text-white/90 hover:bg-white/5'}
                            `}
                          >
                            {opt}
                            {player.banter === opt && <Check size={16} />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            {isHost ? (
              <div className="flex flex-col gap-3 mt-4">
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={startRace}
                  className="w-full p-[18px] rounded-xl bg-amber text-[#1a1a00] text-[16px] font-extrabold tracking-[0.5px] uppercase border-none cursor-pointer shadow-[0_4px_20px_rgba(245,166,35,0.3)] flex items-center justify-center gap-2"
                >
                  Start Race <Flag size={18} fill="currentColor" />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowCancelModal(true)}
                  className="w-full p-[14px] rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 text-[14px] font-bold tracking-[0.5px] uppercase cursor-pointer hover:bg-red-500/20 flex items-center justify-center gap-2 transition-colors"
                >
                  Cancel Game <X size={16} />
                </motion.button>
              </div>
            ) : (
              <div className="w-full p-[18px] rounded-xl bg-white/5 border border-white/10 text-white/50 text-[14px] font-bold tracking-[0.5px] uppercase flex items-center justify-center gap-2 mt-4">
                Waiting for host to start...
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN (Desktop) / MIDDLE (Mobile) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-6 pb-[180px] md:pb-6 relative z-10 w-full h-full">
        <div className="px-5 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-[14px] font-semibold text-white/90">Starting Grid</h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-5 pb-4">
          {!isSpectator && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('fleet')}
              className="rounded-2xl border-[1.5px] p-2 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-b from-white/10 to-transparent cursor-pointer shadow-lg relative overflow-hidden backdrop-blur-md"
              style={{ borderColor: player.color, boxShadow: `0 4px 20px ${player.color}15` }}
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${player.color}, transparent)` }} />
              <CarAvatar src={player.vehicle} color={player.color} className="w-16 h-16 mt-1" />
              <div className="text-[12px] font-bold text-center leading-tight px-1 z-10 text-white">{player.name}</div>
              <div className="text-[10px] italic text-center leading-[1.3] min-h-[28px] px-1 z-10 font-medium" style={{ color: player.color }}>
                {player.banter || <span className="opacity-50">Tap to customise</span>}
              </div>
            </motion.div>
          )}

          {opponents.map((o, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: o._joined ? 1 : 1, x: 0 }}
              className={`rounded-2xl border p-2 flex flex-col items-center justify-center gap-1.5 backdrop-blur-md relative overflow-hidden transition-all duration-500
                ${o._joined ? 'bg-gradient-to-b from-white/[0.08] to-transparent shadow-lg' : 'bg-white/[0.02] border-dashed border-white/20'}
              `}
              style={{ borderColor: o._joined ? 'rgba(255,255,255,0.15)' : undefined }}
            >
              {o._joined ? (
                <>
                  {isHost && (
                    <button
                      onClick={(e) => { e.stopPropagation(); kickPlayer(o.sessionId); }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 flex items-center justify-center transition-colors z-20"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${o.color}, transparent)` }} />
                  <CarAvatar src={o.vehicle} color={o.color} className="w-16 h-16 mt-1" />
                  <div className="text-[12px] font-bold text-center leading-tight px-1 z-10 text-white/90">{o.name}</div>
                  <div className="text-[10px] italic text-center leading-[1.3] min-h-[28px] px-1 z-10 font-medium" style={{ color: o.color }}>
                    {o.banter}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-40 py-2">
                  <motion.div 
                    animate={{ opacity: [0.3, 0.8, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-10 h-10 mb-1 rounded-full border border-dashed border-white/40"
                  />
                  <div className="text-[10px] font-semibold text-center uppercase tracking-wider">Waiting</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCancelModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#1A1A2E] border border-red-500/30 p-6 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                <X size={24} />
              </div>
              <h3 className="text-[20px] font-bold text-white mb-2">Cancel Session?</h3>
              <p className="text-[14px] text-white/60 mb-6 leading-relaxed">Are you sure you want to cancel? This will instantly remove everyone from the lobby.</p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Go Back
                </button>
                <button 
                  onClick={() => { setShowCancelModal(false); cancelGame(); }}
                  className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
