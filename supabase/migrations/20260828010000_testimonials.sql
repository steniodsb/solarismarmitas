-- Depoimentos de clientes ("Quem prova, aprova") exibidos na home em carrossel.
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_sort_idx
  on public.testimonials (sort_order);

alter table public.testimonials enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'testimonials'
      and policyname = 'Leitura pública testimonials'
  ) then
    execute 'create policy "Leitura pública testimonials" on public.testimonials for select using (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'testimonials'
      and policyname = 'Admin gerencia testimonials'
  ) then
    execute 'create policy "Admin gerencia testimonials" on public.testimonials for all
      using (has_role(auth.uid(), ''admin''::app_role))
      with check (has_role(auth.uid(), ''admin''::app_role))';
  end if;
end $$;

-- Bucket de fallback: em produção as imagens vão para o R2, mas o painel cai
-- no Supabase Storage quando o R2 não está configurado (dev local).
insert into storage.buckets (id, name, public)
values ('testimonials', 'testimonials', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'testimonials public read'
  ) then
    execute 'create policy "testimonials public read" on storage.objects for select using (bucket_id = ''testimonials'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'testimonials admin insert'
  ) then
    execute 'create policy "testimonials admin insert" on storage.objects for insert with check (bucket_id = ''testimonials'' and auth.role() = ''authenticated'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'testimonials admin delete'
  ) then
    execute 'create policy "testimonials admin delete" on storage.objects for delete using (bucket_id = ''testimonials'' and auth.role() = ''authenticated'')';
  end if;
end $$;
