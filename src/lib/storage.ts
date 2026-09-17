import { Order, CartItem, EmailNotification, OrderStatus } from '@/types';
import { createAccessToken, hasOrderAccess, canDownloadOrder } from './order-security.mjs';

const ORDERS_STORAGE_KEY = 'vibe_store_orders_v1';
const CART_STORAGE_KEY = 'vibe_store_cart_v1';
const EMAILS_STORAGE_KEY = 'vibe_store_simulated_emails_v1';
const ORDER_LOOKUP_ERROR = 'ไม่พบคำสั่งซื้อจากข้อมูลที่ระบุ กรุณาตรวจสอบเลขที่คำสั่งซื้อและอีเมลอีกครั้ง';

// Seed demo orders for testing order tracking out of the box if needed
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-2026-1001',
    customerName: 'สมชาย นักพัฒนา',
    customerEmail: 'somchai.dev@example.com',
    items: [
      {
        product: {
          id: 'prod-mediaplayer-01',
          title: 'E-Book 1: คู่มือพัฒนา Media Player PRO (Cyberpunk Studio Edition)',
          slug: 'mediaplayer-pro-cyberpunk-guide',
          description: 'เรียนรู้วิธีสร้างโปรแกรมเครื่องเล่นเพลง MP3 และวิดีโอ MP4 สไตล์ Cyberpunk Studio ด้วย Python 3.12 และ PyQt6',
          fullDescription: '',
          price: 290,
          category: 'mediaplayer',
          categoryLabel: 'งานที่ 1: ฟังเพลง & วิดีโอ',
          coverImage: '/products/media_player_pro.png',
          rating: 5.0,
          reviewsCount: 88,
          author: { name: 'Media Player Dev Team', avatar: '', role: 'PyQt6 Specialist' },
          features: [],
          fileSize: '48.2 MB',
          fileFormat: 'PDF E-Book + Source Code',
          downloadFileName: 'MediaPlayerPRO-Cyberpunk-Guide.pdf',
        },
        quantity: 1,
      },
    ],
    totalAmount: 290,
    status: 'PAID',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    paidAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    downloadToken: 'tok_demo_sample_paid_1001',
    downloadExpiresAt: new Date(Date.now() + 3600000 * 48).toISOString(),
    paymentMethod: 'promptpay',
  },
];

// Helper to safely access localStorage in client
function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom event for multi-component reactivity
    window.dispatchEvent(new Event('vibe-storage-updated'));
  } catch (err) {
    console.warn(`Error writing to localStorage key "${key}":`, err);
  }
}

// Generate unique order ID
export function generateOrderId(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `ORD-2026-${randomDigits}`;
}

// Generate secure temporary download token
export function generateDownloadToken(): string {
  return createAccessToken();
}

// ==================== ORDER OPERATIONS ====================

export function getAllOrders(): Order[] {
  return getFromStorage<Order[]>(ORDERS_STORAGE_KEY, INITIAL_DEMO_ORDERS);
}

export function getOrderById(orderId: string): Order | null {
  const orders = getAllOrders();
  return orders.find((o) => o.id.trim().toUpperCase() === orderId.trim().toUpperCase()) || null;
}

export function getAuthorizedOrder(orderId: string, accessToken: string): Order | null {
  const order = getOrderById(orderId);
  return hasOrderAccess(order, accessToken) ? order : null;
}

export function canDownload(order: Order, accessToken: string): boolean {
  return canDownloadOrder(order, accessToken);
}

/**
 * Privacy-First Order Lookup
 * Requirement: หน้าติดตามคำสั่งซื้อไม่เปิดเผยข้อมูลของผู้อื่น
 * Must match both Order ID AND Customer Email
 */
export function verifyAndGetOrder(
  orderId: string,
  customerEmail: string
): { success: boolean; order?: Order; error?: string } {
  if (!orderId || !orderId.trim()) {
    return { success: false, error: 'กรุณากรอกเลขที่คำสั่งซื้อ (เช่น ORD-2026-xxxx)' };
  }
  if (!customerEmail || !customerEmail.trim()) {
    return { success: false, error: 'กรุณากรอกอีเมลที่ใช้สั่งซื้อเพื่อยืนยันตัวตน' };
  }

  const cleanOrderId = orderId.trim().toUpperCase();
  const cleanEmail = customerEmail.trim().toLowerCase();

  const orders = getAllOrders();
  const foundOrder = orders.find((o) => o.id.toUpperCase() === cleanOrderId);

  if (!foundOrder) {
    return { success: false, error: ORDER_LOOKUP_ERROR };
  }

  // Strictly verify email to prevent unauthorized data exposure!
  if (foundOrder.customerEmail.trim().toLowerCase() !== cleanEmail) {
    return { success: false, error: ORDER_LOOKUP_ERROR };
  }

  return { success: true, order: foundOrder };
}

export function createOrder(
  customerName: string,
  customerEmail: string,
  items: CartItem[],
  paymentMethod: 'promptpay' | 'credit_card' = 'promptpay'
): Order {
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const newOrder: Order = {
    id: generateOrderId(),
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    items,
    totalAmount,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    downloadToken: generateDownloadToken(),
    downloadExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours validity
    paymentMethod,
  };

  const currentOrders = getAllOrders();
  const updatedOrders = [newOrder, ...currentOrders];
  saveToStorage(ORDERS_STORAGE_KEY, updatedOrders);

  // Sync to Central Database (makes orders from mobile show up on admin PC!)
  if (typeof window !== 'undefined') {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((err) => console.warn('Central DB sync error:', err));
  }

  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orders = getAllOrders();
  const index = orders.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());
  if (index === -1) return null;

  const updatedOrder: Order = {
    ...orders[index],
    status,
    paidAt: status === 'PAID' ? new Date().toISOString() : orders[index].paidAt,
  };

  orders[index] = updatedOrder;
  saveToStorage(ORDERS_STORAGE_KEY, orders);

  // Sync status to Central Database
  if (typeof window !== 'undefined') {
    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.warn('Central DB status sync error:', err));
  }

  // If status is PAID, automatically generate and log simulated delivery email
  if (status === 'PAID') {
    createAndSaveEmailNotification(updatedOrder);
  }

  return updatedOrder;
}

// ==================== EMAIL NOTIFICATION LOGS ====================

export function getSimulatedEmails(): EmailNotification[] {
  return getFromStorage<EmailNotification[]>(EMAILS_STORAGE_KEY, []);
}

export function createAndSaveEmailNotification(order: Order): EmailNotification {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const downloadUrl = `${baseUrl}/order-success/${order.id}?token=${order.downloadToken}`;

  const emailLog: EmailNotification = {
    id: 'eml_' + Math.random().toString(36).substring(2, 9),
    to: order.customerEmail,
    customerName: order.customerName,
    subject: `[Vibe Store] ยืนยันการชำระเงินสำเร็จและลิงก์ดาวน์โหลดสินค้าดิจิทัล (คำสั่งซื้อ #${order.id})`,
    orderId: order.id,
    sentAt: new Date().toISOString(),
    downloadUrl,
    items: order.items.map((i) => ({
      title: i.product.title,
      price: i.product.price,
      fileFormat: i.product.fileFormat,
    })),
    totalAmount: order.totalAmount,
  };

  const existingEmails = getSimulatedEmails();
  saveToStorage(EMAILS_STORAGE_KEY, [emailLog, ...existingEmails]);

  // Also trigger API route to dispatch real email if server environment is configured
  if (typeof window !== 'undefined') {
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: order.customerEmail,
        customerName: order.customerName,
        orderId: order.id,
        downloadUrl,
        items: emailLog.items,
        totalAmount: order.totalAmount,
      }),
    }).catch((err) => {
      console.warn('API send-email background call:', err);
    });
  }

  return emailLog;
}

/**
 * Generate native mailto: URL with full order confirmation and download link
 * Allows instant opening in Gmail / Outlook / Apple Mail on mobile or desktop
 */
export function generateMailtoLink(order: Order): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const downloadUrl = `${baseUrl}/order-success/${order.id}?token=${order.downloadToken}`;
  const subject = encodeURIComponent(`[Vibe Store] ยืนยันคำสั่งซื้อ #${order.id} และลิงก์ดาวน์โหลด E-Book`);
  const body = encodeURIComponent(
    `เรียนคุณ ${order.customerName},\n\n` +
      `ขอบคุณสำหรับการสั่งซื้อ E-Book จาก Vibe Coding Digital Store\n\n` +
      `หมายเลขคำสั่งซื้อ: #${order.id}\n` +
      `ยอดรวมทั้งสิ้น: ${order.totalAmount} บาท\n\n` +
      `รายการสินค้าดิจิทัล:\n` +
      order.items.map((i) => `- ${i.product.title} (${i.product.price} บาท)`).join('\n') +
      `\n\nคลิกที่ลิงก์ด้านล่างเพื่อรับไฟล์ E-Book ของคุณ (อายุการใช้งาน 48 ชม.):\n` +
      `${downloadUrl}\n\n` +
      `ขอขอบคุณ,\nVibe Coding Store Team`
  );
  return `mailto:${order.customerEmail}?subject=${subject}&body=${body}`;
}

// ==================== PRODUCT REVIEWS STORAGE ====================

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const REVIEWS_STORAGE_KEY = 'vibe_store_user_reviews_v1';

export function getProductReviews(productId: string): ProductReview[] {
  const allReviews = getFromStorage<ProductReview[]>(REVIEWS_STORAGE_KEY, []);
  return allReviews.filter((r) => r.productId === productId);
}

export function addProductReview(
  productId: string,
  authorName: string,
  rating: number,
  comment: string
): ProductReview {
  const newReview: ProductReview = {
    id: 'rev_' + Math.random().toString(36).substring(2, 9),
    productId,
    authorName: authorName.trim() || 'ผู้อ่าน',
    rating: Math.max(1, Math.min(5, rating)),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };

  const current = getFromStorage<ProductReview[]>(REVIEWS_STORAGE_KEY, []);
  saveToStorage(REVIEWS_STORAGE_KEY, [newReview, ...current]);
  return newReview;
}

// ==================== CART OPERATIONS ====================

export function getCart(): CartItem[] {
  return getFromStorage<CartItem[]>(CART_STORAGE_KEY, []);
}

export function saveCart(items: CartItem[]): void {
  saveToStorage(CART_STORAGE_KEY, items);
}

export function openCartDrawer(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vibe-open-cart'));
  }
}

export function addToCart(product: CartItem['product']): CartItem[] {
  const cart = getCart();
  const existing = cart.find((item) => item.product.id === product.id);

  let updated: CartItem[];
  if (existing) {
    // For digital products (E-books), 1 copy per customer order is standard; keep quantity as 1
    updated = cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: 1 } : item
    );
  } else {
    updated = [...cart, { product, quantity: 1 }];
  }

  saveCart(updated);
  return updated;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart();
  const updated = cart.filter((item) => item.product.id !== productId);
  saveCart(updated);
  return updated;
}

export function clearCart(): void {
  saveCart([]);
}

/**
 * Fetch an order from the Central Database (used when customer created order on mobile and opens on PC)
 */
export async function fetchOrderFromCentralDb(orderId: string): Promise<Order | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.order) {
      const currentOrders = getAllOrders();
      if (!currentOrders.some((o) => o.id.toUpperCase() === data.order.id.toUpperCase())) {
        saveToStorage(ORDERS_STORAGE_KEY, [data.order, ...currentOrders]);
      }
      return data.order;
    }
  } catch (err) {
    console.warn('fetchOrderFromCentralDb error:', err);
  }
  return null;
}
