/*
  # Add status column to products table
  
  1. Changes
    - Add status column to products table with default value 'active'
    - Update existing records to have default status
    - Add check constraint to ensure valid status values
*/

-- Add status column with default value
ALTER TABLE products
ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Update existing records to have the default status
UPDATE products SET status = 'active' WHERE status IS NULL;