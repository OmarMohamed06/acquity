alter table public.listings
  add column if not exists payment_status text;

update public.listings
set payment_status = 'free_beta'
where payment_status is null;
