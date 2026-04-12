import { products } from "@/data/products";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProductCard } from "@/components/product/ProductCard";

const NewArrivals = () => {
  const newProducts = products.filter((product) => product.isNew);

  return (
    <PageWrapper>
      <div className="space-y-4">
        <h1 className="text-3xl text-gold">Novidades</h1>
        <p className="text-sm text-muted-foreground">Peças recém-chegadas para atualizar seu treino.</p>
        <div className="grid grid-cols-2 gap-3">
          {newProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default NewArrivals;
