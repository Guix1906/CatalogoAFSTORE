import { create } from "zustand";

export type SortOption = "relevancia" | "menor-preco" | "maior-preco" | "novidades";

interface CatalogState {
  searchQuery: string;
  sizeFilter: "Todos" | "P" | "M" | "G" | "GG" | "Promoção";
  sortBy: SortOption;
  setSearchQuery: (value: string) => void;
  setSizeFilter: (value: CatalogState["sizeFilter"]) => void;
  setSortBy: (value: SortOption) => void;
  resetFilters: () => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  searchQuery: "",
  sizeFilter: "Todos",
  sortBy: "relevancia",
  setSearchQuery: (value) => set({ searchQuery: value }),
  setSizeFilter: (value) => set({ sizeFilter: value }),
  setSortBy: (value) => set({ sortBy: value }),
  resetFilters: () => set({ sizeFilter: "Todos", sortBy: "relevancia" }),
}));
