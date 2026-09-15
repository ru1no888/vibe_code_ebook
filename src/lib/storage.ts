import { Order, CartItem, EmailNotification, OrderStatus } from '@/types';

const ORDERS_STORAGE_KEY = 'vibe_store_orders_v1';
const CART_STORAGE_KEY = 'vibe_store_cart_v1';
const EMAILS_STORAGE_KEY = 'vibe_store_simulated_emails_v1';

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
  return 'dl_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
}

// ==================== ORDER OPERATIONS ====================

export function getAllOrders(): Order[] {
  return getFromStorage<Order[]>(ORDERS_STORAGE_KEY, INITIAL_DEMO_ORDERS);
}

export function getOrderById(orderId: string): Order | null {
  const orders = getAllOrders();
  return orders.find((o) => o.id.trim().toUpperCase() === orderId.trim().toUpperCase()) || null;
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
    return {
      success: false,
      error: `ไม่พบคำสั่งซื้อหมายเลข "${orderId}" ในระบบ กรุณาตรวจสอบความถูกต้อง`,
    };
  }

  // Strictly verify email to prevent unauthorized data exposure!
  if (foundOrder.customerEmail.trim().toLowerCase() !== cleanEmail) {
    return {
      success: false,
      error: '🔒 การยืนยันตัวตนไม่ผ่าน: อีเมลที่ระบุไม่ตรงกับอีเมลในคำสั่งซื้อนี้ (เพื่อความปลอดภัยของข้อมูลลูกค้า)',
    };
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
  return emailLog;
}

// ==================== CART OPERATIONS ====================

export function getCart(): CartItem[] {
  return getFromStorage<CartItem[]>(CART_STORAGE_KEY, []);
}

export function saveCart(items: CartItem[]): void {
  saveToStorage(CART_STORAGE_KEY, items);
}

export function addToCart(product: CartItem['product']): CartItem[] {
  const cart = getCart();
  const existing = cart.find((item) => item.product.id === product.id);

  let updated: CartItem[];
  if (existing) {
    // For digital products, quantity is usually 1, but we allow increment or keep as 1
    updated = cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
