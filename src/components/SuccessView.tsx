import React from 'react';
import { motion } from 'motion/react';
import { Check, Copy, Send } from 'lucide-react';

interface SuccessViewProps {
  createdLink: string;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({
  createdLink,
  copied,
  onCopy,
  onReset
}) => {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-black/5 text-center"
    >
      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-emerald-500" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Pautan Berjaya Dijana!</h2>
      <p className="text-[#1A1A1A]/60 mb-8">Sedia untuk dikongsi kepada keluarga dan rakan-rakan.</p>

      <div className="bg-[#F5F2ED] p-4 rounded-2xl mb-8 break-all font-mono text-sm text-[#FF6321]">
        {createdLink}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          animate={copied ? { scale: [1, 1.05, 1] } : {}}
          onClick={onCopy}
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white font-bold py-4 rounded-xl hover:bg-black transition-all"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Disalin!' : 'Salin Pautan'}
        </motion.button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-[#F5F2ED] text-[#1A1A1A] font-bold py-4 rounded-xl hover:bg-[#EBE8E3] transition-all active:scale-[0.98]"
        >
          Jana Baru
        </button>
      </div>

      <div className="mt-12 space-y-6 text-left">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]/40 flex items-center gap-2">
          <Send className="w-4 h-4" /> Tips Perkongsian
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[#FF6321]/10 text-[#FF6321] flex items-center justify-center shrink-0 font-bold text-sm">1</div>
            <p className="text-sm text-[#1A1A1A]/70">Tampal pautan di Threads atau WhatsApp.</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[#FF6321]/10 text-[#FF6321] flex items-center justify-center shrink-0 font-bold text-sm">2</div>
            <p className="text-sm text-[#1A1A1A]/70">Tunggu 3-5 saat sehingga kad pratinjau muncul secara automatik.</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-[#FF6321]/10 text-[#FF6321] flex items-center justify-center shrink-0 font-bold text-sm">3</div>
            <p className="text-sm text-[#1A1A1A]/70">Padam teks URL sebelum menghantar untuk paparan yang lebih bersih.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuccessView;
