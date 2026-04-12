import { Product } from '../../types';
import ProductCard from '../product/ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  layout?: 'grid' | 'scroll';
}

export default function ProductSection({ title, products, viewAllLink, layout = 'grid' }: ProductSectionProps) {
  return (
    <section className="py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-brand-gold tracking-tight">{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted flex items-center gap-1 hover:text-brand-gold transition-colors">
            Ver tudo <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {layout === 'grid' ? (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {products.map((product) => (
            <div key={product.id} className="min-w-[160px] w-[160px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
