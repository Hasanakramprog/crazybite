import React from 'react';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata = {
  title: 'Admin Dashboard — Crazy Bites',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <AdminNav />
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
