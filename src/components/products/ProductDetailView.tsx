'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Edit3,
  Trash2,
  Tag,
  User,
} from 'lucide-react';
import { Product } from '@/types/product.types';
import { formatCurrency, formatDate, getStockStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ProductDetailViewProps {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.thumbnail || '/placeholder.png'];

  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Edit Product
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Main Product Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Main Selected Image */}
          <div className="w-full aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-4 overflow-hidden relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <div className="absolute top-3 left-3">
                <Badge variant="success" size="md">
                  {product.discountPercentage}% OFF
                </Badge>
              </div>
            ) : null}
          </div>

          {/* Thumbnail Gallery Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl border p-1 bg-slate-50 shrink-0 overflow-hidden transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.title} preview ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Specs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Stock Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="md">
                {product.category}
              </Badge>
              <Badge variant={stockStatus.variant} size="md">
                {stockStatus.label}
              </Badge>
              {product.brand && (
                <span className="text-xs font-semibold text-slate-500">
                  Brand: <span className="text-slate-900">{product.brand}</span>
                </span>
              )}
            </div>

            {/* Title & SKU */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>
              {product.sku && (
                <p className="text-xs font-mono text-slate-400 mt-1">
                  SKU: {product.sku}
                </p>
              )}
            </div>

            {/* Rating & Reviews Bar */}
            <div className="flex items-center gap-3 py-2 border-y border-slate-100">
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="text-sm font-bold text-slate-900">
                  {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
                </span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {product.reviews?.length || 0} Customer Reviews
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="text-sm text-slate-400 line-through">
                  {formatCurrency(
                    product.price / (1 - product.discountPercentage / 100)
                  )}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="pt-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Guarantee Badges Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-100">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-800">Warranty</p>
                <p className="text-slate-500">{product.warrantyInformation || '1 Year Official'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Truck className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-800">Shipping</p>
                <p className="text-slate-500">{product.shippingInformation || 'Ships in 3-5 days'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <RotateCcw className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-800">Return Policy</p>
                <p className="text-slate-500">{product.returnPolicy || '30 days returns'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Customer Reviews
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Feedback from verified purchasers
            </p>
          </div>
          <Badge variant="primary" size="md">
            {product.reviews?.length || 0} reviews
          </Badge>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-slate-50/75 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between gap-3"
              >
                <div>
                  {/* Rating stars + Date */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 stroke-amber-400'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(rev.date)}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Reviewer info */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    <User className="w-3 h-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {rev.reviewerName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Verified Buyer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No customer reviews available for this item yet.
          </div>
        )}
      </div>
    </div>
  );
};
