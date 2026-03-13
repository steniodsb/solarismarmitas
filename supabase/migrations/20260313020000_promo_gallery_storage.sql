-- Storage policies para o bucket promo-gallery
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'promo-gallery public read' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    EXECUTE 'CREATE POLICY "promo-gallery public read" ON storage.objects FOR SELECT USING (bucket_id = ''promo-gallery'')';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'promo-gallery admin write' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    EXECUTE 'CREATE POLICY "promo-gallery admin write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''promo-gallery'' AND has_role(auth.uid(), ''admin''::app_role))';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'promo-gallery admin delete' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    EXECUTE 'CREATE POLICY "promo-gallery admin delete" ON storage.objects FOR DELETE USING (bucket_id = ''promo-gallery'' AND has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;
