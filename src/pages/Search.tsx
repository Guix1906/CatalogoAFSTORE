import { useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SearchBar } from "@/components/ui/SearchBar";
import { ProductCard } from "@/components/product/ProductCard";
import { useCatalogStore } from "@/store/catalog-store";

const SearchPage = () => {
  const { searchQuery, setSearchQuery } = useCatalogStore();

  const results = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  return (
    <PageWrapper>
      <div className="space-y-4">
        <h1 className="text-3xl text-gold">Busca</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} autoFocus />

        {searchQuery && results.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            {searchQuery ? (
              "Nenhum resultado encontrado."
            ) : (
              <>
                Comece digitando para ver resultados em tempo real.<br />
                Sugestões: <Link to="/categoria/feminino" className="text-gold">Feminino</Link>,{" "}
                <Link to="/categoria/masculino" className="text-gold">Masculino</Link>,{" "}
                <Link to="/novidades" className="text-gold">Novidades</Link>
              </>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default SearchPage;
