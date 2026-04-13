import { useMemo } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import HeroBanner from '../components/home/HeroBanner';
import CategoryTabs from '../components/layout/CategoryTabs';
import ProductSection from '../components/home/ProductSection';
import WhatsAppBanner from '../components/home/WhatsAppBanner';
import { useActiveProducts } from '../hooks/useOptimizedQueries';
import { SectionSkeleton, HeroSkeleton } from '../components/layout/Skeletons';

export default function Home() {
  const { data: products, isLoading } = useActiveProducts(0, 50);

  const sections = useMemo(() => {
    if (!products) return { bestSellers: [], newArrivals: [], onSale: [] };
    
    return {
      bestSellers: products.filter(p => p.isBestSeller).slice(0, 4),
      newArrivals: products.filter(p => p.isNew).slice(0, 6),
      onSale: products.filter(p => p.isOnSale).slice(0, 4)
    };
  }, [products]);

  return (
    <PageWrapper>
      <div className="pt-16"> {/* Spacer for fixed header */}
        <CategoryTabs />
        
        {isLoading ? (
          <>
            <HeroSkeleton />
            <SectionSkeleton titleWidth="w-48" count={4} />
            <SectionSkeleton titleWidth="w-32" count={4} />
          </>
        ) : (
          <>
            <HeroBanner />
            
            {sections.bestSellers.length > 0 && (
              <ProductSection 
                title="Mais Vendidos" 
                products={sections.bestSellers} 
                layout="grid"
              />
            )}

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

