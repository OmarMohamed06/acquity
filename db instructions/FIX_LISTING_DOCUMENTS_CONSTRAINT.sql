-- Fix listing_documents CHECK constraint to accept valid document types
-- Run this if you get error: violates check constraint "listing_documents_document_type_check"

-- Option 1: Drop and recreate the constraint with valid values
ALTER TABLE public.listing_documents 
DROP CONSTRAINT IF EXISTS listing_documents_document_type_check;

-- Add new constraint that accepts these document types
ALTER TABLE public.listing_documents 
ADD CONSTRAINT listing_documents_document_type_check 
CHECK (document_type IN ('financial_doc', 'legal_doc', 'identity_doc', 'certificate', 'license', 'other', NULL));

-- Option 2: If you just want to remove the constraint entirely (less strict)
-- ALTER TABLE public.listing_documents DROP CONSTRAINT IF EXISTS listing_documents_document_type_check;

-- Verify the constraint was added
SELECT constraint_name, constraint_definition 
FROM information_schema.table_constraints 
WHERE table_name = 'listing_documents' AND constraint_type = 'CHECK';
