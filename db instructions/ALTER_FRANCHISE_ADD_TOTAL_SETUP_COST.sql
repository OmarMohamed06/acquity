-- Add total_setup_cost column to franchise_sale_details table

ALTER TABLE franchise_sale_details
ADD COLUMN total_setup_cost NUMERIC;

-- Add comment to document the column
COMMENT ON COLUMN franchise_sale_details.total_setup_cost IS 'Total initial setup/investment cost for the franchise';
