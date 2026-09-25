'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Edit3, Trash2, Star } from 'lucide-react';
import { Product } from '@/types/product.types';
import { formatCurrency, getStockStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface ProductCardGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => {
        const stockStatus = getStockStatus(product.stock);

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3 card-hover"
          >
            {/* Top row: Category badge & Stock */}
            <div className="flex items-center justify-between gap-2">
              <Badge variant="neutral" size="sm">
                {product.category}
              </Badge>
              <Badge variant={stockStatus.variant} size="sm">
                {stockStatus.label}
              </Badge>
            </div>

            {/* Thumbnail + Title */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200/60 shrink-0 overflow-hidden flex items-center justify-center p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.thumbnail || (product.images && product.images[0]) || '/placeholder.png'}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${product.id}`}
                  className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-snug"
                >
                  {product.title}
                </Link>
                {product.brand && (
                  <p className="text-xs text-slate-400 mt-0.5">{product.brand}</p>
                )}
              </div>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-base font-bold text-slate-900">
                  {formatCurrency(product.price)}
                </span>
                {product.discountPercentage && product.discountPercentage > 0 ? (
                  <span className="ml-1.5 text-xs text-emerald-600 font-medium">
                    -{product.discountPercentage}%
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-1 text-amber-500 bg-amber-50/70 px-2 py-0.5 rounded-lg border border-amber-200/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span className="text-xs font-bold text-slate-800">
                  {product.rating ? Number(product.rating).toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <Link
                href={`/products/${product.id}`}
                className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors border border-slate-200/70"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </Link>

              <button
                onClick={() => onEdit(product)}
                className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/70 rounded-xl transition-colors border border-indigo-100 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onDelete(product)}
                className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold text-rose-700 bg-rose-50/50 hover:bg-rose-100/70 rounded-xl transition-colors border border-rose-100 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
