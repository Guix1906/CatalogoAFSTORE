import { Home, Grid, Sparkles, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { configService } from '../../services/configService';

export default function BottomNav() {
  const [url, setUrl] = useState('');
  const navItems = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/categorias', icon: Grid, label: 'Categorias' },
    { to: '/novidades', icon: Sparkles, label: 'Novidades' },
  ];

  useEffect(() => {
    configService.getWhatsAppUrl().then(setUrl);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-bg border-t border-brand-gold/20 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 transition-colors
              ${isActive ? 'text-brand-gold' : 'text-brand-text-muted'}
            `}
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <item.icon size={20} />
                </motion.div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.1em]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <a
          href={url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { if (!url) e.preventDefault(); }}
          className="flex flex-col items-center gap-1 text-brand-whatsapp relative"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-brand-whatsapp/10 p-1.5 rounded-full"
          >
            <MessageCircle size={20} fill="currentColor" fillOpacity={0.2} />
          </motion.div>
          <span className="text-[9px] font-sans font-bold uppercase tracking-[0.1em]">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
