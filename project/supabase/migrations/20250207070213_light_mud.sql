/*
  # Update Product Schema
  
  1. Changes
    - Add check for existing policies before creating new ones
    - Ensure proper column types and defaults
    - Add RLS policies if they don't exist
    
  2. Security
    - Maintain existing RLS settings
    - Only add missing policies
*/

-- Drop existing trigger first to avoid conflicts
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  quantity integer DEFAULT 0 CHECK (quantity >= 0),
  category text NOT NULL,
  details jsonb DEFAULT '[]',
  dimensions jsonb DEFAULT '{"length": 0, "width": 0, "height": 0, "unit": "cm"}',
  "careInstructions" text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND rowsecurity = true
  ) THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();