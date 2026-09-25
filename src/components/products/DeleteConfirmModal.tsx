'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Product } from '@/types/product.types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product) => Promise<void>;
  product: Product | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!product) return null;

  const handleConfirm = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await onConfirm(product);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete Product"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-rose-50 border border-rose-100">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-sm text-slate-700">
            <p className="font-semibold text-slate-900 mb-1">
              Are you sure you want to delete this product?
            </p>
            <p className="text-xs text-slate-600 mb-2">
              <span className="font-bold text-slate-800">&quot;{product.title}&quot;</span> (ID: #{product.id}) will be removed from your catalog.
            </p>
            <p className="text-[11px] text-slate-400">
              Note: This action is handled through DummyJSON API and will update your frontend view.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            isLoading={isDeleting}
            disabled={isDeleting}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Product
          </Button>
        </div>
      </div>
    </Modal>
  );
};
