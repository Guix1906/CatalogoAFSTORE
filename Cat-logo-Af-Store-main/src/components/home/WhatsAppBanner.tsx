import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { configService } from '../../services/configService';

export default function WhatsAppBanner() {
  const handleWhatsApp = async () => {
    const url = await configService.getWhatsAppUrl();
    window.open(url, '_blank');
  };

  return (
    <section className="px-4 py-8">
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-brand-card border border-brand-border p-6 rounded-2xl flex items-center justify-between gap-4 group hover:border-brand-whatsapp transition-colors cursor-pointer block"
      >
        <div className="text-left space-y-1">
          <h3 className="text-lg font-serif font-bold text-brand-text">Dúvidas?</h3>
          <p className="text-xs text-brand-text-muted">Fale direto com a gente no WhatsApp</p>
        </div>
        <div className="bg-brand-whatsapp p-3 rounded-full text-white shadow-lg shadow-brand-whatsapp/20 group-hover:scale-110 transition-transform">
          <MessageCircle size={24} fill="currentColor" fillOpacity={0.2} />
        </div>
      </motion.a>
    </section>
  );
}
