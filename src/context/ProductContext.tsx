import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProductDetails {
  title: string;
  content: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  details: ProductDetails[];
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  careInstructions: string[];
  images: string[];
  featured: boolean;
  status: 'active' | 'inactive';
  external_link?: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => Promise<void>;
  getProductsByCategory: (categoryId: string) => Product[];
  getFeaturedProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    subscribeToProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('products')
        .select('*');

      if (err) throw err;

      const parsedProducts = (data || []).map(product => ({
        ...product,
        details: Array.isArray(product.details) ? product.details : [],
        dimensions: product.dimensions || { length: 0, width: 0, height: 0, unit: 'cm' },
        careInstructions: Array.isArray(product.care_instructions) ? product.care_instructions : [],
        images: Array.isArray(product.images) ? product.images : [],
        status: product.status || 'active'
      }));

      setProducts(parsedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToProducts = () => {
    const subscription = supabase
      .channel('products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
        if (payload.eventType === 'INSERT') {
          setProducts(prev => [payload.new as Product, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new as Product : p));
        } else if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      const productData = {
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        quantity: Number(product.quantity) || 0,
        category: product.category,
        details: product.details || [],
        dimensions: product.dimensions || { length: 0, width: 0, height: 0, unit: 'cm' },
        "careInstructions": product.careInstructions || [],
        images: product.images || [],
        featured: Boolean(product.featured),
        status: product.status || 'active'
      };

      const { data, error: err } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (err) throw err;
      if (data) {
        setProducts(prev => [data[0] as Product, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setLoading(true);
      
      // Format the updates to match database schema
      const updateData = {
        ...updates,
        price: updates.price ? Number(updates.price) : undefined,
        quantity: updates.quantity !== undefined ? Number(updates.quantity) : undefined,
        details: updates.details || undefined,
        dimensions: updates.dimensions || undefined,
        "careInstructions": updates.careInstructions || undefined,
        images: updates.images || undefined
      };

      const { data, error: err } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select();

      if (err) throw err;
      if (data) {
        setProducts(prev => prev.map(p => p.id === id ? data[0] as Product : p));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      const { error: err } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdateProducts = async (ids: string[], updates: Partial<Product>) => {
    try {
      setLoading(true);
      // Convert the updates to match database schema
      const dbUpdates = {
        ...updates,
        "careInstructions": updates.careInstructions || undefined,
        details: updates.details || undefined,
        dimensions: updates.dimensions || undefined
      };

      const { error: err } = await supabase
        .from('products')
        .update(dbUpdates)
        .in('id', ids);

      if (err) throw err;
      setProducts(prev => prev.map(p => 
        ids.includes(p.id) ? { ...p, ...updates } : p
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.category === categoryId);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkUpdateProducts,
        getProductsByCategory,
        getFeaturedProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

export type { Product, ProductDetails };