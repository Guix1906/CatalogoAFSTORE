export type ProductCategory = "feminino" | "masculino" | "conjuntos" | "leggings" | "tops";
export type ProductSize = "P" | "M" | "G" | "GG";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  sizes: ProductSize[];
  colors?: ProductColor[];
  description: string;
  measurements?: string;
  isNew: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  gender: "feminino" | "masculino" | "unissex";
  tags: string[];
  createdAt: string;
}
