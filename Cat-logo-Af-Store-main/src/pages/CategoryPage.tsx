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
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedSize, setSelectedSize] = useState('Todos');

  const category = CATEGORIES.find(c => c.slug === slug);

  useEffect(() => {
    const loadProducts = async () => {
      let result: Product[] = [];
      if (slug === 'ofertas') {
        const all = await productService.getActiveProducts();
        result = all.filter(p => p.isOnSale);
      } else if (slug) {
        result = await productService.getProductsByCategory(slug);
      }
      setProducts(result);
    };
    loadProducts();
  }, [slug]);
  
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
      <div className="sticky top-16 z-40 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border">
        <div className="px-4 h-14 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 text-brand-text">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-serif font-bold text-brand-gold uppercase tracking-tight">
            {category?.name || (slug === 'ofertas' ? 'Promoções' : 'Categoria')}
          </h2>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3 flex gap-3 overflow-x-auto scrollbar-hide">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`
                px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap
                ${selectedSize === size 
                  ? 'bg-brand-gold border-brand-gold text-brand-bg' 
                  : 'bg-brand-card border-brand-border text-brand-text-muted'}
              `}
            >
              Tam: {size}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">
          {filteredProducts.length} Produtos
        </span>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-text">
          <SlidersHorizontal size={14} />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent focus:outline-none"
          >
            <option value="relevance">Relevância</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="newest">Novidades</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 pb-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <p className="text-brand-text-muted">Nenhum produto encontrado nesta categoria.</p>
          <button 
            onClick={() => navigate('/')}
            className="text-brand-gold font-bold uppercase text-xs tracking-widest"
          >
            Voltar ao Início
          </button>
        </div>
      )}
    </PageWrapper>
  );
}
