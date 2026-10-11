-- ==============================================================================
-- Crazy Bites Seed Data (Run after schema.sql)
-- All 27 printed menu items across 5 categories
-- ==============================================================================

-- Settings
insert into public.settings (id, restaurant_name, tagline_en, tagline_ar, whatsapp, instagram, default_currency, lbp_rate)
values (
  1,
  'Crazy Bites',
  'Good Food • Bold Flavors • Always Crazy',
  'أكل طيب • نكهات قوية • دايمًا كريزي',
  '+96176191122',
  'crazybites.lb',
  'USD',
  89500
)
on conflict (id) do nothing;

-- Categories
insert into public.categories (slug, name_en, name_ar, sort_order) values
  ('sandwiches',       'Sandwiches',       'ساندويش',      1),
  ('burgers',          'Burgers',          'برجر',          2),
  ('grills',           'Grills',           'مشاوي',         3),
  ('meals',            'Meals',            'وجبات',         4),
  ('charcoal-chicken', 'Charcoal Chicken', 'فروج عالفحم',   5)
on conflict (slug) do nothing;

-- 1. Sandwiches (12 items)
insert into public.items (category_id, name_en, name_ar, description_en, description_ar, price_usd, sort_order)
select c.id, v.name_en, v.name_ar, v.desc_en, v.desc_ar, v.price, v.ord
from public.categories c,
(values
  ('Fajita',         'فاهيتا',      'Sautéed chicken, bell peppers, onions, melted cheese & signature Mexican sauce', 'دجاج متبل، فليفلة، بصل، جبنة ذائبة وصوص مكسيكي خاص', 6.00,  1),
  ('Francisco',      'فرانسيسكو',   'Grilled chicken strips, sweet corn, mushrooms, melted mozzarella & mayo', 'شرائح دجاج مشوي، ذرة، فطر، جبنة موزاريلا ومايونيز', 6.00,  2),
  ('Philadelphia',   'فيلادلفيا',   'Tender beef slices, grilled onions, mushrooms, melted cheddar & special steak sauce', 'شرائح لحم طرية، بصل مشوي، فطر، جبنة شيدر وصوص الستيك المميز', 7.00,  3),
  ('Sub',            'ساب',         'Classic deli cold cuts, cheese, fresh lettuce, tomatoes & special sub dressing', 'كلد كت كلاسيكي، جبنة، خس طازج، طماطم ودريسينج الساب المميز', 5.00,  4),
  ('Crispy',         'كرسبي',       'Golden breaded fried chicken tenderloins, lettuce, pickles & garlic mayo', 'أصابع دجاج كرسبي مقرمشة، خس، كبيس ومايونيز بالثوم', 5.00,  5),
  ('Zinger',         'زنجر',        'Spicy crunchy chicken breast, jalapeños, lettuce & spicy fire sauce', 'صدر دجاج كرسبي حار، هلابينو، خس وصوص حار ناري', 6.00,  6),
  ('Twister',        'تويستر',      'Crispy chicken strips wrapped in tortilla with lettuce, tomato & ranch', 'ستربس دجاج كرسبي بخبز التورتيلا مع خس، طماطم ورانش', 5.00,  7),
  ('Steak',          'ستيك',        'Premium grilled steak cuts, melted provolone cheese & caramelized onions', 'قطع لحم ستيك ممتازة، جبنة بروفولون وبصل مكرمل', 7.00,  8),
  ('Chicken Breast', 'تشكن برست',   'Lean grilled chicken breast, pickles, garlic paste & crisp lettuce', 'صدر دجاج مشوي صحي، كبيس، كريم ثوم وخس', 5.00,  9),
  ('Soda',           'سودة',        'Freshly sautéed chicken liver with garlic, lemon & pomegranate molasses', 'سودة دجاج طازجة مقلية بالثوم والحامض ودبس الرمان', 4.00, 10),
  ('Fries',          'بطاطا',       'Crispy golden french fries in Lebanese bread with coleslaw, pickles & ketchup', 'بطاطا مقلية مقرمشة مع سلطة كولسلو، كبيس وكاتشب بخبز لبناني', 3.00, 11),
  ('Shawarma',       'شاورما',      'Traditional spiced shawarma, pickles, garlic sauce / tarator in soft flatbread', 'شاورما بتتبيلة أصيلة، كبيس، كريم ثوم أو طراطور', 4.00, 12)
) as v(name_en, name_ar, desc_en, desc_ar, price, ord)
where c.slug = 'sandwiches';

-- 2. Burgers (4 items)
insert into public.items (category_id, name_en, name_ar, description_en, description_ar, price_usd, tags, sort_order)
select c.id, v.name_en, v.name_ar, v.desc_en, v.desc_ar, v.price, v.tags, v.ord
from public.categories c,
(values
  ('Cheese Burger',      'تشيز برجر',        '100% pure beef patty, double American cheddar, pickles, onion, house burger sauce', 'برجر لحم بقري صافي، شيدر أمريكي مدبل، كبيس، بصل وصوص برجر خاص', 6.00, '{}'::text[],            1),
  ('American Burger',    'اميركان برجر',     'Beef patty, smoky beef bacon, cheddar cheese, crisp lettuce, tomato, BBQ sauce', 'برجر لحم، بيكون بقري مدخن، شيدر، خس، طماطم وصوص باربكيو', 6.00, '{}'::text[],            2),
  ('Lebanese Burger',    'لبنانية برجر',     'Authentic Lebanese burger with coleslaw, fries, pickles & cocktail sauce', 'البرجر اللبناني الأصيل مع سلطة كولسلو، بطاطا، كبيس وصوص كوكتيل', 5.00, '{classic}'::text[],    3),
  ('Crazy Bites Burger', 'برجر كريزي بايتس', 'Signature double smash patty, melted triple cheese, caramelized onions & secret crazy sauce', 'البرجر الأسطوري المميز دبل لحم، جبنة ثلاثية، بصل مكرمل وصوص كريزي السري', 8.00, '{signature}'::text[],   4)
) as v(name_en, name_ar, desc_en, desc_ar, price, tags, ord)
where c.slug = 'burgers';

-- 3. Grills (2 items)
insert into public.items (category_id, name_en, name_ar, description_en, description_ar, price_usd, tags, sort_order)
select c.id, v.name_en, v.name_ar, v.desc_en, v.desc_ar, v.price, v.tags, v.ord
from public.categories c,
(values
  ('Shaghaf Lahme', 'شغف لحمة', 'Tender charcoal-grilled marinated beef chunks served in warm flatbread with biwaz & hommus', 'شقف لحمة بلدية طرية مشوية عالفحم مع بيواز وحمص', 4.50, '{charcoal}'::text[], 1),
  ('Taouk',         'طاووق',    'Charcoal-grilled juicy marinated chicken skewers, garlic paste, pickles & fries', 'شيش طاووق طري ومتبل مشوي عالفحم، ثوم، كبيس وبطاطا', 4.00, '{charcoal}'::text[], 2)
) as v(name_en, name_ar, desc_en, desc_ar, price, tags, ord)
where c.slug = 'grills';

-- 4. Meals (4 items)
insert into public.items (category_id, name_en, name_ar, description_en, description_ar, price_usd, sort_order)
select c.id, v.name_en, v.name_ar, v.desc_en, v.desc_ar, v.price, v.ord
from public.categories c,
(values
  ('Chicken Shawarma Meal', 'وجبة شاورما دجاج', 'Sliced chicken shawarma platter served with golden fries, garlic dip, coleslaw & pickles', 'صحن شاورما دجاج مقطعة مع بطاطا مقلية، كريم ثوم، كولسلو ومخلل', 5.50, 1),
  ('Turkey Shawarma Meal',  'وجبة شاورما تركي',  'Juicy turkey shawarma platter served with fries, special dipping sauces & pickles', 'وجبة شاورما تركي شهية مع بطاطا مقلية، صوصات ومخلل', 7.00, 2),
  ('Crispy Meal (Small)',   'وجبة كرسبي صغيرة',  '3 pcs golden crunchy chicken tenders, french fries, coleslaw, garlic & honey mustard dip', '٣ قطع دجاج كرسبي مقرمش، بطاطا مقلية، كولسلو، ثوم وهني ماسترد', 5.00, 3),
  ('Crispy Meal (Large)',   'وجبة كرسبي كبيرة',  '5 pcs golden crunchy chicken tenders, generous french fries, coleslaw, bun & dips', '٥ قطع دجاج كرسبي مقرمش، حصة كبيرة بطاطا، كولسلو، خبزة وصوصات', 8.00, 4)
) as v(name_en, name_ar, desc_en, desc_ar, price, ord)
where c.slug = 'meals';

-- 5. Charcoal Chicken (1 item)
insert into public.items (category_id, name_en, name_ar, description_en, description_ar, price_usd, tags, sort_order)
select c.id, 'Charcoal Chicken', 'فروج عالفحم', 'Whole fresh charcoal-grilled chicken marinated in Lebanese herb & garlic spices, served with fresh garlic sauce, pickles & bread', 'فروج كامل طازج مشوي عالفحم بتتبيلة مميزة مع كريم ثوم طازج، مخللات وخبز', 15.00, '{signature, charcoal}'::text[], 1
from public.categories c
where c.slug = 'charcoal-chicken';
