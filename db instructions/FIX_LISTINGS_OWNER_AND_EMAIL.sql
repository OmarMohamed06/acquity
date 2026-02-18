-- ============================================================================
-- FIX LISTINGS OWNER AND EMAIL - COMPLETE SOLUTION
-- ============================================================================

-- Step 1: Check current state
SELECT 'BEFORE FIX' as step;
SELECT COUNT(*) as total_listings, 
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as listings_without_owner
FROM listings;

SELECT id, email FROM auth.users;

SELECT id, title, user_id FROM listings LIMIT 5;

-- Step 2: If you have no users, create a test user
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Check if users exist
  IF (SELECT COUNT(*) FROM auth.users) = 0 THEN
    -- Create a test user in auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'seller@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now()
    ) RETURNING id INTO new_user_id;
    
    RAISE NOTICE 'Created test user: %', new_user_id;
  END IF;
END $$;

-- Step 3: Assign user_id to listings that don't have one
UPDATE listings
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Step 4: Verify the fix
SELECT 'AFTER FIX' as step;
SELECT COUNT(*) as total_listings,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as listings_with_owner
FROM listings;

SELECT l.id, l.title, l.user_id, u.email
FROM listings l
LEFT JOIN auth.users u ON l.user_id = u.id
LIMIT 5;

-- Step 5: Test the trigger by checking if seller_email would be found
SELECT 
  l.id as listing_id,
  l.title,
  l.user_id,
  u.email as seller_email,
  p.full_name as seller_name
FROM listings l
LEFT JOIN auth.users u ON l.user_id = u.id
LEFT JOIN profiles p ON u.id = p.id
LIMIT 5;
