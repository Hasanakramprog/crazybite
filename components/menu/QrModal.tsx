'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QrCode, X, Download, ExternalLink, Check } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface QrModalProps {
  lang: Language;
}

export const QrModal: React.FC<QrModalProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false);
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-sm bg-[#171717] border border-neutral-700/80 rounded-3xl p-6 sm:p-7 text-center shadow-2xl shadow-black/80 my-auto">
        {/* Prominent Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-4 end-4 w-9 h-9 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F5C518] mb-3 text-black shadow-md shadow-[#F5C518]/20">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black uppercase text-white tracking-wide mb-1">
          Crazy Bites
        </h3>
        <p className="text-xs text-neutral-400 mb-5">
          {t.scan_for_menu}
        </p>

        {/* QR Code Container */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-[#F5C518] rounded-2xl shadow-xl border-4 border-black inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/qr?format=png"
              alt="Crazy Bites Menu QR Code"
              width={200}
              height={200}
              className="rounded-lg block"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <a
            href="/api/qr?format=png"
            download="crazy-bites-menu-qr.png"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#F5C518] hover:bg-[#e0b314] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res QR (PNG)</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs rounded-xl transition-colors active:scale-[0.98] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Link Copied!</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>Copy Menu Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#F5C518]/50 transition-colors cursor-pointer"
        title={t.qr_code}
      >
        <QrCode className="w-3.5 h-3.5 text-[#F5C518]" />
        <span>{t.qr_code}</span>
      </button>

      {mounted && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
};
