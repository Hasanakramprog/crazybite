'use client';

import React from 'react';
import { MenuItem, RestaurantSettings } from '@/lib/types';
import { Language, translations, formatPrice } from '@/lib/i18n';
import { MessageCircle, Star, Flame } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  lang: Language;
  settings: RestaurantSettings;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, lang, settings }) => {
  const t = translations[lang];
  const name = lang === 'ar' ? (item.name_ar || item.name_en) : item.name_en;
  const description = lang === 'ar' ? (item.description_ar || item.description_en) : (item.description_en || item.description_ar);
  const { usdFormatted, lbpFormatted } = formatPrice(item.price_usd, settings.lbp_rate);

  const cleanPhone = (settings.whatsapp || '+96176191122').replace(/\D/g, '');
  const itemOrderText = lang === 'ar'
    ? `مرحباً، أود طلب: ${name} (${usdFormatted})`
    : `Hello, I'd like to order: ${name} (${usdFormatted})`;
  const orderUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(itemOrderText)}`;

  const isSoldOut = !item.is_available;

  return (
    <div
      className={`relative group bg-[#171717] hover:bg-[#1c1c1c] border border-neutral-800/80 hover:border-[#F5C518]/40 rounded-2xl p-3 sm:p-4 transition-all duration-200 shadow-sm flex flex-col justify-between ${
        isSoldOut ? 'opacity-50 grayscale select-none' : ''
      }`}
    >
      <div>
        {/* Header row: Name and Price */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-1">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug line-clamp-2">
              {name}
            </h4>
          </div>

          {/* Dotted leader for tablet/desktop */}
          <div className="flex-grow border-b border-dotted border-neutral-700 mx-1 mb-1 hidden md:block" />

          {/* Price */}
          <div className="flex items-baseline gap-1 sm:flex-col sm:items-end flex-shrink-0">
            <span className="text-sm sm:text-base font-black text-[#F5C518] tracking-tight">
              {usdFormatted}
            </span>
            {lbpFormatted && (
              <span className="text-[9px] sm:text-[10px] text-neutral-400 font-mono">
                {lbpFormatted}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
            {item.tags.map((tag) => {
              const tagLabel = (t.tags as any)[tag] || tag;
              const isSignature = tag === 'signature' || tag === 'best-seller';
              const isSpicy = tag === 'spicy';

              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${
                    isSignature
                      ? 'bg-[#F5C518] text-black shadow-sm'
                      : isSpicy
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {isSignature && <Star className="w-2 h-2 fill-current" />}
                  {isSpicy && <Flame className="w-2 h-2 fill-current" />}
                  {tagLabel}
                </span>
              );
            })}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1.5 sm:mt-2 font-normal leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Footer row: Sold out label OR Order on WhatsApp action */}
      <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between">
        {isSoldOut ? (
          <span className="text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {t.sold_out}
          </span>
        ) : (
          <div className="w-full flex items-center justify-end">
            <a
              href={orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-neutral-400 hover:text-[#25D366] transition-colors py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-lg hover:bg-neutral-800/60"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#25D366]" />
              <span className="hidden xs:inline sm:inline">{t.order_whatsapp}</span>
              <span className="inline xs:hidden sm:hidden">Order</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
