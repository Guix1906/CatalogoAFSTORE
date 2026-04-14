import { supabase } from '../integrations/supabase/client';
import { Product } from '../types';
import localProducts from '../data/products.json';

// Função ultra-segura de conversão
const mapProduct = (p: any): Product => ({
  id: String(p.id),
  name: String(p.name || 'Produto sem nome'),
  slug: String(p.slug || ''),
  category: (p.category || 'leggings') as any,
  price: Number(p.price || 0),
  originalPrice: p.original_price || p.originalPrice || undefined,
  discount: p.discount || undefined,
  images: Array.isArray(p.images) ? p.images : [],
  sizes: Array.isArray(p.sizes) ? p.sizes : ['P', 'M', 'G'],
  colors: Array.isArray(p.colors) ? p.colors : [],
  description: p.description || '',
  measurements: p.measurements || undefined,
  isNew: !!(p.is_new || p.isNew),
  isBestSeller: !!(p.is_best_seller || p.isBestSeller),
  isOnSale: !!(p.is_on_sale || p.isOnSale),
  active: p.active !== false,
  gender: (p.gender || 'feminino') as any,
  tags: Array.isArray(p.tags) ? p.tags : [],
  createdAt: p.created_at || p.createdAt || new Date().toISOString(),
});

export const productService = {
  async getActiveProducts(): Promise<Product[]> {
    try {
      // Inicia com os produtos locais para garantir exibição imediata
      const allItems: Product[] = (localProducts as any[]).map(mapProduct);

      // Tenta buscar novidades do Supabase
      const { data, error } = await supabase.from('products').select('*').eq('active', true);
      
      if (!error && data && data.length > 0) {
        const cloudItems = data.map(mapProduct);
        // Filtra para não duplicar IDs se o usuário já subiu os mesmos itens
        const cloudIds = new Set(cloudItems.map(i => i.id));
        return [...cloudItems, ...allItems.filter(i => !cloudIds.has(i.id))];
      }
      
      return allItems;
    } catch (err) {
      console.error('Erro de conexão, usando local:', err);
      return (localProducts as any[]).map(mapProduct);
    }
  },

  async getProducts(): Promise<Product[]> {
    return this.getActiveProducts();
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getActiveProducts();
    return products.find(p => p.id === id);
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getActiveProducts();
    return products.filter(p => p.category === category);
  },

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getActiveProducts();
    const q = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase.from('products').insert(product).select('*').single();
    if (error) throw error;
    return mapProduct(data);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase.from('products').update(product).eq('id', id).select('*').single();
    if (error) throw error;
    return mapProduct(data);
  },

  async deleteProduct(id: string): Promise<void> {
    await supabase.from('products').delete().eq('id', id);
  },

  async toggleProductActive(id: string, active: boolean): Promise<void> {
    await supabase.from('products').update({ active }).eq('id', id);
  },
};
