/**
 * Test Script: Create Sample Listing Data
 * 
 * Run this in your Supabase SQL Editor to populate test data
 * Useful for testing the listing detail page without form submissions
 */

-- ============================================================================
-- INSERT SAMPLE BUSINESS LISTING
-- ============================================================================

INSERT INTO listings (
  id, 
  slug, 
  type, 
  plan, 
  status,
  title, 
  category, 
  location, 
  country, 
  city,
  description, 
  established_year,
  price, 
  revenue, 
  ebitda, 
  cash_flow,
  image_url,
  user_id,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'established-technology-business-for-sale-550e8400',
  'business_sale',
  'premium',
  'approved',
  'Established Technology Business for Sale',
  'Technology',
  'San Francisco, CA',
  'USA',
  'San Francisco',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  2015,
  750000,
  1200000,
  350000,
  280000,
  'https://via.placeholder.com/1200x600?text=Technology+Business',
  '00000000-0000-0000-0000-000000000001', -- Replace with actual user ID
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT OPERATIONAL DETAILS FOR THE SAMPLE LISTING
-- ============================================================================

INSERT INTO listing_operational (
  listing_id,
  employees_count,
  owner_involvement,
  support_provided,
  seller_relationship,
  preferred_contact,
  reason_for_sale,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  12,
  'full_time',
  'full',
  'owner',
  'email',
  'Retirement',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT FINANCIAL DETAILS FOR THE SAMPLE LISTING
-- ============================================================================

INSERT INTO listing_financials (
  listing_id,
  valuation_multiple,
  gross_margin,
  net_margin,
  inventory_value,
  assets_value,
  liabilities,
  revenue_3yr_cagr_pct,
  income_statement,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  2.0,
  65.0,
  29.2,
  150000,
  850000,
  100000,
  12.5,
  '{"year_2023": 1200000, "year_2022": 1050000, "year_2021": 920000}',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERT ADDITIONAL SAMPLE LISTINGS (FOR VARIETY)
-- ============================================================================

INSERT INTO listings (
  id, 
  slug, 
  type, 
  plan, 
  status,
  title, 
  category, 
  location, 
  country, 
  city,
  description, 
  established_year,
  price, 
  revenue, 
  ebitda, 
  cash_flow,
  image_url,
  user_id,
  created_at,
  updated_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'premium-coffee-shop-downtown-dubai-550e8400',
  'business_sale',
  'premium',
  'approved',
  'Premium Coffee Shop - Downtown Dubai',
  'Food & Beverage',
  'Dubai, UAE',
  'UAE',
  'Dubai',
  'Established premium coffee shop in the heart of downtown Dubai with loyal customer base and consistent revenue growth. Perfect for investor looking for passive income.',
  2016,
  350000,
  600000,
  150000,
  120000,
  'https://via.placeholder.com/1200x600?text=Coffee+Shop',
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'profitable-retail-business-mall-location-550e8400',
  'business_sale',
  'standard',
  'approved',
  'Profitable Retail Business - Prime Mall Location',
  'Retail',
  'Abu Dhabi, UAE',
  'UAE',
  'Abu Dhabi',
  'Well-established retail business in one of Abu Dhabi''s premier shopping malls. Strong foot traffic, established brand presence, and proven profitability.',
  2014,
  250000,
  500000,
  100000,
  80000,
  'https://via.placeholder.com/1200x600?text=Retail+Store',
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFY DATA WAS INSERTED
-- ============================================================================

SELECT 
  l.id,
  l.slug,
  l.title,
  l.category,
  l.location,
  l.price,
  l.status
FROM listings l
WHERE l.type = 'business_sale'
ORDER BY l.created_at DESC
LIMIT 5;
