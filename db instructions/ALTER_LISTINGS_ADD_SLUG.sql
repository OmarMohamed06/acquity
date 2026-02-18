-- Add slug column to listings table for SEO-friendly URLs
-- Slugs are generated once at creation and never changed
-- Format: {sanitized-title}-{8-char-id}
-- Example: enterprise-payment-gateway-8f3a9k2b

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_listings_slug ON public.listings(slug);

-- Add comment for documentation
COMMENT ON COLUMN public.listings.slug IS 'SEO-friendly URL slug, generated once at creation, never regenerated';
