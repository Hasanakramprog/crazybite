'use client';

import React, { useState, useMemo } from 'react';
import { Category, MenuItem } from '@/lib/types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Star,
  Flame,
} from 'lucide-react';
import {
  addItem,
  updateItem,
  deleteItem,
  toggleItemAvailability,
} from '@/app/actions/items';

interface ItemsManagerProps {
  categories: Category[];
}

export const ItemsManager: React.FC<ItemsManagerProps> = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: MenuItem; categoryId: string } | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);

  // All items with their category reference
  const allItemsWithCat = useMemo(() => {
    return categories.flatMap((cat) =>
      (cat.items || []).map((item) => ({
        ...item,
        categoryTitle: cat.name_en,
        categoryId: cat.id,
      }))
    );
  }, [categories]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return allItemsWithCat.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        item.name_en.toLowerCase().includes(q) ||
        (item.name_ar && item.name_ar.toLowerCase().includes(q)) ||
        (item.description_en && item.description_en.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [allItemsWithCat, selectedCategory, searchTerm]);

  const handleToggle = async (item: MenuItem) => {
    const nextVal = !item.is_available;
    await toggleItemAvailability(item.id, nextVal);
    window.location.reload();
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await addItem(fd);
    setIsAddOpen(false);
    setLoading(false);
    window.location.reload();
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await updateItem(editingItem.item.id, fd);
    setEditingItem(null);
    setLoading(false);
    window.location.reload();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setLoading(true);
    await deleteItem(deletingItem.id);
    setDeletingItem(null);
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Menu Items Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Add dishes, edit bilingual names and descriptions, set prices, and manage availability.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#e0b314] text-black font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Category selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56 px-3.5 py-2.5 bg-[#171717] border border-neutral-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#F5C518]"
        >
          <option value="all">All Categories ({allItemsWithCat.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_en} ({c.items?.length || 0})
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative w-full flex-1">
          <Search className="absolute start-3.5 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items by name or description..."
            className="w-full ps-10 pe-4 py-2.5 bg-[#171717] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F5C518]"
          />
        </div>
      </div>

      {/* Items Table / Cards */}
      <div className="bg-[#171717] border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800/80">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-xs">
            No items found matching your filters.
          </div>
        ) : (
          filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-900/60 transition-colors"
              >
                {/* Item Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      {item.categoryTitle}
                    </span>
                    <h3 className="font-bold text-white text-base">
                      {item.name_en}
                    </h3>
                    {item.name_ar && (
                      <span className="text-xs text-neutral-400 font-medium">
                        ({item.name_ar})
                      </span>
                    )}

                    {item.tags?.map((t) => (
                      <span
                        key={t}
                        className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          t === 'signature'
                            ? 'bg-[#F5C518] text-black'
                            : t === 'spicy'
                            ? 'bg-red-950 text-red-400'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {item.description_en && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                      {item.description_en}
                    </p>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-end">
                    <div className="text-base font-black text-[#F5C518]">
                      ${item.price_usd % 1 === 0 ? item.price_usd : item.price_usd.toFixed(2)}
                    </div>
                  </div>

                  {/* Availability toggle */}
                  <button
                    onClick={() => handleToggle(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      item.is_available
                        ? 'bg-green-950/50 text-green-400 border border-green-800/60'
                        : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                    }`}
                  >
                    {item.is_available ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Sold Out</span>
                      </>
                    )}
                  </button>

                  {/* Edit and Delete buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem({ item, categoryId: item.categoryId })}
                      className="p-2 text-neutral-400 hover:text-[#F5C518] hover:bg-neutral-800 rounded-xl transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-xl transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#171717] border border-neutral-800 rounded-3xl p-6 shadow-2xl my-8">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 end-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black uppercase text-white mb-4">
              Add New Menu Item
            </h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Category *
                </label>
                <select
                  name="category_id"
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en} ({c.name_ar || ''})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    required
                    placeholder="e.g. Crispy Burger"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Name (Arabic)
                  </label>
                  <input
                    type="text"
                    name="name_ar"
                    dir="rtl"
                    placeholder="مثال: كرسبي برجر"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    name="price_usd"
                    required
                    placeholder="6.00"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="signature, spicy, popular"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Description (English)
                </label>
                <textarea
                  name="description_en"
                  rows={2}
                  placeholder="Ingredients, toppings, special sauces..."
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Description (Arabic)
                </label>
                <textarea
                  name="description_ar"
                  dir="rtl"
                  rows={2}
                  placeholder="المكونات، الصوصات، الإضافات..."
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="add_is_available"
                  name="is_available"
                  value="true"
                  defaultChecked
                  className="w-4 h-4 accent-[#F5C518]"
                />
                <label htmlFor="add_is_available" className="text-xs text-neutral-300 font-medium">
                  Available in stock immediately
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#F5C518] hover:bg-[#e0b314] text-black text-xs font-black uppercase rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#171717] border border-neutral-800 rounded-3xl p-6 shadow-2xl my-8">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 end-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black uppercase text-white mb-4">
              Edit Menu Item
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    required
                    defaultValue={editingItem.item.name_en}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Name (Arabic)
                  </label>
                  <input
                    type="text"
                    name="name_ar"
                    dir="rtl"
                    defaultValue={editingItem.item.name_ar}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    name="price_usd"
                    required
                    defaultValue={editingItem.item.price_usd}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingItem.item.tags?.join(', ') || ''}
                    placeholder="signature, spicy, popular"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Description (English)
                </label>
                <textarea
                  name="description_en"
                  rows={2}
                  defaultValue={editingItem.item.description_en || ''}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Description (Arabic)
                </label>
                <textarea
                  name="description_ar"
                  dir="rtl"
                  rows={2}
                  defaultValue={editingItem.item.description_ar || ''}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit_is_available"
                  name="is_available"
                  value="true"
                  defaultChecked={editingItem.item.is_available}
                  className="w-4 h-4 accent-[#F5C518]"
                />
                <label htmlFor="edit_is_available" className="text-xs text-neutral-300 font-medium">
                  Available in stock
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#F5C518] hover:bg-[#e0b314] text-black text-xs font-black uppercase rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#171717] border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-black uppercase text-white mb-2">
              Delete Item?
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-white">"{deletingItem.name_en}"</strong> from the menu? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
