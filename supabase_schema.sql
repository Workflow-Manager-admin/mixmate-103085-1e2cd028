-- MixMate Supabase Schema
-- Tables: liquors, cocktails, favorites, shopping_list, chat_history

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Liquors Table
CREATE TABLE IF NOT EXISTS liquors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  mixers TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on liquor name for faster searches
CREATE INDEX IF NOT EXISTS idx_liquors_name ON liquors(name);

-- Cocktails Table
CREATE TABLE IF NOT EXISTS cocktails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  steps TEXT NOT NULL,
  liquors TEXT[] NOT NULL DEFAULT '{}', -- Array of liquor names
  tags TEXT[] NOT NULL DEFAULT '{}',    -- Array of tags (refreshing, strong, sweet, classic)
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on frequently queried fields
CREATE INDEX IF NOT EXISTS idx_cocktails_liquors ON cocktails USING GIN(liquors);
CREATE INDEX IF NOT EXISTS idx_cocktails_tags ON cocktails USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_cocktails_like_count ON cocktails(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_cocktails_created_at ON cocktails(created_at DESC);

-- Favorites Table - Stores user's favorite cocktails
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cocktail_id UUID NOT NULL REFERENCES cocktails(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cocktail_id) -- Prevent duplicate favorites
);

-- Create indexes for favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_cocktail_id ON favorites(cocktail_id);

-- Shopping List Table - Stores user's shopping items
CREATE TABLE IF NOT EXISTS shopping_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for shopping list
CREATE INDEX IF NOT EXISTS idx_shopping_list_user_id ON shopping_list(user_id);

-- Chat History Table - Stores AI bartender interactions
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for chat history
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at);

-- Row Level Security Policies
-- Enable Row Level Security on all tables
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and modify their own favorites
CREATE POLICY favorites_user_policy ON favorites 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only see and modify their own shopping list items
CREATE POLICY shopping_list_user_policy ON shopping_list
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only see and modify their own chat history
CREATE POLICY chat_history_user_policy ON chat_history
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public access policy for liquors and cocktails
ALTER TABLE liquors ENABLE ROW LEVEL SECURITY;
CREATE POLICY liquors_public_read ON liquors FOR SELECT USING (true);

ALTER TABLE cocktails ENABLE ROW LEVEL SECURITY;
CREATE POLICY cocktails_public_read ON cocktails FOR SELECT USING (true);

-- Sample data for liquors
INSERT INTO liquors (name, description, mixers)
VALUES 
('Whiskey', 'A distilled alcoholic beverage made from fermented grain mash. Various grains are used for different varieties, including barley, corn, rye, and wheat.', 'Soda water, sweet vermouth, bitters, ginger ale, lemon juice'),
('Gin', 'A distilled alcoholic drink that derives its predominant flavor from juniper berries. Originated as a medicinal liquor made by monks in Italy.', 'Tonic water, lime juice, cucumber, elderflower, vermouth, cranberry juice'),
('Tequila', 'A distilled beverage made from the blue agave plant, primarily in the area surrounding the city of Tequila in Mexico.', 'Lime juice, orange juice, grapefruit soda, triple sec, tomato juice'),
('Rum', 'A distilled alcoholic drink made by fermenting and then distilling sugarcane molasses or sugarcane juice.', 'Cola, lime juice, mint, pineapple juice, coconut cream'),
('Vodka', 'A clear distilled alcoholic beverage with different varieties originating in Poland, Russia and Sweden.', 'Tonic water, orange juice, cranberry juice, ginger beer, soda water'),
('Brandy', 'A spirit produced by distilling wine, usually with a fruit base like grapes.', 'Soda water, lemon juice, ginger ale, coffee, hot chocolate'),
('Liqueur', 'Sweetened distilled spirits typically flavored with fruits, herbs, spices, or nuts.', 'Coffee, cream, soda water, fruit juices, champagne');

-- Sample data for cocktails (simplified list)
INSERT INTO cocktails (name, description, image_url, ingredients, steps, liquors, tags)
VALUES
('Old Fashioned', 'A classic whiskey cocktail made with sugar, bitters, and a twist of citrus rind.', 'https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/old-fashioned.jpg', 
'- 2 oz Bourbon or Rye whiskey
- 1 sugar cube
- 2-3 dashes Angostura bitters
- Orange peel for garnish',
'1. Place sugar cube in an Old Fashioned glass
2. Add bitters and a splash of water, then muddle
3. Add whiskey and ice, stir
4. Garnish with orange peel',
ARRAY['Whiskey'], ARRAY['classic', 'strong']),

('Mojito', 'A refreshing rum cocktail with mint, lime, and soda water.', 'https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/mojito.jpg',
'- 2 oz White rum
- 1 oz Fresh lime juice
- 2 tsp Sugar
- 6-8 Mint leaves
- Soda water',
'1. Muddle mint leaves with sugar and lime juice
2. Add rum and fill glass with ice
3. Top with soda water and stir
4. Garnish with mint sprig',
ARRAY['Rum'], ARRAY['refreshing', 'sweet']),

('Martini', 'A classic cocktail made with gin and vermouth.', 'https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/martini.jpg',
'- 2.5 oz Gin
- 0.5 oz Dry vermouth
- Olive or lemon twist for garnish',
'1. Fill a mixing glass with ice
2. Add gin and vermouth, stir well
3. Strain into a chilled martini glass
4. Garnish with olive or lemon twist',
ARRAY['Gin'], ARRAY['classic', 'strong']),

('Margarita', 'A tequila-based cocktail with lime juice and orange liqueur.', 'https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/margarita.jpg',
'- 2 oz Tequila
- 1 oz Fresh lime juice
- 0.5 oz Triple sec or Cointreau
- Salt for rim (optional)',
'1. If desired, salt the rim of the glass
2. Fill a shaker with ice
3. Add tequila, lime juice, and triple sec, shake well
4. Strain into glass over ice',
ARRAY['Tequila'], ARRAY['refreshing', 'classic']),

('Moscow Mule', 'A vodka cocktail with ginger beer and lime juice.', 'https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/moscow-mule.jpg',
'- 2 oz Vodka
- 0.5 oz Fresh lime juice
- 4-5 oz Ginger beer
- Lime wedge for garnish',
'1. Fill a copper mug with ice
2. Add vodka and lime juice
3. Top with ginger beer and stir gently
4. Garnish with lime wedge',
ARRAY['Vodka'], ARRAY['refreshing']);
