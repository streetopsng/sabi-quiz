import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sliders,
  MoreHorizontal,
  Plus
} from 'lucide-react';

export default function HostToolbar({
  onNextRound,
  onOpenSettings,
  nextRoundLabel = "New Round",
  showNewRound = true
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // viewMode: 'collapsed' | 'vertical'
  const [viewMode, setViewMode] = useState('vertical');

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

      {viewMode === 'vertical' && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 p-3 rounded-3xl bg-[#142D38]/95 border border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-2xl bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white shadow-sm"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-2xl bg-[#FF8A3D] hover:bg-[#ff9752] active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white shadow-sm"
              title="Settings & Presenter Mode"
            >
              <Sliders size={18} />
            </button>
          )}

          {showNewRound && (
            <button
              onClick={onNextRound}
              className="py-3 px-2 rounded-2xl bg-gradient-to-b from-[#FF8A3D] to-[#F97316] hover:brightness-110 active:scale-95 text-white font-semibold text-xs transition-all cursor-pointer shadow-[0_4px_15px_rgba(255,138,61,0.4)] [writing-mode:vertical-lr] rotate-180"
              title={nextRoundLabel}
            >
              {nextRoundLabel}
            </button>
          )}

          <button
            onClick={() => setViewMode('collapsed')}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white/70"
            title="Collapse to (+)"
          >
            <MoreHorizontal size={18} />
          </button>
        </motion.div>
      )}
    </>
  );
}
