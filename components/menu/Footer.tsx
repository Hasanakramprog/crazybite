'use client';

import React from 'react';
import { Phone, Clock, MapPin, Heart } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';
import { RestaurantSettings } from '@/lib/types';

interface FooterProps {
  settings: RestaurantSettings;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ settings, lang }) => {
  const t = translations[lang];

  return (
    <footer className="w-full bg-[#0E0E0E] border-t border-neutral-900 mt-16 pt-12 pb-24 sm:pb-12 text-neutral-400">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Brand Logo */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-neutral-800 bg-black mb-3 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Crazy Bites"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Brand Slogan */}
        <div className="brush-banner px-4 py-1.5 rounded-lg mb-4">
          <p className="text-black font-black uppercase text-sm sm:text-base tracking-widest">
            {t.slogan}
          </p>
        </div>

        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
          {lang === 'ar' ? 'كريزي بايتس' : settings.restaurant_name}
        </h3>
        <p className="text-xs text-neutral-400 max-w-md mb-8">
          {lang === 'ar' ? settings.tagline_ar : settings.tagline_en}
        </p>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
          {/* Phone */}
          <a
            href={`tel:${settings.whatsapp}`}
            className="flex flex-col items-center p-4 rounded-2xl bg-[#171717] border border-neutral-800/80 hover:border-[#F5C518]/50 transition-colors"
          >
            <Phone className="w-5 h-5 text-[#F5C518] mb-2" />
            <span className="text-xs font-bold text-white mb-0.5">{t.call_us}</span>
            <span className="text-xs font-mono text-neutral-400 dir-ltr">{settings.whatsapp}</span>
          </a>

          {/* Hours */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-[#171717] border border-neutral-800/80">
            <Clock className="w-5 h-5 text-[#F5C518] mb-2" />
            <span className="text-xs font-bold text-white mb-0.5">{t.open_hours}</span>
            <span className="text-xs text-neutral-400">{settings.hours || "12:00 PM – 1:00 AM"}</span>
          </div>

          {/* Maps */}
          <a
            href={settings.maps_url || "https://maps.google.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 rounded-2xl bg-[#171717] border border-neutral-800/80 hover:border-[#F5C518]/50 transition-colors"
          >
            <MapPin className="w-5 h-5 text-[#F5C518] mb-2" />
            <span className="text-xs font-bold text-white mb-0.5">Location</span>
            <span className="text-xs text-neutral-400">View on Google Maps</span>
          </a>
        </div>

        {/* Social and links */}
        <div className="flex items-center gap-6 mb-8 text-neutral-400">
          {settings.instagram && (
            <a
              href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#F5C518] transition-colors text-xs font-medium"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@{settings.instagram.replace('@', '')}</span>
            </a>
          )}
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-neutral-600 flex items-center gap-1">
          <span>© {new Date().getFullYear()} Crazy Bites. Made with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          <span>for food lovers.</span>
        </div>
      </div>
    </footer>
  );
};
