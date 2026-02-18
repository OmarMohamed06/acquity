-- Add full_name column to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Create index on full_name for faster searches
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);

-- Optional: Update any existing profiles with data from auth.users if available
UPDATE profiles p
SET full_name = (
  SELECT raw_user_meta_data ->> 'full_name'
  FROM auth.users au
  WHERE au.id = p.id
)
WHERE p.full_name IS NULL
  AND EXISTS (
    SELECT 1
    FROM auth.users au
    WHERE au.id = p.id
    AND au.raw_user_meta_data ->> 'full_name' IS NOT NULL
  );
