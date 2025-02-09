/*
  # Fix Products Schema

  1. Changes
    - Simplify products table structure
    - Remove RLS completely
    - Add basic constraints
*/

-- Drop existing table
DROP TABLE IF EXISTS products;

-- Create simplified products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  quantity integer DEFAULT 0,
  category text NOT NULL,
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);