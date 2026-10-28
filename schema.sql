-- ========================================================
-- RENOVRA - CLOUDFLARE D1 DATABASE SCHEMA
-- ========================================================
-- Instructions:
-- 1. Go to Cloudflare Dashboard -> Workers & Pages -> D1
-- 2. Click on your D1 database -> "Console"
-- 3. Paste this script and click "Execute"
-- ========================================================

-- 1. Products Table (Packages, Single Tools, Digital Products)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  product_type TEXT NOT NULL, -- 'subscription', 'single_tool', 'digital'
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT,
  image_url TEXT,
  features TEXT, -- JSON array string e.g. ["Feature 1", "Feature 2"]
  badge_text TEXT,
  color_from TEXT DEFAULT 'from-blue-500/50',
  color_to TEXT DEFAULT 'to-blue-500/10',
  is_popular INTEGER DEFAULT 0,
  validity TEXT,
  download_url TEXT,
  order_idx INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Site Settings Table (bKash, Nagad, WhatsApp, Logo, Name)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_name TEXT DEFAULT 'Renovra',
  logo_url TEXT DEFAULT '',
  support_whatsapp TEXT DEFAULT '8801766392692',
  support_phone TEXT DEFAULT '01766392692',
  bkash_number TEXT DEFAULT '01766392692 (Personal)',
  nagad_number TEXT DEFAULT '01766392692 (Personal)',
  bank_transfer_number TEXT DEFAULT 'City Bank / Islami Bank',
  redotpay_id TEXT DEFAULT '12345678 (RedotPay ID)',
  telegram_channel TEXT DEFAULT '@renovra',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table (Customer Authentication)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_phone TEXT NOT NULL,
  trx_id TEXT,
  payment_method TEXT,
  package_id TEXT,
  product_name TEXT,
  price REAL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  proof_url TEXT,
  customer_name TEXT,
  whatsapp TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- SEED INITIAL DATA
-- ========================================================

INSERT OR IGNORE INTO settings (id, site_name, support_whatsapp, support_phone, bkash_number, nagad_number)
VALUES ('default', 'Renovra', '8801766392692', '01766392692', '01766392692 (Personal)', '01766392692 (Personal)');

-- Subscriptions
INSERT OR IGNORE INTO products (id, product_type, name, description, price, category, image_url, features, badge_text, color_from, color_to, is_popular, validity, order_idx)
VALUES 
('pkg-starter', 'subscription', 'Starter AI Bundle', 'Essential AI tools bundle for creators and students.', 490, 'AI Bundle', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60', '["ChatGPT Plus (Shared Access)","Canva Pro Education/Team","Grammarly Premium","Instant Email & WhatsApp Delivery","30 Days Warranty & Support"]', 'Popular', 'from-blue-500/50', 'to-blue-500/10', 1, '30 Days', 0),
('pkg-pro', 'subscription', 'Pro Creator Suite', 'All-in-one suite for digital marketers, designers & video editors.', 990, 'Design & AI', 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=60', '["Canva Pro (Private/Direct Invite)","ChatGPT Plus GPT-4o Access","Envato Elements (Daily Downloads)","CapCut Pro / Freepik Premium","Priority 24/7 WhatsApp Support","Instant Replacement Guarantee"]', 'Best Value', 'from-purple-500/50', 'to-indigo-500/10', 1, '30 Days', 1),
('pkg-master', 'subscription', 'Ultimate Agency Master', 'Massive collection of 30+ premium tools for agencies and power users.', 1990, 'Agency', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=60', '["ChatGPT Plus + Claude 3.5 Sonnet","Midjourney v6 Unlimited Relaxed","Canva Pro + Freepik + Envato","SEMrush / Ahrefs Report Access","Ubersuggest + Grammarly","Dedicated Account Manager Support"]', 'Agency Pick', 'from-amber-500/50', 'to-orange-500/10', 0, '30 Days', 2);

-- Single Tools
INSERT OR IGNORE INTO products (id, product_type, name, description, price, category, image_url, features, badge_text, validity, order_idx)
VALUES
('tool-chatgpt', 'single_tool', 'ChatGPT Plus (GPT-4o)', 'Get access to GPT-4o, DALL-E 3, code interpreter and custom GPTs.', 350, 'AI Writing & Code', 'https://i.ibb.co/L5Qx6T2/chatgpt.png', '["GPT-4o & o1 access","Image & file analysis","Fast response speed"]', 'Top Rated', '1 Month', 0),
('tool-canva', 'single_tool', 'Canva Pro Direct Invite', '100M+ premium graphics, templates, brand kit and Magic Studio AI.', 150, 'Graphics & Design', 'https://i.ibb.co/8g6wXW4/canva.png', '["100M+ Premium photos & videos","Background remover","Brand kits & resize"]', 'Best Seller', '1 Year', 1),
('tool-envato', 'single_tool', 'Envato Elements', 'Unlimited downloads of themes, templates, stock footage and audio.', 450, 'Design Assets', 'https://i.ibb.co/808bFqJ/envato.png', '["Themes, templates, graphics","Commercial license","Daily high speed download"]', 'Essential', '1 Month', 2),
('tool-monica', 'single_tool', 'Monica AI Pro', 'All-in-one AI assistant powered by GPT-4, Claude 3.5 and Gemini Pro.', 390, 'AI Assistant', 'https://i.ibb.co/311WqS5/monica.png', '["GPT-4 & Claude 3.5 in sidebar","Web page summarizer","Image generator"]', 'Trending', '1 Month', 3);

-- Digital Products
INSERT OR IGNORE INTO products (id, product_type, name, description, price, category, image_url, download_url, order_idx)
VALUES
('digital-ai-prompts', 'digital', '10,000+ Ultimate ChatGPT Prompts Pack', 'Curated prompt collection for marketing, copywriting, coding, SEO & business growth.', 250, 'Templates & Prompts', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', 'https://drive.google.com', 0),
('digital-canva-templates', 'digital', '500+ Social Media Editable Canva Templates', 'Ready-to-use aesthetic templates for Facebook, Instagram, LinkedIn and YouTube.', 299, 'Design Assets', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80', 'https://drive.google.com', 1),
('digital-web-templates', 'digital', 'SaaS & Agency Landing Page UI Kit (Figma)', 'High-converting Figma UI kit with 50+ components, dark mode, and design system.', 490, 'UI/UX Kits', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80', 'https://drive.google.com', 2);
