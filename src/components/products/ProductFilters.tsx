'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, X, Filter, ArrowUpDown, RefreshCw, Layers } from 'lucide-react';
import { Category, SortField, SortOrder } from '@/types/product.types';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductFiltersProps {
  search: string;
  category: string;
  sortBy: SortField;
  order: SortOrder;
  categories: Category[];
  isLoadingCategories: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (sortBy: SortField, order: SortOrder) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  category,
  sortBy,
  order,
  categories,
  isLoadingCategories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
}) => {
  // Local immediate search input state for buttery smooth typing
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 400);
  const [, startTransition] = useTransition();

  // Sync prop changes (e.g. from URL changes or reset) to local search input
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // When debounced value changes and differs from prop, notify parent
  useEffect(() => {
    if (debouncedSearch !== search) {
      startTransition(() => {
        onSearchChange(debouncedSearch);
      });
    }
  }, [debouncedSearch, search, onSearchChange]);

  const hasActiveFilters = Boolean(search || category || sortBy);

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search products by title, brand, or SKU..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-900 rounded-xl pl-10 pr-9 py-2.5 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:w-48">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={Boolean(search)} // DummyJSON constraint: search mode overrides category
              className={`w-full appearance-none bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-800 rounded-xl pl-8 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer ${
                search ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={search ? 'Category filter is disabled while search query is active' : 'Filter by category'}
            >
              <option value="">All Categories</option>
              {isLoadingCategories ? (
                <option value="" disabled>Loading categories...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Sort Field Selector */}
          <div className="relative flex-1 sm:w-40">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortField, order)}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-800 rounded-xl pl-8 pr-8 py-2.5 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer"
            >
              <option value="">Default Sorting</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {/* Sort Order Toggle (Asc / Desc) */}
          {sortBy && (
            <button
              onClick={() => onSortChange(sortBy, order === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              title={`Currently: ${order === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <span>{order === 'asc' ? 'Asc ↑' : 'Desc ↓'}</span>
            </button>
          )}

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setLocalSearch('');
                onReset();
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold text-slate-600 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Priority Hint Badge (DummyJSON specification) */}
      {search && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-blue-700 bg-blue-50/50 p-2.5 rounded-xl">
          <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            Search query active. DummyJSON searches across the full catalog. Clear search to use category filters.
          </span>
        </div>
      )}
    </div>
  );
};
