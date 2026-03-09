-- Update prices for all sizes
UPDATE frozen_sizes SET price = 16.90 WHERE ml = 400;
UPDATE frozen_sizes SET price = 19.90 WHERE ml = 500;
UPDATE frozen_sizes SET price = 26.90 WHERE ml = 850;

-- Update category descriptions
UPDATE frozen_categories SET description = 'Alimentação com foco mais saudável, para quem está começando dietas e cuidando da saúde.' WHERE slug = 'fitness';
UPDATE frozen_categories SET description = 'Comida mais caseira pra quem busca praticidade pro dia a dia.' WHERE slug = 'caseira';
UPDATE frozen_categories SET description = 'Focada em dietas mais extremas para perda de peso.' WHERE slug = 'low-carb';
UPDATE frozen_categories SET description = 'Refeições preparadas sem carnes, com foco mais saudável pro dia a dia.' WHERE slug = 'vegetariana';
UPDATE frozen_categories SET description = 'Sucos naturais em embalagens de 300ml para congelamento.' WHERE slug = 'sucos';

-- Add Promocionais category
INSERT INTO frozen_categories (name, slug, description, sort_order, active)
VALUES ('Promocionais', 'promocionais', 'Montamos combos sortidos com combinações bem variadas pra você que não tem tempo de ficar escolhendo e quer praticidade nas suas refeições.', 6, true)
ON CONFLICT DO NOTHING;