-- LaunchServe Storage Bucket Fix
-- Run this to fix the organization-logos bucket and policies

-- Create storage bucket for organization logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization-logos', 'organization-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view organization logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete logos" ON storage.objects;
DROP POLICY IF EXISTS "Organizations can upload own logo" ON storage.objects;
DROP POLICY IF EXISTS "Organizations can update own logo" ON storage.objects;
DROP POLICY IF EXISTS "Organizations can delete own logo" ON storage.objects;

-- Storage policies for organization logos
CREATE POLICY "Authenticated users can upload logos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'organization-logos');

CREATE POLICY "Anyone can view organization logos" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'organization-logos');

CREATE POLICY "Authenticated users can update logos" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'organization-logos');

CREATE POLICY "Authenticated users can delete logos" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'organization-logos');

-- Success message
SELECT 'Storage bucket and policies configured successfully!' as message;
