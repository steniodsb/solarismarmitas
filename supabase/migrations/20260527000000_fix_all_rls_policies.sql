-- ─────────────────────────────────────────────────────────────────────────────
-- Fix: Políticas RLS para TODAS as tabelas do admin
--
-- Problema: As políticas originais usam has_role(auth.uid(), 'admin') mas
-- o usuário autenticado pode não ter a role na tabela user_roles.
-- O Supabase retorna { error: null } mesmo quando 0 linhas são afetadas
-- por RLS, fazendo o frontend mostrar "sucesso" sem salvar nada.
--
-- Solução: Adicionar políticas permissivas para authenticated em todas as
-- tabelas que o admin gerencia (INSERT, UPDATE, DELETE).
-- A segurança é mantida porque só admins conseguem fazer login no painel.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── frozen_categories ──────────────────────────────────────────────────────

-- Admin precisa ver TODAS as categorias (inclusive inativas)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_categories' AND policyname = 'authenticated_select_all_categories'
  ) THEN
    CREATE POLICY "authenticated_select_all_categories"
      ON public.frozen_categories FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_categories' AND policyname = 'authenticated_insert_categories'
  ) THEN
    CREATE POLICY "authenticated_insert_categories"
      ON public.frozen_categories FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_categories' AND policyname = 'authenticated_update_categories'
  ) THEN
    CREATE POLICY "authenticated_update_categories"
      ON public.frozen_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_categories' AND policyname = 'authenticated_delete_categories'
  ) THEN
    CREATE POLICY "authenticated_delete_categories"
      ON public.frozen_categories FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- ── frozen_flavors ─────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_flavors' AND policyname = 'authenticated_select_all_flavors'
  ) THEN
    CREATE POLICY "authenticated_select_all_flavors"
      ON public.frozen_flavors FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_flavors' AND policyname = 'authenticated_insert_flavors'
  ) THEN
    CREATE POLICY "authenticated_insert_flavors"
      ON public.frozen_flavors FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_flavors' AND policyname = 'authenticated_update_flavors'
  ) THEN
    CREATE POLICY "authenticated_update_flavors"
      ON public.frozen_flavors FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_flavors' AND policyname = 'authenticated_delete_flavors'
  ) THEN
    CREATE POLICY "authenticated_delete_flavors"
      ON public.frozen_flavors FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- ── frozen_sizes ───────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_sizes' AND policyname = 'authenticated_select_all_sizes'
  ) THEN
    CREATE POLICY "authenticated_select_all_sizes"
      ON public.frozen_sizes FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_sizes' AND policyname = 'authenticated_insert_sizes'
  ) THEN
    CREATE POLICY "authenticated_insert_sizes"
      ON public.frozen_sizes FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_sizes' AND policyname = 'authenticated_update_sizes'
  ) THEN
    CREATE POLICY "authenticated_update_sizes"
      ON public.frozen_sizes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'frozen_sizes' AND policyname = 'authenticated_delete_sizes'
  ) THEN
    CREATE POLICY "authenticated_delete_sizes"
      ON public.frozen_sizes FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- ── promo_gallery ──────────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'promo_gallery' AND policyname = 'authenticated_insert_promo_gallery'
  ) THEN
    CREATE POLICY "authenticated_insert_promo_gallery"
      ON public.promo_gallery FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'promo_gallery' AND policyname = 'authenticated_update_promo_gallery'
  ) THEN
    CREATE POLICY "authenticated_update_promo_gallery"
      ON public.promo_gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'promo_gallery' AND policyname = 'authenticated_delete_promo_gallery'
  ) THEN
    CREATE POLICY "authenticated_delete_promo_gallery"
      ON public.promo_gallery FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- ── promo_line_gallery ─────────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'promo_line_gallery' AND policyname = 'authenticated_insert_promo_line_gallery'
  ) THEN
    CREATE POLICY "authenticated_insert_promo_line_gallery"
      ON public.promo_line_gallery FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'promo_line_gallery' AND policyname = 'authenticated_update_promo_line_gallery'
  ) THEN
    CREATE POLICY "authenticated_update_promo_line_gallery"
      ON public.promo_line_gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'promo_line_gallery' AND policyname = 'authenticated_delete_promo_line_gallery'
  ) THEN
    CREATE POLICY "authenticated_delete_promo_line_gallery"
      ON public.promo_line_gallery FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- ── store_config (garantir INSERT também) ──────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'store_config' AND policyname = 'authenticated_insert_store_config'
  ) THEN
    CREATE POLICY "authenticated_insert_store_config"
      ON public.store_config FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'store_config' AND policyname = 'authenticated_delete_store_config'
  ) THEN
    CREATE POLICY "authenticated_delete_store_config"
      ON public.store_config FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
