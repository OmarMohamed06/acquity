-- Ensure listing_documents table exists with compatible columns

create table if not exists public.listing_documents (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  document_type text,
  file_name text not null,
  file_path text,
  file_url text,
  file_size integer,
  file_size_bytes integer,
  mime_type text,
  uploaded_by uuid,
  uploaded_by_user_id uuid,
  created_at timestamp with time zone default now(),
  uploaded_at timestamp with time zone default now()
);

alter table public.listing_documents enable row level security;

-- Allow owners to insert their own docs
create policy if not exists listing_documents_insert_own
  on public.listing_documents
  for insert
  with check (
    (uploaded_by = auth.uid() or uploaded_by_user_id = auth.uid())
    and exists (
      select 1 from public.listings
      where public.listings.id = public.listing_documents.listing_id
        and public.listings.user_id = auth.uid()
    )
  );

-- Allow owners and admins to view docs
create policy if not exists listing_documents_select_admin_or_owner
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

create index if not exists idx_listing_documents_listing_id
  on public.listing_documents(listing_id);
