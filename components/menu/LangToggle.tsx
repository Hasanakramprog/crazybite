'use client';

import React from 'react';
import { Language } from '@/lib/i18n';
import { Globe } from 'lucide-react';

interface LangToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LangToggle: React.FC<LangToggleProps> = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="inline-flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1 shadow-inner">
      <Globe className="w-3.5 h-3.5 text-neutral-400 ms-2 me-1.5" />
      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
          currentLang === 'en'
            ? 'bg-[#F5C518] text-black shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange('ar')}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
          currentLang === 'ar'
            ? 'bg-[#F5C518] text-black shadow-sm'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        عربي
      </button>
    </div>
  );
};
