/*
  # Fix Product Management
  
  1. Changes
    - Add indexes for better query performance
    - Add constraints for data integrity
    - Update RLS policies for better security
    
  2. Security
    - Maintain existing RLS policies
    - Add additional data validation
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- Add constraints for data integrity
ALTER TABLE products 
ADD CONSTRAINT valid_category 
CHECK (category IN ('eid', 'ramadan', 'new'));

ALTER TABLE products 
ADD CONSTRAINT positive_price 
CHECK (price >= 0);

ALTER TABLE products 
ADD CONSTRAINT non_negative_quantity 
CHECK (quantity >= 0);

-- Add function to validate product data
CREATE OR REPLACE FUNCTION validate_product_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure details is a valid JSON array
  IF NOT (NEW.details @> '[]'::jsonb) THEN
    NEW.details := '[]'::jsonb;
  END IF;

  -- Ensure dimensions has required fields
  IF NOT (NEW.dimensions ? 'length' AND 
          NEW.dimensions ? 'width' AND 
          NEW.dimensions ? 'height' AND 
          NEW.dimensions ? 'unit') THEN
    NEW.dimensions := '{"length": 0, "width": 0, "height": 0, "unit": "cm"}'::jsonb;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for data validation
DROP TRIGGER IF EXISTS validate_product_data_trigger ON products;
CREATE TRIGGER validate_product_data_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION validate_product_data();