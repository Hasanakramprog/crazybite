'use server';

import { revalidatePath } from 'next/cache';
import { getLocalMenuData, saveLocalMenuData } from '@/lib/data-store';
import { createClient } from '@/lib/supabase/server';
import { Category } from '@/lib/types';

export async function addCategory(formData: FormData) {
  const name_en = (formData.get('name_en') as string)?.trim() || 'New Category';
  const name_ar = (formData.get('name_ar') as string)?.trim() || '';
  const slug = (formData.get('slug') as string)?.trim().toLowerCase() || name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const supabase = await createClient();

  if (supabase) {
    try {
      const { data: countData } = await supabase.from('categories').select('id');
      const sort_order = (countData?.length || 0) + 1;
      await supabase.from('categories').insert({
        slug,
        name_en,
        name_ar,
        sort_order,
        is_visible: true,
      });
      revalidatePath('/');
      revalidatePath('/admin/categories');
      return { success: true };
    } catch (e) {
      console.warn('Supabase insert category failed, falling back to local file', e);
    }
  }

  // Local fallback
  const menu = getLocalMenuData();
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    slug,
    name_en,
    name_ar,
    sort_order: menu.categories.length + 1,
    is_visible: true,
    items: [],
  };

  menu.categories.push(newCat);
  saveLocalMenuData(menu);

  revalidatePath('/');
  revalidatePath('/admin/categories');
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const name_en = (formData.get('name_en') as string)?.trim();
  const name_ar = (formData.get('name_ar') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim();
  const is_visible = formData.get('is_visible') === 'true';

  const supabase = await createClient();

  if (supabase) {
    try {
      await supabase
        .from('categories')
        .update({
          name_en,
          name_ar,
          slug,
          is_visible,
        })
        .eq('id', id);
      revalidatePath('/');
      revalidatePath('/admin/categories');
      return { success: true };
    } catch (e) {
      console.warn('Supabase update category failed', e);
    }
  }

  const menu = getLocalMenuData();
  const cat = menu.categories.find((c) => c.id === id);
  if (cat) {
    if (name_en) cat.name_en = name_en;
    if (name_ar !== undefined) cat.name_ar = name_ar;
    if (slug) cat.slug = slug;
    cat.is_visible = is_visible;
    saveLocalMenuData(menu);
  }

  revalidatePath('/');
  revalidatePath('/admin/categories');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  if (supabase) {
    try {
      await supabase.from('categories').delete().eq('id', id);
      revalidatePath('/');
      revalidatePath('/admin/categories');
      return { success: true };
    } catch (e) {
      console.warn('Supabase delete category failed', e);
    }
  }

  const menu = getLocalMenuData();
  menu.categories = menu.categories.filter((c) => c.id !== id);
  saveLocalMenuData(menu);

  revalidatePath('/');
  revalidatePath('/admin/categories');
  return { success: true };
}

export async function reorderCategories(orderedIds: string[]) {
  const supabase = await createClient();

  if (supabase) {
    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await supabase
          .from('categories')
          .update({ sort_order: i + 1 })
          .eq('id', orderedIds[i]);
      }
      revalidatePath('/');
      revalidatePath('/admin/categories');
      return { success: true };
    } catch (e) {
      console.warn('Supabase reorder categories failed', e);
    }
  }

  const menu = getLocalMenuData();
  const catMap = new Map(menu.categories.map((c) => [c.id, c]));
  const reordered: Category[] = [];

  orderedIds.forEach((id, index) => {
    const cat = catMap.get(id);
    if (cat) {
      cat.sort_order = index + 1;
      reordered.push(cat);
      catMap.delete(id);
    }
  });

  // Append any others not in the ordered list
  catMap.forEach((cat) => reordered.push(cat));

  menu.categories = reordered;
  saveLocalMenuData(menu);

  revalidatePath('/');
  revalidatePath('/admin/categories');
  return { success: true };
}
