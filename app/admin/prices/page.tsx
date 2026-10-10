import React from 'react';
import { getMenuData } from '@/lib/data-store';
import { PriceTable } from '@/components/admin/PriceTable';

export default async function AdminPricesPage() {
  const menuData = await getMenuData();

  return <PriceTable categories={menuData.categories} />;
}
