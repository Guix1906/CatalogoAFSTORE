import { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ProductCard from '../components/product/ProductCard';
import SearchBar from '../components/ui/SearchBar';
import { CATEGORIES } from '../constants';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function SearchPage() {
  const { searchQuery } = useStore();
  const [results, setResults] = useState<Product[]>([]);
  const [highlights, setHighlights] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (searchQuery.trim()) {
        const res = await productService.searchProducts(searchQuery);
        setResults(res);
      } else {
        const all = await productService.getActiveProducts();
        setHighlights(all.slice(0, 4));
      }
    };
    loadData();
  }, [searchQuery]);

  return (
    <PageWrapper>
      <div className="p-4 space-y-6">
        <SearchBar />

        {searchQuery ? (
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">
              {results.length} Resultados para "{searchQuery}"
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {results.length === 0 && (
              <div className="py-20 text-center text-brand-text-muted">
                Nenhum produto encontrado.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">
                Sugestões de Categorias
              </h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/categoria/${cat.slug}`}
                    className="px-4 py-2 bg-brand-card border border-brand-border rounded-full text-xs font-bold uppercase tracking-widest hover:border-brand-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">
                Destaques
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {highlights.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
