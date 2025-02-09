/*
  # Add sample products for each category
  
  1. Changes
    - Add sample products for Eid Collection
    - Add sample products for Ramadan Essentials
    - Add sample products for New Arrivals
    - Each product has complete details including images, care instructions, etc.
*/

-- Insert Eid Collection Products
INSERT INTO products (
  name, description, price, quantity, category, details, dimensions, care_instructions, images, featured
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

-- Insert Ramadan Essentials
INSERT INTO products (
  name, description, price, quantity, category, details, dimensions, care_instructions, images, featured
) VALUES
(
  'Smart Ramadan Calendar',
  'Interactive digital Ramadan calendar with prayer times, Quran verses, and daily reminders.',
  89.99,
  50,
  'ramadan',
  '[{"title": "Features", "content": "Prayer times, Daily verses, Reminders"}, {"title": "Connectivity", "content": "WiFi enabled, Mobile app control"}]',
  '{"length": 10, "width": 2, "height": 8, "unit": "in"}',
  ARRAY['Keep away from water', 'Clean screen with microfiber cloth'],
  ARRAY['https://images.unsplash.com/photo-1579975096649-e773152b04cb', 'https://images.unsplash.com/photo-1632923057155-dd35366509c6'],
  true
),
(
  'Premium Iftar Serving Set',
  'Complete serving set for Iftar including plates, bowls, and serving dishes with Islamic patterns.',
  129.99,
  40,
  'ramadan',
  '[{"title": "Set Contents", "content": "4 plates, 4 bowls, 2 serving dishes"}, {"title": "Material", "content": "Fine bone china with gold trim"}]',
  '{"length": 16, "width": 16, "height": 10, "unit": "in"}',
  ARRAY['Dishwasher safe', 'Microwave safe', 'Hand wash recommended for gold trim'],
  ARRAY['https://images.unsplash.com/photo-1585336261022-680e295ce3fe', 'https://images.unsplash.com/photo-1561626423-a51b45aef0a1'],
  false
);

-- Insert New Arrivals
INSERT INTO products (
  name, description, price, quantity, category, details, dimensions, care_instructions, images, featured
) VALUES
(
  'Smart Azan Clock',
  'Modern digital clock with built-in azan times and decorative display.',
  79.99,
  60,
  'new',
  '[{"title": "Features", "content": "Prayer times, Temperature display, Alarm"}, {"title": "Power", "content": "USB powered with battery backup"}]',
  '{"length": 8, "width": 1, "height": 6, "unit": "in"}',
  ARRAY['Keep away from moisture', 'Clean with dry cloth only'],
  ARRAY['https://images.unsplash.com/photo-1530034424313-9d4ac61cc5c9', 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1'],
  true
),
(
  'Decorative LED String Lights',
  'Beautiful string lights with crescent moon and star shapes, perfect for creating a festive atmosphere.',
  34.99,
  100,
  'new',
  '[{"title": "Length", "content": "10 meters"}, {"title": "Power", "content": "USB powered, remote controlled"}]',
  '{"length": 394, "width": 1, "height": 1, "unit": "in"}',
  ARRAY['Indoor use only', 'Keep away from water', 'Store carefully to prevent tangling'],
  ARRAY['https://images.unsplash.com/photo-1577127294842-62b282f2f0ff', 'https://images.unsplash.com/photo-1576158674937-6c3f5e47e5af'],
  false
);