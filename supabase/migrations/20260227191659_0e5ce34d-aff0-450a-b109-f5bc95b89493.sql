
-- Frozen categories
CREATE TABLE public.frozen_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.frozen_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active frozen categories"
  ON public.frozen_categories FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage frozen categories"
  ON public.frozen_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Frozen sizes (prices differ per category)
CREATE TABLE public.frozen_sizes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.frozen_categories(id) ON DELETE CASCADE,
  label text NOT NULL,
  ml integer NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.frozen_sizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active frozen sizes"
  ON public.frozen_sizes FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage frozen sizes"
  ON public.frozen_sizes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Frozen flavors per category
CREATE TABLE public.frozen_flavors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.frozen_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.frozen_flavors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active frozen flavors"
  ON public.frozen_flavors FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage frozen flavors"
  ON public.frozen_flavors FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed categories
INSERT INTO public.frozen_categories (name, slug, description, sort_order) VALUES
  ('Fitness', 'fitness', 'Marmitas proteicas e balanceadas para quem treina', 1),
  ('Low Carb', 'low-carb', 'Refeições com baixo teor de carboidratos', 2),
  ('Caseira', 'caseira', 'O sabor de casa com praticidade de congelado', 3),
  ('Vegetariana', 'vegetariana', 'Opções 100% vegetarianas e nutritivas', 4),
  ('Sucos Congelados', 'sucos', 'Sucos naturais prontos para consumo', 5);

-- Seed sizes for each category (different prices)
INSERT INTO public.frozen_sizes (category_id, label, ml, price, sort_order)
SELECT c.id, s.label, s.ml, s.price, s.sort_order
FROM public.frozen_categories c
CROSS JOIN (VALUES
  ('400ml', 400, 0, 1),
  ('500ml', 500, 0, 2),
  ('850ml', 850, 0, 3)
) AS s(label, ml, price, sort_order)
WHERE c.slug != 'sucos';

-- Set prices per category+size
UPDATE public.frozen_sizes SET price = 15.90 WHERE ml = 400 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'fitness');
UPDATE public.frozen_sizes SET price = 19.90 WHERE ml = 500 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'fitness');
UPDATE public.frozen_sizes SET price = 29.90 WHERE ml = 850 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'fitness');

UPDATE public.frozen_sizes SET price = 14.90 WHERE ml = 400 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'low-carb');
UPDATE public.frozen_sizes SET price = 18.90 WHERE ml = 500 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'low-carb');
UPDATE public.frozen_sizes SET price = 28.90 WHERE ml = 850 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'low-carb');

UPDATE public.frozen_sizes SET price = 12.90 WHERE ml = 400 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'caseira');
UPDATE public.frozen_sizes SET price = 16.90 WHERE ml = 500 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'caseira');
UPDATE public.frozen_sizes SET price = 25.90 WHERE ml = 850 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'caseira');

UPDATE public.frozen_sizes SET price = 14.90 WHERE ml = 400 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'vegetariana');
UPDATE public.frozen_sizes SET price = 18.90 WHERE ml = 500 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'vegetariana');
UPDATE public.frozen_sizes SET price = 28.90 WHERE ml = 850 AND category_id = (SELECT id FROM public.frozen_categories WHERE slug = 'vegetariana');

-- Sucos: single size 300ml
INSERT INTO public.frozen_sizes (category_id, label, ml, price, sort_order)
SELECT id, '300ml', 300, 8.90, 1 FROM public.frozen_categories WHERE slug = 'sucos';

-- Seed flavors for Fitness
INSERT INTO public.frozen_flavors (category_id, name, description, sort_order)
SELECT id, f.name, f.description, f.sort_order FROM public.frozen_categories c
CROSS JOIN (VALUES
  ('Frango Grelhado com Batata Doce', 'Peito de frango, batata doce, brócolis', 1),
  ('Tilápia com Legumes', 'Filé de tilápia, mix de legumes, arroz integral', 2),
  ('Carne Magra com Quinoa', 'Patinho moído, quinoa, espinafre', 3),
  ('Frango com Grão de Bico', 'Frango desfiado, grão de bico, cenoura', 4),
  ('Omelete Proteico', 'Ovos, peito de peru, tomate, espinafre', 5)
) AS f(name, description, sort_order)
WHERE c.slug = 'fitness';

-- Seed flavors for Low Carb
INSERT INTO public.frozen_flavors (category_id, name, description, sort_order)
SELECT id, f.name, f.description, f.sort_order FROM public.frozen_categories c
CROSS JOIN (VALUES
  ('Frango com Abobrinha', 'Frango grelhado, abobrinha, couve-flor', 1),
  ('Carne com Berinjela', 'Carne moída, berinjela gratinada, espinafre', 2),
  ('Salmão com Aspargos', 'Salmão ao forno, aspargos, cogumelos', 3),
  ('Lombo com Brócolis', 'Lombo suíno, brócolis, tomate assado', 4)
) AS f(name, description, sort_order)
WHERE c.slug = 'low-carb';

-- Seed flavors for Caseira
INSERT INTO public.frozen_flavors (category_id, name, description, sort_order)
SELECT id, f.name, f.description, f.sort_order FROM public.frozen_categories c
CROSS JOIN (VALUES
  ('Arroz, Feijão e Bife', 'Arroz branco, feijão preto, bife acebolado, salada', 1),
  ('Strogonoff de Frango', 'Strogonoff cremoso, arroz, batata palha', 2),
  ('Carne de Panela', 'Carne de panela, arroz, feijão, mandioca', 3),
  ('Frango à Parmegiana', 'Frango empanado, molho, arroz, purê', 4),
  ('Feijoada Light', 'Feijoada com carnes magras, arroz, farofa, couve', 5),
  ('Escondidinho de Carne', 'Purê de mandioca, carne seca desfiada', 6)
) AS f(name, description, sort_order)
WHERE c.slug = 'caseira';

-- Seed flavors for Vegetariana
INSERT INTO public.frozen_flavors (category_id, name, description, sort_order)
SELECT id, f.name, f.description, f.sort_order FROM public.frozen_categories c
CROSS JOIN (VALUES
  ('Grão de Bico ao Curry', 'Grão de bico, curry, arroz integral, salada', 1),
  ('Lasanha de Berinjela', 'Berinjela, molho de tomate, queijo, manjericão', 2),
  ('Bowl de Quinoa', 'Quinoa, legumes assados, molho tahine', 3),
  ('Risoto de Cogumelos', 'Arroz arbóreo, mix de cogumelos, parmesão', 4)
) AS f(name, description, sort_order)
WHERE c.slug = 'vegetariana';

-- Seed flavors for Sucos
INSERT INTO public.frozen_flavors (category_id, name, description, sort_order)
SELECT id, f.name, f.description, f.sort_order FROM public.frozen_categories c
CROSS JOIN (VALUES
  ('Laranja Natural', 'Suco de laranja 100% natural', 1),
  ('Mamão com Laranja', 'Blend de mamão e laranja', 2),
  ('Abacaxi com Hortelã', 'Abacaxi fresco com hortelã', 3),
  ('Morango', 'Suco de morango natural', 4),
  ('Detox Verde', 'Couve, limão, gengibre, maçã', 5),
  ('Maracujá', 'Suco de maracujá natural', 6)
) AS f(name, description, sort_order)
WHERE c.slug = 'sucos';
