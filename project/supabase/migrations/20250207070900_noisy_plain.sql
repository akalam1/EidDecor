/*
  # Fix RLS Policies for Products Table

  1. Changes
    - Drop existing policies
    - Create new simplified policies that allow:
      - Public read access
      - Full access for authenticated users
    - Ensure proper RLS configuration
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for everyone" ON products;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON products;

-- Temporarily disable RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "Public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users full access"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is properly configured
ALTER TABLE products FORCE ROW LEVEL SECURITY;