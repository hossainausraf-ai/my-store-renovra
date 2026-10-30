import { defaultProducts, Product } from '@/data/products';
import { defaultSettings, SiteSettings } from '@/data/settings';
import { defaultCoupons, Coupon } from '@/data/coupons';
import { StoredOrder, getAllOrders, addOrder, updateOrderStatus, deleteOrder, searchOrders } from '@/lib/orders-store';
import fs from 'fs';
import path from 'path';

interface CloudflareD1Response {
  result: Array<{
    results: any[];
    success: boolean;
    meta?: any;
  }>;
  success: boolean;
  errors: any[];
  messages: any[];
}

export function isD1Configured(): boolean {
  return !!(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_D1_DATABASE_ID &&
    process.env.CLOUDFLARE_API_TOKEN
  );
}

/**
 * Execute SQL against Cloudflare D1 HTTP REST API
 */
export async function queryD1<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error('Cloudflare D1 credentials missing');
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloudflare D1 API HTTP ${res.status}: ${errorText}`);
  }

  const data: CloudflareD1Response = await res.json();
  if (!data.success || !data.result?.[0]?.success) {
    const msg = data.errors?.[0]?.message || 'D1 query failed';
    throw new Error(msg);
  }

  return (data.result[0].results || []) as T[];
}

// ========================================================
// FALLBACK LOCAL STORE (When D1 keys are not yet configured)
// ========================================================
const LOCAL_PRODUCTS_PATH = path.join(process.cwd(), 'src', 'data', 'products.json');
const LOCAL_SETTINGS_PATH = path.join(process.cwd(), 'src', 'data', 'settings.json');
const LOCAL_USERS_PATH = path.join(process.cwd(), 'src', 'data', 'users.json');
const LOCAL_COUPONS_PATH = path.join(process.cwd(), 'src', 'data', 'coupons.json');
const LOCAL_HERO_CARDS_PATH = path.join(process.cwd(), 'src', 'data', 'hero-cards.json');

function loadLocalCoupons(): Coupon[] {
  try {
    if (fs.existsSync(LOCAL_COUPONS_PATH)) {
      const raw = fs.readFileSync(LOCAL_COUPONS_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Fallback: reading local coupons failed, using defaultCoupons', e);
  }
  return [...defaultCoupons];
}

function saveLocalCoupons(coupons: Coupon[]) {
  try {
    fs.writeFileSync(LOCAL_COUPONS_PATH, JSON.stringify(coupons, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Fallback: saving local coupons failed', e);
  }
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  created_at?: string;
}

function loadLocalUsers(): AppUser[] {
  try {
    if (fs.existsSync(LOCAL_USERS_PATH)) {
      const raw = fs.readFileSync(LOCAL_USERS_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Fallback: reading local users failed', e);
  }
  return [];
}

function saveLocalUsers(users: AppUser[]) {
  try {
    fs.writeFileSync(LOCAL_USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Fallback: saving local users failed', e);
  }
}

function loadLocalProducts(): Product[] {
  try {
    if (fs.existsSync(LOCAL_PRODUCTS_PATH)) {
      const raw = fs.readFileSync(LOCAL_PRODUCTS_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Fallback: reading local products failed, using defaultProducts', e);
  }
  return [...defaultProducts];
}

function saveLocalProducts(products: Product[]) {
  try {
    fs.writeFileSync(LOCAL_PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Fallback: saving local products failed', e);
  }
}

function loadLocalSettings(): SiteSettings {
  try {
    if (fs.existsSync(LOCAL_SETTINGS_PATH)) {
      const raw = fs.readFileSync(LOCAL_SETTINGS_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Fallback: reading local settings failed, using defaultSettings', e);
  }
  return { ...defaultSettings };
}

function saveLocalSettings(settings: SiteSettings) {
  try {
    fs.writeFileSync(LOCAL_SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Fallback: saving local settings failed', e);
  }
}

// In-memory cache for ultra-fast local response
let inMemoryProducts: Product[] | null = null;
let inMemorySettings: SiteSettings | null = null;

// ========================================================
// UNIFIED DATABASE ACCESS FUNCTIONS (D1 + Auto-Fallback)
// ========================================================

export async function dbGetProducts(type?: string): Promise<Product[]> {
  if (isD1Configured()) {
    try {
      const sql = type 
        ? 'SELECT * FROM products WHERE product_type = ? ORDER BY order_idx ASC, created_at DESC'
        : 'SELECT * FROM products ORDER BY order_idx ASC, created_at DESC';
      const params = type ? [type] : [];
      const rows = await queryD1(sql, params);
      
      return rows.map((r: any) => ({
        id: r.id,
        product_type: r.product_type,
        name: r.name,
        description: r.description || '',
        price: Number(r.price) || 0,
        category: r.category || '',
        image_url: r.image_url || '',
        gallery_images: r.gallery_images ? (typeof r.gallery_images === 'string' ? JSON.parse(r.gallery_images) : r.gallery_images) : [],
        features: r.features ? (typeof r.features === 'string' ? JSON.parse(r.features) : r.features) : [],
        badge_text: r.badge_text || '',
        color_from: r.color_from || 'from-blue-500/50',
        color_to: r.color_to || 'to-blue-500/10',
        is_popular: Boolean(r.is_popular),
        validity: r.validity || '',
        download_url: r.download_url || '',
      }));
    } catch (err) {
      console.warn('D1 Query Error (falling back to local):', err);
    }
  }

  // Fallback
  if (!inMemoryProducts) {
    inMemoryProducts = loadLocalProducts();
  }
  if (type) {
    return inMemoryProducts.filter(p => p.product_type === type);
  }
  return inMemoryProducts;
}

export async function dbSaveProduct(product: Partial<Product> & { name: string; price: number; product_type: any }): Promise<Product> {
  const id = product.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const featuresJson = JSON.stringify(product.features || []);
  const galleryImagesJson = JSON.stringify(product.gallery_images || []);

  if (isD1Configured()) {
    try {
      // Auto-migrate column if not exists in D1
      try {
        await queryD1('ALTER TABLE products ADD COLUMN gallery_images TEXT');
      } catch {}

      // Check if exists
      const existing = await queryD1('SELECT id FROM products WHERE id = ?', [id]);
      if (existing && existing.length > 0) {
        await queryD1(
          `UPDATE products SET 
            product_type = ?, name = ?, description = ?, price = ?, category = ?, 
            image_url = ?, gallery_images = ?, features = ?, badge_text = ?, color_from = ?, color_to = ?, 
            is_popular = ?, validity = ?, download_url = ?
          WHERE id = ?`,
          [
            product.product_type, product.name, product.description || '', product.price, product.category || '',
            product.image_url || '', galleryImagesJson, featuresJson, product.badge_text || '', product.color_from || '', product.color_to || '',
            product.is_popular ? 1 : 0, product.validity || '', product.download_url || '', id
          ]
        );
      } else {
        await queryD1(
          `INSERT INTO products 
            (id, product_type, name, description, price, category, image_url, gallery_images, features, badge_text, color_from, color_to, is_popular, validity, download_url, order_idx)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id, product.product_type, product.name, product.description || '', product.price, product.category || '',
            product.image_url || '', galleryImagesJson, featuresJson, product.badge_text || '', product.color_from || '', product.color_to || '',
            product.is_popular ? 1 : 0, product.validity || '', product.download_url || '', 0
          ]
        );
      }
      return { ...product, id } as Product;
    } catch (err) {
      console.warn('D1 Insert/Update Error (falling back to local):', err);
    }
  }

  // Fallback
  if (!inMemoryProducts) inMemoryProducts = loadLocalProducts();
  const existingIdx = inMemoryProducts.findIndex(p => p.id === id);
  const fullProduct: Product = {
    id,
    product_type: product.product_type,
    name: product.name,
    description: product.description || '',
    price: product.price,
    category: product.category || '',
    image_url: product.image_url || '',
    gallery_images: product.gallery_images || [],
    features: product.features || [],
    badge_text: product.badge_text || '',
    color_from: product.color_from || 'from-blue-500/50',
    color_to: product.color_to || 'to-blue-500/10',
    is_popular: Boolean(product.is_popular),
    validity: product.validity || '',
    download_url: product.download_url || '',
  };

  if (existingIdx >= 0) {
    inMemoryProducts[existingIdx] = fullProduct;
  } else {
    inMemoryProducts.unshift(fullProduct);
  }
  saveLocalProducts(inMemoryProducts);
  return fullProduct;
}

export async function dbDeleteProduct(id: string): Promise<boolean> {
  if (isD1Configured()) {
    try {
      await queryD1('DELETE FROM products WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.warn('D1 Delete Error (falling back to local):', err);
    }
  }

  // Fallback
  if (!inMemoryProducts) inMemoryProducts = loadLocalProducts();
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);
  saveLocalProducts(inMemoryProducts);
  return true;
}

export async function dbReorderProducts(orderedIds: string[]): Promise<boolean> {
  if (isD1Configured()) {
    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await queryD1('UPDATE products SET order_idx = ? WHERE id = ?', [i, orderedIds[i]]);
      }
      return true;
    } catch (err) {
      console.warn('D1 Reorder Error:', err);
    }
  }

  // Fallback
  if (!inMemoryProducts) inMemoryProducts = loadLocalProducts();
  const map = new Map(inMemoryProducts.map(p => [p.id, p]));
  const reordered: Product[] = [];
  for (const id of orderedIds) {
    const p = map.get(id);
    if (p) reordered.push(p);
  }
  for (const p of inMemoryProducts) {
    if (!orderedIds.includes(p.id)) reordered.push(p);
  }
  inMemoryProducts = reordered;
  saveLocalProducts(inMemoryProducts);
  return true;
}

export async function dbGetSettings(): Promise<SiteSettings> {
  if (isD1Configured()) {
    try {
      const rows = await queryD1('SELECT * FROM settings LIMIT 1');
      if (rows && rows.length > 0) {
        return {
          site_name: rows[0].site_name || defaultSettings.site_name,
          logo_url: rows[0].logo_url || defaultSettings.logo_url,
          support_whatsapp: rows[0].support_whatsapp || defaultSettings.support_whatsapp,
          support_phone: rows[0].support_phone || defaultSettings.support_phone,
          bkash_number: rows[0].bkash_number || defaultSettings.bkash_number,
          bank_transfer_number: rows[0].bank_transfer_number || defaultSettings.bank_transfer_number,
          cellfin_number: rows[0].cellfin_number || defaultSettings.cellfin_number,
          bangla_qr_url: rows[0].bangla_qr_url || defaultSettings.bangla_qr_url,
          bangla_qr_details: rows[0].bangla_qr_details || defaultSettings.bangla_qr_details,
          redotpay_id: rows[0].redotpay_id || defaultSettings.redotpay_id,
          telegram_channel: rows[0].telegram_channel || defaultSettings.telegram_channel,
        };
      }
    } catch (err) {
      console.warn('D1 Settings Error (falling back to local):', err);
    }
  }

  // Fallback
  if (!inMemorySettings) inMemorySettings = loadLocalSettings();
  return inMemorySettings;
}

export async function dbSaveSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  if (isD1Configured()) {
    try {
      const existing = await queryD1('SELECT id FROM settings LIMIT 1');
      if (existing && existing.length > 0) {
        await queryD1(
          `UPDATE settings SET 
            site_name = ?, logo_url = ?, support_whatsapp = ?, support_phone = ?,
            bkash_number = ?, bank_transfer_number = ?, cellfin_number = ?, bangla_qr_url = ?, bangla_qr_details = ?,
            redotpay_id = ?, telegram_channel = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
          [
            settings.site_name || '', settings.logo_url || '', settings.support_whatsapp || '',
            settings.support_phone || '', settings.bkash_number || '', settings.bank_transfer_number || '',
            settings.cellfin_number || '', settings.bangla_qr_url || '', settings.bangla_qr_details || '',
            settings.redotpay_id || '', settings.telegram_channel || '',
            existing[0].id
          ]
        );
      } else {
        await queryD1(
          `INSERT INTO settings 
            (id, site_name, logo_url, support_whatsapp, support_phone, bkash_number, bank_transfer_number, cellfin_number, bangla_qr_url, bangla_qr_details, redotpay_id, telegram_channel)
          VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            settings.site_name || '', settings.logo_url || '', settings.support_whatsapp || '',
            settings.support_phone || '', settings.bkash_number || '', settings.bank_transfer_number || '',
            settings.cellfin_number || '', settings.bangla_qr_url || '', settings.bangla_qr_details || '',
            settings.redotpay_id || '', settings.telegram_channel || ''
          ]
        );
      }
    } catch (err) {
      console.warn('D1 Settings Save Error:', err);
    }
  }

  // Fallback
  if (!inMemorySettings) inMemorySettings = loadLocalSettings();
  inMemorySettings = {
    ...inMemorySettings,
    ...settings
  };
  saveLocalSettings(inMemorySettings);
  return inMemorySettings;
}

// ========================================================
// USER AUTHENTICATION DATABASE OPERATIONS
// ========================================================

export async function dbGetUserByEmail(email: string): Promise<AppUser | null> {
  const cleanEmail = email.trim().toLowerCase();

  if (isD1Configured()) {
    try {
      const rows = await queryD1('SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);
      if (rows && rows.length > 0) {
        return rows[0] as AppUser;
      }
      return null;
    } catch (err) {
      console.warn('D1 GetUserByEmail Error (falling back to local):', err);
    }
  }

  const users = loadLocalUsers();
  return users.find(u => u.email.toLowerCase() === cleanEmail) || null;
}

export async function dbGetUserById(id: string): Promise<AppUser | null> {
  if (isD1Configured()) {
    try {
      const rows = await queryD1('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      if (rows && rows.length > 0) {
        return rows[0] as AppUser;
      }
      return null;
    } catch (err) {
      console.warn('D1 GetUserById Error (falling back to local):', err);
    }
  }

  const users = loadLocalUsers();
  return users.find(u => u.id === id) || null;
}

export async function dbCreateUser(user: { name: string; email: string; password_hash: string; phone?: string }): Promise<AppUser> {
  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanEmail = user.email.trim().toLowerCase();
  const newUser: AppUser = {
    id,
    name: user.name.trim(),
    email: cleanEmail,
    password_hash: user.password_hash,
    phone: user.phone?.trim() || '',
    created_at: new Date().toISOString()
  };

  if (isD1Configured()) {
    try {
      await queryD1(
        'INSERT INTO users (id, name, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)',
        [newUser.id, newUser.name, newUser.email, newUser.password_hash, newUser.phone || '']
      );
      return newUser;
    } catch (err) {
      console.warn('D1 CreateUser Error (falling back to local):', err);
    }
  }

  const users = loadLocalUsers();
  users.push(newUser);
  saveLocalUsers(users);
  return newUser;
}

// ========================================================
// COUPON MANAGEMENT METHODS
// ========================================================

export async function dbGetCoupons(): Promise<Coupon[]> {
  if (isD1Configured()) {
    try {
      const rows = await queryD1('SELECT * FROM coupons ORDER BY created_at DESC');
      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          ...r,
          is_active: Boolean(r.is_active),
          discount_value: Number(r.discount_value),
          min_order_amount: Number(r.min_order_amount || 0),
          max_discount_amount: Number(r.max_discount_amount || 0),
          usage_limit: Number(r.usage_limit || 0),
          used_count: Number(r.used_count || 0),
        }));
      }
    } catch (err) {
      console.warn('D1 GetCoupons Error (falling back to local):', err);
    }
  }

  return loadLocalCoupons();
}

export async function dbSaveCoupon(coupon: Omit<Coupon, 'id' | 'created_at' | 'used_count'> & { id?: string }): Promise<Coupon> {
  const id = coupon.id || `cpn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const cleanCode = coupon.code.trim().toUpperCase();
  
  const newCoupon: Coupon = {
    id,
    code: cleanCode,
    discount_type: coupon.discount_type || 'percentage',
    discount_value: Number(coupon.discount_value) || 0,
    applicable_to: coupon.applicable_to || 'all',
    min_order_amount: Number(coupon.min_order_amount || 0),
    max_discount_amount: Number(coupon.max_discount_amount || 0),
    usage_limit: Number(coupon.usage_limit || 0),
    used_count: 0,
    expiry_date: coupon.expiry_date || '',
    is_active: coupon.is_active !== undefined ? Boolean(coupon.is_active) : true,
    created_at: new Date().toISOString()
  };

  if (isD1Configured()) {
    try {
      await queryD1(
        `INSERT INTO coupons (id, code, discount_type, discount_value, applicable_to, min_order_amount, max_discount_amount, usage_limit, used_count, expiry_date, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           code = excluded.code,
           discount_type = excluded.discount_type,
           discount_value = excluded.discount_value,
           applicable_to = excluded.applicable_to,
           min_order_amount = excluded.min_order_amount,
           max_discount_amount = excluded.max_discount_amount,
           usage_limit = excluded.usage_limit,
           expiry_date = excluded.expiry_date,
           is_active = excluded.is_active`,
        [
          newCoupon.id,
          newCoupon.code,
          newCoupon.discount_type,
          newCoupon.discount_value,
          newCoupon.applicable_to,
          newCoupon.min_order_amount || 0,
          newCoupon.max_discount_amount || 0,
          newCoupon.usage_limit || 0,
          newCoupon.used_count || 0,
          newCoupon.expiry_date || '',
          newCoupon.is_active ? 1 : 0
        ]
      );
      return newCoupon;
    } catch (err) {
      console.warn('D1 SaveCoupon Error (falling back to local):', err);
    }
  }

  const coupons = loadLocalCoupons();
  const existingIdx = coupons.findIndex(c => c.id === newCoupon.id || c.code.toUpperCase() === cleanCode);
  if (existingIdx >= 0) {
    coupons[existingIdx] = { ...coupons[existingIdx], ...newCoupon };
  } else {
    coupons.unshift(newCoupon);
  }
  saveLocalCoupons(coupons);
  return newCoupon;
}

export async function dbUpdateCoupon(id: string, updates: Partial<Coupon>): Promise<boolean> {
  if (isD1Configured()) {
    try {
      const sets: string[] = [];
      const params: any[] = [];
      
      if (updates.code !== undefined) {
        sets.push('code = ?');
        params.push(updates.code.trim().toUpperCase());
      }
      if (updates.discount_type !== undefined) {
        sets.push('discount_type = ?');
        params.push(updates.discount_type);
      }
      if (updates.discount_value !== undefined) {
        sets.push('discount_value = ?');
        params.push(Number(updates.discount_value));
      }
      if (updates.applicable_to !== undefined) {
        sets.push('applicable_to = ?');
        params.push(updates.applicable_to);
      }
      if (updates.min_order_amount !== undefined) {
        sets.push('min_order_amount = ?');
        params.push(Number(updates.min_order_amount));
      }
      if (updates.max_discount_amount !== undefined) {
        sets.push('max_discount_amount = ?');
        params.push(Number(updates.max_discount_amount));
      }
      if (updates.usage_limit !== undefined) {
        sets.push('usage_limit = ?');
        params.push(Number(updates.usage_limit));
      }
      if (updates.is_active !== undefined) {
        sets.push('is_active = ?');
        params.push(updates.is_active ? 1 : 0);
      }
      if (updates.expiry_date !== undefined) {
        sets.push('expiry_date = ?');
        params.push(updates.expiry_date);
      }

      if (sets.length > 0) {
        params.push(id);
        await queryD1(`UPDATE coupons SET ${sets.join(', ')} WHERE id = ?`, params);
        return true;
      }
    } catch (err) {
      console.warn('D1 UpdateCoupon Error (falling back to local):', err);
    }
  }

  const coupons = loadLocalCoupons();
  const c = coupons.find(item => item.id === id);
  if (!c) return false;
  Object.assign(c, updates);
  if (updates.code) c.code = updates.code.trim().toUpperCase();
  saveLocalCoupons(coupons);
  return true;
}

export async function dbDeleteCoupon(id: string): Promise<boolean> {
  if (isD1Configured()) {
    try {
      await queryD1('DELETE FROM coupons WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.warn('D1 DeleteCoupon Error (falling back to local):', err);
    }
  }

  const coupons = loadLocalCoupons();
  const filtered = coupons.filter(c => c.id !== id);
  saveLocalCoupons(filtered);
  return true;
}

export async function dbIncrementCouponUsage(code: string): Promise<void> {
  const cleanCode = code.trim().toUpperCase();
  if (isD1Configured()) {
    try {
      await queryD1('UPDATE coupons SET used_count = used_count + 1 WHERE UPPER(code) = ?', [cleanCode]);
      return;
    } catch (err) {
      console.warn('D1 IncrementCouponUsage Error (falling back to local):', err);
    }
  }

  const coupons = loadLocalCoupons();
  const c = coupons.find(item => item.code.toUpperCase() === cleanCode);
  if (c) {
    c.used_count = (c.used_count || 0) + 1;
    saveLocalCoupons(coupons);
  }
}

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  coupon?: Coupon;
  discountAmount: number;
  finalPrice: number;
}

export async function dbValidateCoupon(
  code: string,
  product: { id: string; product_type?: string; price: number }
): Promise<CouponValidationResult> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: 'দয়া করে একটি কুপন কোড লিখুন।', discountAmount: 0, finalPrice: product.price };
  }

  const coupons = await dbGetCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return { valid: false, message: 'কুপন কোডটি সঠিক নয়। অনুগ্রহ করে যাচাই করে পুনরায় চেষ্টা করুন।', discountAmount: 0, finalPrice: product.price };
  }

  if (!coupon.is_active) {
    return { valid: false, message: 'এই কুপনটি বর্তমানে নিষ্ক্রিয় রয়েছে।', discountAmount: 0, finalPrice: product.price };
  }

  if (coupon.expiry_date) {
    const expiry = new Date(coupon.expiry_date).getTime();
    if (!isNaN(expiry) && Date.now() > expiry) {
      return { valid: false, message: 'এই কুপনটির মেয়াদ শেষ হয়ে গেছে।', discountAmount: 0, finalPrice: product.price };
    }
  }

  if (coupon.usage_limit && coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
    return { valid: false, message: 'এই কুপনের সর্বোচ্চ ব্যবহারের সীমা শেষ হয়ে গেছে।', discountAmount: 0, finalPrice: product.price };
  }

  if (coupon.min_order_amount && coupon.min_order_amount > 0 && product.price < coupon.min_order_amount) {
    return {
      valid: false,
      message: `এই কুপনটি ব্যবহার করতে ন্যূনতম ৳${coupon.min_order_amount} টাকার অর্ডার প্রয়োজন।`,
      discountAmount: 0,
      finalPrice: product.price
    };
  }

  // Check product applicability
  if (coupon.applicable_to && coupon.applicable_to !== 'all') {
    const target = coupon.applicable_to.toLowerCase();
    const prodType = (product.product_type || '').toLowerCase();
    const prodId = (product.id || '').toLowerCase();

    const matchesType = (target === 'subscription' && prodType === 'subscription') ||
                        (target === 'single_tool' && prodType === 'single_tool') ||
                        (target === 'digital' && prodType === 'digital') ||
                        (target === 'packages' && prodType === 'subscription');

    const matchesId = target === prodId;

    if (!matchesType && !matchesId) {
      let scopeName = 'নির্দিষ্ট প্যাকেজ বা প্রোডাক্টের জন্য';
      if (target === 'subscription' || target === 'packages') scopeName = 'শুধুমাত্র সাবস্ক্রিপশন প্যাকেজের জন্য';
      if (target === 'single_tool') scopeName = 'শুধুমাত্র সিঙ্গেল টুলসের জন্য';
      if (target === 'digital') scopeName = 'শুধুমাত্র ডিজিটাল প্রডাক্টের জন্য';

      return {
        valid: false,
        message: `এই কুপনটি ${scopeName} প্রযোজ্য। আপনার নির্বাচিত পণ্যে প্রযোজ্য নয়।`,
        discountAmount: 0,
        finalPrice: product.price
      };
    }
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = Math.round((product.price * coupon.discount_value) / 100);
    if (coupon.max_discount_amount && coupon.max_discount_amount > 0) {
      discount = Math.min(discount, coupon.max_discount_amount);
    }
  } else {
    discount = Math.min(coupon.discount_value, product.price);
  }

  const finalPrice = Math.max(0, product.price - discount);

  return {
    valid: true,
    message: `অভিনন্দন! "${coupon.code}" কুপন সফলভাবে যুক্ত হয়েছে (${coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `৳${coupon.discount_value}`} ছাড়)।`,
    coupon,
    discountAmount: discount,
    finalPrice
  };
}

// ========================================================
// HERO CARDS MANAGEMENT METHODS
// ========================================================

export interface HeroCard {
  id: string;
  name: string;
  logo_url: string;
  features: string[];
  emojis: string[];
  order_idx?: number;
  created_at?: string;
}

function loadLocalHeroCards(): HeroCard[] {
  try {
    if (fs.existsSync(LOCAL_HERO_CARDS_PATH)) {
      const raw = fs.readFileSync(LOCAL_HERO_CARDS_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Fallback: reading local hero cards failed', e);
  }
  return [];
}

function saveLocalHeroCards(cards: HeroCard[]) {
  try {
    fs.writeFileSync(LOCAL_HERO_CARDS_PATH, JSON.stringify(cards, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Fallback: saving local hero cards failed', e);
  }
}

export async function dbGetHeroCards(): Promise<HeroCard[]> {
  if (isD1Configured()) {
    try {
      await queryD1(`
        CREATE TABLE IF NOT EXISTS hero_cards (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          logo_url TEXT,
          features TEXT,
          emojis TEXT,
          order_idx INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const rows = await queryD1('SELECT * FROM hero_cards ORDER BY order_idx ASC, created_at DESC');
      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          ...r,
          features: typeof r.features === 'string' ? JSON.parse(r.features || '[]') : (r.features || []),
          emojis: typeof r.emojis === 'string' ? JSON.parse(r.emojis || '[]') : (r.emojis || []),
          order_idx: Number(r.order_idx || 0)
        }));
      }
    } catch (err) {
      console.warn('D1 GetHeroCards Error (falling back to local):', err);
    }
  }
  return loadLocalHeroCards();
}

export async function dbSaveHeroCard(card: Omit<HeroCard, 'created_at'> & { created_at?: string }): Promise<HeroCard> {
  const id = card.id || `hero_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const featuresJson = JSON.stringify(card.features || []);
  const emojisJson = JSON.stringify(card.emojis || []);
  const orderIdx = card.order_idx !== undefined ? Number(card.order_idx) : 0;
  
  const savedCard: HeroCard = {
    id,
    name: card.name.trim(),
    logo_url: card.logo_url || '',
    features: card.features || [],
    emojis: card.emojis || [],
    order_idx: orderIdx,
    created_at: card.created_at || new Date().toISOString()
  };

  if (isD1Configured()) {
    try {
      await queryD1(`
        CREATE TABLE IF NOT EXISTS hero_cards (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          logo_url TEXT,
          features TEXT,
          emojis TEXT,
          order_idx INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await queryD1(
        `INSERT INTO hero_cards (id, name, logo_url, features, emojis, order_idx)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           logo_url = excluded.logo_url,
           features = excluded.features,
           emojis = excluded.emojis,
           order_idx = excluded.order_idx`,
        [id, savedCard.name, savedCard.logo_url, featuresJson, emojisJson, orderIdx]
      );
    } catch (err) {
      console.warn('D1 SaveHeroCard Error (falling back to local):', err);
    }
  }

  const local = loadLocalHeroCards();
  const idx = local.findIndex(c => c.id === id);
  if (idx >= 0) {
    local[idx] = savedCard;
  } else {
    local.push(savedCard);
  }
  saveLocalHeroCards(local);
  return savedCard;
}

export async function dbDeleteHeroCard(id: string): Promise<boolean> {
  if (isD1Configured()) {
    try {
      await queryD1('DELETE FROM hero_cards WHERE id = ?', [id]);
    } catch (err) {
      console.warn('D1 DeleteHeroCard Error:', err);
    }
  }
  const local = loadLocalHeroCards().filter(c => c.id !== id);
  saveLocalHeroCards(local);
  return true;
}

export async function dbReorderHeroCards(orderedIds: string[]): Promise<boolean> {
  if (isD1Configured()) {
    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await queryD1('UPDATE hero_cards SET order_idx = ? WHERE id = ?', [i, orderedIds[i]]);
      }
    } catch (err) {
      console.warn('D1 ReorderHeroCards Error:', err);
    }
  }
  const local = loadLocalHeroCards();
  const map = new Map(local.map(c => [c.id, c]));
  const reordered: HeroCard[] = [];
  for (let i = 0; i < orderedIds.length; i++) {
    const c = map.get(orderedIds[i]);
    if (c) {
      reordered.push({ ...c, order_idx: i });
    }
  }
  for (const c of local) {
    if (!orderedIds.includes(c.id)) reordered.push(c);
  }
  saveLocalHeroCards(reordered);
  return true;
}

// ========================================================
// ORDERS (Cloudflare D1 + Fallback)
// ========================================================
export async function dbGetOrders(): Promise<StoredOrder[]> {
  if (isD1Configured()) {
    try {
      const rows = await queryD1<StoredOrder>('SELECT * FROM orders ORDER BY created_at DESC');
      if (rows && Array.isArray(rows)) return rows;
    } catch (err) {
      console.warn('D1 dbGetOrders Error:', err);
    }
  }
  return getAllOrders();
}

export async function dbSaveOrder(order: StoredOrder): Promise<StoredOrder> {
  if (isD1Configured()) {
    try {
      await queryD1(
        `INSERT INTO orders (id, user_phone, trx_id, payment_method, package_id, product_name, price, status, proof_url, customer_name, whatsapp, created_at, original_price, discount_amount, coupon_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id,
          order.user_phone,
          order.trx_id || null,
          order.payment_method || null,
          order.package_id || null,
          order.product_name || null,
          order.price || 0,
          order.status || 'pending',
          order.proof_url || null,
          order.customer_name || null,
          order.whatsapp || null,
          order.created_at || new Date().toISOString(),
          order.original_price || null,
          order.discount_amount || null,
          order.coupon_code || null,
        ]
      );
    } catch (err) {
      console.warn('D1 dbSaveOrder Error:', err);
    }
  }
  addOrder(order);
  return order;
}

export async function dbUpdateOrderStatus(id: string, status: string): Promise<boolean> {
  if (isD1Configured()) {
    try {
      await queryD1('UPDATE orders SET status = ? WHERE id = ? OR trx_id = ?', [status, id, id]);
    } catch (err) {
      console.warn('D1 dbUpdateOrderStatus Error:', err);
    }
  }
  updateOrderStatus(id, status as any);
  return true;
}

export async function dbDeleteOrder(id: string): Promise<boolean> {
  if (isD1Configured()) {
    try {
      await queryD1('DELETE FROM orders WHERE id = ? OR trx_id = ?', [id, id]);
    } catch (err) {
      console.warn('D1 dbDeleteOrder Error:', err);
    }
  }
  deleteOrder(id);
  return true;
}

export async function dbSearchOrders(query: string): Promise<StoredOrder[]> {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  if (isD1Configured()) {
    try {
      const digits = cleanQ.replace(/\D/g, '');
      const corePhone = digits.length >= 10 ? digits.slice(-10) : digits;
      const qParam = `%${cleanQ}%`;
      const phoneParam = `%${corePhone}%`;

      let sql = `
        SELECT * FROM orders 
        WHERE LOWER(id) LIKE LOWER(?) 
           OR LOWER(trx_id) LIKE LOWER(?) 
           OR LOWER(user_phone) LIKE LOWER(?) 
           OR LOWER(whatsapp) LIKE LOWER(?) 
           OR LOWER(customer_name) LIKE LOWER(?)
      `;
      const params: any[] = [qParam, qParam, qParam, qParam, qParam];

      if (corePhone.length >= 7) {
        sql += ` OR user_phone LIKE ? OR whatsapp LIKE ?`;
        params.push(phoneParam, phoneParam);
      }

      sql += ` ORDER BY created_at DESC`;

      const rows = await queryD1<StoredOrder>(sql, params);
      if (rows && rows.length > 0) return rows;
    } catch (err) {
      console.warn('D1 dbSearchOrders Error:', err);
    }
  }

  return searchOrders(cleanQ);
}



