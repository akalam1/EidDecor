/*
  # Fix care instructions field naming
  
  1. Changes
    - Drop existing products table
    - Recreate with consistent snake_case column naming
    - Add proper constraints and defaults
*/

-- Drop existing table
DROP TABLE IF EXISTS products;

-- Create products table with consistent snake_case column naming
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  quantity integer DEFAULT 0,
  category text NOT NULL CHECK (category IN ('eid', 'ramadan', 'new')),
  details jsonb DEFAULT '[]',
  dimensions jsonb DEFAULT '{"length": 0, "width": 0, "height": 0, "unit": "cm"}',
  care_instructions text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);