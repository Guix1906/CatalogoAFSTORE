import { Link } from "react-router-dom";
import { categoryList } from "@/data/products";

export const CategoryScroll = () => (
  <section>
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-2xl text-gold">Categorias</h2>
      <Link to="/categorias" className="text-xs text-muted-foreground transition-colors hover:text-gold">
        Ver todas
      </Link>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-1">
      {categoryList.map((category, index) => (
        <Link
          key={`${category.label}-${index}`}
          to={category.label === "Promoções" ? "/novidades" : `/categoria/${category.slug}`}
          className="min-w-[102px] rounded-2xl border border-border bg-card px-3 py-3 text-center transition-colors hover:border-gold/35"
        >
          <span className="block text-xl">{category.icon}</span>
          <span className="mt-1 block text-xs text-foreground/90">{category.label}</span>
        </Link>
      ))}
    </div>
  </section>
);
