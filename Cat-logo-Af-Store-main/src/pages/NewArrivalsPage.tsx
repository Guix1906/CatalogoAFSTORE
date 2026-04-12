import { useEffect, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function NewArrivalsPage() {
  const navigate = useNavigate();
  const [newProducts, setNewProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const all = await productService.getActiveProducts();
      setNewProducts(all.filter(p => p.isNew));
    };
    loadData();
  }, []);

  return (
    <PageWrapper>
      <div className="sticky top-16 z-40 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border">
        <div className="px-4 h-14 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 text-brand-text">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-serif font-bold text-brand-gold uppercase tracking-tight">
            Novidades
          </h2>
        </div>
      </div>

      <div className="px-4 py-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">
          {newProducts.length} Lançamentos
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 pb-8">
        {newProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PageWrapper>
  );
}
