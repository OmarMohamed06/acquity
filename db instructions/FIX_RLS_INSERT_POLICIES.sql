-- ============================================================================
-- FIX: Add missing INSERT policies for detail tables
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- These tables need INSERT policies to allow users to create their listing details
-- after creating a listing record.

-- ============================================================================
-- 1. business_sale_details INSERT policy
-- ============================================================================
CREATE POLICY business_sale_details_insert_own ON business_sale_details
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = business_sale_details.listing_id
        AND listings.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 2. franchise_sale_details INSERT policy
-- ============================================================================
CREATE POLICY franchise_sale_details_insert_own ON franchise_sale_details
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = franchise_sale_details.listing_id
        AND listings.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 3. investment_opportunity_details INSERT policy
-- ============================================================================
CREATE POLICY investment_opportunity_details_insert_own ON investment_opportunity_details
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = investment_opportunity_details.listing_id
        AND listings.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 4. listing_documents INSERT policy (if missing)
-- ============================================================================
-- Check if this policy exists, if not, add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'listing_documents' 
    AND policyname = 'listing_documents_insert_own'
  ) THEN
    CREATE POLICY listing_documents_insert_own ON listing_documents
      FOR INSERT
      WITH CHECK (
        uploaded_by = auth.uid() AND
        EXISTS (
          SELECT 1 FROM listings
          WHERE listings.id = listing_documents.listing_id
            AND listings.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ============================================================================
-- Verify policies were created
-- ============================================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN (
  'business_sale_details',
  'franchise_sale_details', 
  'investment_opportunity_details',
  'listing_documents'
)
AND cmd = 'INSERT'
ORDER BY tablename, policyname;
