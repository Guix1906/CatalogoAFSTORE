import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
  horizontal?: boolean;
}

export const ProductSection = ({ title, products, horizontal }: ProductSectionProps) => (
  <section className="space-y-3">
    <h2 className="text-2xl text-gold">{title}</h2>
    {horizontal ? (
      <div className="flex gap-3 overflow-x-auto pb-1">
        {products.map((product, index) => (
          <div className="min-w-[190px] flex-1" key={product.id}>
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-3">
        {products.map((product, index) => (
          <ProductCard product={product} index={index} key={product.id} />
        ))}
      </div>
    )}
  </section>
);
