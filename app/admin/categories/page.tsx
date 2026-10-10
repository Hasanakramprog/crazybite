import React from 'react';
import { getMenuData } from '@/lib/data-store';
import { CategoriesManager } from '@/components/admin/CategoriesManager';

export default async function AdminCategoriesPage() {
  const menuData = await getMenuData();

  return <CategoriesManager initialCategories={menuData.categories} />;
}
