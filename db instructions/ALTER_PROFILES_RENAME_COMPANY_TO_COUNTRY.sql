-- Rename company_name column to country in profiles table

ALTER TABLE profiles
RENAME COLUMN company_name TO country;

-- Update comment to reflect the change
COMMENT ON COLUMN profiles.country IS 'User country or location';
