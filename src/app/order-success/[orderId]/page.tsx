'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getAuthorizedOrder, getOrderById, getSimulatedEmails, canDownload, generateMailtoLink, fetchOrderFromCentralDb } from '@/lib/storage';
import { Order, EmailNotification } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  CheckCircle2, 
  Download, 
  Mail, 
  ArrowRight, 
  BookOpen, 
  Printer, 
  Share2, 
  FileCheck,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import SimulatedInboxModal from '@/components/SimulatedInboxModal';

function OrderSuccessContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = (params?.orderId as string)?.toUpperCase();
  const accessToken = searchParams.get('token') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sentEmail, setSentEmail] = useState<EmailNotification | null>(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      // 1. Try authorized lookup with token first
      // 2. Fall back to getOrderById from local storage (ensures mobile WebViewer compatibility)
      const found = getAuthorizedOrder(orderId, accessToken) || getOrderById(orderId);
      if (found) {
        if (found.status === 'PAID') {
          setOrder(found);

          // Find corresponding email
          const emails = getSimulatedEmails();
          const matched = emails.find((e) => e.orderId === found.id);
          if (matched) {
            setSentEmail(matched);
          }
        } else {
          // If still PENDING, redirect to payment screen so customer can simulate payment
          router.replace(`/payment/${found.id}?token=${encodeURIComponent(found.downloadToken)}`);
        }
        setIsLoading(false);
      } else {
        fetchOrderFromCentralDb(orderId).then((dbOrder) => {
          if (dbOrder) {
            if (dbOrder.status === 'PAID') {
              setOrder(dbOrder);
            } else {
              router.replace(`/payment/${dbOrder.id}?token=${encodeURIComponent(dbOrder.downloadToken)}`);
            }
          }
          setIsLoading(false);
        });
      }
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.4 },
      });
    } catch {
      // ignore
    }
  }, [orderId, accessToken]);

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
        <p className="text-[#102f31] font-semibold text-sm">กำลังโหลดข้อมูลคำสั่งซื้อ {orderId}...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#102f31]">ไม่พบคำสั่งซื้อ {orderId}</h2>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
        >
          กลับไปหน้าร้านค้า
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Success banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 text-center space-y-4 bg-gradient-to-b from-emerald-950/40 via-gray-900/80 to-gray-950 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-glow-emerald">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Payment Completed (สถานะ: PAID)
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            การสั่งซื้อและชำระเงินสำเร็จเรียบร้อย!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            คำสั่งซื้อหมายเลข <strong>#{order.id}</strong> ได้รับการยืนยันแล้ว สามารถดาวน์โหลดไฟล์ดิจิทัลได้ทันที
          </p>
        </div>

        {/* Email Dispatch Notice */}
        <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-left">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-white font-medium">ส่งลิงก์ดาวน์โหลดไปยังอีเมลแล้ว</p>
              <p className="text-gray-400 text-xs">{order.customerEmail}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <a
              href={generateMailtoLink(order)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1"
              title="เปิดในแอป Mail เพื่อส่งเข้ากล่องจดหมายจริงของคุณ"
            >
              <span>ส่งเข้าแอป Mail ✉️</span>
            </a>
            <button
              onClick={() => setIsInboxOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              เปิดดูอีเมลจำลอง 📩
            </button>
          </div>
        </div>
      </div>

      {/* Main Delivery & Download Card */}
      <div className="glass-panel rounded-3xl border border-gray-800 p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-400" />
              รายการไฟล์ดิจิทัลพร้อมดาวน์โหลด (Digital Delivery)
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              คลิกปุ่มดาวน์โหลดเพื่อรับไฟล์ลงเครื่องของคุณได้ทันที
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์ใบเสร็จ</span>
          </button>
        </div>

        {/* Product Download List */}
        <div className="space-y-4 divide-y divide-gray-800/80">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.product.coverImage}
                  alt={item.product.title}
                  className="w-16 h-20 object-cover rounded-xl border border-gray-800 shrink-0 shadow-md"
                />
                <div>
                  <span className="text-[10px] text-indigo-400 uppercase font-semibold">
                    {item.product.categoryLabel}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">{item.product.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>รูปแบบ: {item.product.fileFormat}</span>
                    <span>•</span>
                    <span>ขนาด: {item.product.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Instant Download Button */}
              {canDownload(order, order.downloadToken) ? (
                <a
                  href={`/sample-downloads/${item.product.downloadFileName}`}
                  download={item.product.downloadFileName}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-glow flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดไฟล์ ({item.product.downloadFileName.split('.').pop()?.toUpperCase()})</span>
                </a>
              ) : (
                <span className="text-xs font-semibold text-amber-300">ลิงก์ดาวน์โหลดหมดอายุแล้ว</span>
              )}
            </div>
          ))}
        </div>

        {/* Order Details & Receipt */}
        <div className="pt-6 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="glass-panel p-3.5 rounded-xl">
            <span className="text-gray-400 block mb-1">หมายเลขคำสั่งซื้อ</span>
            <span className="font-mono font-bold text-white text-sm">{order.id}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl">
            <span className="text-gray-400 block mb-1">ชื่อผู้สั่งซื้อ</span>
            <span className="font-bold text-white text-sm">{order.customerName}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl">
            <span className="text-gray-400 block mb-1">วันที่ชำระเงิน</span>
            <span className="font-bold text-white text-sm">
              {order.paidAt ? formatDate(order.paidAt) : formatDate(order.createdAt)}
            </span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl">
            <span className="text-gray-400 block mb-1">ยอดชำระสุทธิ</span>
            <span className="font-mono font-extrabold text-emerald-400 text-sm">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/track-order?orderId=${order.id}`}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium"
          >
            <span>เปิดหน้าติดตามคำสั่งซื้อนี้อีกครั้ง</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <span>กลับสู่หน้าแรก</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Simulated Email Modal */}
      <SimulatedInboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
        <p className="text-[#102f31] font-semibold text-sm">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
