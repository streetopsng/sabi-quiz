import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import HostToolbar from './HostToolbar';
import SettingsModal from './SettingsModal';
import Spinner from './Spinner';
import { playSelect } from '../utils/audio';

export default function Question() {
  const {
    gameState, currentQ, player,
    timeLeft, answered, chosenAnswer,
    handleAnswer, gameQuestions, gameConfig, isSpectator, nextQuestion, resolveQuestion, isHost,
    hostSettings, setHostSettings, gameCode
  } = useGame();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isPictureMode, setIsPictureMode] = useState(false);

  const q = gameQuestions[currentQ] || gameQuestions[0];
  const totalQuestions = gameQuestions.length || 12;

  if (!q) {
    return (
      <div className="relative min-h-[100dvh] w-full bg-[#163440] text-white flex flex-col items-center justify-center font-poppins">
        <Spinner size="lg" />
        <p className="mt-4 text-white/80 font-medium">Loading Question...</p>
      </div>
    );
  }

  // 4 Option Colors matching Figma 865:1318 & 886:491
  const optionStyles = [
    { bg: 'bg-[#F59E0B]', border: 'border-[#F59E0B]/50' }, // Gold / Yellow
    { bg: 'bg-[#284E5E]', border: 'border-[#284E5E]/50' }, // Deep Teal / Slate
    { bg: 'bg-[#FF8A3D]', border: 'border-[#FF8A3D]/50' }, // Sabi Orange
    { bg: 'bg-[#8B5CF6]', border: 'border-[#8B5CF6]/50' }, // Electric Purple
  ];

  const hasImage = q.image || isPictureMode;
  const showResult = gameState === 'result' || timeLeft === 0;

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#183944] text-white flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none font-poppins pb-16">
      
      {/* AMBIENT RADIAL LIGHTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#224e5d]/35 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#122b34]/55 rounded-full blur-[140px]" />
      </div>

      {/* TOP BAR (MATCHING FIGMA 865:1318) */}
      <header className="relative z-20 w-full max-w-[1300px] mx-auto px-6 pt-6 pb-2 flex items-center justify-between shrink-0">
        <div>
          <div className="text-xs sm:text-sm font-semibold text-white/70 tracking-wide">
            GummyGum.app {gameCode || '32679'}
          </div>
          <div className="text-base sm:text-lg font-bold text-white mt-0.5">
            Round {currentQ + 1} of {totalQuestions}
          </div>
        </div>

        {/* Orange Menu Button (Figma 865:1318) */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="w-11 h-11 rounded-2xl bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 text-white flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(255,138,61,0.4)] cursor-pointer"
          title="Settings"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* MAIN QUESTION & ANSWERS AREA */}
      <main className="relative z-10 flex-1 max-w-[1200px] w-full mx-auto px-6 py-4 flex flex-col items-center justify-center my-auto">
        
        {/* Question Headline */}
        <motion.h1
          key={q.q}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg sm:text-2xl md:text-3xl font-bold text-center text-white mb-4 sm:mb-6 max-w-3xl drop-shadow-md leading-snug"
        >
          {q.q}
        </motion.h1>

        {/* LAYOUT: SPLIT (PICTURE QUESTION) OR CENTERED (TEXT QUESTION) */}
        {hasImage ? (
          /* PICTURE QUESTION LAYOUT (MATCHING FIGMA 886:491 & 894:1237) */
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center mb-4 sm:mb-6">
            {/* Left Picture Card */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black/30 border border-white/10 shadow-xl max-h-[180px] sm:max-h-[220px] aspect-[4/3] mx-auto flex items-center justify-center">
              <img
                src={q.image || '/assets/figma/image3.png'}
                alt="Question Media"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right 2x2 Option Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {q.opts.map((opt, i) => renderOptionButton(opt, i))}
            </div>
          </div>
        ) : (
          /* STANDARD TEXT QUESTION LAYOUT (MATCHING FIGMA 865:1318 & 886:426) */
          <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {q.opts.map((opt, i) => renderOptionButton(opt, i))}
          </div>
        )}

        {/* CENTERED TIMER PROGRESS LINE WITH CIRCULAR BADGE (MATCHING FIGMA) */}
        <div className="relative w-full max-w-md flex items-center justify-center mt-1 px-4">
          {/* Progress Line */}
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / (gameConfig?.timerMode || 15)) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>

          {/* Centered Circular Timer Badge */}
          <div className="absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white bg-[#183944] text-white font-black text-base sm:text-lg flex items-center justify-center shadow-lg">
            {timeLeft.toString().padStart(2, '0')}
          </div>
        </div>

      </main>

      {/* FOOTER & HOST CONTROLS */}
      <footer className="relative z-20 w-full max-w-[1300px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Floating Host Toolbar on Bottom Left */}
        {isHost && (
          <HostToolbar
            onNextRound={() => { playSelect(); resolveQuestion(gameCode); }}
            onOpenSettings={() => setShowSettingsModal(true)}
            onTogglePictureMode={() => setIsPictureMode(!isPictureMode)}
            isPictureMode={isPictureMode}
            nextRoundLabel={currentQ + 1 >= totalQuestions ? "End & Scores" : "End & Scores"}
            showNewRound={true}
          />
        )}

        {/* GummyGum Watermark Badge on Bottom Right */}
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

    </div>
  );

  function renderOptionButton(opt, i) {
    const isSelected = chosenAnswer === i;
    const isCorrect = showResult && i === q.answer;
    const isWrong = showResult && isSelected && i !== q.answer;
    const style = optionStyles[i % 4];

    // Card styling matching Figma 865:1318 & 886:426
    let cardClass = `${style.bg} text-white shadow-xl`;

    if (answered) {
      if (isSelected) {
        cardClass += ' ring-4 ring-white scale-[1.02] shadow-2xl';
      } else if (!showResult) {
        cardClass += ' opacity-60';
      }
    }

    if (showResult) {
      if (isCorrect) {
        // Glowing orange-purple gradient border matching Figma 886:426
        cardClass += ' p-[3px] bg-gradient-to-r from-[#FF8A3D] via-[#A855F7] to-[#7C3AED] shadow-[0_0_30px_rgba(255,138,61,0.5)] scale-[1.03] z-10';
      } else {
        cardClass += ' opacity-40 grayscale-[20%]';
      }
    }

    return (
      <motion.button
        key={i}
        whileHover={!answered && !isSpectator ? { scale: 1.02 } : {}}
        whileTap={!answered && !isSpectator ? { scale: 0.98 } : {}}
        disabled={answered || isSpectator}
        onClick={() => {
          if (!answered && !isSpectator) playSelect();
          handleAnswer(i);
        }}
        className={`relative min-h-[52px] sm:min-h-[64px] md:min-h-[72px] rounded-2xl sm:rounded-[22px] p-3 sm:p-4 font-bold text-base sm:text-lg text-center transition-all cursor-pointer flex items-center justify-center shadow-md ${cardClass}`}
      >
        {/* Inner container to hold gradient border if correct */}
        {isCorrect && showResult ? (
          <div className="w-full h-full bg-[#183944] rounded-[18px] sm:rounded-[20px] flex items-center justify-center p-2 text-white">
            <span>{opt}</span>
          </div>
        ) : (
          <span>{opt}</span>
        )}
      </motion.button>
    );
  }
}
