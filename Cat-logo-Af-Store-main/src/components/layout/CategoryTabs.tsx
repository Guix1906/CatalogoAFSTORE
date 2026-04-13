import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../../constants';

export default function CategoryTabs() {
  const tabs = [
    { name: 'Todos', slug: '' },
    ...CATEGORIES,
  ];

  return (
    <div className="sticky top-16 z-40 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border/50">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-6 py-4 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.slug}
            to={tab.slug === '' ? '/' : `/categoria/${tab.slug}`}
            end={tab.slug === ''}
            className={({ isActive }) => `
              px-6 py-2 rounded-full text-[10px] font-sans font-medium uppercase tracking-[0.2em] transition-all whitespace-nowrap border
              ${isActive 
                ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20 scale-105' 
                : 'bg-brand-card/50 border-brand-border/50 text-brand-text-muted hover:border-brand-gold/30'}
            `}
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
