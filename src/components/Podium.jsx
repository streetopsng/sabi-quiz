import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import VectorDecor from './VectorDecor';
import { GoldMedalVector, PodiumVector } from './VectorIcons';
import SideToolbar from './SideToolbar';
import CarAvatar from './CarAvatar';
import { useGame } from '../context/GameContext';
import { playSelect } from '../utils/audio';

export default function Podium() {
  const { navigate, player, opponents, showAlertModal, gameCode, ggSession } = useGame();

  // Step 1: Game Over splash (Mockup 8), Step 2: Leaderboard (Mockup 9)
  const [podiumStep, setPodiumStep] = useState(1);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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

  // Auto transition from Game Over to Leaderboard after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPodiumStep(2);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Sort all contestants by score
  const leaderboard = [player, ...opponents.filter(o => o._joined)].sort((a, b) => b.score - a.score);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0e1f29] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      <VectorDecor showConfetti={true} variant="teal" />
      <SideToolbar onGiveFeedback={() => setShowFeedbackModal(true)} />

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-6 py-6 max-w-4xl w-full mx-auto flex flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: GAME OVER SPLASH (MATCHES MOCKUP 8) */}
          {podiumStep === 1 && (
            <motion.div
              key="gameOverStep"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              onClick={() => setPodiumStep(2)}
              className="cursor-pointer flex flex-col items-center justify-center text-center py-16"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl mb-4">
                Game Over
              </h1>
              <p className="text-white/60 text-base font-medium">Tap anywhere for final standings...</p>

              {/* Floating Bottom Toolbar Preview with Give Feedback Pill */}
              <div className="fixed bottom-10 left-8 z-30 flex items-center gap-3 bg-[#152e3c]/90 border border-white/10 p-2.5 rounded-full shadow-2xl backdrop-blur-md">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowFeedbackModal(true); }}
                  className="px-5 py-2 rounded-full bg-[#ff6f3c] text-white text-xs font-extrabold uppercase tracking-wide shadow-lg hover:bg-[#e65c2b] transition-all cursor-pointer"
                >
                  Give Feedback
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LEADERBOARD PODIUM (MATCHES MOCKUP 9) */}
          {podiumStep === 2 && (
            <motion.div
              key="leaderboardStep"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center w-full max-w-xl text-center"
            >
              {/* Gold Sabi Logo */}
              <div className="text-4xl font-black text-[#f5a623] drop-shadow-md tracking-tight mb-8">
                sabi
              </div>

              {/* Leaderboard List with Medal Ribbons */}
              <div className="w-full space-y-4 mb-10 max-h-80 overflow-y-auto px-2">
                {leaderboard.map((p, rank) => (
                  <motion.div
                    key={p.sessionId || rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rank * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-3xl border backdrop-blur-md transition-all ${rank === 0 ? 'bg-[#1a3845] border-amber-400/50 shadow-xl' : 'bg-white/5 border-white/10'}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Medal Ribbon Icon */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        {rank === 0 ? <GoldMedalVector className="w-10 h-10" /> : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
                      </div>

                      {/* Avatar Circle with Red Background */}
                      <div className="w-12 h-12 rounded-full bg-red-600 border-2 border-white/20 flex items-center justify-center overflow-hidden shadow-md">
                        <CarAvatar src={p.vehicle} color={p.color} className="w-9 h-9" />
                      </div>

                      {/* Player Name */}
                      <span className="text-lg font-bold text-white tracking-wide">
                        {p.name || `Player ${rank + 1}`}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="text-xl font-black text-white tracking-wider">
                      {Math.round(p.score || 0)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { playSelect(); navigate('create'); }}
                  className="flex-1 py-4 rounded-full border-2 border-white/80 bg-black/40 text-white font-bold text-base tracking-wide hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
                >
                  play More
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { playSelect(); navigate('home'); }}
                  className="flex-1 py-4 rounded-full bg-[#ff6f3c] border-2 border-white/80 text-white font-extrabold text-base uppercase tracking-wide shadow-lg hover:bg-[#e65c2b] transition-all cursor-pointer"
                >
                  Back to Home
                </motion.button>
              </div>
              {ggSession && (
                <a href="https://gummygum.app" className="mt-6 text-white/50 text-sm font-semibold hover:text-white transition-colors cursor-pointer">
                  Done — back to GummyGum →
                </a>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FEEDBACK MODAL */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowFeedbackModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#152e3c] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-md w-full text-center z-10">
              <h3 className="text-xl font-bold text-white mb-2">Give Feedback</h3>
              <p className="text-xs text-white/60 mb-4">How was your trivia session experience?</p>
              <textarea
                rows={4}
                placeholder="Share your thoughts..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full bg-black/30 border border-white/15 rounded-xl p-3 text-white text-sm outline-none mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowFeedbackModal(false)} className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold">Cancel</button>
                <button onClick={submitFeedback} disabled={submittingFeedback} className="flex-1 py-3 rounded-xl bg-[#ff6f3c] text-white font-bold disabled:opacity-60">
                  {submittingFeedback ? 'Sending…' : 'Submit'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
