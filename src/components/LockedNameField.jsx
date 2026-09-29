import { Lock } from 'lucide-react';

export default function LockedNameField({ name }) {
  return (
    <div className="w-full flex flex-col items-center" aria-readonly="true">
      <div className="w-full border-b-[3px] sm:border-b-[4px] border-white/30 text-center text-xl sm:text-2xl md:text-3xl font-medium text-white pb-2 sm:pb-3 truncate">
        {name}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-white/50">
        <Lock size={12} />
        <span>Name set by your GummyGum invite</span>
      </p>
    </div>
  );
}
