-- Allow listing owners and admins (from profiles.role) to view listing_documents
-- Keeps existing policies intact

drop policy if exists listing_documents_select_admin_or_owner on public.listing_documents;

create policy listing_documents_select_admin_or_owner
  on public.listing_documents
  for select
  using (
    exists (
      select 1
      from public.listings
      where public.listings.id = public.listing_documents.listing_id
        and (
          public.listings.user_id = auth.uid()
          or exists (
            select 1
            from public.profiles
            where public.profiles.id = auth.uid()
              and public.profiles.role = 'admin'
          )
        )
    )
  );
