import CarAvatar from './CarAvatar';

export default function AvatarBadge({ src, color, onClick, size = "md", showTapToChange = true }) {
  const sizeClasses = size === "lg" 
    ? "w-36 h-36 md:w-44 md:h-44" 
    : size === "sm" 
      ? "w-20 h-20" 
      : "w-32 h-32 md:w-40 md:h-40";

  const imgSizeClasses = size === "lg" 
    ? "w-24 h-24 md:w-28 md:h-28" 
    : size === "sm" 
      ? "w-12 h-12" 
      : "w-20 h-20 md:w-24 md:h-24";

  return (
    <div 
      onClick={onClick}
      className={`relative ${sizeClasses} rounded-full bg-[#d92323] border-4 border-white/40 shadow-2xl overflow-hidden cursor-pointer group flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 select-none shrink-0`}
    >
      {/* Centered Avatar Graphic */}
      <div className={`${imgSizeClasses} ${showTapToChange ? '-mt-3' : ''} flex items-center justify-center`}>
        <CarAvatar src={src} color={color} className="w-full h-full" />
      </div>

      {/* Bottom Translucent Footer Bar for Tap to Change */}
      {showTapToChange && (
        <div className="absolute bottom-0 inset-x-0 bg-black/40 border-t border-white/15 py-1.5 md:py-2.5 text-center flex items-center justify-center">
          <span className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-wider leading-none drop-shadow-md">
            Tap to Change
          </span>
        </div>
      )}
    </div>
  );
}
