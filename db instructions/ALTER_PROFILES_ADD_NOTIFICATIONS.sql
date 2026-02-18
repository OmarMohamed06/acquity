-- Add notification preference columns to profiles table

-- Add email notification preferences
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT FALSE;

-- Add comment to describe the new columns
COMMENT ON COLUMN profiles.email_notifications IS 'Receive updates about your listings';
COMMENT ON COLUMN profiles.marketing_emails IS 'Receive marketing and promotional emails';
