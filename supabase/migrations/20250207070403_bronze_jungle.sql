/*
  # Fix RLS Policies for Products Table
  
  1. Changes
    - Drop all existing policies
    - Create new simplified policies
    - Add policy for authenticated users to manage products
    
  2. Security
    - Public read access for all users
    - Full access for authenticated users
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON products;

-- Temporarily disable RLS to ensure clean state
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to bypass RLS
ALTER TABLE products FORCE ROW LEVEL SECURITY;