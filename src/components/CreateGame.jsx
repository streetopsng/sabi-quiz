import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Type, BookOpen, Hash, Clock, Zap, Flame, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function CreateGame() {
  const { navigate, createGame } = useGame();
  const [sessionName, setSessionName] = useState('');
  
  const [topicPack, setTopicPack] = useState('General Knowledge');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [qCount, setQCount] = useState(20);
  const [timerMode, setTimerMode] = useState(15);
  const [bonusRounds, setBonusRounds] = useState(true);
  const [streakMultipliers, setStreakMultipliers] = useState(true);
  const [hardMode, setHardMode] = useState(false);

  const topics = [
    "General Knowledge",
    "African Business & Culture",
    "Tech & Innovation",
    "Company Values",
    "Sports & Entertainment"
  ];

  return (
    <motion.div 
      className="flex flex-col h-full max-w-[430px] md:max-w-3xl mx-auto bg-navy relative"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-amber/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="pt-12 px-5 pb-4 relative z-10">
        <button 
          onClick={() => navigate('home')}
          className="mb-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="text-[11px] tracking-[2px] uppercase text-amber font-semibold">Race Director</div>
        <h1 className="text-[28px] font-extrabold mt-1 text-white tracking-tight">Set up your game</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 relative z-10 pb-[100px]">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Card 1: Basics */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="mb-4">
            <label className="text-[13px] font-medium text-white/80 flex items-center gap-2 mb-2.5">
              <Type size={14} className="text-amber" /> Session name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Q3 Team Trivia" 
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl text-white text-[15px] py-3.5 px-4 outline-none focus:border-amber/60 focus:bg-white/5 transition-all"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-white/80 flex items-center gap-2 mb-2.5">
              <BookOpen size={14} className="text-amber" /> Topic pack
            </label>
            <div className="relative z-20">
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-black/20 border border-white/10 rounded-xl text-white text-[15px] py-3.5 px-4 cursor-pointer transition-all hover:bg-white/5 flex items-center justify-between"
              >
                <span>{topicPack}</span>
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
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 left-0 w-full bg-[#16213E] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="max-h-[220px] overflow-y-auto no-scrollbar py-1">
                        {topics.map((topic, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setTopicPack(topic);
                              setIsDropdownOpen(false);
                            }}
                            className={`px-4 py-3.5 text-[14px] cursor-pointer flex items-center justify-between transition-colors
                              ${topicPack === topic ? 'bg-amber/10 text-amber font-medium' : 'text-white/90 hover:bg-white/5'}
                            `}
                          >
                            {topic}
                            {topicPack === topic && <Check size={16} />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Card 2: Mechanics */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-md z-10 relative">
          <div className="mb-5">
            <label className="text-[13px] font-medium text-white/80 flex items-center gap-2 mb-3">
              <Hash size={14} className="text-amber" /> Number of questions
            </label>
            <div className="flex gap-2">
              {[10, 20, 30].map(val => (
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  key={val}
                  onClick={() => setQCount(val)}
                  className={`flex-1 py-3 rounded-xl border text-[14px] font-medium text-center cursor-pointer transition-all
                    ${qCount === val ? 'bg-amber text-[#1a1a00] border-amber shadow-lg shadow-amber/20' : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5'}
                  `}
                >
                  {val}
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium text-white/80 flex items-center gap-2 mb-3">
              <Clock size={14} className="text-amber" /> Timer mode
            </label>
            <div className="flex flex-col gap-2">
              {[
                { val: 15, label: 'Standard', desc: '15s per question' },
                { val: 10, label: 'Hard mode', desc: '10s per question' }
              ].map(m => (
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  key={m.val}
                  onClick={() => setTimerMode(m.val)}
                  className={`px-4 py-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between
                    ${timerMode === m.val ? 'bg-amber/10 border-amber/50' : 'bg-black/20 border-white/10 hover:bg-white/5'}
                  `}
                >
                  <div className={`text-[14px] font-medium ${timerMode === m.val ? 'text-amber' : 'text-white'}`}>{m.label}</div>
                  <div className={`text-[12px] ${timerMode === m.val ? 'text-amber/80' : 'text-muted'}`}>{m.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* Card 3: Advanced Rules */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          {[
            { id: 'bonus', label: 'Bonus rounds', sub: 'Random 2× point surprises', icon: Zap, color: '#f59e0b', state: bonusRounds, setter: setBonusRounds },
            { id: 'streak', label: 'Streak multipliers', sub: 'Reward consecutive correct answers', icon: Flame, color: '#ef4444', state: streakMultipliers, setter: setStreakMultipliers },
            { id: 'hard', label: 'Sudden death', sub: 'One wrong answer eliminates you', icon: ShieldAlert, color: '#8b5cf6', state: hardMode, setter: setHardMode },
          ].map((t, idx) => (
            <div key={t.id} className={`flex items-center justify-between py-4 px-4 ${idx !== 0 ? 'border-t border-white/5' : ''}`}>
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <t.icon size={16} color={t.color} />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-white">{t.label}</div>
                  <div className="text-[11px] text-white/50 mt-0.5">{t.sub}</div>
                </div>
              </div>
              <div 
                onClick={() => t.setter(!t.state)}
                className={`w-[46px] h-[26px] rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${t.state ? 'bg-amber' : 'bg-white/15'}`}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`absolute top-[3px] w-5 h-5 bg-white rounded-full shadow-sm ${t.state ? 'left-[23px]' : 'left-[3px]'}`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button area */}
      <div className="fixed md:absolute bottom-0 left-0 w-full p-5 pt-8 bg-gradient-to-t from-navy via-navy to-transparent z-30 pointer-events-none">
        <div className="max-w-[430px] md:max-w-3xl mx-auto pointer-events-auto">
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => createGame({
              sessionName,
              topicPack,
              qCount,
              timerMode,
              bonusRounds,
              streakMultipliers,
              hardMode
            })}
            className="w-full p-[18px] rounded-xl bg-amber text-[#1a1a00] text-[16px] font-extrabold tracking-[0.5px] uppercase border-none cursor-pointer shadow-[0_4px_20px_rgba(245,166,35,0.3)] flex items-center justify-center gap-2"
          >
            Create Room <Zap size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
