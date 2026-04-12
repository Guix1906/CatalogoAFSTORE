import { useEffect, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import HeroBanner from '../components/home/HeroBanner';
import CategoryScroll from '../components/home/CategoryScroll';
import ProductSection from '../components/home/ProductSection';
import WhatsAppBanner from '../components/home/WhatsAppBanner';
import { productService } from '../services/productService';
import { Product } from '../types';

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [onSale, setOnSale] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const all = await productService.getActiveProducts();
      setBestSellers(all.filter(p => p.isBestSeller).slice(0, 4));
      setNewArrivals(all.filter(p => p.isNew).slice(0, 6));
      setOnSale(all.filter(p => p.isOnSale).slice(0, 4));
    };
    loadData();
  }, []);

  return (
    <PageWrapper>
      <HeroBanner />
      <CategoryScroll />
      
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
          layout="scroll"
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

      <WhatsAppBanner />
    </PageWrapper>
  );
}
