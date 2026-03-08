import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Info } from 'lucide-react';

interface CreateLinkFormProps {
  tngUrl: string;
  setTngUrl: (url: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const CreateLinkForm: React.FC<CreateLinkFormProps> = ({
  tngUrl,
  setTngUrl,
  error,
  loading,
  onSubmit
}) => {
  return (
    <motion.form
      key="form"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onSubmit={onSubmit}
      className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-black/5"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/40 mb-2 ml-1">
            Pautan TNG eWallet (Money Packet)
          </label>
          <input
            required
            type="url"
            value={tngUrl}
            onChange={(e) => setTngUrl(e.target.value)}
            placeholder="https://cdn.tngdigital.com.my/s/oauth2/index.html#/moneypacket?..."
            className={`w-full px-4 py-3 rounded-xl bg-[#F5F2ED] border-2 transition-all outline-none ${error ? 'border-red-500' : 'border-transparent focus:border-[#FF6321]'}`}
          />
          {error && (
            <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{error}</p>
          )}
        </div>

        <div className="p-4 bg-[#F5F2ED] rounded-2xl border border-black/5">
          <p className="text-sm font-bold text-[#1A1A1A]">Kad Pantun Hari Raya</p>
          <p className="text-[11px] text-[#1A1A1A]/50 mt-1">Setiap pautan akan pilih satu pantun raya secara rawak.</p>
        </div>

        <div className="pt-2">
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#FF6321] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF6321]/30 hover:bg-[#E5591D] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Jana Pautan Ka-ching
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-[#F5F2ED] rounded-2xl flex gap-3 items-start">
        <Info className="w-5 h-5 text-[#FF6321] shrink-0 mt-0.5" />
        <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">
          Hanya pautan rasmi <strong>Touch 'n Go eWallet Money Packet</strong> diterima untuk menjamin keselamatan dan kesahihan.
        </p>
      </div>
    </motion.form>
  );
};

export default CreateLinkForm;
