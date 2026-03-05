import { ReactNode } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Header } from '@/components/layout/Header';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AdminGuard>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full sm:w-56 shrink-0">
              <AdminNav />
            </aside>
            {/* Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </AdminGuard>
      </div>
    </div>
  );
}
