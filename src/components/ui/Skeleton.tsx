import React from 'react';
import { cn } from '@/lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/80', className)}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 py-4 px-6 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-1/4" />
          </div>
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-200 rounded w-14" />
          <div className="h-6 bg-slate-200 rounded-full w-20" />
          <div className="h-8 bg-slate-200 rounded-lg w-20" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-4"
        >
          <div className="w-full h-44 rounded-xl bg-slate-200" />
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-slate-200 rounded w-20" />
            <div className="h-6 bg-slate-200 rounded-full w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
