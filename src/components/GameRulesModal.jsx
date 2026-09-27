import React from 'react';
import { motion } from 'framer-motion';

export default function GameRulesModal({ onConfirm, name }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-[#0D1E2B] border-2 border-white/15 rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-y-auto text-white"
      >
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7F36]/20 border border-[#FF7F36]/40 text-[#FF9E66] text-[11px] font-extrabold uppercase tracking-wider mb-2">
            Game Overview
          </div>
          <h3 className="text-2xl sm:text-[26px] font-black text-white tracking-tight">
            How Sabi Trivia Works
          </h3>
          <p className="text-xs sm:text-[13px] text-white/60 mt-1.5 leading-relaxed">
            Welcome{name ? `, ${name}` : ''}! Before you enter the room, here's what to expect in this experience.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-[#FF7F36]/20 text-[#FF9E66] font-black text-sm flex items-center justify-center shrink-0 border border-[#FF7F36]/30">
              1
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-white">Answer fast & accurately</div>
              <div className="text-[11.5px] text-white/60 mt-0.5 leading-snug">
                Multiple-choice trivia questions with a countdown timer. Faster correct answers earn maximum points!
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-[#FF7F36]/20 text-[#FF9E66] font-black text-sm flex items-center justify-center shrink-0 border border-[#FF7F36]/30">
              2
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-white">Build your streak bonus</div>
              <div className="text-[11.5px] text-white/60 mt-0.5 leading-snug">
                Chain correct answers together to unlock streak multipliers that supercharge your round score.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-[#FF7F36]/20 text-[#FF9E66] font-black text-sm flex items-center justify-center shrink-0 border border-[#FF7F36]/30">
              3
            </div>
            <div className="text-left">
              <div className="text-[13px] font-bold text-white">Climb the live leaderboard</div>
              <div className="text-[11.5px] text-white/60 mt-0.5 leading-snug">
                Watch rankings update live after each question and see who takes the trivia crown at the finish!
              </div>
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="p-3 bg-[#FF7F36]/10 border border-[#FF7F36]/25 rounded-xl text-left flex items-center gap-2.5 mb-6">
          <span className="text-base shrink-0">💡</span>
          <span className="text-[11.5px] text-[#FFB68D] font-medium leading-snug">
            <strong>Pro tip:</strong> Lock in your answer quickly! Points decrease as the round timer ticks down.
          </span>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={onConfirm}
          className="w-full py-3.5 text-sm sm:text-base font-bold rounded-xl bg-[#FF7F36] text-white shadow-[0_4px_20px_rgba(255,127,54,0.4)] hover:bg-[#e66f2c] transition-all cursor-pointer border border-white/20"
        >
          Got it, enter waiting room →
        </motion.button>
      </motion.div>
    </div>
  );
}
