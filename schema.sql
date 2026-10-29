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
  gallery_images TEXT, -- JSON array string e.g. ["url1", "url2", "url3"]
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

-- 2. Site Settings Table (bKash, Bank Transfer, CellFin, Bangla QR, WhatsApp, Logo, Name)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_name TEXT DEFAULT 'Renovra',
  logo_url TEXT DEFAULT '',
  support_whatsapp TEXT DEFAULT '8801766392692',
  support_phone TEXT DEFAULT '01766392692',
  bkash_number TEXT DEFAULT '01766392692 (Personal / Send Money)',
  bank_transfer_number TEXT DEFAULT 'City Bank / Islami Bank (Account details)',
  cellfin_number TEXT DEFAULT '01766392692 (CellFin / IBBL)',
  bangla_qr_url TEXT DEFAULT '',
  bangla_qr_details TEXT DEFAULT '',
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

-- Subscriptions (15 Official Packages)
INSERT OR REPLACE INTO products (id, product_type, name, description, price, category, image_url, features, badge_text, color_from, color_to, is_popular, validity, order_idx)
VALUES 
('pkg-ai-starter', 'subscription', 'AI Starter Package', 'Essential AI tools bundle for students, freelancers, office employees & online learners.', 199, 'AI & Writing', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', '["ChatGPT (GPT-4o Access)","Grammarly Premium","QuillBot Premium","Perplexity AI Pro","Instant Dashboard Access","30 Days Replacement Warranty"]', 'Starter Choice', 'from-blue-500/50', 'to-blue-500/10', 1, '30 Days', 1),
('pkg-ai-student-pro', 'subscription', 'AI Student Pro Package', 'Top academic & research AI tools for university students, thesis writers & researchers.', 399, 'Academic & Research', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80', '["ChatGPT Plus","Perplexity AI Pro","Grammarly Premium","QuillBot Premium","Paperpal Academic AI","Scite AI Research Assistant","30 Days Full Warranty"]', 'Student Favorite', 'from-emerald-500/50', 'to-teal-500/10', 1, '30 Days', 2),
('pkg-ai-content-creator', 'subscription', 'AI Content Creator Package', 'Powerhouse copywriting & content generation tools for bloggers, YouTubers & creators.', 599, 'Content Creation', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80', '["ChatGPT Plus","Hix AI Full Suite","Jasper AI Writer","Wordhero AI","Grammarly Premium","Rewritefy Content Humanizer","24/7 WhatsApp Support"]', 'Best Value', 'from-purple-500/50', 'to-indigo-500/10', 1, '30 Days', 3),
('pkg-ai-research-pro', 'subscription', 'AI Research Pro Package', 'Advanced research, citation & plagiarism checking suite for PhD scholars & analysts.', 699, 'Academic & Research', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80', '["ChatGPT Plus","Perplexity AI Pro","Scite AI Citation & Index","Paperpal Research AI","Quetext Plagiarism Checker","Grammarly Premium","30 Days Replacement Guarantee"]', 'Research Pro', 'from-cyan-500/50', 'to-blue-500/10', 0, '30 Days', 4),
('pkg-business-professional', 'subscription', 'Business Professional AI Package', 'Executive AI suite for business owners, corporate managers, founders & consultants.', 799, 'Business & Productivity', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80', '["ChatGPT Plus","Grok AI Supercomputer","Grammarly Business","Beautiful AI Presentations","Perplexity AI Pro","Priority Account Support"]', 'Business Choice', 'from-amber-500/50', 'to-yellow-500/10', 0, '30 Days', 5),
('pkg-ai-marketing-copy', 'subscription', 'AI Marketing Copy Package', 'High-converting ad copy, landing pages & sales funnel copywriting tools.', 699, 'Copywriting & Ads', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80', '["Jasper AI Copywriter","Wordhero Copy Engine","Hix AI All-in-One","ChatGPT Plus","Grammarly Premium","Rewritefy Humanizer","Instant Activation"]', 'Marketing Special', 'from-pink-500/50', 'to-rose-500/10', 0, '30 Days', 6),
('pkg-ai-writer-premium', 'subscription', 'AI Writer Premium Package', 'Unrestricted 8-tool ultimate writing stack for professional bloggers & writing agencies.', 999, 'Writing & SEO', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80', '["ChatGPT Plus (GPT-4o)","Grok AI","Perplexity AI Pro","Hix AI Suite","Jasper AI Writer","Wordhero AI","Grammarly Premium","QuillBot Premium","Full 30 Days Warranty"]', 'Writer Ultimate', 'from-violet-500/50', 'to-purple-500/10', 1, '30 Days', 7),
('pkg-ai-designer-pro', 'subscription', 'AI Designer Pro Package', 'Complete creative design suite with unlimited stock assets and premium AI art tools.', 799, 'Design & Graphics', 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80', '["Leonardo AI (Image Generation)","ArtSpace AI","Canva Pro Direct Invite","Kittl Graphic Design Pro","Freepik Premium","Envato Elements (Unlimited)","Photoroom Pro Background Remover"]', 'Designer Choice', 'from-fuchsia-500/50', 'to-pink-500/10', 1, '30 Days', 8),
('pkg-ecommerce-design', 'subscription', 'Product & E-Commerce Design Package', 'Create viral product mockups, ad banners & catalog designs for online shops.', 699, 'E-Commerce & Shop', 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80', '["Leonardo AI (Product Photos)","Photoroom Pro","Canva Pro","Placeit Mockup Generator","Envato Elements","Freepik Premium","Instant 1-Click Access"]', 'E-commerce Special', 'from-orange-500/50', 'to-amber-500/10', 0, '30 Days', 9),
('pkg-social-media-growth', 'subscription', 'Social Media Growth Package', 'All tools to design, write, edit videos & grow social media channels rapidly.', 799, 'Social Media', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80', '["Canva Pro","Leonardo AI","ChatGPT Plus","Grammarly Premium","CapCut Pro (Desktop & Mobile)","Envato Elements","24/7 WhatsApp Support"]', 'Social Media', 'from-sky-500/50', 'to-blue-500/10', 0, '30 Days', 10),
('pkg-ai-video-creator', 'subscription', 'AI Video Creator Package', 'Next-gen cinematic AI video generators, voiceovers & video editing suite.', 1499, 'Video & Animation', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80', '["VEO 3 (Google AI Video)","Leonardo AI (Motion Video)","CapCut Pro","VideoExpress AI","Avatar Builder AI","Epidemic Sound (Copyright-Free Music)","High Speed Access"]', 'Video Creator', 'from-red-500/50', 'to-orange-500/10', 1, '30 Days', 11),
('pkg-youtube-automation', 'subscription', 'YouTube Automation Package', 'Complete toolset for faceless YouTube channels & automated video production.', 1499, 'YouTube & Video', 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop&q=80', '["ChatGPT Plus (Scriptwriting)","VEO 3 (AI Video Clips)","Leonardo AI (Thumbnails & Art)","VidIQ Boost (SEO Keywords)","CapCut Pro (Editing)","Epidemic Sound (SFX & Music)","Canva Pro (Thumbnails)"]', 'YouTube Pro', 'from-red-600/50', 'to-rose-600/10', 1, '30 Days', 12),
('pkg-seo-growth', 'subscription', 'SEO Growth Package', 'Dominate Google search results with the world\'s leading SEO intelligence tools.', 999, 'SEO & Ranking', 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop&q=80', '["Semrush Guru Access","Moz Pro","Ubersuggest Lifetime","SpyFu Competitor Intel","AnswerThePublic Pro","SEOptimer Audit Tool","Grammarly Premium"]', 'SEO Master', 'from-emerald-500/50', 'to-green-500/10', 0, '30 Days', 13),
('pkg-freelancer-complete', 'subscription', 'Freelancer Complete Package', 'The ultimate freelance bundle for Fiverr, Upwork & global client projects.', 1299, 'Freelancing', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80', '["ChatGPT Plus (GPT-4o)","Leonardo AI","Canva Pro","Grammarly Premium","QuillBot Premium","Envato Elements (Assets)","CapCut Pro","Semrush Access","30 Days Full Replacement Warranty"]', 'Freelancer All-in-One', 'from-indigo-500/50', 'to-purple-500/10', 1, '30 Days', 14),
('pkg-ultimate-ai-creator', 'subscription', 'Ultimate AI Creator Bundle', 'The most comprehensive master bundle with 13+ flagship AI & digital marketing tools.', 2499, 'Full Agency Suite', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80', '["ChatGPT Plus (GPT-4o & o1)","Grok AI","Perplexity AI Pro","VEO 3 (AI Video)","Leonardo AI","ArtSpace AI","Canva Pro","Envato Elements","Freepik Premium","CapCut Pro","Grammarly Premium","Semrush Guru","VidIQ Boost","VIP Dedicated Account & Priority Support"]', 'Ultimate Powerhouse', 'from-yellow-500/50', 'to-amber-500/10', 1, '30 Days', 15);

-- Single Tools
INSERT OR IGNORE INTO products (id, product_type, name, description, price, category, image_url, features, badge_text, validity, order_idx)
VALUES
('tool-chatgpt', 'single_tool', 'ChatGPT Plus (GPT-4o)', 'Get access to GPT-4o, DALL-E 3, code interpreter and custom GPTs.', 350, 'AI Writing & Code', 'https://i.ibb.co/L5Qx6T2/chatgpt.png', '["GPT-4o & o1 access","Image & file analysis","Fast response speed"]', 'Top Rated', '1 Month', 0),
('tool-canva', 'single_tool', 'Canva Pro Direct Invite', '100M+ premium graphics, templates, brand kit and Magic Studio AI.', 150, 'Graphics & Design', 'https://i.ibb.co/8g6wXW4/canva.png', '["100M+ Premium photos & videos","Background remover","Brand kits & resize"]', 'Best Seller', '1 Month', 1),
('tool-envato', 'single_tool', 'Envato Elements', 'Unlimited downloads of themes, templates, stock footage and audio.', 450, 'Design Assets', 'https://i.ibb.co/808bFqJ/envato.png', '["Themes, templates, graphics","Commercial license","Daily high speed download"]', 'Essential', '1 Month', 2),
('tool-monica', 'single_tool', 'Monica AI Pro', 'All-in-one AI assistant powered by GPT-4, Claude 3.5 and Gemini Pro.', 390, 'AI Assistant', 'https://i.ibb.co/311WqS5/monica.png', '["GPT-4 & Claude 3.5 in sidebar","Web page summarizer","Image generator"]', 'Trending', '1 Month', 3);

-- Digital Products
INSERT OR IGNORE INTO products (id, product_type, name, description, price, category, image_url, download_url, order_idx)
VALUES
('digital-ai-prompts', 'digital', '10,000+ Ultimate ChatGPT Prompts Pack', 'Curated prompt collection for marketing, copywriting, coding, SEO & business growth.', 250, 'Templates & Prompts', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', 'https://drive.google.com', 0),
('digital-canva-templates', 'digital', '500+ Social Media Editable Canva Templates', 'Ready-to-use aesthetic templates for Facebook, Instagram, LinkedIn and YouTube.', 299, 'Design Assets', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80', 'https://drive.google.com', 1),
('digital-web-templates', 'digital', 'SaaS & Agency Landing Page UI Kit (Figma)', 'High-converting Figma UI kit with 50+ components, dark mode, and design system.', 490, 'UI/UX Kits', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80', 'https://drive.google.com', 2);

-- 5. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
    discount_value REAL NOT NULL,
    applicable_to TEXT NOT NULL DEFAULT 'all', -- 'all', 'subscription', 'single_tool', 'digital', or product_id
    min_order_amount REAL DEFAULT 0,
    max_discount_amount REAL DEFAULT 0,
    usage_limit INTEGER DEFAULT 0,
    used_count INTEGER DEFAULT 0,
    expiry_date TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Starter Coupons
INSERT OR IGNORE INTO coupons (id, code, discount_type, discount_value, applicable_to, min_order_amount, is_active, created_at)
VALUES 
('cpn-welcome', 'WELCOME10', 'percentage', 10, 'all', 0, 1, CURRENT_TIMESTAMP),
('cpn-save50', 'SAVE50', 'fixed', 50, 'all', 300, 1, CURRENT_TIMESTAMP),
('cpn-pro20', 'PRO20', 'percentage', 20, 'subscription', 400, 1, CURRENT_TIMESTAMP),
('cpn-tool15', 'TOOL15', 'percentage', 15, 'single_tool', 100, 1, CURRENT_TIMESTAMP),
('cpn-special100', 'SPECIAL100', 'fixed', 100, 'all', 500, 1, CURRENT_TIMESTAMP),
('cpn-demo50', 'DEMO50', 'percentage', 50, 'all', 100, 1, CURRENT_TIMESTAMP);

