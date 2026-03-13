-- Storage policies para o bucket promo-gallery
-- Leitura pública
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'promo-gallery public read'
      AND tablename = 'objects'
      AND schemaname = 'storage'
  ) THEN
    EXECUTE 'CREATE POLICY "promo-gallery public read" ON storage.objects FOR SELECT USING (bucket_id = ''promo-gallery'')';
  END IF;
END $$;

-- Upload para usuários autenticados com role admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'promo-gallery admin insert'
      AND tablename = 'objects'
      AND schemaname = 'storage'
  ) THEN
    EXECUTE 'CREATE POLICY "promo-gallery admin insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''promo-gallery'' AND auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Update para usuários autenticados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'promo-gallery admin update'
      AND tablename = 'objects'
      AND schemaname = 'storage'
  ) THEN
    EXECUTE 'CREATE POLICY "promo-gallery admin update" ON storage.objects FOR UPDATE USING (bucket_id = ''promo-gallery'' AND auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Delete para usuários autenticados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'promo-gallery admin delete'
      AND tablename = 'objects'
      AND schemaname = 'storage'
  ) THEN
    EXECUTE 'CREATE POLICY "promo-gallery admin delete" ON storage.objects FOR DELETE USING (bucket_id = ''promo-gallery'' AND auth.role() = ''authenticated'')';
  END IF;
END $$;
