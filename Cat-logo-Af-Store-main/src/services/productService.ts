import { supabase } from '../integrations/supabase/client';
import { Product } from '../types';
import localProducts from '../data/products.json';

const toProduct = (row: any): Product => {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    discount: row.discount || undefined,
    images: Array.isArray(row.images) ? row.images : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : ['P', 'M', 'G'],
    colors: Array.isArray(row.colors) ? row.colors : [],
    description: row.description || '',
    measurements: row.measurements || undefined,
    isNew: row.is_new ?? false,
    isBestSeller: row.is_best_seller ?? false,
    isOnSale: row.is_on_sale ?? false,
    active: row.active ?? true,
    gender: row.gender || 'feminino',
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
  };
};

const normalizeCategory = (cat: string) => {
  if (!cat) return 'leggings';
  return cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
};

const sanitizePayload = (product: Partial<Product>) => {
  const baseName = (product.name || '').trim();
  const slugFromName = baseName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return {
    name: (product.name || '').trim(),
    slug: (product.slug || slugFromName || `produto-${Date.now()}`).trim(),
    category: normalizeCategory(product.category as string),
    price: Number(product.price || 0),
    original_price: product.originalPrice ?? null,
    discount: product.discount ?? null,
    images: (product.images || []).filter(Boolean),
    sizes: (product.sizes || ['P', 'M', 'G']) as string[],
    colors: product.colors || [],
    measurements: product.measurements || null,
    is_new: Boolean(product.isNew),
    is_best_seller: Boolean(product.isBestSeller),
    is_on_sale: Boolean(product.isOnSale),
    active: product.active ?? true,
    gender: normalizeCategory(product.gender || 'feminino'),
    tags: (product.tags || []).filter(Boolean),
    description: product.description || '',
  };
};

export const productService = {
  async getProducts(page = 0, limit = 50): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) return data.map(toProduct);
      return (localProducts as any[]).map(p => ({ ...p, isNew: !!p.isNew, isBestSeller: !!p.isBestSeller, isOnSale: !!p.isOnSale }));
    } catch (err) {
      console.warn('Erro ao carregar lista completa, usando local:', err);
      return (localProducts as any[]).map(p => ({ ...p, isNew: !!p.isNew, isBestSeller: !!p.isBestSeller, isOnSale: !!p.isOnSale }));
    }
  },

  async getActiveProducts(page = 0, limit = 50): Promise<Product[]> {

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) return data.map(toProduct);

      return (localProducts as any[]).map(p => ({ ...p, isNew: !!p.isNew, isBestSeller: !!p.isBestSeller, isOnSale: !!p.isOnSale }));
    } catch (err) {
      console.warn('Usando catálogo local:', err);
      return (localProducts as any[]).map(p => ({ ...p, isNew: !!p.isNew, isBestSeller: !!p.isBestSeller, isOnSale: !!p.isOnSale }));
    }
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return (localProducts as any[]).find(p => p.id === id);
    }
    return toProduct(data);
  },

  async getProductsByCategory(category: string, page = 0, limit = 50): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return (localProducts as any[]).filter(p => p.category === category);
    }
    return data.map(toProduct);
  },

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) return [];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);

    if (error || !data || data.length === 0) {
      const q = query.toLowerCase();
      return (localProducts as any[]).filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return data.map(toProduct);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const payload = sanitizePayload(product);
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return toProduct(data);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const payload = sanitizePayload(product);
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return toProduct(data);
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  async toggleProductActive(id: string, active: boolean): Promise<void> {
    const { error } = await supabase.from('products').update({ active }).eq('id', id);
    if (error) throw error;
  },
};
