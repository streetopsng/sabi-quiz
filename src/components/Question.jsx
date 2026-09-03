import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import VectorDecor from './VectorDecor';
import SideToolbar from './SideToolbar';
import { playSelect } from '../utils/audio';

export default function Question() {
  const {
    gameState, currentQ, player,
    timeLeft, answered, chosenAnswer,
    handleAnswer, gameQuestions, gameConfig, isSpectator, startRace, isHost
  } = useGame();

  const q = gameQuestions[currentQ] || gameQuestions[0];
  const totalQuestions = gameQuestions.length;

  if (!q) {
    return (
      <div className="relative min-h-[100dvh] w-full bg-[#0e1f29] text-white flex items-center justify-center font-sans">
        <VectorDecor variant="teal" />
        <div className="text-center z-10">
          <div className="w-12 h-12 border-4 border-[#ff6f3c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold">Loading Question...</h2>
        </div>
      </div>
    );
  }

  // 4 Option Colors matching Mockup 7
  const optionStyles = [
    { bg: 'bg-[#f5a623]', hover: 'hover:bg-[#e09415]', border: 'border-amber-300/40' }, // Gold / Yellow
    { bg: 'bg-[#1b4e5b]', hover: 'hover:bg-[#15414d]', border: 'border-cyan-400/40' },  // Dark Teal / Slate
    { bg: 'bg-[#ff6f3c]', hover: 'hover:bg-[#e65c2b]', border: 'border-orange-400/40' },// Bright Orange
    { bg: 'bg-[#9333ea]', hover: 'hover:bg-[#7e22ce]', border: 'border-purple-400/40' },// Purple / Violet
  ];

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0e1f29] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      <VectorDecor variant="teal" />
      <SideToolbar onNewRound={isHost ? startRace : null} />

      {/* TOP INFO BAR */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-6 pt-6 flex items-start justify-between">
        <div>
          <div className="text-xs font-bold text-white/70 tracking-wider">
            GummyGum.app {gameConfig?.code || '32679'}
          </div>
          <div className="text-sm font-extrabold text-white mt-0.5">
            Round {currentQ + 1} of {totalQuestions}
          </div>
        </div>

        {!isSpectator && (
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 backdrop-blur-md">
            <div className="text-right">
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Score</div>
              <div className="text-lg font-black text-white leading-none">{Math.round(player?.score || 0)}</div>
            </div>
            {player?.streak > 1 && (
              <div className="text-xs font-extrabold text-[#ff6f3c] bg-[#ff6f3c]/15 border border-[#ff6f3c]/30 rounded-full px-2 py-1 ml-1">
                🔥 {player.streak}
              </div>
            )}
          </div>
        )}
      </header>

      {/* MAIN QUESTION & ANSWERS AREA */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 py-6 max-w-4xl w-full mx-auto flex flex-col items-center justify-start">
        
        {/* Question Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug text-center text-white mb-10 max-w-3xl drop-shadow-md"
        >
          {q.q}
        </motion.h1>

        {/* 2x2 Colorful Option Grid (MATCHES MOCKUP 7 EXACTLY) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl mb-10">
          {q.opts.map((opt, i) => {
            const isSelected = chosenAnswer === i;
            const showResult = gameState === 'result';
            const isCorrect = showResult && i === q.answer;
            const isWrong = showResult && isSelected && i !== q.answer;

            const style = optionStyles[i % 4];

            let cardClass = `${style.bg} ${style.hover} border ${style.border} text-white shadow-xl`;

            if (answered) {
              if (isSelected) {
                cardClass += ' ring-4 ring-white scale-[1.02] shadow-2xl';
              } else {
                cardClass += ' opacity-50';
              }
            }

            if (showResult) {
              if (isCorrect) {
                cardClass = 'bg-emerald-500 border-2 border-white text-white ring-4 ring-emerald-300 scale-[1.03] shadow-2xl z-10';
              } else if (isWrong) {
                cardClass = 'bg-red-600 border-2 border-white text-white opacity-80';
              }
            }

            return (
              <motion.button
                key={i}
                whileTap={!answered && !isSpectator ? { scale: 0.96 } : {}}
                disabled={answered || isSpectator}
                onClick={() => {
                  if (!answered && !isSpectator) playSelect();
                  handleAnswer(i);
                }}
                className={`py-6 px-6 rounded-3xl font-extrabold text-lg md:text-xl text-center transition-all cursor-pointer flex items-center justify-center shadow-2xl backdrop-blur-sm min-h-[80px] ${cardClass}`}
              >
                <span>{opt}</span>
              </motion.button>
            );
          })}
        </div>

        {/* CENTERED TIMER PROGRESS BAR WITH CIRCULAR BADGE (MATCHES MOCKUP 7) */}
        <div className="relative w-full max-w-md flex items-center justify-center mt-2">
          {/* Progress Line */}
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / (gameConfig?.timerMode || 15)) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>

          {/* Centered Circular Timer Badge */}
          <div className="absolute w-12 h-12 rounded-full border-2 border-white bg-[#0e1f29] text-white font-black text-lg flex items-center justify-center shadow-lg">
            {timeLeft}
          </div>
        </div>

      </main>

      {/* FOOTER GUMMYGUM BADGE */}
      <footer className="relative z-10 py-4 px-6 flex justify-end">
        <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 rounded-xl text-amber-400 font-bold text-xs">
          <span>🤝 GummyGum</span>
        </div>
      </footer>
    </div>
  );
}
