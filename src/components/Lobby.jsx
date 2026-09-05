import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowLeft, Copy, Check } from 'lucide-react';
import AvatarBadge from './AvatarBadge';
import HostToolbar from './HostToolbar';
import SettingsModal from './SettingsModal';
import { useGame } from '../context/GameContext';
import { playSelect } from '../utils/audio';
import { VEHICLES } from '../constants';

export default function Lobby() {
  const { 
    navigate, player, setPlayer, opponents, startRace,
    isHost, cancelGame, kickPlayer, gameCode,
    hostSettings, setHostSettings
  } = useGame();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeOpponents = opponents.filter(o => o._joined);
  const activePlayers = activeOpponents.length + (isHost ? 0 : 1);

  // Split 5-digit PIN for styling: first 3 digits white, last 2 purple (matching Figma 791:325)
  const pinString = (gameCode || '32679').toString().padStart(5, '0');
  const pinPrefix = pinString.slice(0, 3);
  const pinSuffix = pinString.slice(3);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?join=${pinString}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#183944] text-white flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none font-poppins pb-12">
      
      {/* AMBIENT RADIAL LIGHTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#224e5d]/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#122b34]/60 rounded-full blur-[140px]" />
      </div>

      {/* TOP HEADER */}
      <header className="relative z-20 w-full max-w-[1300px] mx-auto px-6 pt-6 pb-2 flex items-center justify-between shrink-0">
        <button 
          onClick={() => { playSelect(); navigate('home'); }}
          className="w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
          title="Back to Homepage"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Brand Name sabi */}
        <div 
          onClick={() => navigate('home')}
          className="cursor-pointer text-4xl sm:text-5xl font-black text-[#F4D06F] drop-shadow-md tracking-tight group"
        >
          <span className="group-hover:scale-105 inline-block transition-transform">sabi</span>
        </div>

        {/* Orange Menu Button (Figma 791:325 & 840:558) */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="w-11 h-11 rounded-2xl bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 text-white flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(255,138,61,0.4)] cursor-pointer"
          title="Settings"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 max-w-[1100px] w-full mx-auto px-6 py-4 flex flex-col items-center justify-center my-auto">
        
        {/* ================= HOST VIEW (FIGMA 791:325 & 840:558) ================= */}
        {isHost ? (
          <div className="w-full flex flex-col items-center gap-5 sm:gap-6">
            
            {/* TWO CARDS ROW */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
              
              {/* LEFT CARD: QR CODE & PIN ENTRY */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-[#122834]/90 border border-white/10 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
                {/* QR Section */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs sm:text-sm font-semibold text-white/90 mb-2">
                    Scan to join
                  </span>
                  <div className="p-2 bg-white rounded-xl sm:rounded-2xl shadow-md mb-2.5">
                    <img
                      src="/assets/figma/qr_code.png"
                      alt="Scan to join"
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
                    />
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-1.5 rounded-full bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 text-white text-[11px] sm:text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Shareable Link'}</span>
                  </button>
                </div>

                {/* Vertical Divider line */}
                <div className="hidden sm:block w-[1px] h-32 md:h-36 bg-white/15" />

                {/* PIN Code Section */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs sm:text-sm font-semibold text-white/90 mb-0.5">
                    Join by Pin
                  </span>
                  <span className="text-[11px] text-white/60 mb-2">
                    Go to GummyGum.app
                  </span>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wider mt-0.5 select-all">
                    <span className="text-white">{pinPrefix}</span>
                    <span className="text-[#A855F7]">{pinSuffix}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT CARD: ACTIVE PLAYERS */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-[#122834]/90 border border-white/10 p-4 sm:p-6 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md min-h-[200px] sm:min-h-[220px]">
                <div className="text-base sm:text-lg font-bold text-white mb-1">
                  {activePlayers}/10 Players
                </div>

                {activePlayers === 0 ? (
                  <div className="text-xs sm:text-sm text-white/50 my-auto py-6">
                    Waiting for players
                  </div>
                ) : (
                  <div className="w-full flex-1 overflow-y-auto no-scrollbar py-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 justify-items-center">
                      {activeOpponents.map((o, idx) => (
                        <div key={idx} className="relative flex flex-col items-center p-1.5 rounded-2xl group">
                          <button
                            onClick={() => kickPlayer(o.sessionId)}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove player"
                          >
                            <X size={12} />
                          </button>
                          <AvatarBadge
                            src={o.vehicle}
                            color={o.color || '#EF4444'}
                            size="sm"
                          />
                          <span className="text-xs font-semibold text-white truncate max-w-[85px] mt-1">
                            {o.name || 'Player'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* START BUTTON (FIGMA 791:325 & 840:558) */}
            <div className="w-full max-w-[380px]">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { playSelect(); startRace(); }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#F97316] border-2 border-white/80 text-white text-lg sm:text-xl font-bold shadow-[0_8px_25px_rgba(255,138,61,0.45)] hover:shadow-[0_12px_35px_rgba(255,138,61,0.65)] transition-all cursor-pointer text-center"
              >
                Start
              </motion.button>
            </div>

          </div>
        ) : (
          /* ================= PLAYER WAITING VIEW ================= */
          <div className="flex flex-col items-center justify-center w-full text-center max-w-md my-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 tracking-tight">
              The game will begin shortly!
            </h2>

            <div className="mb-6 flex justify-center cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
              <AvatarBadge
                src={player.vehicle}
                color={player.color}
                size="lg"
              />
            </div>

            <div className="text-2xl font-bold text-white tracking-wide mb-2">
              {player.name || 'Contestant'}
            </div>
            <div className="text-xs text-white/50">
              Tap avatar to customize
            </div>
          </div>
        )}

      </main>

      {/* FOOTER & BRANDING */}
      <footer className="relative z-20 w-full max-w-[1300px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Collapsible Host Toolbar on bottom left */}
        {isHost && (
          <HostToolbar
            onNextRound={() => { playSelect(); startRace(); }}
            onOpenSettings={() => setShowSettingsModal(true)}
            showNewRound={false}
          />
        )}

        <div className="ml-auto flex items-center gap-2">
          <img
            src="/assets/figma/gummygum_footer_badge.png"
            alt="GummyGum"
            className="h-6 object-contain opacity-75 hover:opacity-100 transition-opacity"
          />
        </div>
      </footer>

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={hostSettings}
        onUpdateSettings={setHostSettings}
      />

      {/* AVATAR PICKER MODAL (FOR PLAYERS) */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAvatarPicker(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#152e3c] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-md w-full text-center z-10">
              <h3 className="text-xl font-bold text-white mb-4">Choose Your Avatar</h3>
              <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2">
                {VEHICLES.map((v, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setPlayer(p => ({ ...p, vehicle: v.icon })); setShowAvatarPicker(false); }} 
                    className={`p-2 rounded-2xl border cursor-pointer flex flex-col items-center hover:bg-white/10 ${player.vehicle === v.icon ? 'border-amber-400 bg-white/10' : 'border-white/10'}`}
                  >
                    <img src={v.icon} alt={v.name} className="w-12 h-12 object-contain" />
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAvatarPicker(false)} className="mt-4 w-full py-3 rounded-xl bg-white/10 text-white font-bold cursor-pointer">
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
