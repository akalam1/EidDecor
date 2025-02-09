/*
  # Products Table RLS Policies and Enhancements
  
  1. Security Changes
    - Add policies for public read access
    - Add policies for full access to manage products
*/

-- Drop any existing policies
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Full access for all users" ON products;

-- Create new policies
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