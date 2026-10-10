import React from 'react';
import { getMenuData } from '@/lib/data-store';
import { ItemsManager } from '@/components/admin/ItemsManager';

export default async function AdminItemsPage() {
  const menuData = await getMenuData();

  return <ItemsManager categories={menuData.categories} />;
}
