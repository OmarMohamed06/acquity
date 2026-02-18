create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamp with time zone not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Allow public newsletter inserts"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);
