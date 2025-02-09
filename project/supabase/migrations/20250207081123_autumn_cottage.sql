/*
  # Add Sample Products
  
  1. New Data
    - Add 3 products for each category (Eid, Ramadan, New Arrivals)
    - Include detailed product information
    - Set some products as featured
*/

-- Insert Eid Collection Products
INSERT INTO products (
  name, description, price, quantity, category, details, dimensions, care_instructions, images, featured
) VALUES
(
  'Elegant Crescent Moon Light',
  'Beautiful crescent moon light perfect for Eid celebrations. Creates a warm, inviting atmosphere with its gentle glow.',
  89.99,
  50,
  'eid',
  '[{"title": "Material", "content": "Premium brass and acrylic"}, {"title": "Lighting", "content": "LED with adjustable brightness"}]',
  '{"length": 15, "width": 5, "height": 20, "unit": "in"}',
  ARRAY['Clean with soft dry cloth', 'Avoid direct water contact', 'Store in cool, dry place'],
  ARRAY['https://images.unsplash.com/photo-1564507592333-c60657eea523', 'https://images.unsplash.com/photo-1577127294256-5f0e3c3e8d8c'],
  true
),
(
  'Festive Star Lantern Set',
  'Set of 3 decorative star lanterns in varying sizes. Perfect for creating a magical Eid atmosphere.',
  129.99,
  30,
  'eid',
  '[{"title": "Set Contents", "content": "3 lanterns (Small, Medium, Large)"}, {"title": "Material", "content": "Metal with glass inserts"}]',
  '{"length": 8, "width": 8, "height": 12, "unit": "in"}',
  ARRAY['Dust regularly', 'Use mild soap if needed', 'Protect from extreme weather'],
  ARRAY['https://images.unsplash.com/photo-1576158674803-56f6be5662eb', 'https://images.unsplash.com/photo-1577127294842-62b282f2f0ff'],
  false
),
(
  'Islamic Pattern Wall Light',
  'Intricate Islamic geometric pattern wall light that casts beautiful shadows. A stunning piece for Eid decoration.',
  159.99,
  25,
  'eid',
  '[{"title": "Design", "content": "Traditional Islamic geometric pattern"}, {"title": "Installation", "content": "Wall-mounted, hardware included"}]',
  '{"length": 24, "width": 2, "height": 24, "unit": "in"}',
  ARRAY['Professional installation recommended', 'Wipe clean with dry cloth', 'Avoid harsh chemicals'],
  ARRAY['https://images.unsplash.com/photo-1585336261022-680e295ce3fe', 'https://images.unsplash.com/photo-1632923057155-dd35366509c6'],
  true
);

-- Insert Ramadan Collection Products
INSERT INTO products (
  name, description, price, quantity, category, details, dimensions, care_instructions, images, featured
) VALUES
(
  'Traditional Fanous Lantern',
  'Authentic Ramadan fanous with intricate metalwork and colored glass panels. A traditional symbol of Ramadan.',
  79.99,
  100,
  'ramadan',
  '[{"title": "Craftsmanship", "content": "Handmade by skilled artisans"}, {"title": "Lighting", "content": "Compatible with LED candles"}]',
  '{"length": 6, "width": 6, "height": 14, "unit": "in"}',
  ARRAY['Handle with care', 'Clean glass with glass cleaner', 'Store in original packaging'],
  ARRAY['https://images.unsplash.com/photo-1558998708-ed5f8eaf1af0', 'https://images.unsplash.com/photo-1561626423-a51b45aef0a1'],
  true
),
(
  'Decorative Prayer Mat',
  'Luxurious prayer mat with elegant Islamic patterns. Comfortable and beautiful for Ramadan prayers.',
  49.99,
  75,
  'ramadan',
  '[{"title": "Material", "content": "Premium woven fabric"}, {"title": "Design", "content": "Traditional Islamic motifs"}]',
  '{"length": 48, "width": 24, "height": 0.5, "unit": "in"}',
  ARRAY['Machine washable cold', 'Air dry only', 'Roll for storage'],
  ARRAY['https://images.unsplash.com/photo-1579975096649-e773152b04cb', 'https://images.unsplash.com/photo-1566624790190-511a09f6ddbd'],
  false
),
(
  'Ramadan Calendar Light Box',
  'Interactive Ramadan countdown calendar with LED backlight. Perfect for families and children.',
  69.99,
  50,
  'ramadan',
  '[{"title": "Features", "content": "30-day countdown, LED backlight"}, {"title": "Power", "content": "Battery operated or USB powered"}]',
  '{"length": 16, "width": 2, "height": 12, "unit": "in"}',
  ARRAY['Keep away from water', 'Clean with dry cloth', 'Remove batteries before storage'],
  ARRAY['https://images.unsplash.com/photo-1530034424313-9d4ac61cc5c9', 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1'],
  true
);

-- Insert New Arrivals
INSERT INTO products (
  name, description, price, quantity, category, details, dimensions, care_instructions, images, featured
) VALUES
(
  'Modern Geometric Table Lamp',
  'Contemporary table lamp featuring Islamic geometric patterns with a modern twist.',
  119.99,
  40,
  'new',
  '[{"title": "Style", "content": "Modern Islamic fusion"}, {"title": "Material", "content": "Brass and frosted glass"}]',
  '{"length": 10, "width": 10, "height": 18, "unit": "in"}',
  ARRAY['Dust with soft cloth', 'Keep away from moisture', 'Handle with care'],
  ARRAY['https://images.unsplash.com/photo-1564507592333-c60657eea523', 'https://images.unsplash.com/photo-1577127294256-5f0e3c3e8d8c'],
  true
),
(
  'LED String Light Curtain',
  'Decorative LED string light curtain with star and moon shapes. Creates a magical atmosphere.',
  39.99,
  100,
  'new',
  '[{"title": "Length", "content": "3 meters"}, {"title": "Power", "content": "USB powered with adapter"}]',
  '{"length": 118, "width": 1, "height": 78, "unit": "in"}',
  ARRAY['Indoor use only', 'Keep away from water', 'Store carefully to prevent tangling'],
  ARRAY['https://images.unsplash.com/photo-1576158674803-56f6be5662eb', 'https://images.unsplash.com/photo-1632923057155-dd35366509c6'],
  false
),
(
  'Digital Azan Clock',
  'Modern digital clock with built-in azan times and decorative display.',
  89.99,
  60,
  'new',
  '[{"title": "Features", "content": "Prayer times, temperature display"}, {"title": "Power", "content": "AC adapter with battery backup"}]',
  '{"length": 12, "width": 2, "height": 8, "unit": "in"}',
  ARRAY['Keep away from direct sunlight', 'Clean screen with microfiber cloth', 'Protect from dust'],
  ARRAY['https://images.unsplash.com/photo-1585336261022-680e295ce3fe', 'https://images.unsplash.com/photo-1632923057155-dd35366509c6'],
  true
);