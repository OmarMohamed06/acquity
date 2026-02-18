-- Add INSERT policy for profiles table to allow user signup
-- (Run this if columns already exist)

CREATE POLICY profiles_insert_own
ON profiles FOR INSERT
WITH CHECK (id = auth.uid());
