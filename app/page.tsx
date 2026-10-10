import { cookies } from 'next/headers';
import { getMenuData } from '@/lib/data-store';
import { MenuClientView } from '@/components/menu/MenuClientView';
import { Language } from '@/lib/i18n';

export default async function HomePage() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('lang')?.value as Language;
  const initialLang: Language = langCookie === 'ar' ? 'ar' : 'en';

  const menuData = await getMenuData();

  return (
    <MenuClientView
      initialCategories={menuData.categories}
      initialSettings={menuData.settings}
      initialLang={initialLang}
    />
  );
}
