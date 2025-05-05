import { useState, useCallback } from 'react';
import axios from 'axios';
// import { Product } from '../types';

// Define types for clarity
export interface Product {
  code: string;
  product_name: string;
  brands?: string;
  ingredients_text?: string;
  nutriments?: { [key: string]: any };
  nutrition_grades?: string;
  nutrition_grades_tags?: string[];
  image_url?: string;
  image_front_url?: string;
}

export function useFetchFood() {
  const [results, setResults] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch single product by barcode
  const fetchFoodByCode = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`
      );
      if (response.data && response.data.product) {
        setProduct(response.data.product as Product);
      } else {
        setProduct(null);
        setError('Product not found');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search products by name
  const fetchFoodByName = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://world.openfoodfacts.org/cgi/search.pl`,
        {
          params: {
            search_terms: query,
            search_simple: 1,
            action: 'process',
            json: 1,
          },
        }
      );
      if (response.data && response.data.products) {
        setResults(response.data.products as Product[]);
      } else {
        setResults([]);
        setError('No products found');
      }
    } catch (err: any) {
      setError(err.message || 'Error searching products');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    product,
    loading,
    error,
    fetchFoodByCode,
    fetchFoodByName,
  };
}
