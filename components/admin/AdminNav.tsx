'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Utensils,
  DollarSign,
  Settings,
  Eye,
  LogOut,
} from 'lucide-react';
import { logoutAdmin } from '@/app/actions/settings';

export const AdminNav: React.FC = () => {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Categories', icon: Layers },
    { href: '/admin/items', label: 'Items', icon: Utensils },
    { href: '/admin/prices', label: 'Quick Prices', icon: DollarSign },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  return (
    <header className="bg-[#171717] border-b border-neutral-800 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-neutral-700 bg-black flex-shrink-0 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Crazy Bites"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-black text-sm tracking-wide text-white uppercase flex items-center gap-1">
              Crazy Bites <span className="text-[#F5C518]">Admin</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#F5C518] text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions: View Live Menu + Logout */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold transition-colors border border-neutral-700/60"
            >
              <Eye className="w-3.5 h-3.5 text-[#F5C518]" />
              <span className="hidden sm:inline">View Menu</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-t border-neutral-800/80 -mx-4 px-4 bg-[#141414]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#F5C518] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
