-- Add user_intent and company_name columns to profiles table

ALTER TABLE profiles
ADD COLUMN user_intent TEXT CHECK (user_intent IN ('buyer', 'seller')),
ADD COLUMN company_name TEXT;

-- Add comments to document the columns
COMMENT ON COLUMN profiles.user_intent IS 'User intent: buyer (investor) or seller (business owner/broker)';
COMMENT ON COLUMN profiles.company_name IS 'Optional company or organization name';
