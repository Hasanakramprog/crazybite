'use server';

import { revalidatePath } from 'next/cache';
import { getLocalMenuData, saveLocalMenuData } from '@/lib/data-store';
import { createClient } from '@/lib/supabase/server';
import { MenuItem } from '@/lib/types';

export async function addItem(formData: FormData) {
  const category_id = formData.get('category_id') as string;
  const name_en = (formData.get('name_en') as string)?.trim() || 'New Item';
  const name_ar = (formData.get('name_ar') as string)?.trim() || '';
  const description_en = (formData.get('description_en') as string)?.trim() || '';
  const description_ar = (formData.get('description_ar') as string)?.trim() || '';
  const price_usd = parseFloat((formData.get('price_usd') as string) || '0');
  const price_lbp = formData.get('price_lbp') ? parseInt(formData.get('price_lbp') as string) : undefined;
  const image_url = (formData.get('image_url') as string)?.trim() || '';
  const tagsStr = (formData.get('tags') as string)?.trim() || '';
  const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const is_available = formData.get('is_available') !== 'false';

  const supabase = await createClient();

  if (supabase) {
    try {
      const { data: countData } = await supabase
        .from('items')
        .select('id')
        .eq('category_id', category_id);

      const sort_order = (countData?.length || 0) + 1;

      await supabase.from('items').insert({
        category_id,
        name_en,
        name_ar,
        description_en,
        description_ar,
        price_usd,
        price_lbp,
        image_url: image_url || null,
        tags,
        is_available,
        sort_order,
      });

      revalidatePath('/');
      revalidatePath('/admin/items');
      revalidatePath('/admin/prices');
      return { success: true };
    } catch (e) {
      console.warn('Supabase insert item failed', e);
    }
  }

  // Local fallback
  const menu = getLocalMenuData();
  const category = menu.categories.find((c) => c.id === category_id);
  if (category) {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      category_id,
      name_en,
      name_ar,
      description_en,
      description_ar,
      price_usd,
      price_lbp,
      image_url: image_url || undefined,
      tags,
      is_available,
      sort_order: (category.items?.length || 0) + 1,
    };
    category.items = category.items || [];
    category.items.push(newItem);
    saveLocalMenuData(menu);
  }

  revalidatePath('/');
  revalidatePath('/admin/items');
  revalidatePath('/admin/prices');
  return { success: true };
}

export async function updateItem(id: string, formData: FormData) {
  const name_en = (formData.get('name_en') as string)?.trim();
  const name_ar = (formData.get('name_ar') as string)?.trim();
  const description_en = (formData.get('description_en') as string)?.trim();
  const description_ar = (formData.get('description_ar') as string)?.trim();
  const price_usd = formData.get('price_usd') ? parseFloat(formData.get('price_usd') as string) : undefined;
  const price_lbp = formData.get('price_lbp') ? parseInt(formData.get('price_lbp') as string) : undefined;
  const image_url = formData.get('image_url') as string;
  const tagsStr = formData.get('tags') as string;
  const tags = tagsStr !== null ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : undefined;
  const is_available = formData.get('is_available') ? formData.get('is_available') === 'true' : undefined;

  const supabase = await createClient();

  if (supabase) {
    try {
      const updates: any = {};
      if (name_en !== undefined) updates.name_en = name_en;
      if (name_ar !== undefined) updates.name_ar = name_ar;
      if (description_en !== undefined) updates.description_en = description_en;
      if (description_ar !== undefined) updates.description_ar = description_ar;
      if (price_usd !== undefined) updates.price_usd = price_usd;
      if (price_lbp !== undefined) updates.price_lbp = price_lbp;
      if (image_url !== undefined) updates.image_url = image_url || null;
      if (tags !== undefined) updates.tags = tags;
      if (is_available !== undefined) updates.is_available = is_available;

      await supabase.from('items').update(updates).eq('id', id);

      revalidatePath('/');
      revalidatePath('/admin/items');
      revalidatePath('/admin/prices');
      return { success: true };
    } catch (e) {
      console.warn('Supabase update item failed', e);
    }
  }

  const menu = getLocalMenuData();
  for (const cat of menu.categories) {
    const item = cat.items.find((i) => i.id === id);
    if (item) {
      if (name_en !== undefined) item.name_en = name_en;
      if (name_ar !== undefined) item.name_ar = name_ar;
      if (description_en !== undefined) item.description_en = description_en;
      if (description_ar !== undefined) item.description_ar = description_ar;
      if (price_usd !== undefined) item.price_usd = price_usd;
      if (price_lbp !== undefined) item.price_lbp = price_lbp;
      if (image_url !== undefined) item.image_url = image_url || undefined;
      if (tags !== undefined) item.tags = tags;
      if (is_available !== undefined) item.is_available = is_available;
      break;
    }
  }
  saveLocalMenuData(menu);

  revalidatePath('/');
  revalidatePath('/admin/items');
  revalidatePath('/admin/prices');
  return { success: true };
}

export async function deleteItem(id: string) {
  const supabase = await createClient();

  if (supabase) {
    try {
      await supabase.from('items').delete().eq('id', id);
      revalidatePath('/');
      revalidatePath('/admin/items');
      revalidatePath('/admin/prices');
      return { success: true };
    } catch (e) {
      console.warn('Supabase delete item failed', e);
    }
  }

  const menu = getLocalMenuData();
  for (const cat of menu.categories) {
    cat.items = cat.items.filter((i) => i.id !== id);
  }
  saveLocalMenuData(menu);

  revalidatePath('/');
  revalidatePath('/admin/items');
  revalidatePath('/admin/prices');
  return { success: true };
}

export async function toggleItemAvailability(id: string, is_available: boolean) {
  const supabase = await createClient();

  if (supabase) {
    try {
      await supabase.from('items').update({ is_available }).eq('id', id);
      revalidatePath('/');
      revalidatePath('/admin/items');
      revalidatePath('/admin/prices');
      return { success: true };
    } catch (e) {
      console.warn('Supabase toggle availability failed', e);
    }
  }

  const menu = getLocalMenuData();
  for (const cat of menu.categories) {
    const item = cat.items.find((i) => i.id === id);
    if (item) {
      item.is_available = is_available;
      break;
    }
  }
  saveLocalMenuData(menu);

  revalidatePath('/');
  revalidatePath('/admin/items');
  revalidatePath('/admin/prices');
  return { success: true };
}

export async function quickUpdatePrices(updates: Array<{ id: string; price_usd: number }>) {
  const supabase = await createClient();

  if (supabase) {
    try {
      for (const update of updates) {
        await supabase
          .from('items')
          .update({ price_usd: update.price_usd })
          .eq('id', update.id);
      }
      revalidatePath('/');
      revalidatePath('/admin/prices');
      revalidatePath('/admin/items');
      return { success: true };
    } catch (e) {
      console.warn('Supabase quick update prices failed', e);
    }
  }

  const menu = getLocalMenuData();
  const priceMap = new Map(updates.map((u) => [u.id, u.price_usd]));
  for (const cat of menu.categories) {
    for (const item of cat.items) {
      if (priceMap.has(item.id)) {
        item.price_usd = priceMap.get(item.id)!;
      }
    }
  }
  saveLocalMenuData(menu);

  revalidatePath('/');
  revalidatePath('/admin/prices');
  revalidatePath('/admin/items');
  return { success: true };
}

export async function bulkUpdatePrices(options: {
  category_id?: string; // all if undefined
  mode: 'percent' | 'fixed';
  action: 'increase' | 'decrease';
  value: number;
}) {
  const { category_id, mode, action, value } = options;

  const calculateNewPrice = (current: number): number => {
    let diff = 0;
    if (mode === 'percent') {
      diff = current * (value / 100);
    } else {
      diff = value;
    }
    const result = action === 'increase' ? current + diff : current - diff;
    return Math.max(0, Math.round(result * 100) / 100);
  };

  const menu = getLocalMenuData();
  const updates: Array<{ id: string; price_usd: number }> = [];

  for (const cat of menu.categories) {
    if (category_id && cat.id !== category_id && cat.slug !== category_id) continue;
    for (const item of cat.items) {
      const newPrice = calculateNewPrice(item.price_usd);
      item.price_usd = newPrice;
      updates.push({ id: item.id, price_usd: newPrice });
    }
  }

  const supabase = await createClient();
  if (supabase) {
    try {
      for (const u of updates) {
        await supabase.from('items').update({ price_usd: u.price_usd }).eq('id', u.id);
      }
    } catch (e) {
      console.warn('Supabase bulk price update error:', e);
    }
  }

  saveLocalMenuData(menu);

  revalidatePath('/');
  revalidatePath('/admin/prices');
  revalidatePath('/admin/items');
  return { success: true, count: updates.length };
}
