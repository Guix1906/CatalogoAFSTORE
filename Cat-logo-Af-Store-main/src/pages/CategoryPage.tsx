import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ProductCard from '../components/product/ProductCard';
import { CATEGORIES } from '../constants';
import { useInfiniteActiveProducts, useInfiniteProductsByCategory } from '../hooks/useOptimizedQueries';
import { ChevronLeft, SlidersHorizontal, Plus } from 'lucide-react';
import { SectionSkeleton } from '../components/layout/Skeletons';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedSize, setSelectedSize] = useState('Todos');

  const { 
    data: activeData, 
    isLoading: isLoadingActive, 
    fetchNextPage: fetchNextActive, 
    hasNextPage: hasNextActive,
    isFetchingNextPage: isFetchingActive 
  } = useInfiniteActiveProducts(8);

  const { 
    data: catData, 
    isLoading: isLoadingCat, 
    fetchNextPage: fetchNextCat, 
    hasNextPage: hasNextCat,
    isFetchingNextPage: isFetchingCat 
  } = useInfiniteProductsByCategory(slug !== 'ofertas' ? slug || '' : '', 8);

  const isLoading = slug === 'ofertas' ? isLoadingActive : isLoadingCat;
  const isFetchingNextPage = slug === 'ofertas' ? isFetchingActive : isFetchingCat;
  const hasNextPage = slug === 'ofertas' ? hasNextActive : hasNextCat;
  const fetchNextPage = slug === 'ofertas' ? fetchNextActive : fetchNextCat;

  const products = useMemo(() => {
    const data = slug === 'ofertas' ? activeData : catData;
    if (!data) return [];
    
    let allProducts = data.pages.flat();
    if (slug === 'ofertas') {
      allProducts = allProducts.filter(p => p.isOnSale);
    }
    return allProducts;
  }, [slug, activeData, catData]);

  const category = CATEGORIES.find(c => c.slug === slug);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedSize !== 'Todos') {
      result = result.filter(p => p.sizes.includes(selectedSize as any));
    }
    if (sortBy === 'price-asc') result = result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = result.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [products, sortBy, selectedSize]);

  const sizes = ['Todos', 'P', 'M', 'G', 'GG'];

  return (
    <PageWrapper>
      <div className="sticky top-16 z-40 bg-brand-bg/95 backdrop-blur-xl border-b border-brand-border/50">
        <div className="px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 flex items-center justify-center text-brand-text bg-brand-card/50 border border-brand-border rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-3xl font-serif font-bold text-brand-gold uppercase tracking-tight">
              {category?.name || (slug === 'ofertas' ? 'Ofertas' : 'Shop')}
            </h2>
          </div>
        </div>

        <div className="px-4 pb-5 flex gap-2 overflow-x-auto scrollbar-hide">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`
                px-5 py-2 rounded-full text-[9px] font-sans font-extrabold uppercase tracking-[0.2em] border transition-all whitespace-nowrap
                ${selectedSize === size 
                  ? 'bg-brand-gold border-brand-gold text-black shadow-sm' 
                  : 'bg-brand-card/50 border-brand-border/50 text-brand-text-muted'}
              `}
            >
              {size === 'Todos' ? 'All Sizes' : `Size: ${size}`}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="-mt-12">
          <SectionSkeleton titleWidth="w-0" count={8} />
        </div>
      ) : (
        <>
          <div className="px-6 py-8 flex items-center justify-between border-b border-brand-border/30 mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.2em] text-brand-text">
                {filteredProducts.length} Itens
              </span>
              <span className="text-[8px] font-sans font-medium text-brand-text-muted uppercase tracking-[0.1em]">Catalogo Ativo</span>
            </div>
            
            <div className="flex items-center gap-3 bg-brand-card/30 px-4 py-2 rounded-full border border-brand-border/50">
              <SlidersHorizontal size={12} className="text-brand-gold" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none text-[9px] font-sans font-extrabold uppercase tracking-[0.1em] text-brand-text cursor-pointer"
              >
                <option value="relevance">Featured</option>
                <option value="price-asc">Price: Low</option>
                <option value="price-desc">Price: High</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-12">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pb-20 px-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full max-w-xs py-4 flex items-center justify-center gap-2 bg-brand-card border border-brand-border rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold active:scale-95 hover:border-brand-gold transition-all"
              >
                {isFetchingNextPage ? (
                  <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus size={14} />
                    Carregar Mais Itens
                  </>
                )}
              </button>
            </div>
          )}


          {filteredProducts.length === 0 && (
            <div className="py-20 text-center space-y-6">
              <p className="text-sm font-sans text-brand-text-muted tracking-wide">Sem resultados nesta categoria.</p>
              <button 
                onClick={() => navigate('/')}
                className="btn-primary !px-8"
              >
                Ver Catálogo Geral
              </button>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}


