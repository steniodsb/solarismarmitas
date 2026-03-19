-- Adiciona colunas de pixels e tags de rastreamento na store_config
ALTER TABLE public.store_config
  ADD COLUMN IF NOT EXISTS facebook_pixel_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS google_analytics_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS google_tag_manager_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS tiktok_pixel_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS custom_head_scripts text DEFAULT '';
