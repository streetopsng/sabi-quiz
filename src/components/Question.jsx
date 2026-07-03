import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { LETTERS } from '../constants';

export default function Question() {
  const { 
    gameState, currentQ, player, opponents,
    timeLeft, answered, bonusRound, chosenAnswer,
    handleAnswer, gameQuestions, gameConfig
  } = useGame();

  const allPlayers = [player, ...opponents.filter(o => o._joined)].sort((a, b) => b.score - a.score);

  const q = gameQuestions[currentQ] || gameQuestions[0]; // Fallback prevents crash during exit animation
  const isTF = q.type === 'tf';
  const totalQuestions = gameQuestions.length;

  return (
    <motion.div 
      className="flex flex-col md:flex-row h-full max-w-[430px] md:max-w-5xl mx-auto bg-navy relative md:items-center md:gap-12 md:py-12 overflow-y-auto no-scrollbar"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      {/* LEFT COLUMN (Desktop) / TOP (Mobile) */}
      <div className="flex flex-col md:flex-1 w-full z-10 shrink-0">
        <div className="pt-5 md:pt-0 px-5 flex items-center justify-between">
          <div className="bg-white/[0.05] border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-[11px] md:text-[13px] font-bold text-muted uppercase tracking-widest">Question {currentQ + 1}</span>
            <span className="w-[1px] h-3 bg-white/20"></span>
            <span className="text-[11px] md:text-[13px] font-bold text-white/40 uppercase tracking-widest">{totalQuestions}</span>
          </div>
          <div className="flex items-center gap-3">
            {player.streak >= 2 && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="bg-[#ff6b35]/10 border border-[#ff6b35]/20 px-2.5 py-1 rounded-full text-[11px] md:text-[12px] text-[#ff6b35] flex items-center gap-1.5 font-bold shadow-[0_0_15px_rgba(255,107,53,0.15)]"
              >
                🔥 <span>{player.streak} Streak</span>
              </motion.div>
            )}
            <div className="bg-amber/10 border border-amber/20 px-3.5 py-1.5 rounded-full text-[16px] md:text-[22px] font-black text-amber leading-none shadow-[0_0_15px_rgba(245,166,35,0.1)]">
              {Math.round(player.score)}
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-6 mx-5 h-[6px] md:h-[8px] bg-black/40 border border-white/5 rounded-full overflow-hidden shrink-0 shadow-inner">
          <motion.div 
            className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red shadow-[0_0_15px_rgba(192,57,43,0.9)]' : 'bg-gradient-to-r from-amber to-[#e69b19] shadow-[0_0_15px_rgba(245,166,35,0.6)]'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / (gameConfig?.timerMode || 15)) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>

        <div className="mt-6 md:mt-8 px-5 shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 backdrop-blur-sm">
            <div className="text-[10px] md:text-[11px] tracking-[2px] uppercase text-amber/60 mb-2 md:mb-3 font-bold pl-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber/60 animate-pulse" /> Live Standings
            </div>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {allPlayers.map((p, i) => (
                <motion.div 
                  key={p.name}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0 transition-colors shadow-sm
                    ${p === player ? 'border-[1.5px] bg-white/[0.08] shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'border-white/5 bg-black/20'}
                  `}
                  style={{ borderColor: p === player ? p.color : undefined }}
                >
                  <div className="text-[10px] md:text-[12px] font-black text-white/30 w-3">{i + 1}</div>
                  <div className="text-[18px] md:text-[22px] drop-shadow-md">{p.vehicle}</div>
                  <div className="text-[12px] md:text-[14px] font-bold" style={{ color: p === player ? p.color : 'white' }}>
                    {Math.round(p.score)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 md:pt-10 px-6 flex-1 flex flex-col justify-center mb-4 md:mb-0">
          <div className="text-[22px] md:text-[36px] font-bold leading-[1.35] md:leading-[1.25] text-white drop-shadow-lg min-h-[72px] md:min-h-0 tracking-tight">
            {q.q}
          </div>
          <div className="text-[13px] md:text-[15px] font-semibold text-white/40 mt-4 flex items-center gap-2 bg-black/20 self-start px-3 py-1.5 rounded-lg border border-white/5">
            <span className="text-amber animate-pulse">⏱</span> {timeLeft} seconds remaining
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (Desktop) / BOTTOM (Mobile) */}
      <div className="flex flex-col flex-1 md:flex-1 md:shrink-0 w-full z-10 px-5 pb-7 md:pb-0 justify-end md:justify-center">
        
        {bonusRound && (
          <motion.div 
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4 bg-gradient-to-r from-amber to-[#e69b19] text-[#1a1a00] text-[13px] md:text-[15px] font-black text-center py-3 px-4 rounded-xl tracking-[1.5px] uppercase shadow-[0_4px_20px_rgba(245,166,35,0.4)]"
          >
            ⚡ Bonus Round — 2× Points!
          </motion.div>
        )}

        <div className={`flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4 mt-auto md:mt-0 ${isTF ? 'grid grid-cols-2' : ''}`}>
          {q.opts.map((opt, i) => {
            const isSelected = chosenAnswer === i;
            const showResult = gameState === 'result';
            const isCorrect = showResult && i === q.answer;
            const isWrong = showResult && isSelected && i !== q.answer;
            const isDimmed = showResult && i !== q.answer;

            let btnClass = "bg-white/[0.04] border-white/10 hover:bg-amber/10 hover:border-amber/50 text-white hover:shadow-[0_4px_20px_rgba(245,166,35,0.15)] hover:-translate-y-0.5 active:translate-y-0";
            let letterClass = "bg-white/10 text-white/80 border border-white/5 shadow-inner";

            if (answered) {
              if (isSelected) {
                btnClass = "bg-amber/20 border-amber text-white shadow-[0_0_15px_rgba(245,166,35,0.2)]";
              } else {
                btnClass = "bg-white/[0.02] border-white/5 text-white/60 shadow-none hover:translate-y-0";
              }
            }

            if (showResult) {
              if (isCorrect) {
                btnClass = "bg-green-500/20 border-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.3)] z-10 scale-[1.02] hover:translate-y-0";
                letterClass = "bg-green-500 text-white border-green-400";
              } else if (isWrong) {
                btnClass = "bg-red-500/20 border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)] z-10 hover:translate-y-0";
                letterClass = "bg-red-500 text-white border-red-400";
              }
            }

            return (
              <motion.button
                key={`${currentQ}-${i}`}
                whileTap={!answered ? { scale: 0.96 } : {}}
                disabled={answered}
                onClick={() => handleAnswer(i)}
                className={`
                  flex items-center gap-3 md:gap-4 w-full p-4 md:p-5 rounded-2xl border-[1.5px] text-[15px] md:text-[17px] font-medium text-left transition-all backdrop-blur-sm
                  ${btnClass} ${isDimmed && !isWrong ? 'opacity-30 scale-95' : ''}
                `}
              >
                <span className={`w-[32px] h-[32px] md:w-[36px] md:h-[36px] shrink-0 rounded-full flex items-center justify-center text-[13px] md:text-[15px] font-extrabold ${letterClass} transition-colors`}>
                  {isTF ? '' : LETTERS[i]}
                </span>
                <span className="flex-1 leading-snug drop-shadow-sm">{opt}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
