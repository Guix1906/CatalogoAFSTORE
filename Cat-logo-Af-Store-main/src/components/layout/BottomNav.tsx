import { Home, Grid, Sparkles, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { useConfig } from '../../hooks/useOptimizedQueries';

const navItems = [
  { to: '/', icon: Home, label: 'Início', end: true },
  { to: '/categorias', icon: Grid, label: 'Categorias', end: false },
  { to: '/novidades', icon: Sparkles, label: 'Novidades', end: false },
];

export default function BottomNav() {
  const { data: config } = useConfig();
  const whatsappUrl = config ? `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}` : '';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-bg/95 border-t border-brand-border/40 pb-safe backdrop-blur-sm">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-all px-3 active:scale-90 ${
                isActive ? 'text-brand-gold' : 'text-brand-text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <span className="text-[9px] font-sans font-extrabold uppercase tracking-[0.1em]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-brand-whatsapp px-3 active:scale-90 transition-transform"
          aria-label="WhatsApp"
        >
          <div className="bg-brand-whatsapp/10 p-1.5 rounded-full">
            <MessageCircle size={20} fill="currentColor" fillOpacity={0.2} />
          </div>
          <span className="text-[9px] font-sans font-extrabold uppercase tracking-[0.1em]">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}

