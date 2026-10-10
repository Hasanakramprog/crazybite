'use client';

import React from 'react';
import { MessageCircle, Flame } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';
import { LangToggle } from './LangToggle';
import { QrModal } from './QrModal';
import { RestaurantSettings } from '@/lib/types';

interface HeaderProps {
  settings: RestaurantSettings;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, lang, onLanguageChange }) => {
  const t = translations[lang];
  const cleanPhone = (settings.whatsapp || '+96176191122').replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    lang === 'ar' ? 'مرحباً، أود أن أطلب من كريزي بايتس:' : 'Hello, I would like to order from Crazy Bites:'
  )}`;

  const brandName = lang === 'ar' ? (settings.restaurant_name === 'Crazy Bites' ? 'كريزي بايتس' : settings.restaurant_name) : settings.restaurant_name;
  const tagline = lang === 'ar' ? (settings.tagline_ar || t.tagline) : (settings.tagline_en || t.tagline);

  return (
    <header className="relative w-full border-b border-neutral-800 bg-[#0E0E0E]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-neutral-700/80 bg-black flex-shrink-0 shadow-md shadow-black/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Crazy Bites Logo"
              width={48}
              height={48}
              className="w-full h-full object-cover select-none"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-none">
                {brandName}
              </h1>
              <Flame className="w-4 h-4 text-[#F5C518] fill-[#F5C518]" />
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium tracking-wide mt-1 line-clamp-1">
              {tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <QrModal lang={lang} />
          <LangToggle currentLang={lang} onLanguageChange={onLanguageChange} />

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>{t.order_whatsapp}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
