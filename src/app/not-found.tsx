'use client';

import React from 'react';
import Link from 'next/link';
import { PackageX, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 shadow-sm">
          <PackageX className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The page or product you are searching for does not exist, was removed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link href="/products" className="w-full">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
