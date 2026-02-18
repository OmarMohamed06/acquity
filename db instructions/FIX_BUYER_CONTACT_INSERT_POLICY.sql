-- Allow inquiries on approved OR pending listings (beta)

DROP POLICY IF EXISTS buyer_contact_insert_approved ON public.buyer_contact;

CREATE POLICY buyer_contact_insert_approved
  ON public.buyer_contact
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE public.listings.id = public.buyer_contact.listing_id
        AND public.listings.status IN ('approved', 'pending')
    )
  );
