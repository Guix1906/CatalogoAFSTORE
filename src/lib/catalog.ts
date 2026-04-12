import { Product } from "@/types/product";
import { SortOption } from "@/store/catalog-store";

export const sortProducts = (items: Product[], sortBy: SortOption) => {
  const sorted = [...items];
  if (sortBy === "menor-preco") return sorted.sort((a, b) => a.price - b.price);
  if (sortBy === "maior-preco") return sorted.sort((a, b) => b.price - a.price);
  if (sortBy === "novidades") return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return sorted.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
};

export const filterBySize = (items: Product[], sizeFilter: "Todos" | "P" | "M" | "G" | "GG" | "Promoção") => {
  if (sizeFilter === "Todos") return items;
  if (sizeFilter === "Promoção") return items.filter((item) => item.isOnSale);
  return items.filter((item) => item.sizes.includes(sizeFilter));
};
