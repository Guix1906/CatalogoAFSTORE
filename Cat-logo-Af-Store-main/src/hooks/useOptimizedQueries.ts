import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { configService } from '../services/configService';
import { Product } from '../types';

// Keys
export const QUERY_KEYS = {
  products: ['products'] as const,
  activeProducts: ['products', 'active'] as const,
  productsByCategory: (category: string) => ['products', 'category', category] as const,
  product: (id: string) => ['product', id] as const,
  config: ['config'] as const,
  search: (query: string) => ['products', 'search', query] as const,
};

// Hooks
export const useProducts = (page = 0, limit = 50) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, { page, limit }],
    queryFn: () => productService.getProducts(page, limit),
  });
};

export const useActiveProducts = (page = 0, limit = 50) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.activeProducts, { page, limit }],
    queryFn: () => productService.getActiveProducts(page, limit),
  });
};

export const useProductsByCategory = (category: string, page = 0, limit = 50) => {
  return useQuery({
    queryKey: QUERY_KEYS.productsByCategory(category),
    queryFn: () => productService.getProductsByCategory(category, page, limit),
    enabled: !!category,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useConfig = () => {
  return useQuery({
    queryKey: QUERY_KEYS.config,
    queryFn: () => configService.getConfig(),
    staleTime: 1000 * 60 * 60, // Config rarely changes, cache for 1 hour
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: () => productService.searchProducts(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Mutations
export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (product: Partial<Product>) => productService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      productService.updateProduct(id, product),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.product(variables.id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      productService.toggleProductActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });

  return {
    createProduct: createMutation,
    updateProduct: updateMutation,
    deleteProduct: deleteMutation,
    toggleActive: toggleActiveMutation,
  };
};
