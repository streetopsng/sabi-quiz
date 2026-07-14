import { motion } from 'framer-motion';
import { Plus, Gamepad2, Trophy, Users, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { VEHICLES } from '../constants';

export default function Home() {
  const { navigate } = useGame();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="flex flex-col md:flex-row h-full max-w-[430px] md:max-w-5xl mx-auto justify-between md:justify-center md:items-center md:gap-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Dynamic Background */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-amber/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-50px] w-[200px] h-[200px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        className="flex-1 flex flex-col items-center md:items-start justify-center px-6 pt-16 pb-6 text-center md:text-left relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="relative">
          <h1 className="text-[72px] font-black tracking-[-4px] text-transparent bg-clip-text bg-gradient-to-br from-amber to-amber-dim leading-none drop-shadow-lg">
            SABI
          </h1>
          <div className="absolute -top-4 -right-6 text-[24px]">🏆</div>
        </motion.div>
        
        <motion.p variants={itemVariants} className="text-[16px] text-white/70 mt-4 leading-relaxed font-medium max-w-[280px] md:max-w-md">
          The premium trivia engine built for competitive corporate teams.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex gap-4 mt-8 justify-center md:justify-start">
          {VEHICLES.slice(0, 4).map((car, idx) => (
            <motion.img
              key={idx}
              src={car.icon}
              alt={car.name}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: idx * 0.2, ease: "easeInOut" }}
              className="w-16 h-16 drop-shadow-2xl object-contain"
            />
          ))}
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-3 mt-12 w-full">
          {[
            { icon: Trophy, val: '20+', label: 'Questions' },
            { icon: Users, val: 'Unlimited', label: 'Players' },
            { icon: Clock, val: '15s', label: 'Per answer' },
          ].map((stat, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center justify-center py-4 px-2 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-sm shadow-inner">
              <stat.icon size={16} className="text-amber/80 mb-2" />
              <div className="text-[18px] font-extrabold text-white leading-none mb-1">{stat.val}</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div 
        className="px-6 py-8 pb-12 flex flex-col gap-3 relative z-10 bg-gradient-to-t from-navy via-navy to-transparent md:bg-none md:w-[380px] md:shrink-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('create')}
          className="w-full p-[18px] rounded-2xl bg-gradient-to-r from-amber to-[#e69b19] text-[#1a1a00] text-[16px] font-extrabold tracking-[0.5px] uppercase border-none cursor-pointer shadow-[0_8px_30px_rgba(245,166,35,0.3)] flex items-center justify-center gap-2 transition-shadow hover:shadow-[0_8px_40px_rgba(245,166,35,0.4)]"
        >
          <Plus size={20} strokeWidth={3} /> Create Room
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('join')}
          className="w-full p-[18px] rounded-2xl bg-white/[0.04] border border-white/10 text-white text-[16px] font-bold cursor-pointer transition-all hover:bg-white/[0.08] hover:border-white/20 flex items-center justify-center gap-2 backdrop-blur-md"
        >
          <Gamepad2 size={20} /> Join Game
        </motion.button>
        <div className="text-[12px] text-white/40 text-center mt-3 font-medium tracking-wide">
          HR admins create · Everyone else joins
        </div>
      </motion.div>
    </motion.div>
  );
}
