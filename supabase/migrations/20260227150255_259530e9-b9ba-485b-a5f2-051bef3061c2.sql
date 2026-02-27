
-- Remove seed products
DELETE FROM public.products;

-- Insert all real products from the menu

-- ===== A LA MINUTAS =====
INSERT INTO public.products (name, description, price, category, ingredients, active, available, sizes, flavors, sort_order) VALUES
('Ala Minuta de Carne', 'Feijão, Batata Frita, Ovo Frito, Bife de Carne e Saladas Variadas!', 35.90, 'A La Minutas', '["Arroz Branco","Feijão","Batata Frita","Ovo Frito","Bife de Carne","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":10}]'::jsonb, '[]'::jsonb, 1),

('Ala Minuta de Frango', 'Acompanha: Arroz Branco, Feijão, Batata Frita, Ovo Frito, Filé de Frango e Saladas Variadas!', 24.43, 'A La Minutas', '["Arroz Branco","Feijão","Batata Frita","Ovo Frito","Filé de Frango","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":20.47}]'::jsonb, '[]'::jsonb, 2),

('Ala Minuta de Chuleta', 'Acompanha: Arroz Branco, Feijão, Batata Frita, Ovo Frito, Chuleta e Saladas Variadas!', 36.90, 'A La Minutas', '["Arroz Branco","Feijão","Batata Frita","Ovo Frito","Chuleta","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":13}]'::jsonb, '[]'::jsonb, 3),

('Ala Minuta Filé de Peixe a Milanesa', 'Acompanha: Arroz Branco, Feijão, Batata Frita, Ovo Frito, Filé de Peixe a Milanesa e Saladas Variadas!', 34.90, 'A La Minutas', '["Arroz Branco","Feijão","Batata Frita","Ovo Frito","Filé de Peixe a Milanesa","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":10}]'::jsonb, '[]'::jsonb, 4),

('Á La Minuta de Lombinho', 'Lombinho de porco! Acompanha Arroz Branco, Feijão, Batata Frita, Ovo Frito e Saladas Variadas!', 34.90, 'A La Minutas', '["Arroz Branco","Feijão","Batata Frita","Ovo Frito","Lombinho de Porco","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":10}]'::jsonb, '[]'::jsonb, 5),

('Ala Minuta de Panqueca Bolonhesa', 'Acompanha: Arroz Branco, Feijão, Batata Frita, Ovo Frito, Panqueca Bolonhesa e Saladas Variadas!', 24.43, 'A La Minutas', '["Arroz Branco","Feijão","Batata Frita","Ovo Frito","Panqueca Bolonhesa","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":20.47}]'::jsonb, '[]'::jsonb, 6),

-- ===== 1/2 A LA MINUTAS =====
('1/2 Ala Minuta de Frango', 'Arroz Branco, Feijão, Batata Frita, Ovo Frito, Filé de Frango e Saladas Variadas!', 28.90, '1/2 A La Minutas', '["Arroz Branco","Feijão","Batata Frita","Ovo Frito","Filé de Frango","Saladas Variadas"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 10),

('1/2 Ala Minuta de Carne', 'Arroz Branco, Feijão, Batata Frita, Ovo Frito, Bife de Carne e Saladas Variadas!', 29.90, '1/2 A La Minutas', '["Arroz Branco","Feijão","Batata Frita","Ovo Frito","Bife de Carne","Saladas Variadas"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 11),

('1/2 Á La Minuta de Filé de Peixe a Milanesa', 'Arroz Branco, Feijão, Batata Frita, Ovo Frito, Filé de Peixe a Milanesa e Saladas Variadas!', 28.90, '1/2 A La Minutas', '["Arroz Branco","Feijão","Batata Frita","Ovo Frito","Filé de Peixe a Milanesa","Saladas Variadas"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 12),

-- ===== MASSAS =====
('Carbonara', 'Almoço de porção de massa! Montamos com todo carinho e dedicação!', 32.99, 'Massas', '["Massa","Molho Carbonara","Bacon","Queijo Parmesão"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":6.91}]'::jsonb, '[]'::jsonb, 20),

('Molho Bolonhesa', 'Almoço de porção de massa! Montamos com todo carinho e dedicação!', 29.90, 'Massas', '["Massa","Molho Bolonhesa","Carne Moída","Queijo Parmesão"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":5.09}]'::jsonb, '[]'::jsonb, 21),

('Massa com Strogonoff de Frango', 'Almoço de porção de massa! Montamos com todo carinho!', 29.90, 'Massas', '["Massa","Strogonoff de Frango","Creme de Leite","Batata Palha"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":7}]'::jsonb, '[]'::jsonb, 22),

('Ao Molho Branco', 'Almoço de porção de massa! Montamos com todo carinho!', 29.90, 'Massas', '["Massa","Molho Branco","Queijo","Presunto"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":5}]'::jsonb, '[]'::jsonb, 23),

-- ===== ALMOÇO CASEIRO =====
('Almoço de Strogonoff de Frango', 'Embalagem de 750ml com arroz, strogonoff de frango, batata palha e saladas variadas!', 28.90, 'Almoço Caseiro', '["Arroz","Strogonoff de Frango","Batata Palha","Saladas Variadas"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 30),

('Almoço de Panqueca Bolonhesa', 'Embalagem de 750ml com arroz, panqueca bolonhesa e saladas variadas!', 28.90, 'Almoço Caseiro', '["Arroz","Panqueca Bolonhesa","Saladas Variadas"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 31),

('Almoço Vegetariano', 'Selecione seu preferido! Acompanha feijão, purê ou aipim e saladas variadas!', 16.74, 'Almoço Caseiro', '["Feijão","Purê ou Aipim","Saladas Variadas","Proteína Vegetal"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 32),

('Almoço De Carne de Panela', 'Embalagem de 750ml com arroz, carne de panela e saladas variadas!', 29.90, 'Almoço Caseiro', '["Arroz","Carne de Panela","Saladas Variadas"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 33),

-- ===== ALMOÇOS EXECUTIVO =====
('Almoço de Frango Acebolado', 'Arroz, feijão, frango acebolado, acompanhamentos e saladas variadas!', 34.90, 'Almoços Executivo', '["Arroz","Feijão","Frango Acebolado","Acompanhamentos","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":5}]'::jsonb, '[]'::jsonb, 40),

('Almoço de Filé de Peixe', 'Acompanha: Arroz branco, filé de peixe, purê de batata e saladas variadas!', 34.90, 'Almoços Executivo', '["Arroz Branco","Filé de Peixe","Purê de Batata","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":5}]'::jsonb, '[]'::jsonb, 41),

('Almoço de Bife de Carne', 'Arroz, feijão, bife de carne, acompanhamentos e saladas variadas!', 25.13, 'Almoços Executivo', '["Arroz","Feijão","Bife de Carne","Acompanhamentos","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":14.77}]'::jsonb, '[]'::jsonb, 42),

('Almoço de Strogonoff', 'Arroz, strogonoff, batata palha e saladas variadas!', 24.43, 'Almoços Executivo', '["Arroz","Strogonoff","Batata Palha","Saladas Variadas"]'::jsonb, true, true, '[{"id":"normal","label":"Normal","priceModifier":0},{"id":"grande","label":"Grande","priceModifier":15.47}]'::jsonb, '[]'::jsonb, 43),

-- ===== COMBOS PROMOÇÃO =====
('3 Ala Minutas + Refri 1,5l', 'Combo com 3 ala minutas acompanhadas de refrigerante 1,5l!', 74.71, 'Combos Promoção', '["3 Ala Minutas","Refrigerante 1,5l"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 50),

('2 Ala Minutas + 600ml', 'Combo com 2 ala minutas acompanhadas de refrigerante 600ml!', 51.92, 'Combos Promoção', '["2 Ala Minutas","Refrigerante 600ml"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 51),

('Ala Minuta + Refri Lata', 'Acompanha arroz, feijão, ovo frito, batata frita, saladas variadas e refrigerante lata!', 35.90, 'Combos Promoção', '["Ala Minuta","Refrigerante Lata"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 52),

-- ===== CONGELADOS =====
('10un Marmitas (escolha seu tipo)', '10 unidades de marmitas variadas (embalagens de 400ml)! Escolha seu tipo de alimentação!', 169.90, 'Congelados', '["10 Marmitas Variadas","Embalagens 400ml"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 60),

('10un Sucos Detox e Frutas Congelados', '10 unidades de sucos detox e frutas congelados! Caso tenha preferência por algum, especifique nas observações.', 99.90, 'Congelados', '["10 Sucos Variados","Detox","Frutas Congeladas"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 61),

-- ===== FITNESS =====
('Almoço Fitness', 'Marmita fitness com opção de frango ou carne! Alimentação saudável com ingredientes selecionados.', 24.90, 'Fitness', '["Arroz Integral","Frango ou Carne Grelhada","Legumes","Salada"]'::jsonb, true, true, '[]'::jsonb, '[{"id":"frango","label":"Frango"},{"id":"carne","label":"Carne"}]'::jsonb, 70),

-- ===== PORÇÕES =====
('Porção de Filé de Peixe a Milanesa', 'Acompanha de 4 a 5 unidades de filé de peixe a milanesa!', 31.90, 'Porções', '["4 a 5 Filés de Peixe a Milanesa"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 80),

('Porção de Batata Frita', 'Porção de batata frita, embalagem de 750ml!', 39.90, 'Porções', '["Batata Frita","Embalagem 750ml"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 81),

('Porção de Polentinha Frita', 'Porção de polentinha frita, embalagem de 750ml!', 44.90, 'Porções', '["Polentinha Frita","Embalagem 750ml"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 82),

('Porção de Panqueca Bolonhesa', 'Porção com 2 unidades de panqueca bolonhesa!', 24.90, 'Porções', '["2 Panquecas Bolonhesas"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 83),

-- ===== REFRIGERANTES =====
('Refri Lata', 'Refrigerante lata 350ml.', 7.99, 'Bebidas', '["Refrigerante Lata 350ml"]'::jsonb, true, true, '[]'::jsonb, '[{"id":"coca","label":"Coca-Cola"},{"id":"guarana","label":"Guaraná"},{"id":"pepsi","label":"Pepsi"}]'::jsonb, 90),

('Refri 1,5l', 'Refrigerante 1,5 litros.', 9.99, 'Bebidas', '["Refrigerante 1,5l"]'::jsonb, true, true, '[]'::jsonb, '[{"id":"coca","label":"Coca-Cola"},{"id":"guarana","label":"Guaraná"},{"id":"pepsi","label":"Pepsi"}]'::jsonb, 91),

('Água Mineral 510ml', 'Água mineral 510ml.', 3.99, 'Bebidas', '["Água Mineral 510ml"]'::jsonb, true, true, '[]'::jsonb, '[]'::jsonb, 92);

-- Update store config with correct min order
UPDATE public.store_config SET min_order_value = 26.00;
