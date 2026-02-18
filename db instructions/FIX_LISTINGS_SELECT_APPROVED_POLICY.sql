-- Ensure public can read approved listings

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS listings_view_approved ON public.listings;

CREATE POLICY listings_view_approved
  ON public.listings
  FOR SELECT
  USING (status = 'approved');
