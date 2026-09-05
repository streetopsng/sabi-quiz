import CarAvatar from './CarAvatar';

export default function AvatarBadge({ src, color, onClick, size = "md", showTapToChange = true }) {
  const sizeClasses = size === "xl"
    ? "w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
    : size === "lg" 
      ? "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32" 
      : size === "sm" 
        ? "w-12 h-12 sm:w-14 sm:h-14" 
        : "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28";

  const imgSizeClasses = size === "xl"
    ? "w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28"
    : size === "lg" 
      ? "w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20" 
      : size === "sm" 
        ? "w-8 h-8" 
        : "w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18";

  return (
    <div 
      onClick={onClick}
      className={`relative ${sizeClasses} rounded-full bg-[#DF1919] border-4 border-white/40 shadow-2xl overflow-hidden cursor-pointer group flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 select-none shrink-0`}
    >
      {/* Centered Avatar Graphic */}
      <div className={`${imgSizeClasses} ${showTapToChange ? '-mt-4 md:-mt-5' : ''} flex items-center justify-center`}>
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
