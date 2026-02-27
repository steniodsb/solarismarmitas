
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS for user_roles - only admins can read
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Fit',
  image_url TEXT,
  sizes JSONB DEFAULT '[]'::jsonb,
  flavors JSONB DEFAULT '[]'::jsonb,
  ingredients JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Store config table
CREATE TABLE public.store_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT NOT NULL DEFAULT '',
  min_order_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  opening_hours JSONB NOT NULL DEFAULT '[]'::jsonb,
  closed_message TEXT NOT NULL DEFAULT 'Estamos fechados no momento.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;

-- Public can read store config
CREATE POLICY "Anyone can view store config"
  ON public.store_config FOR SELECT
  USING (true);

-- Admins can manage store config
CREATE POLICY "Admins can manage store config"
  ON public.store_config FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_config_updated_at
  BEFORE UPDATE ON public.store_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- 9. Seed store config with default values
INSERT INTO public.store_config (whatsapp_number, min_order_value, opening_hours, closed_message)
VALUES (
  '5511999999999',
  30,
  '[{"day":"Segunda","open":"08:00","close":"18:00"},{"day":"Terça","open":"08:00","close":"18:00"},{"day":"Quarta","open":"08:00","close":"18:00"},{"day":"Quinta","open":"08:00","close":"18:00"},{"day":"Sexta","open":"08:00","close":"18:00"},{"day":"Sábado","open":"08:00","close":"14:00"},{"day":"Domingo","open":"","close":""}]'::jsonb,
  'Estamos fechados no momento. Confira nosso horário de funcionamento!'
);

-- 10. Seed products
INSERT INTO public.products (name, description, price, category, ingredients, active, available, sizes, flavors, sort_order) VALUES
('FitMeal', 'Marmita fitness balanceada para quem busca saúde e sabor em cada refeição.', 19.90, 'Fit', '["Frango grelhado","Batata doce","Brócolis","Salada verde","Azeite de oliva"]'::jsonb, true, true, '[{"id":"p","label":"Pequena (300g)","priceModifier":0},{"id":"m","label":"Média (450g)","priceModifier":5},{"id":"g","label":"Grande (600g)","priceModifier":10}]'::jsonb, '[{"id":"frango","label":"Frango Grelhado"},{"id":"peixe","label":"Tilápia Grelhada"}]'::jsonb, 1),
('Tradicional', 'A marmita caseira que lembra o sabor da comida da mamãe.', 17.90, 'Tradicional', '["Arroz branco","Feijão carioca","Carne bovina","Salada fresca","Farofa"]'::jsonb, true, true, '[{"id":"p","label":"Pequena (350g)","priceModifier":0},{"id":"m","label":"Média (500g)","priceModifier":5},{"id":"g","label":"Grande (650g)","priceModifier":10}]'::jsonb, '[{"id":"carne","label":"Carne Bovina"},{"id":"frango","label":"Frango"},{"id":"porco","label":"Lombo Suíno"}]'::jsonb, 2),
('Low Carb', 'Opção com menos carboidratos para manter a dieta sem abrir mão do sabor.', 21.90, 'Low Carb', '["Frango grelhado","Abobrinha","Legumes salteados","Salada verde","Azeite"]'::jsonb, true, true, '[{"id":"p","label":"Pequena (300g)","priceModifier":0},{"id":"m","label":"Média (450g)","priceModifier":5},{"id":"g","label":"Grande (600g)","priceModifier":10}]'::jsonb, '[]'::jsonb, 3),
('Vegetariana', 'Sem carne, com muito sabor. Proteína vegetal de qualidade com ingredientes frescos.', 18.90, 'Vegetariana', '["Proteína vegetal","Quinoa","Grão de bico","Legumes variados","Salada fresca"]'::jsonb, true, false, '[{"id":"p","label":"Pequena (300g)","priceModifier":0},{"id":"m","label":"Média (450g)","priceModifier":5},{"id":"g","label":"Grande (600g)","priceModifier":10}]'::jsonb, '[]'::jsonb, 4);
