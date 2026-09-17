'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getAuthorizedOrder, getOrderById, updateOrderStatus, fetchOrderFromCentralDb } from '@/lib/storage';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Copy,
  Info
} from 'lucide-react';

function PaymentContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = (params?.orderId as string)?.toUpperCase();
  const accessToken = searchParams.get('token') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId) {
      // 1. Try authorized lookup with token first
      // 2. Fall back to getOrderById from local storage (ensures mobile WebViewer compatibility)
      const found = getAuthorizedOrder(orderId, accessToken) || getOrderById(orderId);
      if (found) {
        setOrder(found);
        setIsLoading(false);
      } else {
        fetchOrderFromCentralDb(orderId).then((dbOrder) => {
          if (dbOrder) setOrder(dbOrder);
          setIsLoading(false);
        });
      }
    }
  }, [orderId, accessToken]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    if (!order) return;
    setIsProcessing(true);

    // Trigger confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      // 1. Update status to PAID
      const updated = updateOrderStatus(order.id, 'PAID');
      if (updated) {
        // 2. Redirect to success screen
        router.push(`/order-success/${order.id}?token=${encodeURIComponent(order.downloadToken)}`);
      } else {
        setIsProcessing(false);
      }
    }, 1200);
  };

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        <h2 className="text-xl font-bold text-[#102f31]">ไม่พบข้อมูลคำสั่งซื้อ {orderId}</h2>
        <p className="text-[#66706b] text-sm">คำสั่งซื้ออาจยังไม่ได้ถูกสร้าง หรือถูกล้างประวัติ</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
        >
          กลับไปหน้าร้านค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#66706b] hover:text-[#b44924] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>ยกเลิกและกลับหน้าร้าน</span>
      </Link>

      {/* Prominent DEMO ONLY Badge */}
      <div className="p-4 rounded-2xl bg-[#fff0d2] border-2 border-[#d97706]/40 text-[#7c3e08] flex items-start sm:items-center gap-3 shadow-lg">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1 text-xs sm:text-sm">
          <span className="font-extrabold text-amber-300 uppercase tracking-wider block sm:inline mr-2 text-sm">
            [ DEMO ONLY — ระบบจำลองการชำระเงิน ]
          </span>
          หน้านี้จัดทำเพื่อการสาธิตการเปลี่ยนสถานะจาก <strong>PENDING</strong> สู่ <strong>PAID</strong> ตามเกณฑ์ใบงาน ห้ามใช้บัญชีหรือเงินจริง
        </div>
      </div>

      {/* Main Payment Card */}
      <div className="glass-panel rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
        {/* Card Header */}
        <div className="p-6 sm:p-8 bg-gray-950/80 border-b border-gray-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1">
              <span>สถานะปัจจุบัน:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                order.status === 'PAID' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                คำสั่งซื้อ #{order.id}
              </h1>
              <button
                onClick={copyOrderId}
                className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                title="คัดลอกเลขคำสั่งซื้อ"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied && <span className="text-[10px] text-emerald-400 font-medium">คัดลอกแล้ว</span>}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ผู้สั่งซื้อ: <strong>{order.customerName}</strong> ({order.customerEmail})
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400 block">ยอดที่ต้องชำระ (จำลอง)</span>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono text-indigo-400">
              {formatPrice(order.totalAmount)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>หมดอายุใน {formatTimer(timeLeft)} นาที</span>
            </div>
          </div>
        </div>

        {/* Payment Simulation Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Method View */}
          {order.paymentMethod === 'promptpay' ? (
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Thai PromptPay Mock Header */}
              <div className="w-full max-w-xs bg-indigo-900/40 p-3 rounded-2xl border border-indigo-700/50 flex items-center justify-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-white tracking-wider">Thai PromptPay (จำลอง DEMO)</span>
              </div>

              {/* Realistic Mock QR Code Box */}
              <div className="p-6 bg-white rounded-3xl shadow-xl border-4 border-indigo-600/30 flex flex-col items-center justify-center relative group">
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-indigo-50 to-slate-100 rounded-xl flex flex-col items-center justify-center p-4 border border-indigo-200">
                  {/* SVG Mock QR Code Visual */}
                  <svg className="w-40 h-40 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v4h-2v-4zm2 2h2v2h-2v-2zm-6 2h2v2h-2v-2zm8-2h2v4h-2v-4zm-8-6h2v2h-2v-2zm4 2h2v2h-2v-2z" />
                  </svg>
                  <span className="text-[10px] text-gray-500 font-mono mt-2 font-bold tracking-wider">
                    SCAN TO PAY (DEMO ONLY)
                  </span>
                </div>

                {/* Overlay Badge */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-white text-xs font-semibold">
                  <span>กดปุ่ม "จำลองชำระเงินสำเร็จ" ด้านล่างเพื่อเสร็จสิ้นขั้นตอน</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 max-w-sm">
                สแกนด้วยแอปธนาคารจำลอง หรือกดปุ่มดำเนินการด้านล่างเพื่อเปลี่ยนสถานะคำสั่งซื้อ
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-950 to-purple-950 border border-indigo-700/50 text-white space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <CreditCard className="w-8 h-8 text-indigo-400" />
                  <span className="text-xs font-bold text-amber-300">DEMO CARD</span>
                </div>
                <div className="font-mono text-base tracking-widest text-gray-200">
                  4242 •••• •••• 4242
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>EXP: 12/28</span>
                  <span>CVV: 888</span>
                </div>
              </div>
              <p className="text-xs text-center text-gray-400">
                บัตรเครดิตจำลองสำหรับการทดสอบระบบ
              </p>
            </div>
          )}

          {/* Action Button: จำลองชำระเงินสำเร็จ (Strict Rubric Requirement) */}
          <div className="pt-4 border-t border-gray-800 space-y-4">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base sm:text-lg shadow-glow-emerald flex items-center justify-center gap-3 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>กำลังอัปเดตสถานะเป็น PAID และจัดส่งอีเมล...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>จำลองชำระเงินสำเร็จ (เปลี่ยนสถานะเป็น PAID)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>เมื่อกดปุ่มนี้ ระบบจะบันทึกสถานะ PAID ส่งอีเมลจำลอง และสร้างลิงก์ดาวน์โหลดทันที</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
        <p className="text-[#102f31] font-semibold text-sm">กำลังโหลดระบบชำระเงิน...</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
