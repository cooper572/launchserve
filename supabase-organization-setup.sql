-- LaunchServe Organization System Setup
-- Run this in your Supabase SQL Editor

-- Add account_type to auth.users metadata (handled in signup)
-- We'll use user_metadata to store account_type: 'volunteer' or 'organization'

-- Create organization_profiles table
CREATE TABLE organization_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Organization Info
  organization_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  
  -- Contact Info
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Social Media
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  
  -- Status
  onboarding_completed BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_organization_profiles_user_id ON organization_profiles(user_id);
CREATE INDEX idx_organization_profiles_username ON organization_profiles(username);
CREATE INDEX idx_organization_profiles_verified ON organization_profiles(verified);

-- Enable RLS
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for organization logos
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

-- Storage policies for organization logos (simplified - authenticated users can upload)
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

-- RLS Policies for organization_profiles
CREATE POLICY "Organizations can view own profile" ON organization_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Organizations can insert own profile" ON organization_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Organizations can update own profile" ON organization_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Public can view verified organizations (for displaying org info on opportunities)
CREATE POLICY "Public can view verified organizations" ON organization_profiles
  FOR SELECT
  TO public
  USING (verified = true);

-- Add organization_id to opportunities table (references auth.users directly)
ALTER TABLE opportunities
ADD COLUMN organization_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_opportunities_organization_id ON opportunities(organization_id);

-- Create opportunity_views table to track views
CREATE TABLE opportunity_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_opportunity_views_opportunity_id ON opportunity_views(opportunity_id);
CREATE INDEX idx_opportunity_views_viewed_at ON opportunity_views(viewed_at);

-- Enable RLS
ALTER TABLE opportunity_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert views (for tracking)
CREATE POLICY "Anyone can insert views" ON opportunity_views
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Organizations can view their own opportunity views
CREATE POLICY "Organizations can view own opportunity views" ON opportunity_views
  FOR SELECT
  TO authenticated
  USING (
    opportunity_id IN (
      SELECT id FROM opportunities 
      WHERE organization_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_organization_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_organization_profiles_timestamp
  BEFORE UPDATE ON organization_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_organization_profiles_updated_at();

-- Create view for organization dashboard stats
CREATE OR REPLACE VIEW organization_dashboard_stats AS
SELECT 
  o.organization_id,
  COUNT(DISTINCT o.id) as active_listings,
  0 as pending_applications,
  COALESCE(SUM(view_counts.view_count), 0) as total_views
FROM opportunities o
LEFT JOIN (
  SELECT opportunity_id, COUNT(*) as view_count
  FROM opportunity_views
  GROUP BY opportunity_id
) view_counts ON o.id = view_counts.opportunity_id
WHERE o.organization_id IS NOT NULL
GROUP BY o.organization_id;

-- Grant access to the view
GRANT SELECT ON organization_dashboard_stats TO authenticated;

-- Update RLS policies for opportunities to allow organizations to manage their own
-- Organizations can view their own opportunities
CREATE POLICY "Organizations can view own opportunities" ON opportunities
  FOR SELECT
  TO authenticated
  USING (organization_id = auth.uid());

-- Organizations can insert opportunities
CREATE POLICY "Organizations can insert opportunities" ON opportunities
  FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = auth.uid());

-- Organizations can update their own opportunities
CREATE POLICY "Organizations can update own opportunities" ON opportunities
  FOR UPDATE
  TO authenticated
  USING (organization_id = auth.uid());

-- Organizations can delete their own opportunities
CREATE POLICY "Organizations can delete own opportunities" ON opportunities
  FOR DELETE
  TO authenticated
  USING (organization_id = auth.uid());

-- Success message
SELECT 'Organization system tables created successfully!' as message;

-- NEXT STEPS:
-- 1. Update your signup flow to ask for account type
-- 2. Create organization onboarding page for profile setup
-- 3. Create organization dashboard to manage opportunities
-- 4. Update opportunity creation to link to organization_id
