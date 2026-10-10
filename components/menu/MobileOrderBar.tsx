'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';
import { RestaurantSettings } from '@/lib/types';

interface MobileOrderBarProps {
  settings: RestaurantSettings;
  lang: Language;
}

export const MobileOrderBar: React.FC<MobileOrderBarProps> = ({ settings, lang }) => {
  const t = translations[lang];
  const cleanPhone = (settings.whatsapp || '+96176191122').replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    lang === 'ar' ? 'مرحباً، أود أن أطلب من كريزي بايتس:' : 'Hello, I would like to order from Crazy Bites:'
  )}`;

  return (
    <div className="sm:hidden fixed bottom-4 inset-x-4 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm tracking-wide shadow-2xl shadow-green-950/60 transition-transform active:scale-95"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span>{t.order_whatsapp}</span>
      </a>
    </div>
  );
};
