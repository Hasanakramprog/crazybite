'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getLocalMenuData, saveLocalMenuData } from '@/lib/data-store';
import { createClient } from '@/lib/supabase/server';
import { RestaurantSettings } from '@/lib/types';

export async function updateSettings(formData: FormData) {
  const restaurant_name = (formData.get('restaurant_name') as string)?.trim() || 'Crazy Bites';
  const tagline_en = (formData.get('tagline_en') as string)?.trim() || '';
  const tagline_ar = (formData.get('tagline_ar') as string)?.trim() || '';
  const whatsapp = (formData.get('whatsapp') as string)?.trim() || '+96176191122';
  const instagram = (formData.get('instagram') as string)?.trim() || '';
  const maps_url = (formData.get('maps_url') as string)?.trim() || '';
  const hours = (formData.get('hours') as string)?.trim() || '';
  const default_currency = (formData.get('default_currency') as string)?.trim() || 'USD';
  const lbp_rate = formData.get('lbp_rate') ? parseInt(formData.get('lbp_rate') as string) : 89500;

  const supabase = await createClient();

  if (supabase) {
    try {
      await supabase
        .from('settings')
        .upsert({
          id: 1,
          restaurant_name,
          tagline_en,
          tagline_ar,
          whatsapp,
          instagram,
          maps_url,
          hours,
          default_currency,
        });
      revalidatePath('/');
      revalidatePath('/admin/settings');
      return { success: true };
    } catch (e) {
      console.warn('Supabase settings update error:', e);
    }
  }

  const menu = getLocalMenuData();
  menu.settings = {
    restaurant_name,
    tagline_en,
    tagline_ar,
    whatsapp,
    instagram,
    maps_url,
    hours,
    default_currency,
    lbp_rate,
  };
  saveLocalMenuData(menu);

  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true };
}

export async function loginAdmin(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  const supabase = await createClient();

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  // Demo / local mode authentication fallback
  // In demo mode without Supabase, allow admin with demo password or any admin login
  if (password === 'admin123' || password === 'crazybites' || (email && password)) {
    const cookieStore = await cookies();
    cookieStore.set('crazybites_admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid credentials. (Hint: Use password "admin123" for local demo mode)' };
}

export async function logoutAdmin() {
  const supabase = await createClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.delete('crazybites_admin_session');

  return { success: true };
}
