-- Add external link column to products table
ALTER TABLE products 
ADD COLUMN external_link text;

-- Update existing products to have null external_link
UPDATE products 
SET external_link = NULL 
WHERE external_link IS NULL;