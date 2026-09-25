import React from 'react';
import { PackageSearch, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  actionText?: string;
  actionIcon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No products found',
  description = 'Try adjusting your search query, clearing filters, or adding a new product.',
  onReset,
  actionText = 'Reset Filters',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm my-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
        <PackageSearch className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onReset && (
        <Button
          variant="outline"
          size="md"
          onClick={onReset}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
