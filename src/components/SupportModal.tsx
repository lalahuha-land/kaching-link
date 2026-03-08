import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6">
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#F5F2ED] flex items-center justify-center hover:bg-[#EBE8E3] transition-colors"
              >
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6321]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Coins className="w-8 h-8 text-[#FF6321]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Terima Kasih!</h3>
              <p className="text-sm text-[#1A1A1A]/50 mb-8">
                Sokongan anda amat bermakna bagi kami. Sila imbas kod QR di bawah untuk belanja kami kopi.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="aspect-square max-w-[110px] sm:max-w-none mx-auto bg-[#F5F2ED] rounded-2xl p-3 border border-black/5">
                    <img 
                      src="/assets/kad-raya/touchngo-qr.png" 
                      alt="Touch 'n Go QR"
                      className="w-full h-full object-contain mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Touch 'n Go</p>
                </div>
                <div className="space-y-3">
                  <div className="aspect-square max-w-[110px] sm:max-w-none mx-auto bg-[#F5F2ED] rounded-2xl p-3 border border-black/5">
                    <img 
                      src="/assets/kad-raya/mae-qr.png" 
                      alt="MAE QR"
                      className="w-full h-full object-contain mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">MAE</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-10 w-full bg-[#F5F2ED] text-[#1A1A1A] font-bold py-4 rounded-xl hover:bg-[#EBE8E3] transition-all"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;
