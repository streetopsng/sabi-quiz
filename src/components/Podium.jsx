import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Menu, X, Trophy, MessageSquare, ArrowLeft } from 'lucide-react';
import HostToolbar from './HostToolbar';
import SettingsModal from './SettingsModal';
import AvatarBadge from './AvatarBadge';
import { useGame } from '../context/GameContext';
import { playSelect } from '../utils/audio';

export default function Podium() {
  const { navigate, player, opponents, showAlertModal, gameCode, hostSettings, setHostSettings } = useGame();

  const [showStandings, setShowStandings] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const submitFeedback = async () => {
    if (!feedbackText.trim() || submittingFeedback) return;
    setSubmittingFeedback(true);
    try {
      await setDoc(doc(db, 'games', gameCode, 'feedback', player.sessionId), {
        name: player.name,
        text: feedbackText.trim(),
        submittedAt: Date.now(),
      });
      showAlertModal("Thank you for your feedback!", "Feedback Submitted");
      setShowFeedbackModal(false);
      setFeedbackText('');
    } catch (err) {
      showAlertModal("Failed to send feedback: " + err.message, "Feedback Error");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Sort all contestants by score
  const leaderboard = [player, ...opponents.filter(o => o._joined)].sort((a, b) => b.score - a.score);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#183944] text-white flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none font-poppins pb-16">
      
      {/* AMBIENT RADIAL LIGHTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#224e5d]/35 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#122b34]/55 rounded-full blur-[140px]" />
      </div>

      {/* CONFETTI SPRINKLES OVERLAY (MATCHING FIGMA 899:1296) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { color: '#EF4444', left: '10%', top: '20%', rot: '15deg' },
          { color: '#3B82F6', left: '25%', top: '15%', rot: '-30deg' },
          { color: '#F59E0B', left: '40%', top: '25%', rot: '45deg' },
          { color: '#10B981', left: '60%', top: '18%', rot: '-20deg' },
          { color: '#8B5CF6', left: '75%', top: '22%', rot: '35deg' },
          { color: '#EC4899', left: '88%', top: '35%', rot: '-15deg' },
          { color: '#F59E0B', left: '15%', top: '65%', rot: '40deg' },
          { color: '#10B981', left: '30%', top: '75%', rot: '-25deg' },
          { color: '#8B5CF6', left: '55%', top: '60%', rot: '15deg' },
          { color: '#EF4444', left: '70%', top: '70%', rot: '-40deg' },
          { color: '#3B82F6', left: '85%', top: '65%', rot: '30deg' },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, opacity: 0 }}
            animate={{
              y: [0, 40, 0],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 20, 0]
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2
            }}
            style={{
              position: 'absolute',
              left: c.left,
              top: c.top,
              backgroundColor: c.color,
              transform: `rotate(${c.rot})`,
              width: '8px',
              height: '24px',
              borderRadius: '4px'
            }}
          />
        ))}
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

        {/* Orange Menu Button (Figma 899:1296) */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="w-11 h-11 rounded-2xl bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 text-white flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(255,138,61,0.4)] cursor-pointer"
          title="Settings"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 max-w-[900px] w-full mx-auto px-6 py-4 flex flex-col items-center justify-center my-auto text-center">
        
        {!showStandings ? (
          /* ================= STEP 1: GAME OVER SPLASH (FIGMA 899:1296) ================= */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center my-auto py-4"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
              Game Over
            </h1>

            <p className="text-white/70 text-sm sm:text-lg font-medium mb-6">
              Great game everyone! Ready to see the winners?
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playSelect(); setShowStandings(true); }}
              className="px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#F97316] text-white font-bold text-base sm:text-lg shadow-[0_8px_25px_rgba(255,138,61,0.45)] cursor-pointer"
            >
              View Final Standings
            </motion.button>
          </motion.div>
        ) : (
          /* ================= STEP 2: PODIUM / STANDINGS ================= */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl flex flex-col items-center py-2"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy size={28} className="text-[#FFD166]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Final Standings
              </h2>
            </div>

            <div className="w-full bg-[#122834]/90 border border-white/10 rounded-[28px] sm:rounded-[32px] p-4 sm:p-5 shadow-2xl backdrop-blur-md max-h-[300px] sm:max-h-[340px] overflow-y-auto no-scrollbar space-y-2.5 mt-3 mb-5">
              {leaderboard.map((p, idx) => {
                const rank = idx + 1;
                const isWinner = rank === 1;

                return (
                  <div
                    key={p.sessionId || idx}
                    className={`flex items-center justify-between p-3 rounded-xl sm:rounded-2xl border transition-all ${
                      isWinner
                        ? 'bg-gradient-to-r from-[#FF8A3D]/25 to-[#7C3AED]/25 border-[#FF8A3D]/50 shadow-md'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                        rank === 1 ? 'bg-[#FFD166] text-black' :
                        rank === 2 ? 'bg-slate-300 text-black' :
                        rank === 3 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/70'
                      }`}>
                        {rank}
                      </span>
                      <AvatarBadge src={p.vehicle} color={p.color} size="sm" />
                      <span className="font-bold text-sm sm:text-base text-white truncate max-w-[150px] sm:max-w-[200px]">
                        {p.name || 'Contestant'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-[#FFD166]">
                        {Math.round(p.score || 0)}
                      </span>
                      <span className="text-xs text-white/50 ml-1">pts</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => { playSelect(); navigate('home'); }}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer"
            >
              Back to Homepage
            </button>
          </motion.div>
        )}

      </main>

      {/* FOOTER & HOST TOOLBAR */}
      <footer className="relative z-20 w-full max-w-[1300px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Floating Toolbar with Give Feedback button (Figma 899:1296) */}
        <HostToolbar
          onNextRound={() => setShowFeedbackModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          nextRoundLabel="Give Feedback"
          showNewRound={true}
        />

        {/* GummyGum Watermark */}
        <div className="ml-auto flex items-center gap-2">
          <img
            src="/assets/figma/gummygum_footer_badge.png"
            alt="GummyGum"
            className="h-6 object-contain opacity-75 hover:opacity-100 transition-opacity"
          />
        </div>
      </footer>

      {/* FEEDBACK MODAL */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowFeedbackModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#163440] border border-white/15 p-7 rounded-[32px] shadow-2xl max-w-md w-full text-center z-10 text-white">
              <h3 className="text-2xl font-bold mb-2">Share Your Feedback</h3>
              <p className="text-sm text-white/70 mb-4">How was your Sabi trivia experience?</p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what you liked or how we can improve..."
                rows={4}
                className="w-full rounded-2xl bg-black/30 border border-white/15 p-3.5 text-white text-sm focus:outline-none focus:border-[#FF8A3D] mb-5 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  disabled={submittingFeedback || !feedbackText.trim()}
                  className="flex-1 py-3 rounded-xl bg-[#FF8A3D] hover:bg-[#ff9752] text-white font-bold disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {submittingFeedback ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={hostSettings}
        onUpdateSettings={setHostSettings}
      />

    </div>
  );
}
