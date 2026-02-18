-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification content
  type VARCHAR(50) NOT NULL, -- 'listing_approved', 'listing_rejected', 'new_inquiry', 'listing_sold', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Related entities (optional references)
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  inquiry_id UUID REFERENCES buyer_contact(id) ON DELETE CASCADE,
  
  -- Notification state
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for performance
  CONSTRAINT notifications_user_id_idx CHECK (user_id IS NOT NULL)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read);
CREATE INDEX IF NOT EXISTS notifications_user_read_idx ON notifications(user_id, read);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- RLS Policies

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own notifications (for system/app-generated notifications)
CREATE POLICY "Users can insert their own notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notifications (mark as read, etc.)
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to automatically create notifications for listing status changes
CREATE OR REPLACE FUNCTION notify_listing_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if status changed
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO notifications (user_id, type, title, message, listing_id)
    VALUES (
      NEW.user_id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'listing_approved'
        WHEN NEW.status = 'rejected' THEN 'listing_rejected'
        ELSE 'listing_status_change'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Listing Approved!'
        WHEN NEW.status = 'rejected' THEN 'Listing Rejected'
        ELSE 'Listing Status Updated'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Your listing "' || NEW.title || '" has been approved and is now live.'
        WHEN NEW.status = 'rejected' THEN 'Your listing "' || NEW.title || '" was not approved. Please review and resubmit.'
        ELSE 'Your listing "' || NEW.title || '" status has been updated to ' || NEW.status || '.'
      END,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for listing status changes
DROP TRIGGER IF EXISTS listing_status_notification ON listings;
CREATE TRIGGER listing_status_notification
  AFTER UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION notify_listing_status_change();

-- Create a function to notify sellers of new inquiries
CREATE OR REPLACE FUNCTION notify_new_inquiry()
RETURNS TRIGGER AS $$
DECLARE
  listing_owner UUID;
  listing_title VARCHAR(255);
BEGIN
  -- Get the listing owner and title
  SELECT user_id, title INTO listing_owner, listing_title
  FROM listings
  WHERE id = NEW.listing_id;
  
  -- Create notification for the listing owner
  IF listing_owner IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, listing_id, inquiry_id)
    VALUES (
      listing_owner,
      'new_inquiry',
      'New Inquiry Received',
      'You received a new inquiry from ' || NEW.buyer_name || ' for "' || listing_title || '".',
      NEW.listing_id,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new inquiries
DROP TRIGGER IF EXISTS new_inquiry_notification ON buyer_contact;
CREATE TRIGGER new_inquiry_notification
  AFTER INSERT ON buyer_contact
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_inquiry();

COMMENT ON TABLE notifications IS 'Stores user notifications for various app events';
COMMENT ON COLUMN notifications.type IS 'Type of notification: listing_approved, listing_rejected, new_inquiry, listing_sold, etc.';
COMMENT ON COLUMN notifications.read IS 'Whether the notification has been read by the user';
