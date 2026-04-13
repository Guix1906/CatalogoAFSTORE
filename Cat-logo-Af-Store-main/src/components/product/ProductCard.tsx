import { memo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import PriceDisplay from '../ui/PriceDisplay';
import { Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.35 }}
      onClick={() => navigate(`/produto/${product.id}`)}
      className="group cursor-pointer flex flex-col h-full will-change-transform"
    >
      {/* Image Block */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-brand-card border border-brand-border/40 group-hover:border-brand-gold/30 transition-colors duration-300">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
          referrerPolicy="no-referrer"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full">
            <Eye size={12} />
            Ver Detalhes
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <span className="bg-brand-gold text-black text-[8px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full leading-none">
              Top
            </span>
          )}
          {product.isOnSale && (
            <span className="bg-red-500 text-white text-[8px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full leading-none">
              Oferta
            </span>
          )}
          {product.isNew && !product.isBestSeller && (
            <span className="bg-white/10 backdrop-blur border border-white/20 text-white text-[8px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full leading-none">
              New
            </span>
          )}
        </div>
      </div>

      {/* Info Block */}
      <div className="pt-3 px-0.5 flex-1 flex flex-col justify-between gap-1.5">
        <div>
          <h3 className="text-[12px] font-semibold text-white leading-snug line-clamp-2 tracking-wide">
            {product.name}
          </h3>
          {product.sizes && product.sizes.length > 0 && (
            <p className="text-[9px] font-medium text-[#888] uppercase tracking-widest mt-1">
              {product.sizes.slice(0, 4).join(' · ')}
            </p>
          )}
        </div>

        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
          className="mt-1"
        />
      </div>
    </motion.div>
  );
});

export default ProductCard;

