
ALTER TABLE public.store_config
  ADD COLUMN address TEXT NOT NULL DEFAULT '',
  ADD COLUMN city TEXT NOT NULL DEFAULT '',
  ADD COLUMN state TEXT NOT NULL DEFAULT '',
  ADD COLUMN zip_code TEXT NOT NULL DEFAULT '',
  ADD COLUMN cnpj TEXT NOT NULL DEFAULT '';

UPDATE public.store_config SET
  address = 'Rua Vigário José Inácio, 787 - Centro Histórico',
  city = 'Porto Alegre',
  state = 'RS',
  zip_code = '90020-110',
  cnpj = '44.479.298/0001-30';
