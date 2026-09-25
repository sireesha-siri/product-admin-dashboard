export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStockStatus(stock: number): {
  label: string;
  variant: 'success' | 'warning' | 'danger';
} {
  if (stock <= 0) {
    return { label: 'Out of Stock', variant: 'danger' };
  }
  if (stock <= 10) {
    return { label: `Low Stock (${stock})`, variant: 'warning' };
  }
  return { label: `In Stock (${stock})`, variant: 'success' };
}

export function sanitizePageNumber(value: string | null | undefined, defaultValue = 1): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
}

export function sanitizeLimitNumber(value: string | null | undefined, defaultValue = 10): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if ([10, 20, 50].includes(parsed)) {
    return parsed;
  }
  return defaultValue;
}
