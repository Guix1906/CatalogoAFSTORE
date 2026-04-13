import { useEffect, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import HeroBanner from '../components/home/HeroBanner';
import CategoryTabs from '../components/layout/CategoryTabs';
import ProductSection from '../components/home/ProductSection';
import WhatsAppBanner from '../components/home/WhatsAppBanner';
import { productService } from '../services/productService';
import { Product } from '../types';

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [onSale, setOnSale] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const all = await productService.getActiveProducts();
        if (active) {
          setBestSellers(all.filter(p => p.isBestSeller).slice(0, 4));
          setNewArrivals(all.filter(p => p.isNew).slice(0, 6));
          setOnSale(all.filter(p => p.isOnSale).slice(0, 4));
          setIsLoading(false);
        }
      } catch (error) {
        if (active) setIsLoading(false);
      }
    };
    loadData();
    
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageWrapper>
      <div className="pt-16"> {/* Spacer for fixed header */}
        <CategoryTabs />
        <HeroBanner />
        
        {isLoading ? (
          <div className="py-8 px-4 space-y-12">
            <div className="space-y-4">
              <div className="h-6 w-48 bg-brand-card/50 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-brand-card/30 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-32 bg-brand-card/50 rounded animate-pulse" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 w-[160px] flex-shrink-0 bg-brand-card/30 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {bestSellers.length > 0 && (
              <ProductSection 
                title="Mais Vendidos" 
                products={bestSellers} 
                layout="grid"
              />
            )}

            {newArrivals.length > 0 && (
              <ProductSection 
                title="Novidades" 
                products={newArrivals} 
                layout="grid"
                viewAllLink="/novidades"
              />
            )}

            {onSale.length > 0 && (
              <ProductSection 
                title="Promoções" 
                products={onSale} 
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
