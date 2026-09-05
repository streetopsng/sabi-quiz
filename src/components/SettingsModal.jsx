import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings = {}, onUpdateSettings }) {
  if (!isOpen) return null;

  const toggle = (key) => {
    if (onUpdateSettings) {
      onUpdateSettings({ ...settings, [key]: !settings[key] });
    }
  };

  const setDifficulty = (diff) => {
    if (onUpdateSettings) {
      onUpdateSettings({ ...settings, difficulty: diff });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-[580px] max-h-[90dvh] overflow-y-auto rounded-[32px] bg-gradient-to-b from-[#2B6071] via-[#244E5D] to-[#1C3E4A] p-7 sm:p-9 text-white shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/15"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white/80 hover:text-white"
            title="Close"
          >
            <X size={20} />
          </button>

          {/* Section: Player & mode */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-5 tracking-tight text-white">
              Player & mode
            </h2>

            <div className="space-y-4">
              {/* Team Mode */}
              <div className="flex items-center justify-between py-3 border-b border-white/15">
                <span className="text-base sm:text-lg font-medium text-white/90">Team Mode</span>
                <button
                  type="button"
                  onClick={() => toggle('teamMode')}
                  className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer p-1 ${
                    settings.teamMode ? 'bg-[#FF8A3D]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-6 h-6 rounded-full bg-white shadow-md ${
                      settings.teamMode ? 'ml-auto' : 'mr-auto'
                    }`}
                  />
                </button>
              </div>

              {/* Presenter mode */}
              <div className="flex items-center justify-between py-3 border-b border-white/15">
                <span className="text-base sm:text-lg font-medium text-white/90">
                  Presenter mode (share screen only)
                </span>
                <button
                  type="button"
                  onClick={() => toggle('presenterMode')}
                  className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer p-1 ${
                    settings.presenterMode ? 'bg-[#FF8A3D]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-6 h-6 rounded-full bg-white shadow-md ${
                      settings.presenterMode ? 'ml-auto' : 'mr-auto'
                    }`}
                  />
                </button>
              </div>

              {/* Show Questions on Players devices */}
              <div className="flex items-center justify-between py-3 border-b border-white/15">
                <span className="text-base sm:text-lg font-medium text-white/90">
                  Show Questions on Players devices
                </span>
                <button
                  type="button"
                  onClick={() => toggle('showQuestionsOnDevices')}
                  className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer p-1 ${
                    settings.showQuestionsOnDevices ? 'bg-[#FF8A3D]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-6 h-6 rounded-full bg-white shadow-md ${
                      settings.showQuestionsOnDevices ? 'ml-auto' : 'mr-auto'
                    }`}
                  />
                </button>
              </div>

              {/* Private Scoring (HR-safe) */}
              <div className="flex items-center justify-between py-3 border-b border-white/15">
                <span className="text-base sm:text-lg font-medium text-white/90">
                  Private Scoring (HR-safe)
                </span>
                <button
                  type="button"
                  onClick={() => toggle('privateScoring')}
                  className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer p-1 ${
                    settings.privateScoring ? 'bg-[#FF8A3D]' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-6 h-6 rounded-full bg-white shadow-md ${
                      settings.privateScoring ? 'ml-auto' : 'mr-auto'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Difficulty & Final round */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight text-white">
              Difficulty & Final round
            </h2>
            <div className="text-base sm:text-lg font-medium text-white/80 mb-4">
              Difficulty
            </div>

            {/* Pill Selector: Easy | Mixed | Hard */}
            <div className="inline-flex p-1.5 rounded-2xl bg-black/25 border border-white/10 gap-1">
              {['Easy', 'Mixed', 'Hard'].map((lvl) => {
                const isSelected = (settings.difficulty || 'Mixed').toLowerCase() === lvl.toLowerCase();
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`px-6 py-2.5 rounded-xl font-medium text-sm sm:text-base transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF8A3D] text-white shadow-md font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
