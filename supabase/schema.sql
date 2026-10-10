-- ==============================================================================
-- Crazy Bites Database Schema & RLS Policies
-- ==============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- Categories
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_en     text not null,
  name_ar     text,
  sort_order  int  not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Items
create table if not exists public.items (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid not null references public.categories(id) on delete cascade,
  name_en        text not null,
  name_ar        text,
  description_en text,
  description_ar text,
  price_usd      numeric(10,2) not null check (price_usd >= 0),
  price_lbp      bigint,
  image_url      text,
  tags           text[] not null default '{}',
  is_available   boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists items_category_idx on public.items(category_id, sort_order);

-- Settings (single row)
create table if not exists public.settings (
  id               int primary key default 1 check (id = 1),
  restaurant_name  text not null default 'Crazy Bites',
  tagline_en       text,
  tagline_ar       text,
  logo_url         text,
  whatsapp         text,
  instagram        text,
  maps_url         text,
  hours            jsonb,
  default_currency text not null default 'USD'
);

-- Auto-update updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists items_updated_at on public.items;
create trigger items_updated_at
before update on public.items
for each row execute function public.set_updated_at();

-- ==============================================================================
-- Row Level Security (RLS)
-- ==============================================================================
alter table public.categories enable row level security;
alter table public.items      enable row level security;
alter table public.settings   enable row level security;

-- Public can read
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read items" on public.items;
create policy "public read items" on public.items for select using (true);

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);

-- Only authenticated admin can write
drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all
  to authenticated using (true) with check (true);

drop policy if exists "admin write items" on public.items;
create policy "admin write items" on public.items for all
  to authenticated using (true) with check (true);

drop policy if exists "admin write settings" on public.settings;
create policy "admin write settings" on public.settings for all
  to authenticated using (true) with check (true);

-- ==============================================================================
-- Storage bucket policies (bucket: menu-images)
-- ==============================================================================
-- First create bucket 'menu-images' in Supabase dashboard or via storage API
-- Then apply policies:
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'storage' and table_name = 'objects') then
    execute 'create policy "public read menu images" on storage.objects for select using (bucket_id = ''menu-images'');';
    execute 'create policy "admin upload menu images" on storage.objects for insert to authenticated with check (bucket_id = ''menu-images'');';
    execute 'create policy "admin update menu images" on storage.objects for update to authenticated using (bucket_id = ''menu-images'');';
    execute 'create policy "admin delete menu images" on storage.objects for delete to authenticated using (bucket_id = ''menu-images'');';
  end if;
exception when others then
  -- Storage policies can be configured once bucket is initialized
  null;
end $$;
