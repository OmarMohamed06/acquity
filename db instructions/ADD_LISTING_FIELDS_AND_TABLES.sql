-- ============================================================================
-- Migration: Add slug and additional fields to listings table
-- ============================================================================

-- Add slug column if it doesn't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add financial fields if they don't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS price NUMERIC,
ADD COLUMN IF NOT EXISTS revenue NUMERIC,
ADD COLUMN IF NOT EXISTS ebitda NUMERIC,
ADD COLUMN IF NOT EXISTS cash_flow NUMERIC;

-- Add image column (some might use image instead of image_url)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS image TEXT;

-- Add city column for detailed location
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS city TEXT;

-- ============================================================================
-- Create listing_operational table if it doesn't exist
-- ============================================================================

CREATE TABLE IF NOT EXISTS listing_operational (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  employees_count INTEGER,
  owner_involvement TEXT CHECK (owner_involvement IN ('none', 'part_time', 'full_time')),
  support_provided TEXT CHECK (support_provided IN ('none', 'transition', 'training', 'full')),
  seller_relationship TEXT CHECK (seller_relationship IN ('broker', 'owner', 'mandate', 'advisor')),
  preferred_contact TEXT CHECK (preferred_contact IN ('email', 'phone', 'platform')),
  reason_for_sale TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on listing_operational
ALTER TABLE listing_operational ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view operational details of approved listings
CREATE POLICY listing_operational_view ON listing_operational
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = listing_operational.listing_id 
      AND listings.status = 'approved'
    )
  );

-- Create index for lookup
CREATE INDEX IF NOT EXISTS idx_listing_operational_listing_id 
ON listing_operational(listing_id);

-- ============================================================================
-- Create listing_financials table if it doesn't exist
-- ============================================================================

CREATE TABLE IF NOT EXISTS listing_financials (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
  valuation_multiple NUMERIC,
  gross_margin NUMERIC,
  net_margin NUMERIC,
  inventory_value NUMERIC,
  assets_value NUMERIC,
  liabilities NUMERIC,
  revenue_3yr_cagr_pct NUMERIC,
  income_statement JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on listing_financials
ALTER TABLE listing_financials ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view financial details of approved listings
CREATE POLICY listing_financials_view ON listing_financials
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = listing_financials.listing_id 
      AND listings.status = 'approved'
    )
  );

-- Create index for lookup
CREATE INDEX IF NOT EXISTS idx_listing_financials_listing_id 
ON listing_financials(listing_id);

-- ============================================================================
-- Add indexes for better query performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_type_status ON listings(type, status);
CREATE INDEX IF NOT EXISTS idx_listings_plan_status ON listings(plan, status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_country ON listings(country);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

-- ============================================================================
-- Ensure RLS policies allow public viewing of approved listings
-- ============================================================================

-- Drop existing policy if it exists and recreate to ensure it's correct
DROP POLICY IF EXISTS listings_view_approved ON listings;

CREATE POLICY listings_view_approved ON listings
  FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Ensure operational details are accessible for public viewing
DROP POLICY IF EXISTS listing_operational_view ON listing_operational;

CREATE POLICY listing_operational_view ON listing_operational
  FOR SELECT
  USING (true);  -- Allow all to view since listings themselves control visibility

-- Ensure financial details are accessible for public viewing
DROP POLICY IF EXISTS listing_financials_view ON listing_financials;

CREATE POLICY listing_financials_view ON listing_financials
  FOR SELECT
  USING (true);  -- Allow all to view since listings themselves control visibility
