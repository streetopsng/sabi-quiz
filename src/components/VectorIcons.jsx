import React from 'react';

// 1. Target with Arrow Vector
export function TargetVector({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <circle cx="50" cy="50" r="42" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="8" />
      <circle cx="50" cy="50" r="30" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeWidth="6" />
      <circle cx="50" cy="50" r="18" fill="#ef4444" stroke="#ef4444" strokeWidth="6" />
      <circle cx="50" cy="50" r="6" fill="#ffffff" />
      <line x1="82" y1="18" x2="42" y2="58" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
      <path d="M72 16 L84 16 L84 28" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 2. Leather Briefcase Vector
export function BriefcaseVector({ className = "w-12 h-12" }) {
  return (
    <div className={`relative bg-[#3a2212] border-2 border-[#6b4224] rounded-xl shadow-2xl flex items-center justify-center ${className}`}>
      <div className="w-1/3 h-1/4 border-2 border-[#6b4224] border-b-0 rounded-t-lg absolute -top-[22%] left-1/2 -translate-x-1/2 bg-[#2d1a0e]" />
      <div className="w-1/4 h-1/3 bg-amber-500 rounded-sm shadow-inner border border-amber-600 flex items-center justify-center">
        <div className="w-1/3 h-1/2 bg-amber-900 rounded-xs" />
      </div>
    </div>
  );
}

// 3. Thinking Emoji Vector
export function ThinkingEmojiVector({ className = "w-12 h-12" }) {
  return (
    <div className={`rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-amber-600 flex flex-col items-center justify-center relative shadow-2xl ${className}`}>
      <div className="flex gap-1.5 mb-0.5 z-10">
        <div className="w-3 h-3 bg-black/80 rounded-full border border-black flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
        <div className="w-1.5 h-0.5 bg-black my-auto" />
        <div className="w-3 h-3 bg-black/80 rounded-full border border-black flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>
      <div className="text-base font-bold">🤔</div>
    </div>
  );
}

// 4. Checklist Clipboard Vector
export function ClipboardVector({ className = "w-12 h-16" }) {
  return (
    <div className={`bg-[#fef3c7] border-2 border-[#854d0e] rounded-xl p-1.5 shadow-2xl relative flex flex-col justify-around ${className}`}>
      <div className="w-1/2 h-3 bg-[#78350f] rounded-t-md mx-auto -mt-3.5 mb-1 shadow" />
      <div className="space-y-1">
        <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-xs flex items-center justify-center text-[7px] text-white font-bold">✓</div><div className="h-1.5 bg-[#78350f]/40 flex-1 rounded" /></div>
        <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-xs flex items-center justify-center text-[7px] text-white font-bold">✓</div><div className="h-1.5 bg-[#78350f]/40 flex-1 rounded" /></div>
        <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-xs flex items-center justify-center text-[7px] text-white font-bold">✓</div><div className="h-1.5 bg-[#78350f]/40 flex-1 rounded" /></div>
      </div>
    </div>
  );
}

// 5. Brain Mascot with Light Bulb Vector
export function BrainMascotVector({ className = "w-12 h-12" }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-xl animate-bounce">💡</div>
      <div className="text-2xl -mt-2">🧠</div>
    </div>
  );
}

// 6. Book Mascot with Magnifying Glass Vector
export function MascotBookVector({ className = "w-12 h-12" }) {
  return (
    <div className={`flex items-center justify-center text-3xl drop-shadow-md ${className}`}>
      🔍📖
    </div>
  );
}

// 7. Glowing Light Bulb Vector
export function LightBulbVector({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <path d="M50 15 C30 15 15 30 15 50 C15 62 23 72 32 78 L32 88 L68 88 L68 78 C77 72 85 62 85 50 C85 30 70 15 50 15 Z" fill="#facc15" stroke="#eab308" strokeWidth="4" />
      <path d="M36 88 L64 88 L60 98 L40 98 Z" fill="#94a3b8" />
      <path d="M42 40 C42 32 58 32 58 40 C58 55 42 55 42 65" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 8. Hand Holding Golden Trophy Vector
export function TrophyHandVector({ className = "w-16 h-20" }) {
  return (
    <div className={`flex flex-col items-center justify-center relative ${className}`}>
      <div className="text-4xl drop-shadow-2xl">🏆</div>
      <div className="text-2xl -mt-3">✊</div>
    </div>
  );
}

// 9. 3D Victory Podium Vector (1st, 2nd, 3rd)
export function PodiumVector({ className = "w-24 h-16" }) {
  return (
    <div className={`flex items-end justify-center gap-1 ${className}`}>
      <div className="w-1/3 h-2/3 bg-slate-400 border border-slate-300 rounded-t-lg flex items-center justify-center font-black text-xs text-white">2</div>
      <div className="w-1/3 h-full bg-amber-500 border border-amber-400 rounded-t-lg flex items-center justify-center font-black text-sm text-white shadow-lg">1</div>
      <div className="w-1/3 h-1/2 bg-amber-700 border border-amber-600 rounded-t-lg flex items-center justify-center font-black text-xs text-white">3</div>
    </div>
  );
}

// 10. Gold Medal Ribbon Vector
export function GoldMedalVector({ className = "w-10 h-10" }) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-amber-600 flex items-center justify-center shadow-lg text-sm font-black text-amber-900">
        🥇
      </div>
      <div className="flex gap-1 -mt-1">
        <div className="w-2 h-4 bg-red-600 rotate-12 rounded-b-xs" />
        <div className="w-2 h-4 bg-red-600 -rotate-12 rounded-b-xs" />
      </div>
    </div>
  );
}

// 11. Gold Star Vector
export function GoldStarVector({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#facc15" stroke="#eab308" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

// 12. Confetti Popper Vector
export function ConfettiPopperVector({ className = "w-10 h-10" }) {
  return (
    <div className={`text-3xl flex items-center justify-center ${className}`}>
      🎉
    </div>
  );
}

// 13. 3D Brain Vector
export function Brain3DVector({ className = "w-12 h-12" }) {
  return (
    <div className={`text-4xl flex items-center justify-center ${className}`}>
      🧠
    </div>
  );
}

// 14. Film Strip Vector
export function FilmStripVector({ className = "w-8 h-12" }) {
  return (
    <div className={`bg-black/80 border border-white/30 rounded-md p-1 flex flex-col justify-between ${className}`}>
      <div className="w-full h-2 bg-white/20 rounded-xs" />
      <div className="w-full h-2 bg-white/20 rounded-xs" />
      <div className="w-full h-2 bg-white/20 rounded-xs" />
    </div>
  );
}

// 15. Clapboard Vector
export function ClapboardVector({ className = "w-10 h-10" }) {
  return (
    <div className={`text-3xl flex items-center justify-center ${className}`}>
      🎬
    </div>
  );
}

// 16. Memoji Girl Avatar Vector
export function MemojiGirlVector({ className = "w-12 h-12" }) {
  return (
    <div className={`rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-2xl shadow-lg ${className}`}>
      👧🏽
    </div>
  );
}
