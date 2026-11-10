-- Demo catalog records for the Natural Oil store concept.
-- Run after the core migration in a Supabase project you control.
-- Coconut Oil prices below were provided by the project owner.
-- Prices for all other products are random demo examples and are not real selling prices.

insert into public.categories (name, slug, description, sort_order, is_active)
values
  ('Groundnut', 'groundnut', 'Groundnut oil concept products.', 1, true),
  ('Sesame', 'sesame', 'Sesame, gingelly, and til oil concept products.', 2, true),
  ('Coconut', 'coconut', 'Coconut oil concept products.', 3, true),
  ('Castor', 'castor', 'Castor oil concept products.', 4, true),
  ('Sunflower', 'sunflower', 'Sunflower oil concept products.', 5, true),
  ('Mustard', 'mustard', 'Mustard oil concept products.', 6, true),
  ('Combos', 'combos', 'Multi-product oil combo concepts.', 7, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.products (category_id, name, slug, description, is_active)
select c.id, seed.name, seed.slug, seed.description, true
from (values
  ('Coconut', 'Virgin Coconut Oil', 'virgin-coconut-oil', 'Concept listing for virgin, unrefined coconut oil. Replace this draft with verified ingredients, uses, and care instructions before publishing.'),
  ('Castor', 'Cold Pressed Castor Oil', 'cold-pressed-castor-oil', 'Concept personal-care listing. Add verified product details, usage instructions, and approved claims before publishing.'),
  ('Groundnut', 'Cold Pressed Groundnut Oil', 'cold-pressed-groundnut-oil', 'Wood-pressed groundnut oil concept listing for cooking. Add verified production, ingredient, and care details before publishing.'),
  ('Sesame', 'Cold Pressed Sesame Oil', 'cold-pressed-sesame-oil', 'Sesame, gingelly, or til oil concept listing. Confirm ingredients, pack options, and approved uses before publishing.'),
  ('Sunflower', 'Cold Pressed Sunflower Oil', 'cold-pressed-sunflower-oil', 'Sunflower oil concept listing. Add verified ingredients, production details, and approved uses before publishing.'),
  ('Mustard', 'Cold Pressed Mustard Oil', 'cold-pressed-mustard-oil', 'Mustard oil concept listing. Add verified ingredients, production details, and approved uses before publishing.'),
  ('Combos', 'Groundnut + Sesame Oil Combo', 'groundnut-sesame-oil-combo', 'Concept combo containing one sample 1-litre groundnut pack and one sample 1-litre sesame pack. Confirm contents before publishing.'),
  ('Combos', 'Coconut + Sesame + Groundnut Combo', 'coconut-sesame-groundnut-combo', 'Concept combo containing one sample 1-litre pack of coconut, sesame, and groundnut oil. Confirm contents before publishing.'),
  ('Combos', '7 L Coconut + Sesame + Groundnut Combo', '7l-coconut-sesame-groundnut-combo', 'Concept combo containing sample 5-litre coconut oil and 1-litre sesame and groundnut oil packs. Confirm contents before publishing.'),
  ('Combos', 'Castor + Coconut Oil Combo', 'castor-coconut-oil-combo', 'Concept personal-care combo containing sample 200 ml castor and coconut oil packs. Confirm contents and product instructions before publishing.')
) as seed(category_name, name, slug, description)
join public.categories c on c.name = seed.category_name
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active;

-- Idempotent pack pricing: owner-provided Coconut Oil prices plus random demo examples for the rest.
insert into public.product_variants (product_id, sku, size_label, price_inr, is_active)
select p.id, seed.sku, seed.size_label, seed.price_inr, true
from (values
  ('virgin-coconut-oil', 'virgin-coconut-oil-500ml', '500 ml', 500.00::numeric),
  ('virgin-coconut-oil', 'virgin-coconut-oil-1l', '1 litre', 999.00::numeric),
  ('cold-pressed-castor-oil', 'castor-oil-200ml', '200 ml', 180.00::numeric),
  ('cold-pressed-castor-oil', 'castor-oil-500ml', '500 ml', 360.00::numeric),
  ('cold-pressed-groundnut-oil', 'groundnut-oil-500ml', '500 ml', 290.00::numeric),
  ('cold-pressed-groundnut-oil', 'groundnut-oil-1l', '1 litre', 540.00::numeric),
  ('cold-pressed-groundnut-oil', 'groundnut-oil-5l', '5 litres', 2500.00::numeric),
  ('cold-pressed-groundnut-oil', 'groundnut-oil-15l', '15 litres', 7200.00::numeric),
  ('cold-pressed-sesame-oil', 'sesame-oil-500ml', '500 ml', 350.00::numeric),
  ('cold-pressed-sesame-oil', 'sesame-oil-1l', '1 litre', 650.00::numeric),
  ('cold-pressed-sesame-oil', 'sesame-oil-5l', '5 litres', 3050.00::numeric),
  ('cold-pressed-sunflower-oil', 'sunflower-oil-1l', '1 litre', 260.00::numeric),
  ('cold-pressed-sunflower-oil', 'sunflower-oil-5l', '5 litres', 1200.00::numeric),
  ('cold-pressed-mustard-oil', 'mustard-oil-1l', '1 litre', 390.00::numeric),
  ('cold-pressed-mustard-oil', 'mustard-oil-5l', '5 litres', 1850.00::numeric),
  ('groundnut-sesame-oil-combo', 'groundnut-sesame-combo-2l', '1 litre groundnut + 1 litre sesame', 1100.00::numeric),
  ('coconut-sesame-groundnut-combo', 'coconut-sesame-groundnut-combo-3l', '1 litre each · 3 litre combo', 1650.00::numeric),
  ('7l-coconut-sesame-groundnut-combo', 'coconut-sesame-groundnut-combo-7l', '5 litre coconut + 1 litre sesame + 1 litre groundnut', 4800.00::numeric),
  ('castor-coconut-oil-combo', 'castor-coconut-combo-400ml', '200 ml castor + 200 ml coconut', 330.00::numeric)
) as seed(product_slug, sku, size_label, price_inr)
join public.products p on p.slug = seed.product_slug
on conflict (product_id, size_label) do update set
  sku = excluded.sku,
  price_inr = excluded.price_inr,
  is_active = excluded.is_active;
