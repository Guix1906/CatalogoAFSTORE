import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { ProductBadge } from "@/components/ui/product-badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.35, delay: index * 0.04 }}
    className="overflow-hidden rounded-2xl border border-border bg-card"
  >
    <Link to={`/produto/${product.id}`} className="block">
      <img src={product.images[0]} alt={product.name} loading="lazy" className="h-48 w-full object-cover" />
      <div className="space-y-2.5 p-4">
        <div className="flex gap-2">
          {product.isOnSale ? <ProductBadge type="oferta" /> : null}
          {product.isNew ? <ProductBadge type="novo" /> : null}
          {product.isBestSeller ? <ProductBadge type="mais-vendido" /> : null}
        </div>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</h3>
        <PriceDisplay price={product.price} originalPrice={product.originalPrice} discount={product.discount} />
        <p className="text-xs text-muted-foreground">Tamanhos: {product.sizes.join(" • ")}</p>
      </div>
    </Link>
  </motion.article>
);
