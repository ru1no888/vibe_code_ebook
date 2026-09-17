'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  Mail, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  ArrowLeft,
  Copy,
  Check,
  Send,
  Database,
  Radio
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

interface AdminData {
  success: boolean;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    paidCount: number;
    pendingCount: number;
  };
  orders: Order[];
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | OrderStatus>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [prevOrdersCount, setPrevOrdersCount] = useState<number>(0);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchAdminOrders = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch admin data');
      const json: AdminData = await res.json();
      
      if (json.success) {
        // Detect new order placed from mobile
        if (!isInitial && prevOrdersCount > 0 && json.orders.length > prevOrdersCount) {
          const diff = json.orders.length - prevOrdersCount;
          showToast(`🔔 มีคำสั่งซื้อใหม่เข้ามา ${diff} รายการ!`, 'success');
        }
        setPrevOrdersCount(json.orders.length);
        setData(json);
        setLastRefreshed(new Date());
      }
    } catch (err: any) {
      if (isInitial) {
        showToast('ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้: ' + err.message, 'error');
      }
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, [prevOrdersCount]);

  useEffect(() => {
    fetchAdminOrders(true);
  }, []);

  // Auto-refresh interval (every 5 seconds) to catch mobile orders in real-time
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAdminOrders(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAdminOrders]);

  const handleMarkAsPaid = async (orderId: string) => {
    setActionLoadingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_paid', orderId }),
      });
      const result = await res.json();
      if (result.success) {
        showToast(`อนุมัติคำสั่งซื้อ #${orderId} และส่งอีเมลยืนยันสำเร็จ`, 'success');
        await fetchAdminOrders(false);
      } else {
        showToast(result.error || 'เกิดข้อผิดพลาดในการอนุมัติ', 'error');
      }
    } catch (err: any) {
      showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResendEmail = async (orderId: string) => {
    setActionLoadingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend_email', orderId }),
      });
      const result = await res.json();
      if (result.success) {
        showToast(result.message || 'ส่งอีเมลซ้ำเรียบร้อยแล้ว', 'success');
      } else {
        showToast(result.error || 'ส่งอีเมลไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter & Search
  const filteredOrders = (data?.orders || []).filter((order) => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#f7f4ee] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 animate-bounce">
            <div className={`px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold text-white ${
              toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}>
              {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#e0d6c5] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link 
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c6e68] hover:text-[#102a2f] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                กลับหน้าร้านค้า
              </Link>
              <span className="text-gray-400">•</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
                Central Database Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#102a2f] tracking-tight flex items-center gap-3">
              <span>ระบบหลังบ้านแอดมิน (Admin Dashboard)</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#667779]">
              ศูนย์รวมคำสั่งซื้อจากลูกค้าบนมือถือ (Android / iOS / WebViewer) และคอมพิวเตอร์
            </p>
          </div>

          {/* Real-time Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                autoRefresh
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                  : 'bg-white border-gray-300 text-gray-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
              <span>{autoRefresh ? 'Live Sync (เปิดอยู่)' : 'Live Sync (ปิดอยู่)'}</span>
            </button>

            <button
              onClick={() => fetchAdminOrders(false)}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-[#102a2f] text-white text-xs font-bold hover:bg-[#1e4850] transition-colors flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>รีเฟรชข้อมูล</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e4ded0] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#667779]">ยอดขายรวม (บาท)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#102a2f]">
              {formatPrice(data?.stats.totalRevenue || 0)}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> ชำระเงินสำเร็จ {data?.stats.paidCount || 0} รายการ
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e4ded0] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#667779]">คำสั่งซื้อทั้งหมด</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#102a2f]">
              {data?.stats.totalOrders || 0}
            </div>
            <p className="text-[11px] text-[#667779]">
              บันทึกในฐานข้อมูลส่วนกลาง
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e4ded0] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#667779]">ชำระเงินแล้ว (PAID)</span>
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-800">
              {data?.stats.paidCount || 0}
            </div>
            <p className="text-[11px] text-[#667779]">
              ส่งมอบไฟล์ดาวน์โหลดและส่งอีเมลแล้ว
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e4ded0] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#667779]">รอชำระเงิน (PENDING)</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700">
              {data?.stats.pendingCount || 0}
            </div>
            <p className="text-[11px] text-amber-600">
              รอการชำระหรือยืนยันสลิป
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-[#e4ded0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหา Order ID, ชื่อลูกค้า, หรืออีเมล..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#102a2f] bg-[#fbf9f5]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                filterStatus === 'ALL'
                  ? 'bg-[#102a2f] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ทั้งหมด ({data?.orders.length || 0})
            </button>
            <button
              onClick={() => setFilterStatus('PAID')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                filterStatus === 'PAID'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              ชำระแล้ว ({data?.stats.paidCount || 0})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                filterStatus === 'PENDING'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              รอชำระ ({data?.stats.pendingCount || 0})
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-[#e4ded0] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-black text-[#102a2f] flex items-center gap-2">
              <span>รายการคำสั่งซื้อล่าสุด</span>
              <span className="text-xs font-semibold text-[#667779]">
                (พบ {filteredOrders.length} รายการ)
              </span>
            </h2>
            <span className="text-[11px] text-gray-400">
              อัปเดตล่าสุด: {lastRefreshed.toLocaleTimeString('th-TH')}
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#102a2f] animate-spin mx-auto" />
              <p className="text-sm font-semibold text-gray-600">กำลังดึงข้อมูลคำสั่งซื้อจากฐานข้อมูลส่วนกลาง...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-base font-bold text-gray-700">ไม่พบรายการคำสั่งซื้อที่ค้นหา</p>
              <p className="text-xs text-gray-400">เมื่อลูกค้าทำการสั่งซื้อผ่านมือถือ รายการจะมาปรากฏที่นี่ทันที</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#fcfaf6] text-[#556360] font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3.5">หมายเลขคำสั่งซื้อ (Order ID)</th>
                    <th className="px-5 py-3.5">วันที่และเวลา</th>
                    <th className="px-5 py-3.5">ลูกค้า</th>
                    <th className="px-5 py-3.5">รายการ E-Book</th>
                    <th className="px-5 py-3.5 text-right">ยอดรวม</th>
                    <th className="px-5 py-3.5 text-center">สถานะ</th>
                    <th className="px-5 py-3.5 text-center">จัดการคำสั่งซื้อ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const isPaid = order.status === 'PAID';
                    const isActing = actionLoadingId === order.id;

                    return (
                      <tr key={order.id} className="hover:bg-[#fbf9f4] transition-colors">
                        {/* Order ID */}
                        <td className="px-5 py-4 font-mono font-bold text-[#102a2f]">
                          <div className="flex items-center gap-1.5">
                            <span>{order.id}</span>
                            <button
                              onClick={() => handleCopy(order.id)}
                              className="text-gray-400 hover:text-gray-700"
                              title="คัดลอก Order ID"
                            >
                              {copiedId === order.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#102a2f]">{order.customerName}</div>
                          <div className="text-xs text-gray-500 font-mono">{order.customerEmail}</div>
                        </td>

                        {/* Items */}
                        <td className="px-5 py-4 max-w-xs">
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-xs text-gray-800 line-clamp-1">
                                • {item.product.title}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className="px-5 py-4 text-right font-bold text-[#102a2f]">
                          {formatPrice(order.totalAmount)}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> ชำระเงินแล้ว
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3" /> รอชำระเงิน
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            {/* If pending, Admin can manually mark as PAID */}
                            {!isPaid && (
                              <button
                                onClick={() => handleMarkAsPaid(order.id)}
                                disabled={isActing}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50"
                                title="กดยืนยันชำระเงินและส่งอีเมลหาลูกค้าทันที"
                              >
                                {isActing ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                                <span>อนุมัติชำระเงิน</span>
                              </button>
                            )}

                            {/* If paid, Admin can resend email */}
                            {isPaid && (
                              <button
                                onClick={() => handleResendEmail(order.id)}
                                disabled={isActing}
                                className="px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#102a2f] hover:text-white transition-colors text-xs font-bold flex items-center gap-1 border border-gray-200 disabled:opacity-50"
                                title="ส่งอีเมลใบเสร็จและลิงก์ดาวน์โหลดซ้ำผ่าน Resend"
                              >
                                {isActing ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Send className="w-3 h-3" />
                                )}
                                <span>ส่งเมลซ้ำ</span>
                              </button>
                            )}

                            {/* View Customer Download / Success Screen */}
                            <Link
                              href={`/order-success/${order.id}?token=${order.downloadToken}`}
                              target="_blank"
                              className="px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-200 transition-colors text-xs font-semibold flex items-center gap-1 border border-gray-200"
                              title="เปิดดูหน้าดาวน์โหลดของลูกค้า"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>ดูหน้าลูกค้า</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Developer Integration Note Card */}
        <div className="bg-gradient-to-r from-[#102a2f] to-[#1c444c] rounded-2xl p-6 text-white space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>สถาปัตยกรรมฐานข้อมูลส่วนกลาง (Central Database Architecture)</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            ระบบจัดเก็บคำสั่งซื้อไว้ที่เซิร์ฟเวอร์ส่วนกลาง (Server-side Database) เมื่อลูกค้าสั่งซื้อผ่านสมาร์ทโฟน 
            ระบบจะส่งข้อมูลผ่าน <code>POST /api/orders</code> บันทึกลงฐานข้อมูลส่วนกลางทันที 
            และหน้าแอดมินบนคอมพิวเตอร์จะดึงข้อมูลผ่าน <code>GET /api/admin/orders</code> แบบเรียลไทม์ 
            พร้อมรองรับการส่งอีเมลจริงด้วย <strong>Resend API</strong> ทุกครั้งที่ยืนยันการชำระเงิน
          </p>
        </div>

      </div>
    </div>
  );
}