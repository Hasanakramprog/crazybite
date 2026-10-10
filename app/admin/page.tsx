import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Utensils,
  DollarSign,
  Settings,
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Flame,
  QrCode,
} from 'lucide-react';
import { getMenuData } from '@/lib/data-store';

export default async function AdminDashboardPage() {
  const menuData = await getMenuData();

  const totalCategories = menuData.categories.length;
  const allItems = menuData.categories.flatMap((c) => c.items || []);
  const totalItems = allItems.length;
  const availableItems = allItems.filter((i) => i.is_available).length;
  const soldOutItems = totalItems - availableItems;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#171717] via-neutral-900 to-[#171717] p-6 rounded-3xl border border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Menu Dashboard
            </h1>
            <Flame className="w-6 h-6 text-[#F5C518] fill-[#F5C518]" />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Welcome back! Here is an overview of the <span className="text-white font-bold">{menuData.settings.restaurant_name}</span> digital menu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#e0b314] text-black font-black text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Live Menu</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Categories */}
        <div className="bg-[#171717] border border-neutral-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
            <Layers className="w-5 h-5 text-[#F5C518]" />
          </div>
          <div className="text-3xl font-black text-white">{totalCategories}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Active sections on menu</p>
        </div>

        {/* Total Items */}
        <div className="bg-[#171717] border border-neutral-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Items</span>
            <Utensils className="w-5 h-5 text-[#F5C518]" />
          </div>
          <div className="text-3xl font-black text-white">{totalItems}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Dishes across all categories</p>
        </div>

        {/* Available Items */}
        <div className="bg-[#171717] border border-neutral-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Available</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-green-400">{availableItems}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Ready for order</p>
        </div>

        {/* Sold Out */}
        <div className="bg-[#171717] border border-neutral-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Sold Out</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-400">{soldOutItems}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Temporarily disabled</p>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Quick Prices */}
        <Link
          href="/admin/prices"
          className="group bg-[#171717] hover:bg-[#1f1f1f] border border-neutral-800 hover:border-[#F5C518]/50 p-6 rounded-2xl transition-all shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#F5C518] flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white uppercase group-hover:text-[#F5C518] transition-colors">
              Quick Price Editor
            </h3>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Fast table to edit prices inline in seconds, or run bulk percentage increases/decreases across categories.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#F5C518] mt-4">
            <span>Open Price Editor</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Manage Items */}
        <Link
          href="/admin/items"
          className="group bg-[#171717] hover:bg-[#1f1f1f] border border-neutral-800 hover:border-[#F5C518]/50 p-6 rounded-2xl transition-all shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#F5C518] flex items-center justify-center mb-4">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white uppercase group-hover:text-[#F5C518] transition-colors">
              Menu Items
            </h3>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Add new dishes, edit bilingual names, descriptions, tags, toggle availability, or delete items.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#F5C518] mt-4">
            <span>Manage Items ({totalItems})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Manage Categories */}
        <Link
          href="/admin/categories"
          className="group bg-[#171717] hover:bg-[#1f1f1f] border border-neutral-800 hover:border-[#F5C518]/50 p-6 rounded-2xl transition-all shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#F5C518] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white uppercase group-hover:text-[#F5C518] transition-colors">
              Categories
            </h3>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Add new categories, reorder tabs, hide/show categories, and customize Arabic/English section titles.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#F5C518] mt-4">
            <span>Manage Categories ({totalCategories})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Settings */}
        <Link
          href="/admin/settings"
          className="group bg-[#171717] hover:bg-[#1f1f1f] border border-neutral-800 hover:border-[#F5C518]/50 p-6 rounded-2xl transition-all shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#F5C518] flex items-center justify-center mb-4">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white uppercase group-hover:text-[#F5C518] transition-colors">
              Restaurant Settings
            </h3>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Update WhatsApp ordering phone, brand tagline, working hours, Instagram handle, and currency exchange rate.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#F5C518] mt-4">
            <span>Configure Settings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* QR Code generator */}
        <div className="bg-[#171717] border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#F5C518] flex items-center justify-center mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white uppercase">
                High-Resolution QR Code
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 max-w-md">
                Print on dining tables, takeaway paper bags, flyers, and exterior banners for instant customer ordering.
              </p>
            </div>
            <div className="p-2 bg-[#F5C518] rounded-xl border-2 border-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/api/qr?format=png&url=https%3A%2F%2Fcrazy-bites.netlify.app%2F" alt="QR Code" width={70} height={70} className="rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-800">
            <a
              href="/api/qr?format=png&url=https%3A%2F%2Fcrazy-bites.netlify.app%2F"
              download="crazy-bites-table-qr.png"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5C518] text-black font-bold text-xs rounded-lg"
            >
              Download PNG
            </a>
            <a
              href="/api/qr?format=svg&url=https%3A%2F%2Fcrazy-bites.netlify.app%2F"
              download="crazy-bites-vector-qr.svg"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-lg transition-colors"
            >
              Download Vector (SVG)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
