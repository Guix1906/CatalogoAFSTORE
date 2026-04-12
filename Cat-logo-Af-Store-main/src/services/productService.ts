import { Product } from '../types';
import productsData from '../data/products.json';

// Abstracting data access to make it easy to swap for Supabase later
export const productService = {
  async getProducts(): Promise<Product[]> {
    // In the future, this will be: return supabase.from('products').select('*')
    return productsData as Product[];
  },

  async getActiveProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(p => p.active);
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const products = await this.getActiveProducts();
    return products.filter(p => p.category === categorySlug);
  },

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getActiveProducts();
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }
};
