ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS bkash_number TEXT,
ADD COLUMN IF NOT EXISTS bank_transfer_number TEXT,
ADD COLUMN IF NOT EXISTS redotpay_id TEXT;
