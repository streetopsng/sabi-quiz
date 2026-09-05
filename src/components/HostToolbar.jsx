import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Sliders, 
  Camera, 
  MoreHorizontal, 
  Plus, 
  X,
  Play
} from 'lucide-react';

export default function HostToolbar({
  onNextRound,
  onOpenSettings,
  onTogglePictureMode,
  isPictureMode = false,
  nextRoundLabel = "New Round",
  showNewRound = true
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // viewMode: 'horizontal' | 'collapsed' | 'vertical'
  const [viewMode, setViewMode] = useState('horizontal');

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* 1. COLLAPSED (+) FLOATING BUTTON */}
      {viewMode === 'collapsed' && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode('vertical')}
          className="fixed left-6 bottom-8 z-40 w-12 h-12 rounded-full bg-[#183642]/90 border border-white/20 text-white shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-md cursor-pointer hover:border-[#FF8A3D]/60 hover:text-[#FF8A3D] transition-all"
          title="Expand Host Controls"
        >
          <Plus size={22} />
        </motion.button>
      )}

      {/* 2. VERTICAL EXPANDED SIDEBAR (MATCHING FIGMA CHANGES SECTION) */}
      {viewMode === 'vertical' && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 p-3 rounded-3xl bg-[#142D38]/95 border border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          {/* Close button at top */}
          <button
            onClick={() => setViewMode('horizontal')}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white/80"
            title="Switch to Horizontal Bar"
          >
            <X size={18} />
          </button>

          <div className="w-6 h-[1px] bg-white/15 my-0.5" />

          {/* Sound */}
          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-2xl bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white shadow-sm"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {/* Settings / Presenter Mode */}
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-2xl bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white shadow-sm"
            title="Settings & Presenter Mode"
          >
            <Sliders size={18} />
          </button>

          {/* Picture Mode */}
          <button
            onClick={onTogglePictureMode}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer text-white shadow-sm ${
              isPictureMode ? 'bg-[#FF8A3D]' : 'bg-[#FF8A3D]/80 hover:bg-[#FF8A3D]'
            }`}
            title="Picture Question Toggle"
          >
            <Camera size={18} />
          </button>

          {/* Next / New Round */}
          {showNewRound && (
            <button
              onClick={onNextRound}
              className="py-3 px-2 rounded-2xl bg-gradient-to-b from-[#FF8A3D] to-[#F97316] hover:brightness-110 active:scale-95 text-white font-semibold text-xs transition-all cursor-pointer shadow-[0_4px_15px_rgba(255,138,61,0.4)] [writing-mode:vertical-lr] rotate-180"
              title={nextRoundLabel}
            >
              {nextRoundLabel}
            </button>
          )}

          {/* Collapse to (+) */}
          <button
            onClick={() => setViewMode('collapsed')}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white/70"
            title="Collapse to (+)"
          >
            <MoreHorizontal size={18} />
          </button>
        </motion.div>
      )}

      {/* 3. HORIZONTAL DOCK (FIGMA DEFAULT BOTTOM-LEFT BAR) */}
      {viewMode === 'horizontal' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed left-4 sm:left-8 bottom-4 sm:bottom-6 z-40 flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#163440]/90 border border-white/15 text-white shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-white/10 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white/90 hover:text-white"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white shadow-[0_4px_12px_rgba(255,138,61,0.35)]"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {/* Settings / Mode */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white shadow-[0_4px_12px_rgba(255,138,61,0.35)]"
            title="Settings"
          >
            <Sliders size={18} />
          </button>

          {/* Picture Mode Toggle */}
          <button
            onClick={onTogglePictureMode}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white shadow-[0_4px_12px_rgba(255,138,61,0.35)] ${
              isPictureMode ? 'bg-[#7C3AED]' : 'bg-[#FF8A3D] hover:bg-[#ff9752]'
            }`}
            title="Toggle Picture Question Mode"
          >
            <Camera size={18} />
          </button>

          {/* New Round button (if active) */}
          {showNewRound && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNextRound}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#F97316] text-white font-semibold text-xs sm:text-sm shadow-[0_4px_16px_rgba(255,138,61,0.45)] hover:shadow-[0_6px_22px_rgba(255,138,61,0.6)] transition-all cursor-pointer whitespace-nowrap"
            >
              {nextRoundLabel}
            </motion.button>
          )}

          {/* Collapse / More Options */}
          <button
            onClick={() => setViewMode('collapsed')}
            className="w-8 h-8 rounded-full bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white"
            title="Collapse to (+)"
          >
            <MoreHorizontal size={17} />
          </button>
        </motion.div>
      )}
    </>
  );
}
