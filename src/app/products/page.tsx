'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductCardGrid } from '@/components/products/ProductCardGrid';
import { Pagination } from '@/components/products/Pagination';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { TableSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { useProductUrlParams } from '@/hooks/useProductUrlParams';
import { productService } from '@/services/product.service';
import { useToast } from '@/context/ToastContext';
import { Category, Product, ProductFormData } from '@/types/product.types';

function ProductsContent() {
  const {
    params,
    setPage,
    setLimit,
    setSearch,
    setCategory,
    setSort,
    resetFilters,
  } = useProductUrlParams();

  const { success, error: toastError } = useToast();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Local mutation overlay cache so DummyJSON adds/edits/deletions persist smoothly in the UI session
  const [localAddedProducts, setLocalAddedProducts] = useState<Product[]>([]);
  const [localEditedProducts, setLocalEditedProducts] = useState<Record<number, Partial<Product>>>({});
  const [localDeletedIds, setLocalDeletedIds] = useState<number[]>([]);

  // In-flight request cancellation reference and sequence counter
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestSequenceRef = useRef<number>(0);

  // 1. Fetch Categories once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        setIsLoadingCategories(true);
        const data = await productService.getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Products with request cancellation & race condition protection
  const fetchProducts = useCallback(async () => {
    // Abort any pending requests to prevent stale results from overwriting newer state
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentSeq = ++requestSequenceRef.current;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await productService.getProducts(params, controller.signal);

      // Only apply state if this is still the most recent request sequence
      if (currentSeq === requestSequenceRef.current) {
        let list = data.products || [];

        // Apply local edits overlay
        list = list.map((item) => {
          if (localEditedProducts[item.id]) {
            return { ...item, ...localEditedProducts[item.id] };
          }
          return item;
        });

        // Apply local deletions filter
        list = list.filter((item) => !localDeletedIds.includes(item.id));

        // If on page 1 and no search query active, prepend locally added products that match current category filter
        if (params.page === 1) {
          const matchingLocalAdded = localAddedProducts.filter((item) => {
            if (localDeletedIds.includes(item.id)) return false;
            if (params.category && item.category !== params.category) return false;
            return true;
          });
          list = [...matchingLocalAdded, ...list];
        }

        setProducts(list);
        setTotal(data.total + (localAddedProducts.length - localDeletedIds.length));
        setIsLoading(false);
      }
    } catch (err: unknown) {
      // Ignore AbortError / canceled requests
      if (err instanceof Error && (err.name === 'CanceledError' || err.name === 'AbortError')) {
        return;
      }
      if (currentSeq === requestSequenceRef.current) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch products.';
        setErrorMessage(msg);
        setIsLoading(false);
      }
    }
  }, [params, localAddedProducts, localEditedProducts, localDeletedIds]);

  useEffect(() => {
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  // Handle Add / Edit Submission
  const handleFormSubmit = async (formData: ProductFormData) => {
    if (editingProduct) {
      // Edit Product (PUT /products/:id)
      try {
        const updated = await productService.updateProduct(editingProduct.id, formData);
        
        // Update local state overlay
        setLocalEditedProducts((prev) => ({
          ...prev,
          [editingProduct.id]: {
            ...formData,
            id: editingProduct.id,
            rating: editingProduct.rating,
            reviews: editingProduct.reviews,
            thumbnail: formData.thumbnail || editingProduct.thumbnail,
          },
        }));

        // Update current displayed list
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  ...formData,
                  thumbnail: formData.thumbnail || p.thumbnail,
                }
              : p
          )
        );

        success('Product Updated', `"${updated.title || formData.title}" was successfully updated.`);
        setEditingProduct(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update product.';
        toastError('Update Failed', msg);
        throw err;
      }
    } else {
      // Add Product (POST /products/add)
      try {
        const created = await productService.addProduct(formData);
        const newProduct: Product = {
          ...created,
          id: created.id || Date.now(),
          title: formData.title,
          description: formData.description,
          price: formData.price,
          discountPercentage: formData.discountPercentage,
          stock: formData.stock,
          brand: formData.brand,
          category: formData.category,
          rating: 5.0,
          thumbnail: formData.thumbnail || 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
          images: [formData.thumbnail || 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png'],
          isLocal: true,
        };

        setLocalAddedProducts((prev) => [newProduct, ...prev]);
        setProducts((prev) => [newProduct, ...prev]);
        setTotal((prev) => prev + 1);

        success('Product Created', `"${newProduct.title}" was added to catalog.`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to add product.';
        toastError('Creation Failed', msg);
        throw err;
      }
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async (product: Product) => {
    try {
      await productService.deleteProduct(product.id);
      
      // Update local deletion overlay
      setLocalDeletedIds((prev) => [...prev, product.id]);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setTotal((prev) => Math.max(0, prev - 1));

      success('Product Deleted', `"${product.title}" was removed successfully.`);
      setDeletingProduct(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product.';
      toastError('Delete Failed', msg);
      throw err;
    }
  };

  return (
    <DashboardLayout
      title="Product Catalog"
      subtitle="View, search, filter, and manage your store inventory"
    >
      {/* Top Banner Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Products</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {total} items
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time synchronization with DummyJSON API
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={fetchProducts}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingProduct(null);
              setIsFormModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
            className="flex-1 sm:flex-initial shadow-sm shadow-blue-500/25"
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <ProductFilters
        search={params.search || ''}
        category={params.category || ''}
        sortBy={params.sortBy || ''}
        order={params.order || 'asc'}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onReset={resetFilters}
      />

      {/* Content State Handling */}
      {errorMessage ? (
        <ErrorState
          title="Could not load products"
          message={errorMessage}
          onRetry={fetchProducts}
          isRetrying={isLoading}
        />
      ) : isLoading ? (
        <div>
          <div className="hidden lg:block">
            <TableSkeleton rows={params.limit || 10} />
          </div>
          <div className="lg:hidden">
            <CardSkeleton count={6} />
          </div>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products matched your criteria"
          description={
            params.search
              ? `No products found matching "${params.search}". Try checking for typos or resetting filters.`
              : 'There are no products in this category or page. Try adjusting your filters.'
          }
          onReset={resetFilters}
          actionText="Reset All Filters"
        />
      ) : (
        <div>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <ProductTable
              products={products}
              onEdit={(prod) => {
                setEditingProduct(prod);
                setIsFormModalOpen(true);
              }}
              onDelete={(prod) => setDeletingProduct(prod)}
            />
          </div>

          {/* Mobile Card Grid View */}
          <div className="lg:hidden">
            <ProductCardGrid
              products={products}
              onEdit={(prod) => {
                setEditingProduct(prod);
                setIsFormModalOpen(true);
              }}
              onDelete={(prod) => setDeletingProduct(prod)}
            />
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={params.page || 1}
            totalItems={total}
            limit={params.limit || 10}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        product={deletingProduct}
      />
    </DashboardLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            <TableSkeleton rows={8} />
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
