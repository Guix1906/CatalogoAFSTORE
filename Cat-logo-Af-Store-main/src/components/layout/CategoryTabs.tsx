import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../../constants';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../hooks/useOptimizedQueries';
import { productService } from '../../services/productService';

const CategoryTabs = memo(function CategoryTabs() {
  const queryClient = useQueryClient();

  const tabs = [
    { name: 'Todos', slug: '' },
    ...CATEGORIES,
    { name: 'Promoções', slug: 'ofertas' }
  ];

  const handlePrefetch = (slug: string) => {
    if (!slug) return;
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.productsByCategory(slug),
      queryFn: () => productService.getProductsByCategory(slug, 0, 8),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <div className="sticky top-16 z-40 bg-brand-bg/95 border-b border-brand-border/40 backdrop-blur-sm">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.slug}
            to={tab.slug === '' ? '/' : `/categoria/${tab.slug}`}
            end={tab.slug === ''}
            onMouseEnter={() => handlePrefetch(tab.slug)}
            onTouchStart={() => handlePrefetch(tab.slug)}
            className={({ isActive }) => `
              px-6 py-2 rounded-full text-[10px] font-sans font-extrabold uppercase tracking-[0.2em] transition-all whitespace-nowrap border
              ${isActive 
                ? 'bg-brand-gold border-brand-gold text-black shadow-sm scale-105' 
                : 'bg-brand-card/50 border-brand-border/50 text-brand-text-muted active:border-brand-gold/50'}
            `}
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
});

export default CategoryTabs;


