import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Sparkles, Coins, Gift } from 'lucide-react';
import FestiveLoader from './components/FestiveLoader';
import SupportModal from './components/SupportModal';
import LinkPreview from './components/LinkPreview';
import CreateLinkForm from './components/CreateLinkForm';
import SuccessView from './components/SuccessView';
import { api } from './services/api';

export default function App() {
  const [tngUrl, setTngUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [useGif, setUseGif] = useState(true);

  const requiredPrefix = "https://cdn.tngdigital.com.my/s/oauth2/index.html#/moneypacket?";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isValidTngUrl = tngUrl.startsWith(requiredPrefix) && 
                         (tngUrl.includes("packetId=") || tngUrl.includes("p=")) && 
                         (tngUrl.includes("packetId=") ? tngUrl.split("packetId=")[1]?.length > 5 : tngUrl.split("p=")[1]?.length > 5);

    if (!isValidTngUrl) {
      setError("Sila masukkan pautan TNG Money Packet yang sah (mesti mengandungi packetId).");
      return;
    }

    setLoading(true);
    try {
      const data = await api.createLink(tngUrl);
      if (data.id) {
        const baseUrl = `${window.location.origin}/k/${data.id}`;
        const fullUrl = useGif ? `${baseUrl}?hasGif=true` : baseUrl;
        setCreatedLink(fullUrl);
      } else {
        setError(data.error || "Gagal menjana pautan.");
      }
    } catch (error) {
      console.error('Error creating link:', error);
      setError(error instanceof Error ? error.message : "Ralat rangkaian. Sila cuba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-sans selection:bg-[#FF6321] selection:text-white overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Decorative Sparkles */}
      <div className="fixed top-20 left-[10%] w-2 h-2 bg-[#FF6321] rounded-full animate-pulse opacity-20" />
      <div className="fixed top-40 right-[15%] w-3 h-3 bg-[#FF6321] rounded-full animate-bounce opacity-10" />
      <div className="fixed bottom-20 left-[20%] w-2 h-2 bg-[#FF6321] rounded-full animate-pulse opacity-20" />
      <div className="fixed bottom-40 right-[10%] w-4 h-4 bg-[#FF6321] rounded-full animate-bounce opacity-10" />

      <main className="relative max-w-2xl mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6321] rounded-2xl mb-6 shadow-lg shadow-[#FF6321]/20">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Ka-ching Link
          </h1>
          <p className="text-lg text-[#1A1A1A]/60 max-w-md mx-auto">
            Jana pautan Duit Raya dengan pratonton media yang cantik.
          </p>
        </motion.div>

        <LinkPreview />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-black/5"
            >
              <FestiveLoader />
            </motion.div>
          ) : !createdLink ? (
            <CreateLinkForm 
              tngUrl={tngUrl}
              setTngUrl={(url) => {
                setTngUrl(url);
                if (error) setError(null);
              }}
              useGif={useGif}
              setUseGif={setUseGif}
              error={error}
              loading={loading}
              onSubmit={handleCreate}
            />
          ) : (
            <SuccessView 
              createdLink={createdLink}
              copied={copied}
              onCopy={copyToClipboard}
              onReset={() => setCreatedLink(null)}
            />
          )}
        </AnimatePresence>

        {/* Footer Decorative Elements */}
        <div className="mt-24 flex justify-center gap-12 opacity-20 grayscale">
          <Coins className="w-8 h-8" />
          <Gift className="w-8 h-8" />
          <Sparkles className="w-8 h-8" />
        </div>

        {/* Support Us Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white/50 backdrop-blur-sm border border-black/5 rounded-3xl p-8 max-w-sm mx-auto">
            <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Sokong Projek Ini</h3>
            <p className="text-xs text-[#1A1A1A]/50 leading-relaxed mb-6">
              Jika Ka-ching Link membantu anda memeriahkan lagi suasana Raya, jemputlah belanja kami "kopi" untuk terus mengekalkan servis ini.
            </p>
            <button 
              onClick={() => setShowSupportModal(true)}
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-black transition-all active:scale-95"
            >
              <Coins className="w-4 h-4 text-[#FFD700]" />
              Belanja Kopi
            </button>
            <p className="mt-4 text-[10px] text-[#1A1A1A]/30 italic">
              Terima kasih atas sokongan anda! Selamat Hari Raya! 🌙
            </p>
          </div>
        </motion.div>
      </main>

      <SupportModal 
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}
