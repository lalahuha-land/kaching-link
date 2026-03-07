import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Coins } from 'lucide-react';

const FestiveLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 overflow-hidden relative min-h-[300px]">
      {/* Background Glow */}
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1] 
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-[#FF6321] rounded-full blur-[100px]"
      />

      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Flying Coins Animation */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: (Math.random() - 0.5) * 400, 
              y: (Math.random() - 0.5) * 400,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: 0, 
              y: 0,
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              rotate: 360
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut"
            }}
            className="absolute"
          >
            <div className="w-8 h-8 bg-[#FFD700] rounded-full border-2 border-[#E5591D] flex items-center justify-center shadow-lg">
              <Coins className="w-4 h-4 text-[#E5591D]" />
            </div>
          </motion.div>
        ))}

        {/* Central Collecting Point / Burst */}
        <motion.div
          animate={{ 
            scale: [0.8, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="relative z-10 w-20 h-20 bg-[#FF6321] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#FF6321]/40 border-4 border-white/20"
        >
          <Wallet className="w-10 h-10 text-white" />
          
          {/* Pulse Rings */}
          <motion.div
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 border-4 border-[#FF6321] rounded-[2rem]"
          />
        </motion.div>
      </div>

      <div className="mt-12 text-center relative z-10">
        <motion.h3
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl font-black text-[#FF6321] tracking-[0.2em] uppercase mb-2"
        >
          Ka-ching!
        </motion.h3>
        <p className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">
          Mengumpul Duit Raya...
        </p>
      </div>

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          animate={{ 
            y: [0, -100],
            x: (Math.random() - 0.5) * 100,
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 2 + 1, 
            repeat: Infinity, 
            delay: Math.random() * 2 
          }}
          className="absolute bottom-0 w-1 h-1 bg-[#FFD700] rounded-full"
          style={{ left: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
};

export default FestiveLoader;
