-- Adds sold fields to listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS sold boolean DEFAULT false;
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS sold_price numeric;
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS date_closed timestamptz;
