import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { products, getCategoryLabel } from "@/data/products";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProductCard } from "@/components/product/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterBySize, sortProducts } from "@/lib/catalog";
import { useCatalogStore } from "@/store/catalog-store";

const filters = ["Todos", "P", "M", "G", "GG", "Promoção"] as const;

const Category = () => {
  const { slug = "" } = useParams();
  const [visibleCount, setVisibleCount] = useState(6);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { sizeFilter, setSizeFilter, sortBy, setSortBy } = useCatalogStore();

  const categoryProducts = useMemo(() => {
    const filtered = products.filter((product) => product.category === slug || (slug === "feminino" && product.gender === "feminino"));
    return sortProducts(filterBySize(filtered, sizeFilter), sortBy);
  }, [slug, sizeFilter, sortBy]);

  const visibleProducts = categoryProducts.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(6);
  }, [slug, sizeFilter, sortBy]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 4, categoryProducts.length));
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [categoryProducts.length]);

  return (
    <PageWrapper>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link to="/categorias" className="rounded-full border border-border p-2">
            <ChevronLeft size={16} />
          </Link>
          <h1 className="text-3xl text-gold">{getCategoryLabel(slug)}</h1>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSizeFilter(filter)}
              className={`rounded-full border px-4 py-1.5 text-xs ${
                sizeFilter === filter ? "border-gold bg-gold/20 text-gold" : "border-border bg-card"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className="border-gold/30 bg-card">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevancia">Relevância</SelectItem>
            <SelectItem value="menor-preco">Menor preço</SelectItem>
            <SelectItem value="maior-preco">Maior preço</SelectItem>
            <SelectItem value="novidades">Novidades</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-3">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div ref={sentinelRef} className="py-2 text-center text-xs text-muted-foreground">
          {visibleCount < categoryProducts.length ? "Carregando mais produtos..." : "Você chegou ao fim da categoria"}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Category;
