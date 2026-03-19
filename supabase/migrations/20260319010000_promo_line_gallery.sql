-- Galeria de fotos por linha de combo promocional (tradicional, vegetariana, fitness, low-carb)
create table if not exists public.promo_line_gallery (
  id uuid primary key default gen_random_uuid(),
  line_slug text not null,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Index para busca por linha
create index if not exists promo_line_gallery_slug_idx
  on public.promo_line_gallery (line_slug, sort_order);

-- RLS
alter table public.promo_line_gallery enable row level security;

create policy "Leitura pública promo_line_gallery"
  on public.promo_line_gallery
  for select
  using (true);

create policy "Admin gerencia promo_line_gallery"
  on public.promo_line_gallery
  for all
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('promo-line-gallery', 'promo-line-gallery', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Leitura pública promo-line-gallery"
  on storage.objects for select
  using (bucket_id = 'promo-line-gallery');

create policy "Admin upload promo-line-gallery"
  on storage.objects for insert
  with check (bucket_id = 'promo-line-gallery');

create policy "Admin delete promo-line-gallery"
  on storage.objects for delete
  using (bucket_id = 'promo-line-gallery');
