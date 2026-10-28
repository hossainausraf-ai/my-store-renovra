-- Add user_id to manual_payments to link orders to users
ALTER TABLE manual_payments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add download_url to products for digital products
ALTER TABLE products ADD COLUMN IF NOT EXISTS download_url TEXT;
