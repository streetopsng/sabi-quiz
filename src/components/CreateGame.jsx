import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Type, BookOpen, Hash, Clock, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import VectorDecor from './VectorDecor';
import { playSelect } from '../utils/audio';

export default function CreateGame() {
  const { navigate, createGame } = useGame();
  
  // Wizard page step (1, 2, 3)
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Form State
  const [sessionName, setSessionName] = useState('');
  const [topicPack, setTopicPack] = useState('General Knowledge');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [qCount, setQCount] = useState(20);
  const [timerMode, setTimerMode] = useState(15);
  
  // Mockup 2 Settings (Player & mode / Difficulty)
  const [teamMode, setTeamMode] = useState(false);
  const [presenterMode, setPresenterMode] = useState(true);
  const [showQuestionsOnDevices, setShowQuestionsOnDevices] = useState(true);
  const [privateScoring, setPrivateScoring] = useState(false);
  const [difficulty, setDifficulty] = useState('Mixed');

  // Rules & Host Options
  const [bonusRounds, setBonusRounds] = useState(true);
  const [streakMultipliers, setStreakMultipliers] = useState(true);
  const [hardMode, setHardMode] = useState(false);
  const [playAsContestant, setPlayAsContestant] = useState(true);
  const [hostName, setHostName] = useState('');

  const topics = [
    "General Knowledge",
    "African Business & Culture",
    "Tech & Innovation",
    "Company Values",
    "Sports & Entertainment"
  ];

  const handleNext = () => {
    playSelect();
    setDirection(1);
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    playSelect();
    setDirection(-1);
    if (step === 1) {
      navigate('home');
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  const pageVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 })
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0e1f29] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      <VectorDecor variant="teal" />

      {/* Top Header */}
      <header className="relative z-20 w-full px-4 sm:px-6 md:px-8 pt-5 pb-2 flex items-center justify-between shrink-0">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Step Progress Pill */}
        <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-amber-300">
          <span>Page {step} of 3</span>
        </div>

        <div className="w-10" />
      </header>

      {/* Main Scrollable Content Area */}
      <main className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-4 max-w-xl w-full mx-auto flex flex-col justify-between">
        
        {/* Card Section */}
        <div className="w-full my-auto py-2">
          <AnimatePresence custom={direction} mode="wait">
            
            {/* PAGE 1: Session & Topic Basics */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full bg-[#154b52]/90 border border-[#2b727b]/50 rounded-[32px] p-6 md:p-8 shadow-2xl backdrop-blur-md"
              >
                <div className="text-xs font-extrabold tracking-[2px] uppercase text-[#ff6f3c] mb-1">Step 1</div>
                <h2 className="text-2xl font-black text-white mb-6">Session & Topic Setup</h2>

                {/* Session Name */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-2">
                    <Type size={16} className="text-[#ff6f3c]" /> Session name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Q3 Team Trivia" 
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="w-full bg-black/30 border border-white/15 rounded-xl text-white text-base py-3.5 px-4 outline-none focus:border-[#ff6f3c] transition-all"
                  />
                </div>

                {/* Topic Pack */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-[#ff6f3c]" /> Topic pack
                  </label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-black/30 border border-white/15 rounded-xl text-white text-base py-3.5 px-4 cursor-pointer transition-all hover:bg-white/5 flex items-center justify-between"
                    >
                      <span>{topicPack}</span>
                      <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }}>
                        <ChevronDown size={18} className="text-white/60" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full mt-2 left-0 w-full bg-[#122b36] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          {topics.map((topic, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setTopicPack(topic);
                                setIsDropdownOpen(false);
                              }}
                              className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors ${topicPack === topic ? 'bg-[#ff6f3c]/20 text-[#ff6f3c] font-bold' : 'text-white/90 hover:bg-white/10'}`}
                            >
                              {topic}
                              {topicPack === topic && <Check size={16} />}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Questions Count */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-2">
                    <Hash size={16} className="text-[#ff6f3c]" /> Question count
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 20, 30].map(val => (
                      <button
                        key={val}
                        onClick={() => setQCount(val)}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${qCount === val ? 'bg-[#ff6f3c] border-[#ff6f3c] text-white shadow-lg' : 'bg-black/30 border-white/15 text-white/70 hover:bg-white/10'}`}
                      >
                        {val} Qs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timer Mode */}
                <div>
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-[#ff6f3c]" /> Timer mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 15, label: '15s Standard' },
                      { val: 10, label: '10s Speed' }
                    ].map(m => (
                      <button
                        key={m.val}
                        onClick={() => setTimerMode(m.val)}
                        className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${timerMode === m.val ? 'bg-[#ff6f3c] border-[#ff6f3c] text-white shadow-lg' : 'bg-black/30 border-white/15 text-white/70 hover:bg-white/10'}`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PAGE 2: Player & mode / Difficulty (EXACT MATCH FOR MOCKUP 2) */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full bg-[#154b52]/90 border border-[#2b727b]/50 rounded-[32px] p-6 md:p-8 shadow-2xl backdrop-blur-md"
              >
                {/* Section 1: Player & mode */}
                <h2 className="text-xl font-bold text-white mb-4">Player & mode</h2>
                <div className="space-y-4 mb-8">
                  {/* Item 1: Team Mode */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-base font-semibold text-white">Team Mode</span>
                    <button
                      onClick={() => setTeamMode(!teamMode)}
                      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${teamMode ? 'bg-[#ff6f3c]' : 'bg-white/20'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${teamMode ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Item 2: Presenter mode (share screen only) */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-base font-semibold text-white">Presenter mode (share screen only)</span>
                    <button
                      onClick={() => setPresenterMode(!presenterMode)}
                      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${presenterMode ? 'bg-[#ff6f3c]' : 'bg-white/20'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${presenterMode ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Item 3: Show Questions on Players devices */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-base font-semibold text-white">Show Questions on Players devices</span>
                    <button
                      onClick={() => setShowQuestionsOnDevices(!showQuestionsOnDevices)}
                      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${showQuestionsOnDevices ? 'bg-[#ff6f3c]' : 'bg-white/20'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${showQuestionsOnDevices ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Item 4: Private Scoring (HR-safe) */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-base font-semibold text-white">Private Scoring (HR-safe)</span>
                    <button
                      onClick={() => setPrivateScoring(!privateScoring)}
                      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${privateScoring ? 'bg-[#ff6f3c]' : 'bg-white/20'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${privateScoring ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                {/* Section 2: Difficulty & Final round */}
                <h2 className="text-xl font-bold text-white mb-3">Difficulty & Final round</h2>
                <div className="mb-2">
                  <label className="text-sm font-medium text-white/80 block mb-3">Difficulty</label>
                  <div className="bg-[#102b36] p-1.5 rounded-full flex gap-1 border border-white/10">
                    {['Easy', 'Mixed', 'Hard'].map(d => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${difficulty === d ? 'bg-[#ff6f3c] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PAGE 3: Rules & Host Launch */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full bg-[#154b52]/90 border border-[#2b727b]/50 rounded-[32px] p-6 md:p-8 shadow-2xl backdrop-blur-md"
              >
                <div className="text-xs font-extrabold tracking-[2px] uppercase text-[#ff6f3c] mb-1">Step 3</div>
                <h2 className="text-2xl font-black text-white mb-6">Race Modifiers & Host Details</h2>

                <div className="space-y-4 mb-6">
                  {/* Bonus rounds */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <div className="text-base font-semibold text-white">Bonus rounds</div>
                      <div className="text-xs text-white/60">Random 2x point surprises</div>
                    </div>
                    <button
                      onClick={() => setBonusRounds(!bonusRounds)}
                      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${bonusRounds ? 'bg-[#ff6f3c]' : 'bg-white/20'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${bonusRounds ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Streak multipliers */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <div className="text-base font-semibold text-white">Streak multipliers</div>
                      <div className="text-xs text-white/60">Reward consecutive correct answers</div>
                    </div>
                    <button
                      onClick={() => setStreakMultipliers(!streakMultipliers)}
                      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${streakMultipliers ? 'bg-[#ff6f3c]' : 'bg-white/20'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${streakMultipliers ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Sudden death */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <div className="text-base font-semibold text-white">Sudden death</div>
                      <div className="text-xs text-white/60">One wrong answer eliminates contestant</div>
                    </div>
                    <button
                      onClick={() => setHardMode(!hardMode)}
                      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${hardMode ? 'bg-[#ff6f3c]' : 'bg-white/20'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${hardMode ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Host nickname */}
                  <div className="pt-2">
                    <label className="text-sm font-semibold text-white/90 block mb-2">Host Nickname</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Race Director" 
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      className="w-full bg-black/30 border border-white/15 rounded-xl text-white text-base py-3 px-4 outline-none focus:border-[#ff6f3c] transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Action Buttons Placed Inside Main Scrollable Area */}
        <div className="w-full pt-4 pb-6 flex items-center gap-4 shrink-0">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleNext}
              className="flex-1 py-4 rounded-xl bg-[#ff6f3c] text-white text-base font-extrabold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:bg-[#e65c2b] transition-all cursor-pointer"
            >
              Next Step <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                playSelect();
                createGame({
                  sessionName,
                  topicPack,
                  qCount,
                  timerMode,
                  teamMode,
                  presenterMode,
                  showQuestionsOnDevices,
                  privateScoring,
                  difficulty,
                  bonusRounds,
                  streakMultipliers,
                  hardMode,
                  playAsContestant,
                  hostName
                });
              }}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#ff6b4a] via-[#f75270] to-[#9333ea] text-white text-base font-extrabold uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
            >
              Create Room <Zap size={18} />
            </motion.button>
          )}
        </div>
      </main>
    </div>
  );
}
