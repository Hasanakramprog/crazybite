'use client';

import React, { useState } from 'react';
import { RestaurantSettings } from '@/lib/types';
import {
  Settings,
  Phone,
  Clock,
  MapPin,
  DollarSign,
  Save,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { updateSettings } from '@/app/actions/settings';

interface SettingsFormProps {
  initialSettings: RestaurantSettings;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialSettings }) => {
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await updateSettings(fd);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
          <span>Restaurant Settings</span>
          <Settings className="w-6 h-6 text-[#F5C518]" />
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Control contact info, WhatsApp order recipient, opening hours, branding, and currency exchange rate.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#171717] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Brand Information */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-[#F5C518] mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Brand Information</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                Restaurant Name
              </label>
              <input
                type="text"
                name="restaurant_name"
                defaultValue={initialSettings.restaurant_name}
                required
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                Tagline (English)
              </label>
              <input
                type="text"
                name="tagline_en"
                defaultValue={initialSettings.tagline_en}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">
              Tagline (Arabic)
            </label>
            <input
              type="text"
              name="tagline_ar"
              dir="rtl"
              defaultValue={initialSettings.tagline_ar}
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F5C518]"
            />
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#F5C518] mb-4 flex items-center gap-1.5">
            <Phone className="w-4 h-4" />
            <span>Ordering & Contact Channels</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                WhatsApp Order Number
              </label>
              <input
                type="text"
                name="whatsapp"
                defaultValue={initialSettings.whatsapp}
                placeholder="+96176191122"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#F5C518]"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Customers click this number to instantly send WhatsApp orders.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                Instagram Handle
              </label>
              <div className="relative">
                <svg className="absolute start-3 top-2.5 w-4 h-4 fill-neutral-500" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <input
                  type="text"
                  name="instagram"
                  defaultValue={initialSettings.instagram}
                  placeholder="crazybites.lb"
                  className="w-full ps-9 pe-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                Opening Hours
              </label>
              <div className="relative">
                <Clock className="absolute start-3 top-2.5 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  name="hours"
                  defaultValue={initialSettings.hours}
                  placeholder="Daily: 12:00 PM – 1:00 AM"
                  className="w-full ps-9 pe-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                Google Maps Location URL
              </label>
              <div className="relative">
                <MapPin className="absolute start-3 top-2.5 w-4 h-4 text-neutral-500" />
                <input
                  type="url"
                  name="maps_url"
                  defaultValue={initialSettings.maps_url}
                  placeholder="https://maps.google.com/?q=Crazy+Bites"
                  className="w-full ps-9 pe-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Exchange Rate */}
        <div className="border-t border-neutral-800 pt-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#F5C518] mb-4 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            <span>Currency & Pricing Options</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                Default Currency
              </label>
              <input
                type="text"
                name="default_currency"
                defaultValue={initialSettings.default_currency}
                required
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                LBP Exchange Rate (1 USD = ? L.L)
              </label>
              <input
                type="number"
                name="lbp_rate"
                defaultValue={initialSettings.lbp_rate || 89500}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#F5C518]"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Used to display Lebanese Pound estimates beneath the USD prices.
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-neutral-800">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#e0b314] text-black font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : savedSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
