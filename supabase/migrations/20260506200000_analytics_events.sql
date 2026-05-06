-- Tabela para tracking de pageviews e pedidos enviados pelo WhatsApp
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  path text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events (created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante (anon) pode inserir eventos
DROP POLICY IF EXISTS "anon_insert_analytics" ON public.analytics_events;
CREATE POLICY "anon_insert_analytics"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Apenas admins (autenticados) podem ler
DROP POLICY IF EXISTS "auth_select_analytics" ON public.analytics_events;
CREATE POLICY "auth_select_analytics"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (true);
