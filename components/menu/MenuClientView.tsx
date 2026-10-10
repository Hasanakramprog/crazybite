'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Category, RestaurantSettings } from '@/lib/types';
import { Language, translations } from '@/lib/i18n';
import { Header } from './Header';
import { CategoryTabs } from './CategoryTabs';
import { SearchBar } from './SearchBar';
import { MenuItemCard } from './MenuItemCard';
import { Footer } from './Footer';
import { MobileOrderBar } from './MobileOrderBar';
import { UtensilsCrossed } from 'lucide-react';

interface MenuClientViewProps {
  initialCategories: Category[];
  initialSettings: RestaurantSettings;
  initialLang?: Language;
}

export const MenuClientView: React.FC<MenuClientViewProps> = ({
  initialCategories,
  initialSettings,
  initialLang = 'en',
}) => {
  const [lang, setLang] = useState<Language>(initialLang);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Update HTML document attributes when language changes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.cookie = `lang=${lang}; path=/; max-age=31536000`;
  }, [lang]);

  const t = translations[lang];

  // Filter categories and items based on search and visibility
  const filteredCategories = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return initialCategories
      .filter((cat) => cat.is_visible)
      .map((cat) => {
        let items = cat.items || [];

        // Apply active category filter if selected (and not searching)
        if (activeCategory && !q) {
          if (cat.id !== activeCategory && cat.slug !== activeCategory) {
            return null;
          }
        }

        // Apply search query filter
        if (q) {
          items = items.filter((item) => {
            const matchNameEn = item.name_en?.toLowerCase().includes(q);
            const matchNameAr = item.name_ar?.toLowerCase().includes(q);
            const matchDescEn = item.description_en?.toLowerCase().includes(q);
            const matchDescAr = item.description_ar?.toLowerCase().includes(q);
            const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
            return matchNameEn || matchNameAr || matchDescEn || matchDescAr || matchTags;
          });
        }

        return {
          ...cat,
          items,
        };
      })
      .filter((cat): cat is Category => cat !== null && (cat.items.length > 0 || !searchTerm));
  }, [initialCategories, activeCategory, searchTerm]);

  const totalItemCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  return (
    <div className={`min-h-screen bg-[#0E0E0E] text-white flex flex-col ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Header */}
      <Header settings={initialSettings} lang={lang} onLanguageChange={setLang} />

      {/* Hero Banner with street food aesthetic */}
      <section className="relative overflow-hidden py-6 sm:py-8 border-b border-neutral-900 bg-gradient-to-b from-neutral-950 to-[#0E0E0E]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2">
            {lang === 'ar' ? 'أشهى الساندويشات والبرجر' : 'Taste The Madness'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            {lang === 'ar'
              ? 'مكونات طازجة يومياً، مشوي عالفحم، ونكهات كريزي استثنائية'
              : 'Fresh daily ingredients, charcoal grilled perfection, and bold crazy flavors'}
          </p>
        </div>

        {/* Live Search Bar */}
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} lang={lang} />
      </section>

      {/* Category Tabs Sticky Bar */}
      <CategoryTabs
        categories={initialCategories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        lang={lang}
      />

      {/* Menu Categories and Items */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {totalItemCount === 0 ? (
          <div className="text-center py-20 px-4 bg-[#171717]/40 rounded-3xl border border-neutral-800">
            <UtensilsCrossed className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">{t.no_items_found}</h3>
            <p className="text-xs text-neutral-400 mb-4">
              {lang === 'ar'
                ? 'جرّب البحث بكلمة أخرى أو تصفح كل الأقسام'
                : 'Try searching with another keyword or browse all categories'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-[#F5C518] hover:bg-[#e0b314] text-black font-bold text-xs rounded-full transition-colors"
              >
                {t.clear_search}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCategories.map((cat) => {
              const catTitle = lang === 'ar' ? (cat.name_ar || cat.name_en) : cat.name_en;

              if (cat.items.length === 0) return null;

              return (
                <section key={cat.id} id={cat.slug} className="scroll-mt-28">
                  {/* Category Header with Print Menu Brush-Stroke Style */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="brush-banner px-4 py-1.5 rounded-lg shadow-md">
                      <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                        {catTitle}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-neutral-500 font-mono">
                      ({cat.items.length})
                    </span>
                    <div className="flex-1 border-b border-neutral-800/80 ms-2" />
                  </div>

                  {/* Items Grid: 2 items per row on mobile, 2 per row on desktop */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                    {cat.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        lang={lang}
                        settings={initialSettings}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating mobile order button */}
      <MobileOrderBar settings={initialSettings} lang={lang} />

      {/* Footer */}
      <Footer settings={initialSettings} lang={lang} />
    </div>
  );
};
