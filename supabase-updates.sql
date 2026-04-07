-- =============================================
-- ATUALIZAÇÕES SUPABASE - MARMITAS SOLARIS
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/ixcgauiwwopvzbifnyit/sql
-- =============================================

-- 1. ATUALIZAR PREÇO DO SUCO DE R$8,90 PARA R$9,90
UPDATE public.frozen_sizes
SET price = 9.90
WHERE id = '3e8dc769-f7e8-4bc5-a146-919d4094d348';

-- 2. ATUALIZAR SABORES DOS SUCOS
-- Laranja Natural -> Detox
UPDATE public.frozen_flavors
SET name = 'Detox', description = 'Suco detox natural'
WHERE id = '431ccdc9-da8d-4c53-8043-d47b574ad787';

-- Mamão com Laranja -> Xô Inchaço
UPDATE public.frozen_flavors
SET name = 'Xô Inchaço', description = 'Suco funcional para desinchar'
WHERE id = 'bcd226aa-b28c-48fb-bd08-aa3721782852';

-- Abacaxi com Hortelã -> Frutas Vermelhas
UPDATE public.frozen_flavors
SET name = 'Frutas Vermelhas', description = 'Suco de frutas vermelhas natural'
WHERE id = 'e8444045-2fb9-4302-b7a3-f151b8eefe02';

-- Morango -> Mamão
UPDATE public.frozen_flavors
SET name = 'Mamão', description = 'Suco de mamão natural'
WHERE id = '78fb1e6e-67c6-47e7-b57e-76a12c75ab19';

-- Detox Verde -> Abacaxi
UPDATE public.frozen_flavors
SET name = 'Abacaxi', description = 'Suco de abacaxi natural'
WHERE id = 'f6244824-ac12-4689-9ce2-e5962cb349d1';

-- Maracujá -> Laranja
UPDATE public.frozen_flavors
SET name = 'Laranja', description = 'Suco de laranja natural'
WHERE id = 'ade42e43-63ce-4997-9527-223cf7f473ce';
