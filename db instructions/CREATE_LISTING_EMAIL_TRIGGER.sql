-- Create a function that sends emails via the Edge Function
CREATE OR REPLACE FUNCTION public.send_listing_status_email()
RETURNS TRIGGER AS $$
DECLARE
  v_status text;
  v_rejection_reason text := NULL;
BEGIN
  -- Determine what to send
  IF TG_OP = 'INSERT' THEN
    -- New listing: always send "pending" email
    v_status := 'pending';
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    -- Status changed: send new status email
    v_status := NEW.status;
    
    -- Get rejection reason if rejecting
    IF NEW.status = 'rejected' AND NEW.rejection_reason IS NOT NULL THEN
      v_rejection_reason := NEW.rejection_reason;
    END IF;
  ELSE
    -- No relevant change, don't send email
    RETURN NEW;
  END IF;

  -- Call the Edge Function via HTTP
  PERFORM net.http_post(
    url := 'https://vdmymidkrxpftvesezvb.supabase.co/functions/v1/listing-status-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbXltaWRrcnhwZnR2ZXNlenZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMjE3OTUsImV4cCI6MjA4NDY5Nzc5NX0.hfD4tGlEPwfHFl8YSCWEdfeoDUrcERrOO1zRc6Lc9eQ'
    ),
    body := jsonb_build_object(
      'listing_id', NEW.id,
      'status', v_status,
      'rejection_reason', v_rejection_reason
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't block the operation
  RAISE WARNING 'Error sending email: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_send_listing_status_email ON public.listings;

-- Create the trigger for both INSERT and UPDATE
CREATE TRIGGER trigger_send_listing_status_email
AFTER INSERT OR UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.send_listing_status_email();

-- Ensure the pgsql_net extension is enabled (required for net.http_post)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
