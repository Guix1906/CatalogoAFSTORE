import { useMemo } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import HeroBanner from '../components/home/HeroBanner';
import CategoryTabs from '../components/layout/CategoryTabs';
import ProductSection from '../components/home/ProductSection';
import WhatsAppBanner from '../components/home/WhatsAppBanner';
import { useActiveProducts, QUERY_KEYS } from '../hooks/useOptimizedQueries';
import { SectionSkeleton, HeroSkeleton } from '../components/layout/Skeletons';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

export default function Home() {
  const queryClient = useQueryClient();
  // Carrega apenas 20 para ter conteúdo suficiente mas sem pesar
  const { data: products, isLoading } = useActiveProducts(0, 20);

  const sections = useMemo(() => {
    if (!products || products.length === 0) return { bestSellers: [], newArrivals: [], onSale: [] };
    
    // Novidades: tenta filtrar por isNew, se vazio, pega os mais recentes
    const newItems = products.filter(p => p.isNew);
    const displayNew = newItems.length > 0 ? newItems : products;

    return {
      bestSellers: products.filter(p => p.isBestSeller).slice(0, 4),
      newArrivals: displayNew.slice(0, 6),
      onSale: products.filter(p => p.isOnSale).slice(0, 4)
    };
  }, [products]);


  // Prefetch de categorias comuns para navegação ultra-rápida (Native Feel)
  const handlePrefetch = (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.productsByCategory(slug),
      queryFn: () => productService.getProductsByCategory(slug, 0, 8),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <PageWrapper>
      <div className="pt-16"> {/* Spacer for fixed header */}
        <div onMouseEnter={() => handlePrefetch('leggings')}>
          <CategoryTabs />
        </div>
        
        {isLoading ? (
          <>
            <HeroSkeleton />
            <SectionSkeleton titleWidth="w-48" count={4} />
            <SectionSkeleton titleWidth="w-32" count={4} />
          </>
        ) : (
          <>
            <HeroBanner />
            
            {sections.newArrivals.length > 0 && (
              <ProductSection 
                title="Novidades" 
                products={sections.newArrivals} 
                layout="grid"
                viewAllLink="/novidades"
              />
            )}

            {sections.onSale.length > 0 && (
              <ProductSection 
                title="Promoções" 
                products={sections.onSale} 
                layout="grid"
                viewAllLink="/categoria/ofertas"
              />
            )}


          </>
        )}

        <WhatsAppBanner />
      </div>
    </PageWrapper>
  );
}


