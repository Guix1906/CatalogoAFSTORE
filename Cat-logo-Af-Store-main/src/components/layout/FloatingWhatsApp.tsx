import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { configService } from '../../services/configService';

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 120);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleOpenWhatsApp = async () => {
    await configService.openWhatsApp();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={handleOpenWhatsApp}
          className="fixed right-4 bottom-24 z-50 bg-brand-whatsapp text-brand-text w-14 h-14 rounded-full border border-brand-border shadow-xl shadow-brand-whatsapp/20 flex items-center justify-center"
          aria-label="Abrir WhatsApp"
        >
          <MessageCircle size={24} fill="currentColor" fillOpacity={0.2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}