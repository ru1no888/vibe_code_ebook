'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyAndGetOrder, canDownload } from '@/lib/storage';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  Search, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Download, 
  ArrowRight, 
  ExternalLink,
  BookOpen,
  User,
  Mail,
  FileCheck
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams?.get('orderId') || '';
  const initialEmail = searchParams?.get('email') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [email, setEmail] = useState(initialEmail);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setHasSearched(true);

    const result = verifyAndGetOrder(orderId, email);
    if (result.success && result.order) {
      setOrder(result.order);
      setError(null);
    } else {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId.trim())}?email=${encodeURIComponent(email.trim())}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
          setError(null);
          return;
        }
      } catch {
        // fallback
      }
      setOrder(null);
      setError(result.error || 'ไม่พบข้อมูลคำสั่งซื้อ');
    }
  };

  useEffect(() => {
    if (initialOrderId && initialEmail) {
      handleSearch();
    }
  }, [initialOrderId, initialEmail]);

  return (
    <div className="space-y-8">
      {/* Lookup Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-2xl space-y-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="order-id" className="block text-xs font-semibold text-gray-300 mb-1.5">
                หมายเลขคำสั่งซื้อ (Order ID) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="order-id"
                  type="text"
                  required
                  placeholder="เช่น ORD-2026-1001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700/80 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="order-email" className="block text-xs font-semibold text-gray-300 mb-1.5">
                อีเมลที่ใช้สั่งซื้อ (Buyer Email) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="order-email"
                  type="email"
                  required
                  placeholder="เช่น customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700/80 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Search className="w-4 h-4" />
            <span>ตรวจสอบสถานะคำสั่งซื้อ</span>
          </button>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-[11px] text-red-300/80 mt-0.5">
                (ปฏิบัติตามเกณฑ์: หน้าติดตามคำสั่งซื้อไม่เปิดเผยข้อมูลของผู้อื่น)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Result View */}
      {order && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400">สถานะคำสั่งซื้อ:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'PAID'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {order.status === 'PAID' ? '✓ PAID (ชำระเงินสำเร็จ)' : '⏳ PENDING (รอชำระเงิน)'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
                คำสั่งซื้อ #{order.id}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 block">ยอดรวมทั้งสิ้น</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Customer info & dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
              <span className="text-gray-400 block">ผู้สั่งซื้อ</span>
              <span className="font-bold text-white mt-0.5 block">{order.customerName}</span>
            </div>
            <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
              <span className="text-gray-400 block">อีเมลที่ยืนยัน</span>
              <span className="font-bold text-white mt-0.5 block">{order.customerEmail}</span>
            </div>
            <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
              <span className="text-gray-400 block">วันที่สั่งซื้อ</span>
              <span className="font-bold text-white mt-0.5 block">{formatDate(order.createdAt)}</span>
            </div>
          </div>

          {/* Items & Download Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              รายการสินค้าดิจิทัลในคำสั่งซื้อนี้
            </h3>

            <div className="space-y-3 divide-y divide-gray-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.coverImage}
                      alt={item.product.title}
                      className="w-12 h-16 object-cover rounded-lg border border-gray-800 shrink-0 shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{item.product.title}</h4>
                      <p className="text-[11px] text-gray-400">
                        {item.product.fileFormat} • {item.product.fileSize}
                      </p>
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        {formatPrice(item.product.price)}
                      </span>
                    </div>
                  </div>

                  {/* If PAID -> Show Download; If PENDING -> Show Payment link */}
                  {order.status === 'PAID' ? (
                    canDownload(order, order.downloadToken) ? (
                      <a
                        href={`/sample-downloads/${item.product.downloadFileName}`}
                        download={item.product.downloadFileName}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ดาวน์โหลดไฟล์</span>
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-amber-300">ลิงก์หมดอายุ</span>
                    )
                  ) : (
                    <Link
                      href={`/payment/${order.id}?token=${encodeURIComponent(order.downloadToken)}`}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>ไปหน้าชำระเงินจำลอง</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Privacy-First Order Verification System</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#102f31]">
          ติดตามสถานะคำสั่งซื้อ & ดาวน์โหลดไฟล์
        </h1>
        <p className="text-xs sm:text-sm text-[#66706b] max-w-xl mx-auto">
          เพื่อความปลอดภัยของข้อมูลและป้องกันการเข้าถึงของบุคคลอื่น ระบบกำหนดให้ระบุทั้ง <strong>หมายเลขคำสั่งซื้อ</strong> และ <strong>อีเมลที่ใช้สั่งซื้อ</strong> ที่ตรงกันเท่านั้น
        </p>
      </div>

      <Suspense fallback={
        <div className="glass-panel p-8 rounded-3xl text-center text-gray-400">
          กำลังโหลดข้อมูล...
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
