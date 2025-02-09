/*
  # Fix column naming for consistency
  
  1. Changes
    - Rename care_instructions column to careInstructions to match application code
    - Update existing data to maintain consistency
  
  2. Security
    - Maintains existing RLS policies
*/

-- Rename the column to match application code
ALTER TABLE products 
RENAME COLUMN care_instructions TO "careInstructions";

-- Reapply RLS policies to ensure they work with the renamed column
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Full access for all users" ON products;

CREATE POLICY "Public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Full access for all users"
  ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);