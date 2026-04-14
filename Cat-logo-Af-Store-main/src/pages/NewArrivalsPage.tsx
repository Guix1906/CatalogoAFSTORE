import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ProductCard from '../components/product/ProductCard';
import { useActiveProducts } from '../hooks/useOptimizedQueries';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { SectionSkeleton } from '../components/layout/Skeletons';

export default function NewArrivalsPage() {
  const navigate = useNavigate();
  // Forçamos o refetch para garantir que não estamos vendo cache antigo
  const { data: allProducts, isLoading, error } = useActiveProducts(0, 100);

  const displayProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    return allProducts;
  }, [allProducts]);

  if (error) {
    console.error('Erro na página de novidades:', error);
  }

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
            <span className="text-[8px] font-sans font-bold text-white/40 uppercase tracking-[0.1em]">Diagnostics Mode</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8">
          <SectionSkeleton titleWidth="w-0" count={8} />
        </div>
      ) : (
        <>
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-24 mt-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-6 px-10">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto opacity-50">
                 <AlertCircle size={32} className="text-red-500" />
              </div>
              <div className="space-y-2">
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Nenhum produto encontrado</p>
                <p className="text-[10px] text-brand-text-muted">
                  {error ? `Erro: ${(error as Error).message}` : 'O banco de dados retornou 0 produtos ativos.'}
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary !px-8 mt-4"
              >
                Tentar Novamente
              </button>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}

import { AlertCircle } from 'lucide-react';



