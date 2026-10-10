'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Category } from '@/lib/types';
import { Language, translations } from '@/lib/i18n';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  lang: Language;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  lang,
}) => {
  const t = translations[lang];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to show/hide scroll buttons
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(Math.abs(scrollLeft) > 5);
    setCanScrollRight(Math.abs(scrollLeft) < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = direction === 'left' ? -200 : 200;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Drag to scroll for desktop mouse users
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
    checkScroll();
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTabClick = (id: string | null, e: React.MouseEvent<HTMLButtonElement>) => {
    onSelectCategory(id);
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  return (
    <nav className="sticky top-[57px] z-30 bg-[#0E0E0E]/95 backdrop-blur-md border-b border-neutral-800/90 py-2.5 select-none">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 relative flex items-center">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            className="hidden sm:flex absolute start-1 z-10 w-7 h-7 rounded-full bg-neutral-900/95 border border-neutral-700 text-white items-center justify-center shadow-lg hover:bg-neutral-800 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={(e) => {
            if (scrollContainerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              scrollContainerRef.current.scrollLeft += e.deltaY;
              checkScroll();
            }
          }}
          className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 px-1 py-1 scroll-smooth cursor-grab active:cursor-grabbing touch-pan-x"
        >
          <button
            type="button"
            onClick={(e) => handleTabClick(null, e)}
            className={`flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeCategory === null
                ? 'bg-[#F5C518] text-black shadow-md shadow-[#F5C518]/20 scale-105'
                : 'bg-[#171717] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            {t.all_categories}
          </button>

          {categories
            .filter((cat) => cat.is_visible)
            .map((cat) => {
              const isActive = activeCategory === cat.id || activeCategory === cat.slug;
              const catName = lang === 'ar' ? (cat.name_ar || cat.name_en) : cat.name_en;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={(e) => handleTabClick(cat.slug || cat.id, e)}
                  className={`flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F5C518] text-black shadow-md shadow-[#F5C518]/20 scale-105'
                      : 'bg-[#171717] text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {catName}
                </button>
              );
            })}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            className="hidden sm:flex absolute end-1 z-10 w-7 h-7 rounded-full bg-neutral-900/95 border border-neutral-700 text-white items-center justify-center shadow-lg hover:bg-neutral-800 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
};
