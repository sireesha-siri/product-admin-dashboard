'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Edit3, Trash2, Star } from 'lucide-react';
import { Product } from '@/types/product.types';
import { formatCurrency, getStockStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Product</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Inventory</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Product Info (Image + Title + Brand/SKU) */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.thumbnail || (product.images && product.images[0]) || '/placeholder.png'}
                          alt={product.title}
                          className="w-full h-full object-contain p-1 transform group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {product.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          {product.brand && <span>{product.brand}</span>}
                          {product.brand && product.sku && <span>&bull;</span>}
                          {product.sku && <span className="font-mono text-[11px]">SKU: {product.sku}</span>}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <Badge variant="neutral" size="sm">
                      {product.category}
                    </Badge>
                  </td>

                  {/* Price & Discount */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {formatCurrency(product.price)}
                    </div>
                    {product.discountPercentage && product.discountPercentage > 0 ? (
                      <span className="text-[11px] text-emerald-600 font-medium">
                        -{product.discountPercentage}% off
                      </span>
                    ) : null}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="font-semibold text-slate-800 text-xs">
                          {product.rating ? Number(product.rating).toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      {product.reviews && product.reviews.length > 0 && (
                        <span className="text-slate-400 text-xs">
                          ({product.reviews.length})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={stockStatus.variant} size="sm">
                      {stockStatus.label}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                        aria-label={`View details for ${product.title}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Product"
                        aria-label={`Edit ${product.title}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(product)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Product"
                        aria-label={`Delete ${product.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
