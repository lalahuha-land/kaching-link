import React from 'react';
import { motion } from 'motion/react';
import { Wallet } from 'lucide-react';

const LinkPreview = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <div className="text-center mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6321] bg-[#FF6321]/10 px-3 py-1 rounded-full">
          Pratonton Live
        </span>
      </div>
      
      <div className="relative max-w-sm mx-auto group">
        {/* Social Media Card Simulation */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-black/10 border border-black/5 transition-transform duration-500 group-hover:scale-[1.02]">
          {/* Image Header */}
          <div className="relative h-48 bg-[#FF6321] overflow-hidden flex items-center justify-center">
            {/* Animated Background Elements */}
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '20px 20px' }}
            />
            
            {/* Floating Wallet Icon (Simulating the GIF) */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotateY: [0, 180, 360],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-10 w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-black/20"
            >
              <Wallet className="w-12 h-12 text-[#FF6321]" />
            </motion.div>

            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.3,
                  ease: "easeInOut" 
                }}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{ 
                  top: `${Math.random() * 80 + 10}%`, 
                  left: `${Math.random() * 80 + 10}%` 
                }}
              />
            ))}
          </div>

          {/* Content Area */}
          <div className="p-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Aktif Sekarang</span>
            </div>
            <h3 className="text-xl font-extrabold mb-2 tracking-tight">Duit Raya untuk anda! 🧧</h3>
            <p className="text-sm text-[#1A1A1A]/50 leading-relaxed">
              Seseorang telah menghantar Duit Raya kepada anda! Klik untuk tuntut sekarang di Touch 'n Go eWallet.
            </p>
            
            <div className="mt-6 pt-6 border-t border-black/5 flex items-center justify-between">
              <span className="text-[10px] font-medium text-[#1A1A1A]/30 uppercase tracking-widest">kaching.asiss.my</span>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#F5F2ED] border-2 border-white" />
                <div className="w-6 h-6 rounded-full bg-[#FF6321]/20 border-2 border-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Shadow/Glow */}
        <div className="absolute -inset-4 bg-[#FF6321]/5 blur-3xl -z-10 rounded-full" />
      </div>
    </motion.div>
  );
};

export default LinkPreview;
