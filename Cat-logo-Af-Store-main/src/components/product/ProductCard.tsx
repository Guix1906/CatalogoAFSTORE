import { memo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import PriceDisplay from '../ui/PriceDisplay';
import { Eye } from 'lucide-react';
import { getOptimizedImage } from '../../utils/imageOptimizer';

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => navigate(`/produto/${product.id}`)}
      className="group cursor-pointer flex flex-col h-full active:scale-[0.98] transition-transform"
    >
      {/* Image Block */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-brand-card border border-brand-border/40">
        <img
          src={getOptimizedImage(product.images[0], 400)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover will-change-transform"
          referrerPolicy="no-referrer"
        />

        {/* Simplificado para iPhone: menos overlays pesados */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none md:pointer-events-auto">
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full">
            <Eye size={12} />
            Ver Detalhes
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="bg-brand-gold text-black text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
              Top
            </span>
          )}
          {product.isOnSale && (
            <span className="bg-red-500 text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
              Oferta
            </span>
          )}
        </div>
      </div>

      {/* Info Block */}
      <div className="pt-2 px-0.5 flex-1 flex flex-col justify-between gap-1">
        <div>
          <h3 className="text-[11px] font-semibold text-white leading-snug line-clamp-1 tracking-wide uppercase">
            {product.name}
          </h3>
          {product.sizes && product.sizes.length > 0 && (
            <p className="text-[8px] font-medium text-[#777] uppercase tracking-widest mt-0.5">
              {product.sizes.slice(0, 3).join(' · ')}
            </p>
          )}
        </div>

        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
          className="mt-0.5"
          size="sm"
        />
      </div>
    </motion.div>
  );
});

export default ProductCard;


