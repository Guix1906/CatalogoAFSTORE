import { products } from "@/data/products";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProductCard } from "@/components/product/ProductCard";

const Outlet = () => {
  const outletProducts = products.filter((product) => product.isOnSale);

  return (
    <PageWrapper>
      <div className="space-y-4">
        <h1 className="text-3xl text-gold">Outlet</h1>
        <p className="text-sm text-muted-foreground">Peças com preço especial por tempo limitado.</p>
        <div className="grid grid-cols-2 gap-3">
          {outletProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Outlet;