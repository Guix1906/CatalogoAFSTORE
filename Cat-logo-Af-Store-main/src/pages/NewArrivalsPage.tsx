import PageWrapper from '../components/layout/PageWrapper';
import ProductCard from '../components/product/ProductCard';
import { useActiveProducts } from '../hooks/useOptimizedQueries';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { SectionSkeleton } from '../components/layout/Skeletons';
import { useMemo } from 'react';

export default function NewArrivalsPage() {
  const navigate = useNavigate();
  const { data: allProducts, isLoading } = useActiveProducts(0, 50);

  const newProducts = useMemo(() => {
    return (allProducts || []).filter(p => p.isNew);
  }, [allProducts]);

  return (
    <PageWrapper>
      <div className="sticky top-16 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border/40">
        <div className="px-4 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center text-brand-text bg-brand-card/50 border border-brand-border rounded-full hover:border-brand-gold transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-serif font-bold text-brand-gold uppercase tracking-tight">
            Novidades
          </h2>
        </div>
      </div>

      <div className="px-6 py-6 transition-all duration-300">
        <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] text-brand-text-muted">
          {isLoading ? 'Carregando...' : `${newProducts.length} Peças Exclusivas`}
        </span>
      </div>

      {isLoading ? (
        <div className="-mt-10">
          <SectionSkeleton titleWidth="w-0" count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-20">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!isLoading && newProducts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-brand-text-muted text-sm font-sans tracking-wide">Nenhum lançamento no momento.</p>
        </div>
      )}
    </PageWrapper>
  );
}

