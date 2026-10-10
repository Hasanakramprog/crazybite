import React from 'react';
import { getMenuData } from '@/lib/data-store';
import { SettingsForm } from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  const menuData = await getMenuData();

  return <SettingsForm initialSettings={menuData.settings} />;
}
