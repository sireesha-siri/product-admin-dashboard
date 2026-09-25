'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductDetailView } from '@/components/products/ProductDetailView';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { DeleteConfirmModal } from '@/components/products/DeleteConfirmModal';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { productService } from '@/services/product.service';
import { useToast } from '@/context/ToastContext';
import { Category, Product, ProductFormData } from '@/types/product.types';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const rawId = resolvedParams.id;
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchProduct = useCallback(async () => {
    // Check if ID is a valid number
    const numericId = parseInt(rawId, 10);
    if (isNaN(numericId) || numericId <= 0) {
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setIsNotFound(false);

      const [productData, categoriesData] = await Promise.all([
        productService.getProductById(numericId),
        productService.getCategories().catch(() => []),
      ]);

      setProduct(productData);
      setCategories(categoriesData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch product details.';
      if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
        setIsNotFound(true);
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  }, [rawId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Handle Edit Product
  const handleEditSubmit = async (formData: ProductFormData) => {
    if (!product) return;
    try {
      const updated = await productService.updateProduct(product.id, formData);
      setProduct({
        ...product,
        ...formData,
        ...updated,
      });
      success('Product Updated', `"${formData.title}" was successfully updated.`);
      setIsEditModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update product.';
      toastError('Update Failed', msg);
      throw err;
    }
  };

  // Handle Delete Product
  const handleDeleteConfirm = async (prod: Product) => {
    try {
      await productService.deleteProduct(prod.id);
      success('Product Deleted', `"${prod.title}" was removed.`);
      router.replace('/products');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product.';
      toastError('Delete Failed', msg);
      throw err;
    }
  };

  return (
    <DashboardLayout
      title={product ? product.title : 'Product Details'}
      subtitle="View comprehensive specifications, inventory, and reviews"
    >
      {isNotFound ? (
        <EmptyState
          title="Product Not Found"
          description={`The product with ID #${rawId} does not exist or has been removed from the catalog.`}
          onReset={() => router.push('/products')}
          actionText="Return to Products Catalog"
        />
      ) : errorMessage ? (
        <ErrorState
          title="Failed to load product"
          message={errorMessage}
          onRetry={fetchProduct}
          isRetrying={isLoading}
        />
      ) : isLoading || !product ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <Skeleton className="w-full aspect-square rounded-2xl" />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <Skeleton className="h-6 w-1/4 rounded-lg" />
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="h-6 w-1/3 rounded-lg" />
              <Skeleton className="h-12 w-1/2 rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <ProductDetailView
            product={product}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={() => setIsDeleteModalOpen(true)}
          />

          <ProductFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleEditSubmit}
            product={product}
            categories={categories}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            product={product}
          />
        </>
      )}
    </DashboardLayout>
  );
}
