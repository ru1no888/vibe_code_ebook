'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCart, createOrder, clearCart, removeFromCart } from '@/lib/storage';
import { PRODUCTS } from '@/data/products';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  User, 
  Mail, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Trash2
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'credit_card'>('promptpay');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const syncCart = () => {
    const currentCart = getCart();
    if (currentCart.length === 0 && PRODUCTS.length > 0) {
      setCart([{ product: PRODUCTS[0], quantity: 1 }]);
    } else {
      setCart(currentCart);
    }
  };

  useEffect(() => {
    syncCart();

    const handleStorageChange = () => {
      syncCart();
    };

    window.addEventListener('vibe-storage-updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('vibe-storage-updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!customerName.trim()) {
      setError('กรุณากรอกชื่อ-นามสกุลของคุณ');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail.trim())) {
      setError('กรุณากรอกอีเมลที่ถูกต้อง (ระบบจะส่งลิงก์ดาวน์โหลดไปยังอีเมลนี้)');
      return;
    }

    if (cart.length === 0) {
      setError('ไม่มีสินค้าในรายการสั่งซื้อ');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order with initial status 'PENDING'
      const newOrder = createOrder(
        customerName.trim(),
        customerEmail.trim(),
        cart,
        paymentMethod
      );

      // 2. Clear cart
      clearCart();

      // 3. Redirect to Mock Payment screen
      router.push(`/payment/${newOrder.id}?token=${encodeURIComponent(newOrder.downloadToken)}`);
    } catch (err: any) {
      setError('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#66706b] hover:text-[#b44924] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>เลือกสินค้าเพิ่มเติม</span>
      </Link>

      {/* Page Title */}
      <div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
          Step 1 of 2: Checkout & Customer Info
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102f31]">
          ยืนยันการสั่งซื้อสินค้าดิจิทัล
        </h1>
        <p className="text-xs sm:text-sm text-[#66706b] mt-1">
          กรอกข้อมูลผู้รับเพื่อสร้างหมายเลขคำสั่งซื้อ (สถานะเริ่มต้น: PENDING)
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Form & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Details Box */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
              <User className="w-4 h-4 text-indigo-400" />
              ข้อมูลผู้สั่งซื้อ (สำหรับจัดส่งลิงก์ดาวน์โหลด)
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="customer-name" className="block text-xs font-medium text-gray-300 mb-1.5">
                  ชื่อ - นามสกุล หรือ นามปากกา <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="customer-name"
                    type="text"
                    required
                    placeholder="เช่น สมชาย ใจดี หรือ DevVibe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700/80 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customer-email" className="block text-xs font-medium text-gray-300 mb-1.5">
                  อีเมล (สำหรับรับไฟล์และติดตามคำสั่งซื้อ) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="customer-email"
                    type="email"
                    required
                    placeholder="เช่น your-email@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700/80 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  🔒 สำคัญ: อีเมลนี้จะใช้สำหรับยืนยันตัวตนในหน้าติดตามคำสั่งซื้อ เพื่อป้องกันข้อมูลรั่วไหล
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              ช่องทางจำลองการชำระเงิน (Mock Payment)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'promptpay'
                    ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value="promptpay"
                  checked={paymentMethod === 'promptpay'}
                  onChange={() => setPaymentMethod('promptpay')}
                  className="sr-only"
                />
                <QrCode className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">PromptPay QR</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">DEMO</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">สแกน QR Code จำลองเพื่อยืนยัน</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'credit_card'
                    ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">บัตรเครดิต/เดบิต</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">DEMO</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">ทดสอบชำระด้วยเลขบัตรจำลอง</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
                สรุปรายการคำสั่งซื้อ
              </span>
              <span className="text-xs text-indigo-400 font-normal">{cart.length} รายการ</span>
            </h3>

            {/* Item list */}
            <div className="space-y-3 divide-y divide-gray-800/80 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.product.coverImage}
                    alt={item.product.title}
                    className="w-12 h-14 object-cover rounded-lg border border-gray-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-white truncate">{item.product.title}</h4>
                    <span className="text-[10px] text-gray-400 block">{item.product.fileFormat}</span>
                    <span className="text-xs font-bold text-indigo-400 font-mono">
                      {formatPrice(item.product.price)}
                    </span>
                  </div>
                  {cart.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-gray-400 hover:text-rose-400 transition-colors"
                      title="ลบเล่มนี้ออกจากรายการสั่งซื้อ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-gray-800 pt-4 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-400">
                <span>ยอดรวมสินค้า</span>
                <span className="font-mono">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>การส่งมอบไฟล์ดิจิทัล</span>
                <span className="text-emerald-400 font-medium">ส่งทันที (ฟรี)</span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex justify-between font-bold text-base text-white">
                <span>ยอดชำระสุทธิ</span>
                <span className="text-xl font-mono text-indigo-400">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'กำลังสร้างคำสั่งซื้อ...' : 'ยืนยันและไปหน้าจำลองชำระเงิน'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300 text-center space-y-1">
              <p className="font-semibold uppercase tracking-wider">⚡ แจ้งเตือน: ระบบจำลอง (DEMO ONLY)</p>
              <p className="text-gray-400">
                การกดยืนยันจะสร้างเลขคำสั่งซื้อสถานะ <strong>PENDING</strong> และจะไม่มีการหักเงินจริง
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
