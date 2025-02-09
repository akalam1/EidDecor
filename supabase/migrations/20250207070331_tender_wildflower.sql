/*
  # Fix RLS Policies for Products Table
  
  1. Changes
    - Drop existing policies
    - Create new policies with proper authentication checks
    - Add policy for authenticated users to manage products
    
  2. Security
    - Public read access for all users
    - Write access only for authenticated users
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;

-- Create new policies with proper checks
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Enable full access for authenticated users" ON products
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);