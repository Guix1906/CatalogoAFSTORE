import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';
import { Product } from '../types';

type ProductRow = Tables<'products'>;

const PRODUCT_FIELDS = 'id, name, slug, category, price, original_price, discount, images, sizes, colors, description, measurements, is_new, is_best_seller, is_on_sale, active, gender, tags, created_at';

const toProduct = (row: ProductRow): Product => {
  const colors = Array.isArray(row.colors)
    ? (row.colors as Product['colors'])
    : undefined;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category as Product['category'],
    price: Number(row.price),
    originalPrice: row.original_price !== null ? Number(row.original_price) : undefined,
    discount: row.discount ?? undefined,
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    sizes: (row.sizes as Product['sizes']) || ['P', 'M', 'G'],
    colors,
    description: row.description || '',
    measurements: row.measurements ?? undefined,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    isOnSale: row.is_on_sale,
    active: row.active,
    gender: (row.gender as Product['gender']) || 'unissex',
    tags: row.tags || [],
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
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_FIELDS)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return (data || []).map(toProduct);
  },

  async getActiveProducts(page = 0, limit = 50): Promise<Product[]> {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_FIELDS)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return (data || []).map(toProduct);
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_FIELDS)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? toProduct(data) : undefined;
  },

  async getProductsByCategory(categorySlug: string, page = 0, limit = 50): Promise<Product[]> {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_FIELDS)
      .eq('active', true)
      .eq('category', categorySlug)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return (data || []).map(toProduct);
  },

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) return [];

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_FIELDS)
      .eq('active', true)
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return (data || []).map(toProduct);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const payload = sanitizePayload(product);
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select(PRODUCT_FIELDS)
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
      .select(PRODUCT_FIELDS)
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

