-- Galeria de fotos para a seção de Combos Promocionais
create table if not exists public.promo_gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  is_main boolean not null default false,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Apenas um registro pode ser a foto principal
create unique index if not exists promo_gallery_main_idx
  on public.promo_gallery (is_main)
  where is_main = true;

-- Leitura pública (sem autenticação)
alter table public.promo_gallery enable row level security;

create policy "Leitura pública promo_gallery"
  on public.promo_gallery
  for select
  using (true);

create policy "Admin gerencia promo_gallery"
  on public.promo_gallery
  for all
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));
