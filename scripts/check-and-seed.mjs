import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const url = 'https://jlpubxblcfgrnivjmifj.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpscHVieGJsY2Zncm5pdmptaWZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTYxMzQ3NCwiZXhwIjoyMTA3MTg5NDc0fQ.9dX75mQ4bFY4vaXLPvPieawUqMje8Bf8oofXrNj0w34';

const supabase = createClient(url, serviceKey);

async function main() {
  console.log('Testing connection to Supabase...');
  const { data: settings, error: settingsError } = await supabase.from('settings').select('*');

  if (settingsError) {
    console.error('Settings table error:', settingsError.message);
    if (settingsError.message.includes('relation "public.settings" does not exist')) {
      console.log('NOTICE: The SQL schema has not been run in Supabase yet. Please run supabase/schema.sql in the Supabase SQL editor.');
    }
    return;
  }

  console.log('Settings table exists! Row count:', settings.length);

  const { data: categories, error: catError } = await supabase.from('categories').select('*, items(*)');
  if (catError) {
    console.error('Categories query error:', catError.message);
    return;
  }

  console.log('Categories count in Supabase:', categories.length);
  const totalItems = categories.reduce((sum, c) => sum + (c.items ? c.items.length : 0), 0);
  console.log('Items count in Supabase:', totalItems);

  if (categories.length === 0) {
    console.log('Categories table is empty. Seeding data from data/menu.json...');
    const menuData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/menu.json'), 'utf-8'));

    // Insert settings
    await supabase.from('settings').upsert({
      id: 1,
      restaurant_name: menuData.settings.restaurant_name,
      tagline_en: menuData.settings.tagline_en,
      tagline_ar: menuData.settings.tagline_ar,
      whatsapp: menuData.settings.whatsapp,
      instagram: menuData.settings.instagram,
      maps_url: menuData.settings.maps_url,
      hours: menuData.settings.hours,
      default_currency: menuData.settings.default_currency,
      logo_url: menuData.settings.logo_url,
    });

    for (const cat of menuData.categories) {
      const { data: insertedCat, error: insertCatErr } = await supabase.from('categories').insert({
        slug: cat.slug,
        name_en: cat.name_en,
        name_ar: cat.name_ar,
        sort_order: cat.sort_order,
        is_visible: true,
      }).select().single();

      if (insertCatErr) {
        console.error('Error inserting category', cat.name_en, insertCatErr);
        continue;
      }

      console.log(`Inserted category: ${cat.name_en}`);

      for (const item of cat.items) {
        await supabase.from('items').insert({
          category_id: insertedCat.id,
          name_en: item.name_en,
          name_ar: item.name_ar,
          description_en: item.description_en,
          description_ar: item.description_ar,
          price_usd: item.price_usd,
          price_lbp: item.price_lbp || null,
          tags: item.tags || [],
          is_available: item.is_available,
          sort_order: item.sort_order,
        });
      }
      console.log(`  Inserted ${cat.items.length} items for ${cat.name_en}`);
    }
    console.log('Seeding completed successfully!');
  } else {
    console.log('Database already contains data! No seeding needed.');
  }
}

main().catch(console.error);
