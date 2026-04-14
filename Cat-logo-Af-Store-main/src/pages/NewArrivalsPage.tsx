import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ProductCard from '../components/product/ProductCard';
import { useActiveProducts } from '../hooks/useOptimizedQueries';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { SectionSkeleton } from '../components/layout/Skeletons';

export default function NewArrivalsPage() {
  const navigate = useNavigate();
  const { data: allProducts, isLoading } = useActiveProducts(0, 100);

  const displayProducts = useMemo(() => {
    if (!allProducts) return [];
    
    // First priority: Items explicitly marked as new
    const markedNew = allProducts.filter(p => p.isNew);
    if (markedNew.length > 0) return markedNew;

    // Fallback: Show everything sorted by date (the newest items)
    return [...allProducts].sort((a, b) => 
      new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    );
  }, [allProducts]);


  return (
    <PageWrapper>
      <div className="sticky top-16 z-40 bg-brand-bg border-b border-white/5">
        <div className="px-5 h-20 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center text-white bg-[#181818] border border-white/10 rounded-full active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-[14px] font-sans font-black text-brand-gold uppercase tracking-[0.2em]">Novidades</h2>
            <span className="text-[8px] font-sans font-bold text-white/40 uppercase tracking-[0.1em]">Coleção Exclusiva</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 flex items-center justify-between border-b border-white/5 mb-8">
        <div className="flex items-center gap-2">
           <Sparkles size={14} className="text-brand-gold" />
           <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-white">
             {isLoading ? '...' : `${displayProducts.length} Lançamentos`}
           </span>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8">
          <SectionSkeleton titleWidth="w-0" count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-24">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!isLoading && displayProducts.length === 0 && (
        <div className="py-24 text-center space-y-6">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
             <Sparkles size={32} className="text-white" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-muted">Próxima drop em breve...</p>
        </div>
      )}
    </PageWrapper>
  );
}

