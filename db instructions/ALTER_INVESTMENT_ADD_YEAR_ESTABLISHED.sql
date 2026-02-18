-- Add year_established column to investment_opportunity_details table

ALTER TABLE investment_opportunity_details
ADD COLUMN year_established SMALLINT;

-- Add comment to document the column
COMMENT ON COLUMN investment_opportunity_details.year_established IS 'Year the company was established/founded';
