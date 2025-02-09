/*
  # Fix Products Schema

  1. Changes
    - Drop existing table and recreate with correct schema
    - Add proper constraints and indexes
    - Enable RLS with appropriate policies
    - Add triggers for updated_at timestamp
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
  dimensions jsonb DEFAULT '{"length": 0, "width": 0, "height": 0, "unit": "cm"}'::jsonb,
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

-- Add validation trigger
CREATE OR REPLACE FUNCTION validate_product_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure details is a valid JSON array
  IF NEW.details IS NULL OR NOT jsonb_typeof(NEW.details) = 'array' THEN
    NEW.details := '[]'::jsonb;
  END IF;

  -- Ensure dimensions has required fields
  IF NEW.dimensions IS NULL OR NOT (
    NEW.dimensions ? 'length' AND 
    NEW.dimensions ? 'width' AND 
    NEW.dimensions ? 'height' AND 
    NEW.dimensions ? 'unit'
  ) THEN
    NEW.dimensions := '{"length": 0, "width": 0, "height": 0, "unit": "cm"}'::jsonb;
  END IF;

  -- Ensure care_instructions is a valid array
  IF NEW.care_instructions IS NULL THEN
    NEW.care_instructions := '{}'::text[];
  END IF;

  -- Ensure images is a valid array
  IF NEW.images IS NULL THEN
    NEW.images := '{}'::text[];
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_product_data_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION validate_product_data();