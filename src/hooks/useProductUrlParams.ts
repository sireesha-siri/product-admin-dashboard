'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ProductQueryParams, SortField, SortOrder } from '@/types/product.types';
import { sanitizeLimitNumber, sanitizePageNumber } from '@/lib/utils';

export function useProductUrlParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse and sanitize current URL search parameters
  const params: ProductQueryParams = useMemo(() => {
    const rawPage = searchParams.get('page');
    const rawLimit = searchParams.get('limit');
    const rawSearch = searchParams.get('search') || '';
    const rawCategory = searchParams.get('category') || '';
    const rawSortBy = searchParams.get('sortBy') as SortField;
    const rawOrder = searchParams.get('order') as SortOrder;

    const page = sanitizePageNumber(rawPage, 1);
    const limit = sanitizeLimitNumber(rawLimit, 10);

    const validSortFields: SortField[] = ['price', 'rating', 'title'];
    const sortBy = validSortFields.includes(rawSortBy) ? rawSortBy : '';
    const order = rawOrder === 'desc' ? 'desc' : 'asc';

    return {
      page,
      limit,
      search: rawSearch,
      category: rawCategory,
      sortBy,
      order,
    };
  }, [searchParams]);

  // Update query params in URL without full page reload
  const updateUrl = useCallback(
    (newParams: Partial<ProductQueryParams>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      const queryString = current.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const setPage = useCallback(
    (page: number) => {
      updateUrl({ page: Math.max(1, page) });
    },
    [updateUrl]
  );

  const setLimit = useCallback(
    (limit: number) => {
      // Changing limit resets page to 1
      updateUrl({ limit, page: 1 });
    },
    [updateUrl]
  );

  const setSearch = useCallback(
    (search: string) => {
      // Changing search query resets page to 1
      updateUrl({ search: search.trim() ? search.trim() : undefined, page: 1 });
    },
    [updateUrl]
  );

  const setCategory = useCallback(
    (category: string) => {
      // Changing category resets page to 1
      updateUrl({ category: category.trim() ? category.trim() : undefined, page: 1 });
    },
    [updateUrl]
  );

  const setSort = useCallback(
    (sortBy: SortField, order: SortOrder = 'asc') => {
      updateUrl({
        sortBy: sortBy || undefined,
        order: sortBy ? order : undefined,
        page: 1,
      });
    },
    [updateUrl]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    params,
    setPage,
    setLimit,
    setSearch,
    setCategory,
    setSort,
    resetFilters,
  };
}
