'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProtectedRoute } from '../auth/ProtectedRoute';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
        {/* Desktop Fixed Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl z-10 flex flex-col">
              <Sidebar onCloseMobile={() => setIsMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Header
            onOpenMobile={() => setIsMobileOpen(true)}
            title={title}
            subtitle={subtitle}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
