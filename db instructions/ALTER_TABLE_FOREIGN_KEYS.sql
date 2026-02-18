-- ALTER TABLE statements to add Foreign Key relationships
-- PostgreSQL Acquity Marketplace Schema
-- Based on actual schema: users, listings, *_sale_details, buyer_contact
-- Execute in order

-- ============================================================================
-- LISTINGS TABLE - Link seller to user account
-- ============================================================================

-- Seller ownership: listings.user_id references users.id
-- ON DELETE SET NULL: If seller account deleted, listing soft-owned by system (preserves approval history)
ALTER TABLE listings
ADD CONSTRAINT fk_listings_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;


-- ============================================================================
-- BUSINESS SALE DETAILS - Type-specific fields for business_sale listings
-- ============================================================================

-- 1:1 relationship with listings table
-- ON DELETE CASCADE: When business listing deleted, details cascade removed
ALTER TABLE business_sale_details
ADD CONSTRAINT fk_business_sale_details_listing_id
FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;


-- ============================================================================
-- FRANCHISE SALE DETAILS - Type-specific fields for franchise_sale listings
-- ============================================================================

-- 1:1 relationship with listings table
-- ON DELETE CASCADE: When franchise listing deleted, details cascade removed
ALTER TABLE franchise_sale_details
ADD CONSTRAINT fk_franchise_sale_details_listing_id
FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;


-- ============================================================================
-- INVESTMENT OPPORTUNITY DETAILS - Type-specific fields for investment_opportunity listings
-- ============================================================================

-- 1:1 relationship with listings table
-- ON DELETE CASCADE: When investment listing deleted, details cascade removed
ALTER TABLE investment_opportunity_details
ADD CONSTRAINT fk_investment_opportunity_details_listing_id
FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;


-- ============================================================================
-- BUYER CONTACT - Buyer/Investor inquiries & interest tracking
-- ============================================================================

-- Many:1 relationship with listings (one listing can receive multiple inquiries)
-- ON DELETE CASCADE: When listing deleted, inquiries are removed
ALTER TABLE buyer_contact
ADD CONSTRAINT fk_buyer_contact_listing_id
FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;


-- ============================================================================
-- ADMIN APPROVAL WORKFLOW - Already supported by status + rejection_reason
-- ============================================================================
--
-- listings.status column supports: 'pending', 'approved', 'rejected'
-- listings.rejection_reason stores admin feedback if rejected
--
-- No additional table needed unless you want audit trail of all approvals.
-- If adding approval history table, use:
--
-- CREATE TABLE listing_approval_history (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
--   approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
--   status TEXT NOT NULL,
--   rejection_reason TEXT,
--   created_at TIMESTAMPTZ DEFAULT now()
-- );
-- CREATE INDEX idx_approval_history_listing_id ON listing_approval_history(listing_id);
-- CREATE INDEX idx_approval_history_created_at ON listing_approval_history(created_at DESC);
