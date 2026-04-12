import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import Badge from '../ui/Badge';
import PriceDisplay from '../ui/PriceDisplay';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate(`/produto/${product.id}`)}
      className="group cursor-pointer bg-brand-card border border-brand-border rounded-lg overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestSeller && <Badge variant="gold">Mais Vendido</Badge>}
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-[11px] font-sans font-semibold text-brand-text uppercase tracking-wider line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[8px] font-sans font-normal text-brand-text-muted uppercase tracking-[0.15em]">
            {product.sizes.join(' | ')}
          </p>
        </div>
        
        <PriceDisplay 
          price={product.price} 
          originalPrice={product.originalPrice}
          discount={product.discount}
          className="mt-2"
        />
      </div>
    </motion.div>
  );
}
