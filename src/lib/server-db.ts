import fs from 'fs';
import path from 'path';
import { Order, OrderStatus } from '@/types';

// Path to central database JSON file
const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'orders_db.json');
const TMP_DB_FILE_PATH = path.join('/tmp', 'orders_db.json');

// In-memory cache for ultra-fast access
let ordersCache: Order[] | null = null;

function getActiveDbPath(): string {
  try {
    // If standard path is writable
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return DB_FILE_PATH;
  } catch {
    return TMP_DB_FILE_PATH;
  }
}

/**
 * Retrieve all orders from the central database
 */
export function getDbOrders(): Order[] {
  if (ordersCache !== null) {
    return ordersCache;
  }

  const dbPath = getActiveDbPath();
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      ordersCache = JSON.parse(raw) as Order[];
      return ordersCache;
    }
  } catch (err) {
    console.warn('Error reading central database:', err);
  }

  ordersCache = [];
  return ordersCache;
}

/**
 * Persist orders array to the central database
 */
function writeDbOrders(orders: Order[]): boolean {
  ordersCache = orders;
  const dbPath = getActiveDbPath();

  try {
    fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('Failed writing to primary dbPath, trying /tmp:', err);
    try {
      fs.writeFileSync(TMP_DB_FILE_PATH, JSON.stringify(orders, null, 2), 'utf-8');
      return true;
    } catch (tmpErr) {
      console.error('Failed writing to fallback tmp db:', tmpErr);
      return false;
    }
  }
}

/**
 * Save or update an order in the central database
 */
export function saveDbOrder(order: Order): Order {
  const currentOrders = getDbOrders();
  const existingIndex = currentOrders.findIndex(
    (o) => o.id.trim().toUpperCase() === order.id.trim().toUpperCase()
  );

  let updatedList: Order[];
  if (existingIndex >= 0) {
    updatedList = [...currentOrders];
    updatedList[existingIndex] = order;
  } else {
    // Put newest orders first
    updatedList = [order, ...currentOrders];
  }

  writeDbOrders(updatedList);
  return order;
}

/**
 * Find an order by its ID
 */
export function getDbOrderById(orderId: string): Order | null {
  const orders = getDbOrders();
  const targetId = orderId.trim().toUpperCase();
  return orders.find((o) => o.id.trim().toUpperCase() === targetId) || null;
}

/**
 * Update the status of an existing order
 */
export function updateDbOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const currentOrders = getDbOrders();
  const targetId = orderId.trim().toUpperCase();
  const index = currentOrders.findIndex((o) => o.id.trim().toUpperCase() === targetId);

  if (index === -1) {
    return null;
  }

  const target = currentOrders[index];
  const updatedOrder: Order = {
    ...target,
    status,
    paidAt: status === 'PAID' ? new Date().toISOString() : target.paidAt,
  };

  currentOrders[index] = updatedOrder;
  writeDbOrders(currentOrders);
  return updatedOrder;
}

/**
 * Compute key store statistics for the admin dashboard
 */
export function getDbStats() {
  const orders = getDbOrders();
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.status === 'PAID');
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return {
    totalRevenue,
    totalOrders,
    paidCount: paidOrders.length,
    pendingCount: pendingOrders.length,
  };
}
