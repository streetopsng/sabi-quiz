import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VectorDecor from './VectorDecor';
import { GoldMedalVector } from './VectorIcons';
import HostToolbar from './HostToolbar';
import CarAvatar from './CarAvatar';
import { useGame } from '../context/GameContext';
import { playSelect } from '../utils/audio';

export default function Leaderboard() {
  const {
    player,
    opponents,
    currentQ,
    gameQuestions,
    isHost,
    isSpectator,
    nextQuestion,
  } = useGame();

  const totalQuestions = gameQuestions?.length || 1;
  const [countdown, setCountdown] = useState(6);
  const advancingRef = useRef(false);

  const handleNext = () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    playSelect();
    nextQuestion();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (isHost && !advancingRef.current) {
            advancingRef.current = true;
            nextQuestion();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isHost, nextQuestion]);

  // Sort contestants by score
  const contestants = isSpectator
    ? opponents.filter((o) => o._joined)
    : [player, ...opponents.filter((o) => o._joined)];

  const leaderboard = [...contestants].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#183944] text-white flex flex-col justify-between overflow-hidden select-none font-poppins">
      <HostToolbar onNextRound={handleNext} nextRoundLabel="Next Question" showNewRound={isHost} />

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 py-6 max-w-4xl w-full mx-auto flex flex-col items-center justify-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center justify-center w-full max-w-xl text-center"
        >
          {/* Sabi Brand Logo */}
          <div className="text-3xl sm:text-4xl font-black text-[#f5a623] drop-shadow-md tracking-tight mb-2">
            sabi
          </div>

          {/* Round Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white/90 uppercase tracking-wider mb-6">
            <span>Round {currentQ + 1} of {totalQuestions}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f3c]" />
            <span>Leaderboard</span>
          </div>

          {/* Leaderboard List */}
          <div className="w-full space-y-3 mb-6 max-h-[52dvh] overflow-y-auto px-1 no-scrollbar">
            <AnimatePresence>
              {leaderboard.map((p, rank) => {
                const isMe = !isSpectator && (p.sessionId === player.sessionId || p.name === player.name);

                return (
                  <motion.div
                    key={p.sessionId || p.name || rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rank * 0.08 }}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-3xl border backdrop-blur-md transition-all ${
                      rank === 0
                        ? 'bg-[#1a3845] border-amber-400/50 shadow-xl ring-1 ring-amber-400/30'
                        : isMe
                        ? 'bg-white/10 border-[#ff6f3c]/60 shadow-lg'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Medal / Rank Ribbon */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        {rank === 0 ? (
                          <GoldMedalVector className="w-9 h-9 sm:w-10 sm:h-10" />
                        ) : rank === 1 ? (
                          <span className="text-2xl">🥈</span>
                        ) : rank === 2 ? (
                          <span className="text-2xl">🥉</span>
                        ) : (
                          <span className="font-extrabold text-white/60 text-sm sm:text-base">
                            #{rank + 1}
                          </span>
                        )}
                      </div>

                      {/* Avatar Circle */}
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600 border-2 border-white/20 flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
                        <CarAvatar src={p.vehicle} color={p.color} className="w-8 h-8 sm:w-9 sm:h-9" />
                      </div>

                      {/* Player Name and Badges */}
                      <div className="text-left truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
                            {p.name || `Player ${rank + 1}`}
                          </span>
                          {isMe && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-[#ff6f3c] text-white px-2 py-0.5 rounded-full flex-shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        {p.streak >= 2 && (
                          <div className="text-xs font-bold text-[#ff6f3c] flex items-center gap-1 mt-0.5">
                            <span>🔥 {p.streak} streak</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Score and Points Gained */}
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-lg sm:text-xl font-black text-white tracking-wider">
                        {Math.round(p.score || 0)}
                      </div>
                      {p.roundPoints > 0 && (
                        <div className="text-xs font-black text-emerald-400">
                          +{p.roundPoints}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* ADVANCE CONTROLS */}
          {isHost ? (
            <div className="w-full max-w-md mt-2 flex flex-col items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#ff6f3c] border-2 border-white/80 text-white font-extrabold text-sm sm:text-base uppercase tracking-wide shadow-xl hover:bg-[#e65c2b] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{currentQ + 1 >= totalQuestions ? "View Final Standings" : "Next Question"}</span>
                <span className="text-white/80 text-xs sm:text-sm font-semibold">({countdown}s)</span>
                <span>→</span>
              </motion.button>
              <p className="text-xs text-white/50">Auto-advancing in {countdown}s...</p>
            </div>
          ) : (
            <div className="w-full max-w-md mt-3 flex flex-col items-center gap-3">
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/10">
                <motion.div
                  className="h-full bg-[#ff6f3c] rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(countdown / 6) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
              <p className="text-sm font-bold text-white/70">
                {currentQ + 1 >= totalQuestions ? "Final standings starting in " : "Next question starting in "}
                <span className="text-[#ff6f3c] font-black">{countdown}s</span>...
              </p>
            </div>
          )}
        </motion.div>
      </main>

      {/* FOOTER GUMMYGUM BADGE */}
      <footer className="relative z-10 py-3 px-6 flex justify-end">
        <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 rounded-xl text-amber-400 font-bold text-xs">
          <span>🤝 GummyGum</span>
        </div>
      </footer>
    </div>
  );
}
