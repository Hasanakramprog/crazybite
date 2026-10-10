import fs from 'fs';
import path from 'path';
import { Category, MenuData, MenuItem, RestaurantSettings } from './types';
import { createClient } from './supabase/server';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'menu.json');

export function getLocalMenuData(): MenuData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading local menu file:', error);
  }

  return {
    settings: {
      restaurant_name: "Crazy Bites",
      tagline_en: "Good Food • Bold Flavors • Always Crazy",
      tagline_ar: "أكل طيب • نكهات قوية • دايمًا كريزي",
      whatsapp: "+96176191122",
      instagram: "crazybites.lb",
      maps_url: "https://maps.google.com/?q=Crazy+Bites",
      hours: "Daily: 12:00 PM – 1:00 AM",
      default_currency: "USD",
      lbp_rate: 89500
    },
    categories: []
  };
}

export function saveLocalMenuData(data: MenuData): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local menu data:', error);
  }
}

export async function getMenuData(): Promise<MenuData> {
  const supabase = await createClient();

  if (supabase) {
    try {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .single();

      // Fetch categories with items
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*, items(*)')
        .order('sort_order', { ascending: true });

      if (!catError && categoriesData && categoriesData.length > 0) {
        // Sort items inside each category
        const categories = categoriesData.map((cat: any) => ({
          ...cat,
          items: (cat.items || []).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        }));

        const local = getLocalMenuData();
        return {
          settings: settingsData ? {
            restaurant_name: settingsData.restaurant_name || local.settings.restaurant_name,
            tagline_en: settingsData.tagline_en || local.settings.tagline_en,
            tagline_ar: settingsData.tagline_ar || local.settings.tagline_ar,
            whatsapp: settingsData.whatsapp || local.settings.whatsapp,
            instagram: settingsData.instagram || local.settings.instagram,
            maps_url: settingsData.maps_url || local.settings.maps_url,
            hours: typeof settingsData.hours === 'string' ? settingsData.hours : local.settings.hours,
            default_currency: settingsData.default_currency || 'USD',
            logo_url: settingsData.logo_url || local.settings.logo_url || '/images/logo.png',
            lbp_rate: local.settings.lbp_rate || 89500
          } : local.settings,
          categories
        };
      }
    } catch (err) {
      console.warn('Falling back to local data store due to Supabase error:', err);
    }
  }

  // Fallback to local data
  return getLocalMenuData();
}
