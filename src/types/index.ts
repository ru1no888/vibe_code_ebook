export type ProductCategory = 'mediaplayer' | 'tarot' | 'taskmanager' | 'ebook';

export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  categoryLabel: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  author: Author;
  badge?: string;
  features: string[];
  tableOfContents?: string[];
  fileSize: string;
  fileFormat: string;
  downloadFileName: string;
  sampleContent?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  downloadToken: string;
  downloadExpiresAt?: string;
  paymentMethod?: 'promptpay' | 'credit_card';
}

export interface EmailNotification {
  id: string;
  to: string;
  customerName: string;
  subject: string;
  orderId: string;
  sentAt: string;
  downloadUrl: string;
  items: {
    title: string;
    price: number;
    fileFormat: string;
  }[];
  totalAmount: number;
}
