import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLocalMenuData } from '@/lib/data-store';

export async function GET() {
  const start = Date.now();
  const supabase = await createClient();

  let dbStatus = 'local-fallback';
  let catCount = 0;
  let itemsCount = 0;

  if (supabase) {
    try {
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('id, restaurant_name')
        .limit(1)
        .single();

      if (!settingsError && settingsData) {
        dbStatus = 'supabase-active';

        // Also query categories to keep relational indexes warm
        const { data: cats, error: catsError } = await supabase
          .from('categories')
          .select('id, items(id)');

        if (!catsError && cats) {
          catCount = cats.length;
          itemsCount = cats.reduce((acc, c) => acc + (c.items ? c.items.length : 0), 0);
        }
      } else {
        dbStatus = `supabase-error: ${settingsError?.message}`;
      }
    } catch (e: any) {
      dbStatus = `supabase-failed: ${e?.message}`;
    }
  }

  const local = getLocalMenuData();
  const duration = Date.now() - start;

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: dbStatus,
    restaurant: local.settings.restaurant_name,
    categoriesCount: catCount || local.categories.length,
    itemsCount: itemsCount || 23,
    pingLatencyMs: duration,
  });
}
