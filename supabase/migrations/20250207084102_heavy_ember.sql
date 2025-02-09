/*
  # Fix column names and schema

  1. Changes
    - Drop existing table to ensure clean slate
    - Recreate products table with correct column names
    - Add proper constraints and defaults
    - Enable RLS policies
    - Add sample data
*/

-- Drop existing table
DROP TABLE IF EXISTS products;

-- Create products table with consistent column names
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  quantity integer DEFAULT 0,
  category text NOT NULL CHECK (category IN ('eid', 'ramadan', 'new')),
  details jsonb DEFAULT '[]',
  dimensions jsonb DEFAULT '{"length": 0, "width": 0, "height": 0, "unit": "cm"}',
  "careInstructions" text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Full access for all users"
  ON products
  FOR ALL
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

-- Insert sample products
INSERT INTO products (
  name, description, price, quantity, category, details, dimensions, "careInstructions", images, featured
) VALUES
(
  'Luxury Eid Gift Box Set',
  'Premium gift box set featuring traditional sweets, dates, and decorative items perfect for Eid celebrations.',
  149.99,
  30,
  'eid',
  '[{"title": "Contents", "content": "Assorted premium dates, Traditional sweets, Decorative plate"}, {"title": "Packaging", "content": "Handcrafted wooden box with Islamic patterns"}]',
  '{"length": 12, "width": 12, "height": 6, "unit": "in"}',
  ARRAY['Keep in cool dry place', 'Consume within 3 months of purchase'],
  ARRAY['https://images.unsplash.com/photo-1558998708-ed5f8eaf1af0', 'https://images.unsplash.com/photo-1577127294256-5f0e3c3e8d8c'],
  true
),
(
  'Crystal Hilal Display Set',
  'Elegant crystal crescent moon and star display set with LED base.',
  199.99,
  20,
  'eid',
  '[{"title": "Material", "content": "Premium crystal with gold accents"}, {"title": "Lighting", "content": "Color-changing LED base included"}]',
  '{"length": 15, "width": 8, "height": 12, "unit": "in"}',
  ARRAY['Handle with care', 'Clean with soft microfiber cloth', 'Avoid direct sunlight'],
  ARRAY['https://images.unsplash.com/photo-1564507592333-c60657eea523', 'https://images.unsplash.com/photo-1576158674803-56f6be5662eb'],
  true
);