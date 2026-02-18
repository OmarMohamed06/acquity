-- Check and fix RLS policies for profiles table

-- First, let's see what policies exist
-- Run this to see current policies:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS profiles_insert_own ON profiles;

-- Create INSERT policy
CREATE POLICY profiles_insert_own
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Make sure UPDATE policy exists and allows updates
DROP POLICY IF EXISTS profiles_update_own ON profiles;

CREATE POLICY profiles_update_own
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Verify the policies were created
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';
