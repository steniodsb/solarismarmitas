-- Registro de pedidos do site.
--
-- Até aqui o pedido morria no navegador: o carrinho virava mensagem de
-- WhatsApp e nada dos ITENS chegava ao banco. O analytics guardava só
-- total e quantidade, o que impede qualquer relatório por produto.
--
-- Os campos *_name / *_label são snapshot do momento da compra de
-- propósito: se um sabor for renomeado, desativado ou excluído do
-- catálogo, o histórico de vendas continua legível.

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  transaction_id text unique,
  customer_name  text,
  customer_phone text,
  address        text,
  city           text,
  delivery_mode  text not null default 'delivery',
  notes          text,
  items_count    integer not null default 0,
  total          numeric(10,2) not null default 0,
  -- 'site' hoje; deixa espaço para outros canais depois
  source         text not null default 'site'
);

create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  -- referências ao catálogo: viram null se o registro for apagado,
  -- mas os campos de texto abaixo preservam o histórico
  flavor_id     uuid references public.frozen_flavors(id) on delete set null,
  category_id   uuid references public.frozen_categories(id) on delete set null,
  size_id       uuid references public.frozen_sizes(id) on delete set null,
  flavor_name   text not null,
  category_name text not null,
  category_slug text,
  size_label    text,
  quantity      integer not null check (quantity > 0),
  unit_price    numeric(10,2) not null default 0,
  subtotal      numeric(10,2) not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists orders_created_at_idx        on public.orders (created_at desc);
create index if not exists order_items_order_id_idx     on public.order_items (order_id);
create index if not exists order_items_flavor_id_idx    on public.order_items (flavor_id);
create index if not exists order_items_category_id_idx  on public.order_items (category_id);
create index if not exists order_items_created_at_idx   on public.order_items (created_at desc);

alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- O site grava sem login (o visitante é anônimo), igual ao analytics_events.
drop policy if exists anon_insert_orders on public.orders;
create policy anon_insert_orders on public.orders
  for insert to anon, authenticated with check (true);

drop policy if exists anon_insert_order_items on public.order_items;
create policy anon_insert_order_items on public.order_items
  for insert to anon, authenticated with check (true);

-- Leitura só para quem está logado no painel. Visitante anônimo não pode
-- ler pedidos: eles contêm nome, telefone e endereço de clientes.
drop policy if exists auth_select_orders on public.orders;
create policy auth_select_orders on public.orders
  for select to authenticated using (true);

drop policy if exists auth_select_order_items on public.order_items;
create policy auth_select_order_items on public.order_items
  for select to authenticated using (true);

-- View de apoio ao relatório: uma linha por item com os campos já prontos.
create or replace view public.vw_order_items_report as
select
  oi.id,
  oi.created_at,
  o.id            as order_id,
  o.city,
  o.total         as order_total,
  oi.flavor_id,
  oi.flavor_name,
  oi.category_id,
  oi.category_name,
  oi.category_slug,
  oi.size_label,
  oi.quantity,
  oi.unit_price,
  oi.subtotal
from public.order_items oi
join public.orders o on o.id = oi.order_id;
