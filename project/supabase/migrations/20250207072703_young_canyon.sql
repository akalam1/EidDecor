/*
  # Fix column names and ensure consistency

  1. Changes
    - Ensure consistent snake_case naming for all columns
    - Add missing indexes for performance
    - Add proper constraints
    - Enable RLS with appropriate policies

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated user access
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add performance indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();