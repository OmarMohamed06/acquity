-- Add INSERT policy for profiles table to allow user signup

-- Allow users to insert their own profile during signup
CREATE POLICY profiles_insert_own
ON profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- Add the new columns if they don't exist yet
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='user_intent') THEN
    ALTER TABLE profiles ADD COLUMN user_intent TEXT CHECK (user_intent IN ('buyer', 'seller'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='company_name') THEN
    ALTER TABLE profiles ADD COLUMN company_name TEXT;
  END IF;
END $$;

-- Add comments
COMMENT ON COLUMN profiles.user_intent IS 'User intent: buyer (investor) or seller (business owner/broker)';
COMMENT ON COLUMN profiles.company_name IS 'Optional company or organization name';
