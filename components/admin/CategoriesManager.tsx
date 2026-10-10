'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '@/app/actions/categories';

interface CategoriesManagerProps {
  initialCategories: Category[];
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({ initialCategories }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  // Reorder category up or down
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const next = [...categories];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    setCategories(next);
    await reorderCategories(next.map((c) => c.id));
  };

  const handleToggleVisibility = async (cat: Category) => {
    const updated = !cat.is_visible;
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, is_visible: updated } : c))
    );

    const fd = new FormData();
    fd.append('name_en', cat.name_en);
    fd.append('name_ar', cat.name_ar || '');
    fd.append('slug', cat.slug);
    fd.append('is_visible', String(updated));

    await updateCategory(cat.id, fd);
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await addCategory(fd);
    setIsAddOpen(false);
    setLoading(false);
    window.location.reload();
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await updateCategory(editingCategory.id, fd);
    setEditingCategory(null);
    setLoading(false);
    window.location.reload();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    setLoading(true);
    await deleteCategory(deletingCategory.id);
    setDeletingCategory(null);
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Categories Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Organize menu tabs, rename Arabic and English titles, and control visibility.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#e0b314] text-black font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="bg-[#171717] border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800/80">
        {categories.map((cat, index) => {
          const itemCount = cat.items?.length || 0;

          return (
            <div
              key={cat.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-900/60 transition-colors"
            >
              {/* Order buttons and Info */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 hover:bg-neutral-800 rounded transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === categories.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 hover:bg-neutral-800 rounded transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">
                      {cat.name_en}
                    </h3>
                    {cat.name_ar && (
                      <span className="text-xs text-neutral-400 font-medium">
                        ({cat.name_ar})
                      </span>
                    )}
                    {!cat.is_visible && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                    <span className="font-mono">slug: {cat.slug}</span>
                    <span>•</span>
                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleVisibility(cat)}
                  className={`p-2 rounded-xl transition-colors ${
                    cat.is_visible
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      : 'text-amber-500 bg-amber-950/30'
                  }`}
                  title={cat.is_visible ? 'Hide from public menu' : 'Make visible'}
                >
                  {cat.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setEditingCategory(cat)}
                  className="p-2 text-neutral-400 hover:text-[#F5C518] hover:bg-neutral-800 rounded-xl transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeletingCategory(cat)}
                  className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-xl transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#171717] border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 end-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black uppercase text-white mb-4">
              Add New Category
            </h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Name (English) *
                </label>
                <input
                  type="text"
                  name="name_en"
                  required
                  placeholder="e.g. Appetizers"
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
                  placeholder="مثال: مقبلات"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Slug (URL-friendly ID)
                </label>
                <input
                  type="text"
                  name="slug"
                  placeholder="e.g. appetizers"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                />
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
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#171717] border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setEditingCategory(null)}
              className="absolute top-4 end-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black uppercase text-white mb-4">
              Edit Category
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Name (English) *
                </label>
                <input
                  type="text"
                  name="name_en"
                  defaultValue={editingCategory.name_en}
                  required
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
                  defaultValue={editingCategory.name_ar}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingCategory.slug}
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <input
                type="hidden"
                name="is_visible"
                value={String(editingCategory.is_visible)}
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
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

      {/* Delete Confirmation Modal (Safety requirement from Section 7) */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#171717] border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="p-2 rounded-xl bg-red-950 border border-red-800">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black uppercase text-white">
                Delete Category?
              </h2>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Are you sure you want to delete <strong className="text-white">"{deletingCategory.name_en}"</strong>?
              <br />
              <span className="text-red-400 font-semibold">
                ⚠️ Warning: This will permanently delete all {deletingCategory.items?.length || 0} item(s) inside this category.
              </span>
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
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
                <span>Delete ({deletingCategory.items?.length || 0} items)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
