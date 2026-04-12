import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { name: 'Lançamentos', to: '/novidades' },
  { name: 'Feminino', to: '/categoria/feminino' },
  { name: 'Masculino', to: '/categoria/masculino' },
  { name: 'Outlet', to: '/categoria/ofertas' },
];

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-xs bg-brand-bg border-r border-brand-border z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-4 h-16 flex items-center justify-between border-b border-brand-border">
              <h2 className="font-serif font-bold text-brand-gold uppercase tracking-tight">Menu</h2>
              <button onClick={onClose} className="p-2 hover:bg-brand-card rounded-full transition-colors text-brand-text">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
              <ul className="space-y-2">
                {MENU_ITEMS.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-brand-card transition-colors text-left group"
                    >
                      <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-text group-hover:text-brand-gold transition-colors">
                        {item.name}
                      </span>
                      <ChevronRight size={18} className="text-brand-text-muted group-hover:text-brand-gold transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-8 border-t border-brand-border space-y-4">
              <div className="flex flex-col items-center">
                <h1 className="text-xl font-serif font-bold tracking-tighter text-brand-gold leading-none">
                  AF STORE
                </h1>
                <span className="text-[8px] uppercase tracking-[0.4em] text-brand-text-muted mt-1">
                  Fitness com estilo
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
