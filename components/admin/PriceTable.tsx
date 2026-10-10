'use client';

import React, { useState, useMemo } from 'react';
import { Category } from '@/lib/types';
import {
  DollarSign,
  Save,
  RotateCcw,
  Percent,
  TrendingUp,
  TrendingDown,
  Loader2,
  Check,
  Search,
  Sparkles,
} from 'lucide-react';
import { quickUpdatePrices, bulkUpdatePrices } from '@/app/actions/items';

interface PriceTableProps {
  categories: Category[];
}

export const PriceTable: React.FC<PriceTableProps> = ({ categories }) => {
  // Flatten items with their category name
  const originalItems = useMemo(() => {
    return categories.flatMap((c) =>
      (c.items || []).map((i) => ({
        id: i.id,
        name_en: i.name_en,
        name_ar: i.name_ar,
        categoryName: c.name_en,
        categoryId: c.id,
        price_usd: i.price_usd,
      }))
    );
  }, [categories]);

  // Current edited prices map: id -> price_usd
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    originalItems.forEach((i) => {
      map[i.id] = i.price_usd;
    });
    return map;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Bulk edit state
  const [bulkCategory, setBulkCategory] = useState<string>('all');
  const [bulkMode, setBulkMode] = useState<'percent' | 'fixed'>('percent');
  const [bulkAction, setBulkAction] = useState<'increase' | 'decrease'>('increase');
  const [bulkValue, setBulkValue] = useState<number>(10);
  const [showBulkPreview, setShowBulkPreview] = useState(false);

  // Detect dirty (unsaved) changes
  const changedItemsCount = useMemo(() => {
    return originalItems.filter((item) => editedPrices[item.id] !== item.price_usd).length;
  }, [originalItems, editedPrices]);

  const handlePriceChange = (id: string, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setEditedPrices((prev) => ({ ...prev, [id]: num }));
    }
  };

  const handleReset = () => {
    const map: Record<string, number> = {};
    originalItems.forEach((i) => {
      map[i.id] = i.price_usd;
    });
    setEditedPrices(map);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    const updates = originalItems
      .filter((item) => editedPrices[item.id] !== item.price_usd)
      .map((item) => ({
        id: item.id,
        price_usd: editedPrices[item.id],
      }));

    if (updates.length > 0) {
      await quickUpdatePrices(updates);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setLoading(false);
  };

  // Bulk calculation preview
  const bulkPreviewList = useMemo(() => {
    const targets = originalItems.filter(
      (item) => bulkCategory === 'all' || item.categoryId === bulkCategory
    );

    return targets.map((item) => {
      const current = editedPrices[item.id] ?? item.price_usd;
      let diff = 0;
      if (bulkMode === 'percent') {
        diff = current * (bulkValue / 100);
      } else {
        diff = bulkValue;
      }
      const newPrice = bulkAction === 'increase' ? current + diff : current - diff;
      const rounded = Math.max(0, Math.round(newPrice * 100) / 100);

      return {
        id: item.id,
        name_en: item.name_en,
        categoryName: item.categoryName,
        oldPrice: current,
        newPrice: rounded,
      };
    });
  }, [originalItems, editedPrices, bulkCategory, bulkMode, bulkAction, bulkValue]);

  const handleApplyBulk = () => {
    setEditedPrices((prev) => {
      const next = { ...prev };
      bulkPreviewList.forEach((p) => {
        next[p.id] = p.newPrice;
      });
      return next;
    });
    setShowBulkPreview(false);
  };

  const filteredItems = useMemo(() => {
    return originalItems.filter((i) => {
      const matchCat = selectedCatFilter === 'all' || i.categoryId === selectedCatFilter;
      const matchSearch =
        !searchTerm ||
        i.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.name_ar && i.name_ar.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [originalItems, selectedCatFilter, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span>Quick Price Editor</span>
            <DollarSign className="w-6 h-6 text-[#F5C518]" />
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Update prices inline directly from this table, or execute bulk price updates across whole categories.
          </p>
        </div>

        {/* Save Bar */}
        <div className="flex items-center gap-3">
          {changedItemsCount > 0 && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={handleSaveAll}
            disabled={loading || changedItemsCount === 0}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md ${
              changedItemsCount > 0
                ? 'bg-[#F5C518] hover:bg-[#e0b314] text-black active:scale-95'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : savedSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {savedSuccess
                ? 'Saved!'
                : changedItemsCount > 0
                ? `Save Changes (${changedItemsCount})`
                : 'All Saved'}
            </span>
          </button>
        </div>
      </div>

      {/* Bulk Price Changer Collapsible Tool */}
      <div className="bg-[#171717] border border-neutral-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F5C518]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Bulk Price Adjustment Tool
            </h2>
          </div>
          <span className="text-[11px] text-neutral-400">
            Apply changes to multiple items at once
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Target category */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1">
              Apply to:
            </label>
            <select
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F5C518]"
            >
              <option value="all">All Categories ({originalItems.length} items)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_en} ({c.items?.length || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Action */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1">
              Direction:
            </label>
            <div className="grid grid-cols-2 gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setBulkAction('increase')}
                className={`flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-bold transition-all ${
                  bulkAction === 'increase'
                    ? 'bg-[#F5C518] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                <span>+ Up</span>
              </button>
              <button
                type="button"
                onClick={() => setBulkAction('decrease')}
                className={`flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-bold transition-all ${
                  bulkAction === 'decrease'
                    ? 'bg-[#F5C518] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <TrendingDown className="w-3 h-3" />
                <span>- Down</span>
              </button>
            </div>
          </div>

          {/* Mode & Value */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-400 mb-1">
              Type & Amount:
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step={bulkMode === 'percent' ? '1' : '0.25'}
                min="0.1"
                value={bulkValue}
                onChange={(e) => setBulkValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#F5C518]"
              />
              <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setBulkMode('percent')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    bulkMode === 'percent' ? 'bg-[#F5C518] text-black' : 'text-neutral-400'
                  }`}
                  title="Percentage (%)"
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => setBulkMode('fixed')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    bulkMode === 'fixed' ? 'bg-[#F5C518] text-black' : 'text-neutral-400'
                  }`}
                  title="Fixed USD ($)"
                >
                  $
                </button>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setShowBulkPreview(true)}
              className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-[#F5C518] border border-neutral-700 hover:border-[#F5C518]/50 font-bold text-xs rounded-xl transition-all"
            >
              Preview Adjustment
            </button>
          </div>
        </div>

        {/* Live Preview Modal */}
        {showBulkPreview && (
          <div className="mt-5 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-300">
                Preview: {bulkPreviewList.length} items will be updated
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkPreview(false)}
                  className="px-3 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-lg hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyBulk}
                  className="px-4 py-1 bg-[#F5C518] text-black font-black text-xs rounded-lg hover:bg-[#e0b314]"
                >
                  Apply To Table
                </button>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-neutral-800 divide-y divide-neutral-800/80 bg-neutral-950/60">
              {bulkPreviewList.map((p) => (
                <div key={p.id} className="px-4 py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-semibold">{p.name_en}</span>
                    <span className="text-[10px] text-neutral-500 ms-2">({p.categoryName})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 line-through">${p.oldPrice.toFixed(2)}</span>
                    <span className="text-[#F5C518] font-bold">${p.newPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <select
          value={selectedCatFilter}
          onChange={(e) => setSelectedCatFilter(e.target.value)}
          className="w-full sm:w-56 px-3.5 py-2.5 bg-[#171717] border border-neutral-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#F5C518]"
        >
          <option value="all">All Categories ({originalItems.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_en} ({c.items?.length || 0})
            </option>
          ))}
        </select>

        <div className="relative w-full flex-1">
          <Search className="absolute start-3.5 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items by name..."
            className="w-full ps-10 pe-4 py-2.5 bg-[#171717] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F5C518]"
          />
        </div>
      </div>

      {/* Fast Inline Price Editor Table */}
      <div className="bg-[#171717] border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/60 text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                <th className="py-3.5 px-4 text-start">Category</th>
                <th className="py-3.5 px-4 text-start">Item Name (EN / AR)</th>
                <th className="py-3.5 px-4 text-end">Original Price</th>
                <th className="py-3.5 px-4 text-end w-40">Price (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-xs">
              {filteredItems.map((item) => {
                const isChanged = editedPrices[item.id] !== item.price_usd;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isChanged ? 'bg-[#F5C518]/10' : 'hover:bg-neutral-900/40'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-neutral-400 uppercase">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white text-sm">{item.name_en}</span>
                      {item.name_ar && (
                        <span className="text-neutral-400 text-xs ms-2">({item.name_ar})</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-end font-mono text-neutral-400">
                      ${item.price_usd % 1 === 0 ? item.price_usd : item.price_usd.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="inline-flex items-center gap-1">
                        <span className="text-neutral-400 font-bold">$</span>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          value={editedPrices[item.id] ?? item.price_usd}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          className={`w-24 px-2.5 py-1.5 rounded-lg border text-end font-mono font-bold text-sm focus:outline-none ${
                            isChanged
                              ? 'bg-[#F5C518] text-black border-[#F5C518]'
                              : 'bg-neutral-900 text-white border-neutral-700 focus:border-[#F5C518]'
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
