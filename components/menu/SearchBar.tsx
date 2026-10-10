'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  lang: Language;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, lang }) => {
  const t = translations[lang];

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 mt-4">
      <div className="relative flex items-center">
        <Search className="absolute start-7 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.search_placeholder}
          className="w-full ps-11 pe-10 py-3 bg-[#171717] border border-neutral-800 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all shadow-inner"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute end-7 p-1 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
