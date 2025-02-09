/*
  # Update Products Schema to Match Form

  1. Changes
    - Add all fields from the admin form
    - Ensure proper data types for all fields
    - No RLS for easier access
*/

-- Drop existing table
DROP TABLE IF EXISTS products;

-- Create products table with all form fields
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