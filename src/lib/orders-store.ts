import fs from 'fs';
import path from 'path';

export interface StoredOrder {
  id: string;
  created_at: string;
  user_phone: string;
  trx_id: string;
  payment_method: string;
  package_id: string;
  product_name: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  proof_url?: string;
  customer_name?: string;
  whatsapp?: string;
}

// In-memory cache for fast lookup and serverless fallback
let memoryOrders: StoredOrder[] = [];
let isLoaded = false;

function getFilePath(): string {
  return path.join(process.cwd(), 'src', 'data', 'orders.json');
}

function loadOrdersFromFile(): StoredOrder[] {
  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.warn('Could not read orders from file, using in-memory store:', err);
  }
  return [];
}

function saveOrdersToFile(orders: StoredOrder[]) {
  try {
    const filePath = getFilePath();
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write orders to file, retained in memory:', err);
  }
}

export function getAllOrders(): StoredOrder[] {
  if (!isLoaded) {
    memoryOrders = loadOrdersFromFile();
    isLoaded = true;
  }
  return memoryOrders;
}

export function addOrder(newOrder: StoredOrder): StoredOrder {
  const orders = getAllOrders();
  orders.unshift(newOrder);
  memoryOrders = orders;
  saveOrdersToFile(orders);
  return newOrder;
}

export function updateOrderStatus(id: string, status: 'pending' | 'approved' | 'rejected'): boolean {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id === id || o.trx_id === id);
  if (!order) return false;
  order.status = status;
  memoryOrders = orders;
  saveOrdersToFile(orders);
  return true;
}

export function deleteOrder(id: string): boolean {
  const orders = getAllOrders();
  const filtered = orders.filter((o) => o.id !== id && o.trx_id !== id);
  if (filtered.length === orders.length) return false;
  memoryOrders = filtered;
  saveOrdersToFile(filtered);
  return true;
}

export function searchOrders(query: string): StoredOrder[] {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];
  const orders = getAllOrders();
  return orders.filter(
    (o) =>
      (o.id && o.id.toLowerCase().includes(cleanQ)) ||
      (o.user_phone && o.user_phone.toLowerCase().includes(cleanQ)) ||
      (o.trx_id && o.trx_id.toLowerCase().includes(cleanQ)) ||
      (o.product_name && o.product_name.toLowerCase().includes(cleanQ)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(cleanQ))
  );
}
