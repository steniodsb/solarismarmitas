-- ─────────────────────────────────────────────────────────────────────────────
-- Fix: RLS policies para store_config e Storage buckets
-- Permite que usuários autenticados façam UPDATE em store_config
-- e façam upload/delete nos buckets do admin
-- ─────────────────────────────────────────────────────────────────────────────

-- ── store_config ────────────────────────────────────────────────────────────

-- Leitura pública (anon pode ver config pública como horários/WhatsApp)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'store_config' AND policyname = 'public_read_store_config'
  ) THEN
    CREATE POLICY "public_read_store_config"
      ON public.store_config FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

-- Autenticado pode atualizar (admin)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'store_config' AND policyname = 'authenticated_update_store_config'
  ) THEN
    CREATE POLICY "authenticated_update_store_config"
      ON public.store_config FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ── Storage: product-images ──────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'auth_insert_product_images'
  ) THEN
    CREATE POLICY "auth_insert_product_images"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'product-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'auth_update_product_images'
  ) THEN
    CREATE POLICY "auth_update_product_images"
      ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'product-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'auth_delete_product_images'
  ) THEN
    CREATE POLICY "auth_delete_product_images"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'product-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'public_select_product_images'
  ) THEN
    CREATE POLICY "public_select_product_images"
      ON storage.objects FOR SELECT TO public
      USING (bucket_id = 'product-images');
  END IF;
END $$;

-- ── Storage: promo-gallery ───────────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'auth_insert_promo_gallery'
  ) THEN
    CREATE POLICY "auth_insert_promo_gallery"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'promo-gallery');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'auth_update_promo_gallery'
  ) THEN
    CREATE POLICY "auth_update_promo_gallery"
      ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'promo-gallery');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'auth_delete_promo_gallery'
  ) THEN
    CREATE POLICY "auth_delete_promo_gallery"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'promo-gallery');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'public_select_promo_gallery'
  ) THEN
    CREATE POLICY "public_select_promo_gallery"
      ON storage.objects FOR SELECT TO public
      USING (bucket_id = 'promo-gallery');
  END IF;
END $$;

-- ── Storage: promo-line-gallery ──────────────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'auth_insert_promo_line_gallery'
  ) THEN
    CREATE POLICY "auth_insert_promo_line_gallery"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'promo-line-gallery');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'auth_update_promo_line_gallery'
  ) THEN
    CREATE POLICY "auth_update_promo_line_gallery"
      ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'promo-line-gallery');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'auth_delete_promo_line_gallery'
  ) THEN
    CREATE POLICY "auth_delete_promo_line_gallery"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'promo-line-gallery');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'public_select_promo_line_gallery'
  ) THEN
    CREATE POLICY "public_select_promo_line_gallery"
      ON storage.objects FOR SELECT TO public
      USING (bucket_id = 'promo-line-gallery');
  END IF;
END $$;
