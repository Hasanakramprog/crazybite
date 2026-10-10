import React from 'react';
import Link from 'next/link';
import { Download, ArrowLeft, Printer, Flame } from 'lucide-react';
import { getMenuData } from '@/lib/data-store';

export default async function QrPrintPage() {
  const menuData = await getMenuData();

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col items-center justify-center p-4">
      {/* Navigation */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#F5C518] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>

      {/* Printable Card */}
      <div className="w-full max-w-sm bg-[#171717] border border-neutral-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Top accent */}
        <div className="w-full h-2 bg-[#F5C518] absolute top-0 inset-x-0" />

        <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border border-neutral-700 bg-black mb-2 mt-2 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Crazy Bites"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            {menuData.settings.restaurant_name}
          </h1>
          <Flame className="w-5 h-5 text-[#F5C518] fill-[#F5C518]" />
        </div>

        <p className="text-xs text-neutral-400 mb-6">
          {menuData.settings.tagline_en}
        </p>

        {/* QR Code Container */}
        <div className="p-4 bg-[#F5C518] rounded-2xl inline-block shadow-lg border-4 border-black mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/qr?format=png&url=https%3A%2F%2Fcrazy-bites.netlify.app%2F"
            alt="Crazy Bites Menu QR Code"
            width={240}
            height={240}
            className="rounded-lg"
          />
        </div>

        <div className="brush-banner px-4 py-1.5 rounded-lg mb-2 inline-block">
          <span className="text-black font-black uppercase text-xs tracking-wider">
            SCAN TO VIEW DIGITAL MENU
          </span>
        </div>

        <p className="text-[11px] text-neutral-500 font-mono mt-1">
          WhatsApp: {menuData.settings.whatsapp}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-6">
          <a
            href="/api/qr?format=png&url=https%3A%2F%2Fcrazy-bites.netlify.app%2F"
            download="crazy-bites-qr.png"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#F5C518] hover:bg-[#e0b314] text-black font-bold text-xs uppercase rounded-xl transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res PNG</span>
          </a>
        </div>
      </div>
    </div>
  );
}
