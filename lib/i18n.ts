export type Language = 'en' | 'ar';

export const translations = {
  en: {
    brand: "Crazy Bites",
    tagline: "Good Food • Bold Flavors • Always Crazy",
    slogan: "Good Food Makes Life Better",
    search_placeholder: "Search burgers, sandwiches, meals...",
    all_categories: "All Items",
    order_whatsapp: "Order on WhatsApp",
    call_us: "Call Us",
    open_hours: "Opening Hours",
    currency: "USD",
    sold_out: "Sold Out",
    available: "Available",
    no_items_found: "No items match your search",
    clear_search: "Clear search",
    price: "Price",
    tags: {
      signature: "Signature",
      "best-seller": "Best Seller",
      popular: "Popular",
      spicy: "Spicy 🔥",
      charcoal: "Charcoal Grilled",
      healthy: "Healthy",
      classic: "Classic",
      traditional: "Traditional",
    },
    admin_panel: "Admin Panel",
    admin_login: "Admin Sign In",
    logout: "Log Out",
    dashboard: "Dashboard",
    categories: "Categories",
    items: "Menu Items",
    quick_prices: "Quick Prices",
    settings: "Settings",
    view_live_menu: "View Menu",
    save_changes: "Save Changes",
    delete: "Delete",
    edit: "Edit",
    add_item: "Add Item",
    add_category: "Add Category",
    qr_code: "QR Code",
    scan_for_menu: "Scan for Menu",
    share_menu: "Share Menu",
  },
  ar: {
    brand: "كريزي بايتس",
    tagline: "أكل طيب • نكهات قوية • دايمًا كريزي",
    slogan: "الأكل الطيب بيحلّي الحياة",
    search_placeholder: "ابحث عن برجر، ساندويش، وجبات...",
    all_categories: "كل الأصناف",
    order_whatsapp: "اطلب عبر واتساب",
    call_us: "اتصل بنا",
    open_hours: "ساعات العمل",
    currency: "دولار",
    sold_out: "غير متوفر",
    available: "متوفر",
    no_items_found: "لا توجد نتائج مطابقة لبحثك",
    clear_search: "مسح البحث",
    price: "السعر",
    tags: {
      signature: "مميز ⭐️",
      "best-seller": "الأكثر طلباً 🔥",
      popular: "محبوب",
      spicy: "حار 🔥",
      charcoal: "عالفحم",
      healthy: "صحي",
      classic: "كلاسيك",
      traditional: "بلدي",
    },
    admin_panel: "لوحة التحكم",
    admin_login: "تسجيل دخول المشرف",
    logout: "تسجيل الخروج",
    dashboard: "الرئيسية",
    categories: "الأقسام",
    items: "الأصناف",
    quick_prices: "تعديل الأسعار السريع",
    settings: "الإعدادات",
    view_live_menu: "عرض القائمة",
    save_changes: "حفظ التغييرات",
    delete: "حذف",
    edit: "تعديل",
    add_item: "إضافة صنف",
    add_category: "إضافة قسم",
    qr_code: "رمز الـ QR",
    scan_for_menu: "امسح الرمز للقائمة",
    share_menu: "مشاركة القائمة",
  },
} as const;

export function formatPrice(usd: number, lbpRate?: number, defaultCurrency: string = 'USD'): { usdFormatted: string; lbpFormatted?: string } {
  // Format price: $6, $4.50 — remove trailing .00
  const usdFormatted = usd % 1 === 0 ? `$${usd}` : `$${usd.toFixed(2)}`;
  
  let lbpFormatted: string | undefined;
  if (lbpRate && lbpRate > 0) {
    const lbpValue = Math.round(usd * lbpRate);
    lbpFormatted = `${lbpValue.toLocaleString('en-US')} L.L`;
  }

  return { usdFormatted, lbpFormatted };
}
