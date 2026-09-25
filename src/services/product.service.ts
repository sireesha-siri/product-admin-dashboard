import apiClient from '@/lib/axios';
import {
  Category,
  Product,
  ProductFormData,
  ProductQueryParams,
  ProductResponse,
} from '@/types/product.types';

export const productService = {
  /**
   * Fetch paginated list of products with optional category and sorting.
   * If search query exists, DummyJSON requires the /products/search endpoint.
   */
  async getProducts(
    params: ProductQueryParams = {},
    signal?: AbortSignal
  ): Promise<ProductResponse> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    // 1. If search is present, use search endpoint
    if (params.search && params.search.trim() !== '') {
      const searchParams = new URLSearchParams({
        q: params.search.trim(),
        limit: String(limit),
        skip: String(skip),
      });

      if (params.sortBy) {
        searchParams.append('sortBy', params.sortBy);
        searchParams.append('order', params.order || 'asc');
      }

      const response = await apiClient.get<ProductResponse>(
        `/products/search?${searchParams.toString()}`,
        { signal }
      );
      return response.data;
    }

    // 2. If category is selected (and no search query), use category endpoint
    if (params.category && params.category.trim() !== '') {
      const categoryParams = new URLSearchParams({
        limit: String(limit),
        skip: String(skip),
      });

      if (params.sortBy) {
        categoryParams.append('sortBy', params.sortBy);
        categoryParams.append('order', params.order || 'asc');
      }

      const response = await apiClient.get<ProductResponse>(
        `/products/category/${encodeURIComponent(params.category.trim())}?${categoryParams.toString()}`,
        { signal }
      );
      return response.data;
    }

    // 3. Default all products list
    const queryParams = new URLSearchParams({
      limit: String(limit),
      skip: String(skip),
    });

    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
      queryParams.append('order', params.order || 'asc');
    }

    const response = await apiClient.get<ProductResponse>(
      `/products?${queryParams.toString()}`,
      { signal }
    );
    return response.data;
  },

  /**
   * Fetch all product categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[] | string[]>('/products/categories');
    const data = response.data;

    // Normalizing category response in case API returns string array or object array
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === 'string') {
          return {
            slug: item,
            name: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' '),
            url: `https://dummyjson.com/products/category/${item}`,
          };
        }
        return item;
      });
    }
    return [];
  },

  /**
   * Fetch single product details by ID
   */
  async getProductById(id: number | string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Add a new product (DummyJSON POST /products/add)
   */
  async addProduct(productData: ProductFormData): Promise<Product> {
    const response = await apiClient.post<Product>('/products/add', productData);
    return response.data;
  },

  /**
   * Update an existing product (DummyJSON PUT /products/:id)
   */
  async updateProduct(id: number, productData: Partial<ProductFormData>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete a product (DummyJSON DELETE /products/:id)
   */
  async deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(
      `/products/${id}`
    );
    return response.data;
  },
};
