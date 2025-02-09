-- Add external_link column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'external_link'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN external_link text;
  END IF;
END $$;