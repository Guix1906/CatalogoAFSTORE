import { Home, Grid, Sparkles, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { configService } from '../../services/configService';

const navItems = [
  { to: '/', icon: Home, label: 'Início', end: true },
  { to: '/categorias', icon: Grid, label: 'Categorias', end: false },
  { to: '/novidades', icon: Sparkles, label: 'Novidades', end: false },
];

export default function BottomNav() {
  const [url, setUrl] = useState('');
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    configService.getWhatsAppUrl().then(setUrl).catch(() => {});
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-md border-t border-brand-gold/20 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors px-3 ${
                isActive ? 'text-brand-gold' : 'text-brand-text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <item.icon size={20} />
                </motion.div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.1em]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <a
          href={url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-brand-whatsapp px-3"
          aria-label="WhatsApp"
        >
          <div className="bg-brand-whatsapp/10 p-1.5 rounded-full">
            <MessageCircle size={20} fill="currentColor" fillOpacity={0.2} />
          </div>
          <span className="text-[9px] font-sans font-bold uppercase tracking-[0.1em]">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
