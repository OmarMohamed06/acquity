-- Convert support_provided from TEXT to TEXT[] (array) in franchise_sale_details table
-- This allows storing multiple support items instead of a single text value

-- Step 1: Add a new temporary column as TEXT[]
ALTER TABLE franchise_sale_details
ADD COLUMN support_provided_new TEXT[];

-- Step 2: Migrate existing data - convert comma-separated strings to arrays
-- If the field contains commas, split into array. Otherwise, create single-item array
UPDATE franchise_sale_details
SET support_provided_new = 
  CASE 
    WHEN support_provided IS NULL THEN NULL
    WHEN support_provided LIKE '%,%' THEN string_to_array(support_provided, ',')
    ELSE ARRAY[support_provided]
  END;

-- Step 3: Drop the old column
ALTER TABLE franchise_sale_details
DROP COLUMN support_provided;

-- Step 4: Rename the new column to the original name
ALTER TABLE franchise_sale_details
RENAME COLUMN support_provided_new TO support_provided;

-- Optional: Clean up whitespace from array elements (trim each element)
UPDATE franchise_sale_details
SET support_provided = ARRAY(
  SELECT trim(elem)
  FROM unnest(support_provided) AS elem
)
WHERE support_provided IS NOT NULL;

-- Verify the changes
-- SELECT id, support_provided FROM franchise_sale_details LIMIT 5;
