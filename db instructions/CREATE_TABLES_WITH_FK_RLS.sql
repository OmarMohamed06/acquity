-- ============================================================================
-- ACQUITY MARKETPLACE SCHEMA - Complete Table Creation with FK & RLS
-- PostgreSQL
-- ============================================================================

-- ============================================================================
-- 1. profiles TABLE
-- ============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY profiles_view_own
ON profiles FOR SELECT
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY profiles_update_own
ON profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin can see all
CREATE POLICY profiles_admin_all
ON profiles FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');



-- ============================================================================
-- 2. SELLER_DETAILS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS seller_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Seller identity
  seller_full_name TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  seller_phone TEXT NOT NULL,
  seller_phone_country_code TEXT NOT NULL,
  seller_country TEXT NOT NULL,

  -- Preferences & relationship
  seller_preferred_contact TEXT NOT NULL
    CHECK (seller_preferred_contact IN ('email', 'phone', 'whatsapp')),

  seller_relationship TEXT NOT NULL
    CHECK (seller_relationship IN ('owner', 'cofounder', 'shareholder', 'representative', 'broker', 'partner', 'authorized_representative')),

  -- Ownership information
  seller_ownership_percentage NUMERIC(5, 2),

  -- Legal confirmation
  seller_authority_to_sell BOOLEAN NOT NULL DEFAULT false,

  -- Foreign key to users (optional, seller can exist without user account initially)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Meta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on seller_details
ALTER TABLE seller_details ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view/edit their own seller details
CREATE POLICY seller_details_view_own ON seller_details
  FOR SELECT
  USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Policy: Users can update their own seller details
CREATE POLICY seller_details_update_own ON seller_details
  FOR UPDATE
  USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Policy: Users can insert their own seller details
CREATE POLICY seller_details_insert_own ON seller_details
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Index for lookups
CREATE INDEX idx_seller_details_user_id ON seller_details(user_id);
CREATE INDEX idx_seller_details_email ON seller_details(seller_email);


-- ============================================================================
-- 3. LISTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Seller relationship
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Approval workflow
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,

  -- Listing type
  type TEXT NOT NULL
    CHECK (type IN ('business_sale', 'franchise_sale', 'investment_opportunity')),
  plan TEXT NOT NULL
    CHECK (plan IN ('free', 'standard', 'premium')),

  -- Core details
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT,
  description TEXT NOT NULL,
  established_year SMALLINT,
  image_url TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can view their own listings (any status)
CREATE POLICY listings_view_own ON listings
  FOR SELECT
  USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Policy: Public can view approved listings
CREATE POLICY listings_view_approved ON listings
  FOR SELECT
  USING (status = 'approved');

-- Policy: Owners can update their own listings
CREATE POLICY listings_update_own ON listings
  FOR UPDATE
  USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Policy: Owners can insert listings
CREATE POLICY listings_insert_own ON listings
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Only admins can approve/reject listings
CREATE POLICY listings_approve_admin ON listings
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Indexes for performance
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_plan ON listings(plan);
CREATE INDEX idx_listings_country ON listings(country);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);


-- ============================================================================
-- 4. BUSINESS_SALE_DETAILS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS business_sale_details (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,

  year_established INTEGER,
  employees_count INTEGER,
  asking_price NUMERIC,
  annual_revenue NUMERIC,
  ebitda NUMERIC,
  annual_cashflow NUMERIC,
  reason_for_sale TEXT,
  owner_involvement TEXT
    CHECK (owner_involvement IS NULL OR owner_involvement IN ('none', 'part_time', 'full_time')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on business_sale_details
ALTER TABLE business_sale_details ENABLE ROW LEVEL SECURITY;

-- Policy: View details for approved listings or own listings
CREATE POLICY business_sale_details_view ON business_sale_details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = business_sale_details.listing_id
        AND (listings.status = 'approved' OR listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );

-- Policy: Owners can update their own listing details
CREATE POLICY business_sale_details_update_own ON business_sale_details
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = business_sale_details.listing_id
        AND (listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = business_sale_details.listing_id
        AND (listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );


-- ============================================================================
-- 5. FRANCHISE_SALE_DETAILS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS franchise_sale_details (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,

  year_founded SMALLINT,
  total_units SMALLINT,
  franchise_fee NUMERIC,
  royalty_fee_percent NUMERIC,
  avg_unit_revenue NUMERIC,
  avg_unit_profit NUMERIC,
  avg_unit_cash_flow NUMERIC,
  support_provided TEXT
    CHECK (support_provided IS NULL OR support_provided IN ('none', 'transition', 'training', 'full')),
  target_customer TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on franchise_sale_details
ALTER TABLE franchise_sale_details ENABLE ROW LEVEL SECURITY;

-- Policy: View details for approved listings or own listings
CREATE POLICY franchise_sale_details_view ON franchise_sale_details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = franchise_sale_details.listing_id
        AND (listings.status = 'approved' OR listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );

-- Policy: Owners can update their own listing details
CREATE POLICY franchise_sale_details_update_own ON franchise_sale_details
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = franchise_sale_details.listing_id
        AND (listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = franchise_sale_details.listing_id
        AND (listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );


-- ============================================================================
-- 6. INVESTMENT_OPPORTUNITY_DETAILS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS investment_opportunity_details (
  listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,

  company_stage TEXT
    CHECK (company_stage IS NULL OR company_stage IN ('idea', 'mvp', 'revenue', 'growth', 'mature')),
  capital_required NUMERIC,
  equity_offered_percent NUMERIC,
  annual_revenue NUMERIC,
  annual_profit NUMERIC,
  implied_valuation NUMERIC,
  scalability_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on investment_opportunity_details
ALTER TABLE investment_opportunity_details ENABLE ROW LEVEL SECURITY;

-- Policy: View details for approved listings or own listings
CREATE POLICY investment_opportunity_details_view ON investment_opportunity_details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = investment_opportunity_details.listing_id
        AND (listings.status = 'approved' OR listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );

-- Policy: Owners can update their own listing details
CREATE POLICY investment_opportunity_details_update_own ON investment_opportunity_details
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = investment_opportunity_details.listing_id
        AND (listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = investment_opportunity_details.listing_id
        AND (listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );


-- ============================================================================
-- 7. BUYER_CONTACT TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS buyer_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  company TEXT,
  budget_range TEXT,
  reason_interest TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on buyer_contact
ALTER TABLE buyer_contact ENABLE ROW LEVEL SECURITY;

-- Policy: Listing owners can view inquiries for their listings
CREATE POLICY buyer_contact_view_own ON buyer_contact
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = buyer_contact.listing_id
        AND (listings.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );

-- Policy: Anyone can create an inquiry on an approved or pending listing (beta)
CREATE POLICY buyer_contact_insert_approved ON buyer_contact
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = buyer_contact.listing_id
        AND (listings.status = 'approved' OR listings.status = 'pending')
    )
  );

-- Index for performance
CREATE INDEX idx_buyer_contact_listing_id ON buyer_contact(listing_id);
CREATE INDEX idx_buyer_contact_created_at ON buyer_contact(created_at DESC);


-- ============================================================================
-- SUMMARY OF FOREIGN KEY RELATIONSHIPS
-- ============================================================================
--
-- seller_details.user_id → users.id (ON DELETE SET NULL)
-- listings.user_id → users.id (ON DELETE SET NULL)
-- business_sale_details.listing_id → listings.id (ON DELETE CASCADE)
-- franchise_sale_details.listing_id → listings.id (ON DELETE CASCADE)
-- investment_opportunity_details.listing_id → listings.id (ON DELETE CASCADE)
-- buyer_contact.listing_id → listings.id (ON DELETE CASCADE)
--
-- ============================================================================
-- SUMMARY OF RLS POLICIES
-- ============================================================================
--
-- users:
--   - SELECT: Own profile or admin
--   - UPDATE: Own profile or admin
--
-- seller_details:
--   - SELECT: Own details or admin
--   - UPDATE: Own details or admin
--   - INSERT: Own details
--
-- listings:
--   - SELECT: Own listing (any status) or approved public OR admin
--   - UPDATE: Own listing or admin
--   - INSERT: Own listing
--   - APPROVE: Admin only
--
-- business_sale_details, franchise_sale_details, investment_opportunity_details:
--   - SELECT: If listing is approved OR user owns the listing OR admin
--   - UPDATE: If user owns the listing OR admin
--
-- buyer_contact:
--   - SELECT: If user owns the listing OR admin
--   - INSERT: On any approved listing
--
-- ============================================================================
