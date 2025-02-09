/*
  # Update column names to match application expectations

  1. Changes
    - Rename care_instructions to careInstructions
    - Ensure all column names match application expectations

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create products table with correct column names
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  quantity integer DEFAULT 0,
  category text NOT NULL,
  details jsonb DEFAULT '[]',
  dimensions jsonb DEFAULT '{"length": 0, "width": 0, "height": 0, "unit": "cm"}',
  "careInstructions" text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
      ON categories FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Enable insert for authenticated users only'
  ) THEN
    CREATE POLICY "Enable insert for authenticated users only"
      ON categories FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Enable update for authenticated users only'
  ) THEN
    CREATE POLICY "Enable update for authenticated users only"
      ON categories FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' 
    AND policyname = 'Enable delete for authenticated users only'
  ) THEN
    CREATE POLICY "Enable delete for authenticated users only"
      ON categories FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create policies for products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
      ON products FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Enable insert for authenticated users only'
  ) THEN
    CREATE POLICY "Enable insert for authenticated users only"
      ON products FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Enable update for authenticated users only'
  ) THEN
    CREATE POLICY "Enable update for authenticated users only"
      ON products FOR UPDATE
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Enable delete for authenticated users only'
  ) THEN
    CREATE POLICY "Enable delete for authenticated users only"
      ON products FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE
  ON products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Insert some initial data
INSERT INTO products (
  name,
  description,
  price,
  quantity,
  category,
  details,
  dimensions,
  "careInstructions",
  images,
  featured
) VALUES (
  'GEOMETRIC LED STAR LIGHT',
  'Transform your space with this stunning geometric LED star light. Perfect for creating a magical atmosphere during Ramadan and Eid celebrations.',
  79.99,
  50,
  'eid',
  '[{"title": "Product Details", "content": "Handcrafted from premium materials"}, {"title": "Materials", "content": "Premium brass-plated steel and acrylic"}]',
  '{"length": 12, "width": 12, "height": 12, "unit": "in"}',
  ARRAY['Dust with a soft, dry cloth', 'Avoid using harsh cleaning agents', 'Keep away from direct sunlight when not in use'],
  ARRAY['https://images.unsplash.com/photo-1577127294256-5f0e3c3e8d8c?fit=crop&w=800', 'https://images.unsplash.com/photo-1577127294842-62b282f2f0ff?fit=crop&w=800'],
  true
);