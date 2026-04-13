import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ProductCard from '../components/product/ProductCard';
import { CATEGORIES } from '../constants';
import { productService } from '../services/productService';
import { Product } from '../types';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedSize, setSelectedSize] = useState('Todos');

  const category = CATEGORIES.find(c => c.slug === slug);
  const isOffersPage = slug === 'ofertas';
  const isInvalidCategory = Boolean(slug) && !category && !isOffersPage;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let result: Product[] = [];

        if (isInvalidCategory) {
          setProducts([]);
          return;
        }

        if (slug === 'ofertas') {
          const all = await productService.getActiveProducts();
          result = all.filter(p => p.isOnSale);
        } else if (slug) {
          result = await productService.getProductsByCategory(slug);
        }
        setProducts(result);
      } catch (err) {
        setPageError(err instanceof Error ? err.message : 'Falha ao carregar categoria.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [slug, isInvalidCategory]);
  
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

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (pageError) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-brand-text-muted">{pageError}</p>
          <button onClick={() => navigate('/')} className="btn-primary !px-6 !py-3 !text-[10px]">Voltar ao catálogo</button>
        </div>
      </PageWrapper>
    );
  }

  if (isInvalidCategory) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-brand-text-muted">Categoria não encontrada.</p>
          <button onClick={() => navigate('/categorias')} className="btn-primary !px-6 !py-3 !text-[10px]">Ver categorias</button>
        </div>
      </PageWrapper>
    );
  }

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

        {/* Technical Filter Chips */}
        <div className="px-4 pb-5 flex gap-2 overflow-x-auto scrollbar-hide">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`
                px-5 py-2 rounded-full text-[9px] font-sans font-extrabold uppercase tracking-[0.2em] border transition-all whitespace-nowrap
                ${selectedSize === size 
                  ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20' 
                  : 'bg-brand-card/50 border-brand-border/50 text-brand-text-muted hover:border-brand-gold/50'}
              `}
            >
              {size === 'Todos' ? 'All Sizes' : `Size: ${size}`}
            </button>
          ))}
        </div>
      </div>

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
            <option value="relevance">Sort By: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Arrival Date</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 px-4 pb-20">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-32 text-center space-y-6">
          <div className="bg-brand-card/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-border/50">
             <SlidersHorizontal className="text-brand-text-muted opacity-30" size={24} />
          </div>
          <p className="text-sm font-sans text-brand-text-muted tracking-wide">Busca sem resultados nesta categoria.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary !px-8"
          >
            Ver Catálogo Geral
          </button>
        </div>
      )}
    </PageWrapper>
  );
}
