-- Create a secure function to check if an email exists in auth.users

create or replace function public.check_email_exists(input_email text)
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists(
    select 1 from auth.users
    where lower(email) = lower(input_email)
  );
$$;

grant execute on function public.check_email_exists(text) to anon, authenticated;
