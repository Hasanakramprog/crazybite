# Crazy Bites — Digital Menu Website (Full Project Spec + Seed Data)

> Hand this file to your AI coding tool / follow it step by step. It contains the stack, features, database schema, security rules, **ready-to-run seed data**, design direction, and deployment steps.

---

## 1. Goal

A light, fast, professional online menu for **Crazy Bites** (QR-code friendly) with a secure **admin panel** where the owner can **add / edit / delete / reorder** categories and items and change **prices**. Deployed **free**. Initial data comes from the printed menu (included below).

**Brand:** Crazy Bites — "Good Food • Bold Flavors • Always Crazy"
**Contact:** WhatsApp +961 76 19 11 22
**Languages:** English + Arabic (RTL)
**Currency:** USD (optional LBP field supported)

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Fast SSR/ISR, one codebase for site + admin |
| Styling | **Tailwind CSS** (+ **shadcn/ui** for admin) | Clean, light, quick to build |
| Database | **Supabase Postgres** | Free tier, RLS security |
| Auth | **Supabase Auth** (email + password, sign-ups disabled) | No custom auth code |
| Images | **Supabase Storage** bucket `menu-images` | Free, public read |
| Hosting | **Netlify** (free, commercial use allowed, native Next.js support) | Alternative: Cloudflare Pages via OpenNext |
| Drag & drop reorder | `@dnd-kit/core` | Light and accessible |
| Icons | `lucide-react` | |
| Forms/validation | `react-hook-form` + `zod` | |
| QR code | `qrcode` (generate once from final URL) | |

> ⚠️ Do **not** use Vercel Hobby for this: its free plan is for non-commercial use only.
> ⚠️ Supabase free projects pause after ~7 days of inactivity → add the keep-alive ping (section 10).

---

## 3. Features

### Public menu (`/`)
- Mobile-first, black + yellow brand look (see section 8)
- Sticky category tabs with scroll-spy
- Item row/card: name, price, optional description, optional photo, tags
- Language toggle **EN / AR** (switches `dir="rtl"` for Arabic)
- Search box (filters items live)
- Unavailable items shown greyed out with "Sold out" (or hidden)
- Header: logo/name, tagline, WhatsApp "Order now" button (opens `https://wa.me/96176191122`)
- Footer: contact + "Good Food Makes Life Better" slogan
- SEO meta + Open Graph image, `lang` attribute updates with language
- Fast: server-rendered, revalidated on every admin change

### Admin (`/admin`, login required)
- `/admin/login` — email + password
- **Categories:** add, rename (EN/AR), reorder (drag & drop), show/hide, delete (confirm)
- **Items:** add, edit, delete (confirm), change price, upload photo, toggle availability, tags, reorder inside a category
- **Quick price editor:** one table, edit price inline, save
- **Bulk price change:** increase/decrease all (or one category) by % or fixed amount
- **Settings:** restaurant name, tagline, WhatsApp number, Instagram, maps link, opening hours, logo
- Every save calls `revalidatePath('/')` so the public menu updates instantly
- Mobile-friendly admin (owner will likely edit from phone)

---

## 4. Database Schema (run in Supabase SQL editor)

```sql
-- Extensions
create extension if not exists "pgcrypto";

-- Categories
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_en     text not null,
  name_ar     text,
  sort_order  int  not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Items
create table public.items (
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

create index items_category_idx on public.items(category_id, sort_order);

-- Settings (single row)
create table public.settings (
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

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger items_updated_at
before update on public.items
for each row execute function public.set_updated_at();
```

### Row Level Security

```sql
alter table public.categories enable row level security;
alter table public.items      enable row level security;
alter table public.settings   enable row level security;

-- Public can read
create policy "public read categories" on public.categories for select using (true);
create policy "public read items"      on public.items      for select using (true);
create policy "public read settings"   on public.settings   for select using (true);

-- Only authenticated admin can write
create policy "admin write categories" on public.categories for all
  to authenticated using (true) with check (true);
create policy "admin write items" on public.items for all
  to authenticated using (true) with check (true);
create policy "admin write settings" on public.settings for all
  to authenticated using (true) with check (true);
```

### Storage bucket
In Supabase → Storage: create bucket **`menu-images`** (public). Then:

```sql
create policy "public read menu images" on storage.objects
  for select using (bucket_id = 'menu-images');

create policy "admin upload menu images" on storage.objects
  for insert to authenticated with check (bucket_id = 'menu-images');

create policy "admin update menu images" on storage.objects
  for update to authenticated using (bucket_id = 'menu-images');

create policy "admin delete menu images" on storage.objects
  for delete to authenticated using (bucket_id = 'menu-images');
```

### Security checklist
- Supabase → Authentication → **disable "Allow new users to sign up"**
- Create the single admin user manually (Authentication → Users → Add user)
- Never expose the `service_role` key in the browser or in Netlify public env vars
- Admin routes protected by `middleware.ts` (redirect to `/admin/login` if no session)

---

## 5. Seed Data (from the printed menu)

Prices are USD exactly as printed. Run this SQL **after** the schema.

```sql
-- Settings
insert into public.settings (id, restaurant_name, tagline_en, whatsapp, default_currency)
values (1, 'Crazy Bites', 'Good Food • Bold Flavors • Always Crazy', '+96176191122', 'USD')
on conflict (id) do nothing;

-- Categories
insert into public.categories (slug, name_en, name_ar, sort_order) values
  ('sandwiches',       'Sandwiches',       'ساندويش',      1),
  ('burgers',          'Burgers',          'برجر',          2),
  ('grills',           'Grills',           'مشاوي',         3),
  ('meals',            'Meals',            'وجبات',         4),
  ('charcoal-chicken', 'Charcoal Chicken', 'فروج عالفحم',   5);

-- Sandwiches
insert into public.items (category_id, name_en, name_ar, price_usd, sort_order)
select c.id, v.name_en, v.name_ar, v.price, v.ord
from public.categories c,
(values
  ('Fajita',         'فاهيتا',      6.00,  1),
  ('Francisco',      'فرانسيسكو',   6.00,  2),
  ('Philadelphia',   'فيلادلفيا',   7.00,  3),
  ('Sub',            'ساب',         5.00,  4),
  ('Crispy',         'كرسبي',       5.00,  5),
  ('Zinger',         'زنجر',        6.00,  6),
  ('Twister',        'تويستر',      5.00,  7),
  ('Steak',          'ستيك',        7.00,  8),
  ('Chicken Breast', 'تشكن برست',   5.00,  9),
  ('Soda',           'سودة',        4.00, 10),
  ('Fries',          'بطاطا',       3.00, 11),
  ('Shawarma',       'شاورما',      4.00, 12)
) as v(name_en, name_ar, price, ord)
where c.slug = 'sandwiches';

-- Burgers
insert into public.items (category_id, name_en, name_ar, price_usd, tags, sort_order)
select c.id, v.name_en, v.name_ar, v.price, v.tags, v.ord
from public.categories c,
(values
  ('Cheese Burger',      'تشيز برجر',        6.00, '{}'::text[],            1),
  ('American Burger',    'اميركان برجر',     6.00, '{}'::text[],            2),
  ('Lebanese Burger',    'لبنانية برجر',     5.00, '{}'::text[],            3),
  ('Crazy Bites Burger', 'برجر كريزي بايتس', 8.00, '{signature}'::text[],   4)
) as v(name_en, name_ar, price, tags, ord)
where c.slug = 'burgers';

-- Grills
insert into public.items (category_id, name_en, name_ar, price_usd, sort_order)
select c.id, v.name_en, v.name_ar, v.price, v.ord
from public.categories c,
(values
  ('Shaghaf Lahme', 'شغف لحمة', 4.50, 1),
  ('Taouk',         'طاووق',    4.00, 2)
) as v(name_en, name_ar, price, ord)
where c.slug = 'grills';

-- Meals
insert into public.items (category_id, name_en, name_ar, price_usd, sort_order)
select c.id, v.name_en, v.name_ar, v.price, v.ord
from public.categories c,
(values
  ('Chicken Shawarma Meal', 'وجبة شاورما دجاج', 5.50, 1),
  ('Turkey Shawarma Meal',  'وجبة شاورما تركي',  7.00, 2),
  ('Crispy Meal (Small)',   'وجبة كرسبي صغيرة',  5.00, 3),
  ('Crispy Meal (Large)',   'وجبة كرسبي كبيرة',  8.00, 4)
) as v(name_en, name_ar, price, ord)
where c.slug = 'meals';

-- Charcoal Chicken
insert into public.items (category_id, name_en, name_ar, description_en, price_usd, sort_order)
select c.id, 'Charcoal Chicken', 'فروج عالفحم', 'Fresh grilled always', 15.00, 1
from public.categories c
where c.slug = 'charcoal-chicken';
```

### Same data as JSON (for a TypeScript seed script instead of SQL)

```json
{
  "settings": {
    "restaurant_name": "Crazy Bites",
    "tagline_en": "Good Food • Bold Flavors • Always Crazy",
    "whatsapp": "+96176191122",
    "default_currency": "USD"
  },
  "categories": [
    {
      "slug": "sandwiches", "name_en": "Sandwiches", "name_ar": "ساندويش", "sort_order": 1,
      "items": [
        { "name_en": "Fajita", "name_ar": "فاهيتا", "price_usd": 6 },
        { "name_en": "Francisco", "name_ar": "فرانسيسكو", "price_usd": 6 },
        { "name_en": "Philadelphia", "name_ar": "فيلادلفيا", "price_usd": 7 },
        { "name_en": "Sub", "name_ar": "ساب", "price_usd": 5 },
        { "name_en": "Crispy", "name_ar": "كرسبي", "price_usd": 5 },
        { "name_en": "Zinger", "name_ar": "زنجر", "price_usd": 6 },
        { "name_en": "Twister", "name_ar": "تويستر", "price_usd": 5 },
        { "name_en": "Steak", "name_ar": "ستيك", "price_usd": 7 },
        { "name_en": "Chicken Breast", "name_ar": "تشكن برست", "price_usd": 5 },
        { "name_en": "Soda", "name_ar": "سودة", "price_usd": 4 },
        { "name_en": "Fries", "name_ar": "بطاطا", "price_usd": 3 },
        { "name_en": "Shawarma", "name_ar": "شاورما", "price_usd": 4 }
      ]
    },
    {
      "slug": "burgers", "name_en": "Burgers", "name_ar": "برجر", "sort_order": 2,
      "items": [
        { "name_en": "Cheese Burger", "name_ar": "تشيز برجر", "price_usd": 6 },
        { "name_en": "American Burger", "name_ar": "اميركان برجر", "price_usd": 6 },
        { "name_en": "Lebanese Burger", "name_ar": "لبنانية برجر", "price_usd": 5 },
        { "name_en": "Crazy Bites Burger", "name_ar": "برجر كريزي بايتس", "price_usd": 8, "tags": ["signature"] }
      ]
    },
    {
      "slug": "grills", "name_en": "Grills", "name_ar": "مشاوي", "sort_order": 3,
      "items": [
        { "name_en": "Shaghaf Lahme", "name_ar": "شغف لحمة", "price_usd": 4.5 },
        { "name_en": "Taouk", "name_ar": "طاووق", "price_usd": 4 }
      ]
    },
    {
      "slug": "meals", "name_en": "Meals", "name_ar": "وجبات", "sort_order": 4,
      "items": [
        { "name_en": "Chicken Shawarma Meal", "name_ar": "وجبة شاورما دجاج", "price_usd": 5.5 },
        { "name_en": "Turkey Shawarma Meal", "name_ar": "وجبة شاورما تركي", "price_usd": 7 },
        { "name_en": "Crispy Meal (Small)", "name_ar": "وجبة كرسبي صغيرة", "price_usd": 5 },
        { "name_en": "Crispy Meal (Large)", "name_ar": "وجبة كرسبي كبيرة", "price_usd": 8 }
      ]
    },
    {
      "slug": "charcoal-chicken", "name_en": "Charcoal Chicken", "name_ar": "فروج عالفحم", "sort_order": 5,
      "items": [
        { "name_en": "Charcoal Chicken", "name_ar": "فروج عالفحم", "price_usd": 15, "description_en": "Fresh grilled always" }
      ]
    }
  ]
}
```

### Items to confirm with the owner
- **Soda** and **Fries** are printed under Sandwiches — kept there; consider a "Sides" category later.
- **Charcoal Chicken $15** — size not printed (likely whole chicken). Add a description once confirmed.
- Item descriptions/ingredients are not on the printed menu — admin can add them later.

---

## 6. Project Structure

```
crazy-bites-menu/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                     # public menu (server component, revalidated)
│  ├─ admin/
│  │  ├─ login/page.tsx
│  │  ├─ layout.tsx                # admin shell + nav
│  │  ├─ page.tsx                  # dashboard
│  │  ├─ categories/page.tsx
│  │  ├─ items/page.tsx
│  │  ├─ prices/page.tsx           # quick price editor + bulk change
│  │  └─ settings/page.tsx
│  ├─ actions/                     # server actions (CRUD + revalidatePath('/'))
│  │  ├─ categories.ts
│  │  ├─ items.ts
│  │  └─ settings.ts
│  └─ api/health/route.ts          # keep-alive endpoint
├─ components/
│  ├─ menu/ (CategoryTabs, MenuItem, LangToggle, SearchBar, Header, Footer)
│  └─ admin/ (ItemForm, CategoryForm, PriceTable, ImageUpload, SortableList)
├─ lib/
│  ├─ supabase/ (client.ts, server.ts, middleware.ts)
│  ├─ types.ts
│  └─ i18n.ts                      # EN/AR strings + dir handling
├─ scripts/seed.ts                 # optional TS seeding from data/menu.json
├─ data/menu.json
├─ middleware.ts                   # protects /admin/*
└─ .env.local
```

### Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# Local only, for seed script — NEVER commit or add to hosting public env:
SUPABASE_SERVICE_ROLE_KEY=...
```

Use `@supabase/ssr` for cookie-based auth in the App Router.

---

## 7. Implementation Notes

- **Public page:** fetch visible categories with their items in one query:
  `supabase.from('categories').select('*, items(*)').eq('is_visible', true).order('sort_order').order('sort_order', { referencedTable: 'items' })`
- **Revalidation:** every server action ends with `revalidatePath('/')`.
- **Language:** store choice in a cookie (`lang=en|ar`); set `<html lang dir>` accordingly. Use Tailwind logical utilities (`ps-`, `pe-`, `text-start`) so RTL works without duplicate CSS.
- **Arabic font:** Cairo or Tajawal (Google Fonts via `next/font`).
- **Price display:** `$6`, `$4.50` — hide trailing `.00`. If `price_lbp` is set, show it as a secondary line.
- **Images:** upload to `menu-images/items/<uuid>.webp`; resize/compress client-side to ≤ 800px before upload; render with `next/image`.
- **Reorder:** drag & drop updates `sort_order` for the affected rows in one batch call.
- **Bulk price change:** a server action that runs an update on `items.price_usd` (× multiplier or + amount), rounded to 2 decimals; show a preview before applying.
- **Delete safety:** deleting a category cascades to its items — require a confirmation dialog that states how many items will be deleted.

---

## 8. Design Direction

Match the printed menu's identity: **black + yellow, bold, street-food energy**, but keep it light and readable.

| Token | Value |
|---|---|
| Background | `#0E0E0E` (near-black) |
| Surface/card | `#171717` |
| Accent (yellow) | `#F5C518` |
| Text | `#FAFAFA` / muted `#A3A3A3` |
| Radius | `12px` |

- Headings: bold display font (e.g. **Bebas Neue** or **Poppins 800**) for English; **Cairo 800** for Arabic
- Category headers styled like the print menu: yellow brush-stroke style banner behind the title
- Price in yellow, right-aligned (left-aligned in RTL), dotted leader line between name and price
- Optional light theme toggle (white background, same yellow accent) if the owner prefers
- Big sticky WhatsApp button on mobile: "Order on WhatsApp"
- Target Lighthouse mobile score ≥ 95

---

## 9. Build Milestones

| # | Milestone | Done when |
|---|---|---|
| 1 | Supabase project, schema, RLS, bucket | SQL runs clean |
| 2 | Seed data loaded | 5 categories, 27 items visible in Supabase |
| 3 | Next.js scaffold + Supabase clients + middleware | `/admin` redirects to login |
| 4 | Public menu UI (EN/AR, search, tabs) | Looks right on phone |
| 5 | Admin auth + categories/items CRUD | Owner can add/edit/delete |
| 6 | Quick price editor + bulk change | Prices editable in seconds |
| 7 | Images upload, tags, availability toggle | Photos show on menu |
| 8 | Settings page (WhatsApp, hours, logo) | Footer/header driven by DB |
| 9 | Deploy + QR code + keep-alive | Live URL works |

---

## 10. Deployment (Free)

1. **Supabase:** create project → run schema SQL → run RLS SQL → create bucket + storage policies → run seed SQL → disable sign-ups → create the admin user.
2. **GitHub:** push the Next.js repo.
3. **Netlify:** New site from Git → framework auto-detected as Next.js → add env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` → deploy.
4. **Supabase Auth URLs:** set Site URL and redirect URL to the Netlify domain.
5. **Keep-alive:** `/api/health` runs a tiny query (`select id from settings limit 1`). Add a GitHub Actions workflow that calls it daily:

```yaml
name: keep-alive
on:
  schedule:
    - cron: "0 9 * * *"
  workflow_dispatch:
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl -fsS https://YOUR-SITE.netlify.app/api/health
```

6. **QR code:** generate a QR for the final URL (high error correction), print on tables/menus/bags.
7. **Optional:** buy a cheap custom domain (e.g. `crazybites.menu`) and point it at Netlify.

---

## 11. Acceptance Checklist

- [ ] Public menu loads in under 2 seconds on mobile data
- [ ] All 27 seeded items display with correct prices
- [ ] EN/AR toggle works, Arabic is fully RTL
- [ ] WhatsApp button opens chat with +961 76 19 11 22
- [ ] Admin login works; anonymous users cannot reach `/admin` or write to the DB
- [ ] Admin can create, edit, delete, reorder categories and items
- [ ] Price change in admin appears on the public menu immediately
- [ ] Image upload works and displays optimized
- [ ] Keep-alive workflow runs daily
- [ ] QR code printed and tested on iPhone + Android

---

## 12. Prompt to Give Your AI Coding Tool

> Build the project described in this document: a Next.js (App Router, TypeScript) + Tailwind + Supabase digital menu for "Crazy Bites" with a protected admin panel for full CRUD on categories, items, and prices. Follow the schema, RLS policies, seed data, structure, design direction, and milestones exactly. Start with milestones 1–4, then continue in order. Use server actions with `revalidatePath('/')`, `@supabase/ssr` for auth, and support English + Arabic (RTL) using Tailwind logical properties. Keep dependencies minimal and the public page lightweight.
