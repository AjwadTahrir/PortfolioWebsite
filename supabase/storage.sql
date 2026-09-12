-- Screenshot storage for the admin CMS. Run after schema.sql.
--
-- The bucket itself is created via the dashboard (Storage → New bucket →
-- name it exactly "screenshots" → toggle "Public bucket" on) rather than
-- here, because bucket creation isn't consistently available through the
-- SQL editor across Supabase versions. Once the bucket exists, run this
-- file to set its access rules: same pattern as schema.sql — anyone can
-- view a file, only a signed-in user (you) can upload, replace or delete
-- one.

create policy "public read screenshots"
  on storage.objects for select
  using (bucket_id = 'screenshots');

create policy "admin write screenshots"
  on storage.objects for insert
  with check (bucket_id = 'screenshots' and auth.role() = 'authenticated');

create policy "admin update screenshots"
  on storage.objects for update
  using (bucket_id = 'screenshots' and auth.role() = 'authenticated');

create policy "admin delete screenshots"
  on storage.objects for delete
  using (bucket_id = 'screenshots' and auth.role() = 'authenticated');
