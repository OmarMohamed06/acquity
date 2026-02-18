alter table public.listings
  drop constraint if exists listings_plan_check;

alter table public.listings
  add constraint listings_plan_check
  check (plan in ('free', 'basic', 'standard', 'premium'));

-- Optional: align legacy 'free' to 'basic' for consistency
-- update public.listings set plan = 'basic' where plan = 'free';
