import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playSelect } from '../utils/audio';

export default function CreateGame() {
  const { navigate, createGame, hostSettings, setHostSettings } = useGame();

  const [loading, setLoading] = useState(false);

  // Local settings bound to hostSettings
  const [settings, setSettings] = useState({
    teamMode: hostSettings?.teamMode || false,
    presenterMode: hostSettings?.presenterMode !== undefined ? hostSettings.presenterMode : true,
    showQuestionsOnDevices: hostSettings?.showQuestionsOnDevices !== undefined ? hostSettings.showQuestionsOnDevices : true,
    privateScoring: hostSettings?.privateScoring || false,
    difficulty: hostSettings?.difficulty || 'Mixed',
    topicPack: 'General Knowledge',
    qCount: 12,
    timerMode: 15
  });

  const toggle = (key) => {
    playSelect();
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    if (setHostSettings) setHostSettings(updated);
  };

  const setDifficulty = (lvl) => {
    playSelect();
    const updated = { ...settings, difficulty: lvl };
    setSettings(updated);
    if (setHostSettings) setHostSettings(updated);
  };

  const handleCreate = async () => {
    playSelect();
    setLoading(true);
    try {
      if (setHostSettings) setHostSettings(settings);
      await createGame(settings);
    } catch (err) {
      console.error('Failed to create game:', err);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#183944] text-white flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none font-poppins pb-10">
      
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

        <div 
          onClick={() => navigate('home')}
          className="cursor-pointer text-4xl sm:text-5xl font-black text-[#F4D06F] drop-shadow-md tracking-tight group"
        >
          <span className="group-hover:scale-105 inline-block transition-transform">sabi</span>
        </div>

        <div className="w-11" />
      </header>

      {/* MAIN CONTENT: FIGMA 854:892 "SETTINGS" CARD */}
      <main className="relative z-10 flex-1 max-w-[640px] w-full mx-auto px-6 py-6 flex flex-col items-center justify-center my-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-[#2B6071] via-[#244E5D] to-[#1C3E4A] p-5 sm:p-7 md:p-8 text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/15 backdrop-blur-xl"
        >
          {/* SECTION: PLAYER & MODE (EXACT MATCH FOR FIGMA 854:892) */}
          <div className="mb-6 sm:mb-7">
            <h2 className="text-xl sm:text-2xl font-extrabold mb-3 sm:mb-4 tracking-tight text-white">
              Player & mode
            </h2>

            <div className="space-y-2.5 sm:space-y-3">
              {/* Team Mode */}
              <div className="flex items-center justify-between py-2 sm:py-2.5 border-b border-white/15">
                <span className="text-sm sm:text-base font-medium text-white/90">Team Mode</span>
                <button
                  type="button"
                  onClick={() => toggle('teamMode')}
                  className={`relative w-12 sm:w-14 h-7 sm:h-8 rounded-full transition-colors cursor-pointer p-1 ${
                    settings.teamMode ? 'bg-[#FF8A3D]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-white shadow-md ${
                      settings.teamMode ? 'ml-auto' : 'mr-auto'
                    }`}
                  />
                </button>
              </div>

              {/* Presenter mode */}
              <div className="flex items-center justify-between py-2 sm:py-2.5 border-b border-white/15">
                <span className="text-sm sm:text-base font-medium text-white/90">
                  Presenter mode (share screen only)
                </span>
                <button
                  type="button"
                  onClick={() => toggle('presenterMode')}
                  className={`relative w-12 sm:w-14 h-7 sm:h-8 rounded-full transition-colors cursor-pointer p-1 ${
                    settings.presenterMode ? 'bg-[#FF8A3D]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-white shadow-md ${
                      settings.presenterMode ? 'ml-auto' : 'mr-auto'
                    }`}
                  />
                </button>
              </div>

              {/* Show Questions on Players devices */}
              <div className="flex items-center justify-between py-2 sm:py-2.5 border-b border-white/15">
                <span className="text-sm sm:text-base font-medium text-white/90">
                  Show Questions on Players devices
                </span>
                <button
                  type="button"
                  onClick={() => toggle('showQuestionsOnDevices')}
                  className={`relative w-12 sm:w-14 h-7 sm:h-8 rounded-full transition-colors cursor-pointer p-1 ${
                    settings.showQuestionsOnDevices ? 'bg-[#FF8A3D]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-white shadow-md ${
                      settings.showQuestionsOnDevices ? 'ml-auto' : 'mr-auto'
                    }`}
                  />
                </button>
              </div>

              {/* Private Scoring (HR-safe) */}
              <div className="flex items-center justify-between py-2 sm:py-2.5 border-b border-white/15">
                <span className="text-sm sm:text-base font-medium text-white/90">
                  Private Scoring (HR-safe)
                </span>
                <button
                  type="button"
                  onClick={() => toggle('privateScoring')}
                  className={`relative w-12 sm:w-14 h-7 sm:h-8 rounded-full transition-colors cursor-pointer p-1 ${
                    settings.privateScoring ? 'bg-[#FF8A3D]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-white shadow-md ${
                      settings.privateScoring ? 'ml-auto' : 'mr-auto'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION: DIFFICULTY & FINAL ROUND (EXACT MATCH FOR FIGMA 854:892) */}
          <div className="mb-6 sm:mb-7">
            <h2 className="text-xl sm:text-2xl font-extrabold mb-2.5 tracking-tight text-white">
              Difficulty & Final round
            </h2>
            <div className="text-sm sm:text-base font-medium text-white/80 mb-3">
              Difficulty
            </div>

            {/* Pill Selector: Easy | Mixed | Hard */}
            <div className="inline-flex p-1.5 rounded-2xl bg-black/25 border border-white/10 gap-1.5">
              {['Easy', 'Mixed', 'Hard'].map((lvl) => {
                const isSelected = (settings.difficulty || 'Mixed').toLowerCase() === lvl.toLowerCase();
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`px-5 sm:px-7 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF8A3D] text-white shadow-md font-bold'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LAUNCH TO LOBBY BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={handleCreate}
            className="w-full py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#F97316] text-white text-base sm:text-lg font-bold shadow-[0_8px_25px_rgba(255,138,61,0.4)] hover:shadow-[0_12px_35px_rgba(255,138,61,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Game Lobby...' : 'Continue to Lobby'}</span>
            {!loading && <ArrowRight size={18} />}
          </motion.button>

        </motion.div>

      </main>

      {/* FOOTER WATERMARK */}
      <footer className="relative z-20 w-full max-w-[1300px] mx-auto px-6 py-4 flex items-center justify-end">
        <img
          src="/assets/figma/gummygum_footer_badge.png"
          alt="GummyGum"
          className="h-6 object-contain opacity-75 hover:opacity-100 transition-opacity"
        />
      </footer>

    </div>
  );
}
