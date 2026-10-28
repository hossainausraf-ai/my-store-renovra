import { defaultProducts, Product } from '@/data/products';
import { defaultSettings, SiteSettings } from '@/data/settings';
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

  if (isD1Configured()) {
    try {
      // Check if exists
      const existing = await queryD1('SELECT id FROM products WHERE id = ?', [id]);
      if (existing && existing.length > 0) {
        await queryD1(
          `UPDATE products SET 
            product_type = ?, name = ?, description = ?, price = ?, category = ?, 
            image_url = ?, features = ?, badge_text = ?, color_from = ?, color_to = ?, 
            is_popular = ?, validity = ?, download_url = ?
          WHERE id = ?`,
          [
            product.product_type, product.name, product.description || '', product.price, product.category || '',
            product.image_url || '', featuresJson, product.badge_text || '', product.color_from || '', product.color_to || '',
            product.is_popular ? 1 : 0, product.validity || '', product.download_url || '', id
          ]
        );
      } else {
        await queryD1(
          `INSERT INTO products 
            (id, product_type, name, description, price, category, image_url, features, badge_text, color_from, color_to, is_popular, validity, download_url, order_idx)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id, product.product_type, product.name, product.description || '', product.price, product.category || '',
            product.image_url || '', featuresJson, product.badge_text || '', product.color_from || '', product.color_to || '',
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
          nagad_number: rows[0].nagad_number || defaultSettings.nagad_number,
          bank_transfer_number: rows[0].bank_transfer_number || defaultSettings.bank_transfer_number,
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
            bkash_number = ?, nagad_number = ?, bank_transfer_number = ?, redotpay_id = ?,
            telegram_channel = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
          [
            settings.site_name || '', settings.logo_url || '', settings.support_whatsapp || '',
            settings.support_phone || '', settings.bkash_number || '', settings.nagad_number || '',
            settings.bank_transfer_number || '', settings.redotpay_id || '', settings.telegram_channel || '',
            existing[0].id
          ]
        );
      } else {
        await queryD1(
          `INSERT INTO settings 
            (id, site_name, logo_url, support_whatsapp, support_phone, bkash_number, nagad_number, bank_transfer_number, redotpay_id, telegram_channel)
          VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            settings.site_name || '', settings.logo_url || '', settings.support_whatsapp || '',
            settings.support_phone || '', settings.bkash_number || '', settings.nagad_number || '',
            settings.bank_transfer_number || '', settings.redotpay_id || '', settings.telegram_channel || ''
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

