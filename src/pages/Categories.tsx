import { Link } from "react-router-dom";
import { categoryList, products } from "@/data/products";
import { PageWrapper } from "@/components/layout/PageWrapper";

const Categories = () => (
  <PageWrapper>
    <div className="space-y-4">
      <h1 className="text-3xl text-gold">Categorias</h1>
      <div className="grid grid-cols-2 gap-3">
        {categoryList
          .filter((category) => category.label !== "Promoções")
          .map((category) => {
            const count = products.filter((product) => product.category === category.slug).length;
            return (
              <Link
                key={category.slug}
                to={`/categoria/${category.slug}`}
                className="rounded-2xl border border-gold/25 bg-card p-4"
              >
                <span className="text-2xl">{category.icon}</span>
                <h2 className="mt-2 text-xl font-medium">{category.label}</h2>
                <p className="text-xs text-muted-foreground">{count} produtos</p>
              </Link>
            );
          })}
      </div>
    </div>
  </PageWrapper>
);

export default Categories;
