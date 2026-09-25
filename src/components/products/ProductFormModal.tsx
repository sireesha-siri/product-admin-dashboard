'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Category, Product, ProductFormData } from '@/types/product.types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: Product | null; // If provided, mode is 'edit', else 'add'
  categories: Category[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
}) => {
  const isEditMode = Boolean(product);

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    stock: 1,
    brand: '',
    category: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when opening in edit mode
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || 0,
        discountPercentage: product.discountPercentage || 0,
        stock: product.stock || 0,
        brand: product.brand || '',
        category: product.category || (categories[0]?.slug || ''),
        thumbnail: product.thumbnail || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: 29.99,
        discountPercentage: 0,
        stock: 15,
        brand: '',
        category: categories[0]?.slug || 'beauty',
        thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
      });
    }
    setErrors({});
  }, [product, categories, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required.';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    }

    if (formData.price === undefined || formData.price === null || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0.';
    }

    if (formData.stock === undefined || formData.stock === null || isNaN(formData.stock) || formData.stock < 0) {
      newErrors.stock = 'Stock must be 0 or higher.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discountPercentage: Number(formData.discountPercentage || 0),
      });
      onClose();
    } catch {
      // Error handled by parent / toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    label: c.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Product' : 'Add New Product'}
      description={
        isEditMode
          ? `Update details for "${product?.title}"`
          : 'Fill out the product information below to add it to your catalog.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Product Title *"
          id="title"
          placeholder="e.g. Wireless Noise Canceling Headphones"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          disabled={isSubmitting}
        />

        {/* Category & Brand Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category *"
            id="category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            error={errors.category}
            disabled={isSubmitting}
          />

          <Input
            label="Brand"
            id="brand"
            placeholder="e.g. Sony, Apple, Nike"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        {/* Price, Discount & Stock Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Price ($) *"
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="29.99"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            error={errors.price}
            disabled={isSubmitting}
          />

          <Input
            label="Discount (%)"
            id="discountPercentage"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="10"
            value={formData.discountPercentage}
            onChange={(e) => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) || 0 })}
            disabled={isSubmitting}
          />

          <Input
            label="Stock Quantity *"
            id="stock"
            type="number"
            min="0"
            step="1"
            placeholder="25"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
            error={errors.stock}
            disabled={isSubmitting}
          />
        </div>

        {/* Thumbnail Image URL */}
        <Input
          label="Thumbnail Image URL"
          id="thumbnail"
          placeholder="https://images.example.com/item.png"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          helperText="Optional image URL or CDN link"
          disabled={isSubmitting}
        />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-xs font-semibold text-slate-700 tracking-wide uppercase"
          >
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Enter full product description and specifications..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={isSubmitting}
            className={`w-full rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 p-3 outline-none transition-all ${
              errors.description
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-rose-500 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEditMode ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
