export interface MenuItem {
  id: string;
  category_id?: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  price_usd: number;
  price_lbp?: number;
  image_url?: string;
  tags?: string[];
  is_available: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  items: MenuItem[];
}

export interface RestaurantSettings {
  id?: number;
  restaurant_name: string;
  tagline_en: string;
  tagline_ar: string;
  logo_url?: string;
  whatsapp: string;
  instagram?: string;
  maps_url?: string;
  hours?: string;
  default_currency: string;
  lbp_rate?: number;
}

export interface MenuData {
  settings: RestaurantSettings;
  categories: Category[];
}
