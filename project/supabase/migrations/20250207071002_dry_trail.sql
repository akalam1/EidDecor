/*
  # Remove Security Restrictions
  
  1. Changes
    - Disable RLS completely
    - Remove all policies
    - Allow public access to all operations
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Authenticated users full access" ON products;
DROP POLICY IF EXISTS "Enable read access for everyone" ON products;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON products;

-- Disable RLS completely
ALTER TABLE products DISABLE ROW LEVEL SECURITY;