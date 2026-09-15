'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { ProductCategory, Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { addToCart } from '@/lib/storage';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Star, 
  Download, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Layers,
  Code,
  Layout,
  Music,
  CreditCard,
  CheckSquare,
  ExternalLink
} from 'lucide-react';

const CATEGORIES: { id: ProductCategory | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'ทั้งหมด (All 3 Projects)', icon: Layers },
  { id: 'mediaplayer', label: 'งานที่ 1: ฟังเพลง (Media Player)', icon: Music },
  { id: 'tarot', label: 'งานที่ 2: ดูไพ่ทาโรต์ (Tarot App)', icon: Sparkles },
  { id: 'taskmanager', label: 'งานที่ 3: จัดการงาน (Task Manager)', icon: CheckSquare },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast(`เพิ่ม "${product.title}" ลงในตะกร้าแล้ว`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-indigo-400/40 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-6 shadow-glow">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Vibe Coding: E-Book & Digital Products Store</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          สร้างไอเดียดิจิทัล ให้เป็น{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            รายได้จริง
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          ระบบขายสินค้าดิจิทัลและ E-Book แบบครบวงจร ซื้อง่าย จ่ายจำลอง (Demo Only) ได้รับไฟล์ทันที พร้อมเปิดใช้งานลื่นไหลทั้งบน Web และ Mobile App (MIT App Inventor)
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#catalog"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm sm:text-base shadow-glow flex items-center gap-2 transition-all hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>เลือกชมสินค้าในร้าน</span>
          </a>
          <Link
            href="/track-order"
            className="px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700/80 font-semibold text-sm sm:text-base flex items-center gap-2 transition-all"
          >
            <Search className="w-4 h-4 text-indigo-400" />
            <span>ค้นหา / ติดตามคำสั่งซื้อ</span>
          </Link>
        </div>

        {/* Feature Highlights Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">ดาวน์โหลดทันที</h4>
              <p className="text-[11px] text-gray-400">รับไฟล์ทันทีหลังชำระเงิน</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Mock Payment</h4>
              <p className="text-[11px] text-gray-400">ปลอดภัย DEMO ONLY</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Mobile Ready</h4>
              <p className="text-[11px] text-gray-400">รองรับ App Inventor</p>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">อีเมลแจ้งเตือน</h4>
              <p className="text-[11px] text-gray-400">ส่งลิงก์ดาวน์โหลดทางอีเมล</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Catalog & Products</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">สินค้าดิจิทัลและ E-Book ทั้งหมด</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              พบ {filteredProducts.length} รายการที่พร้อมให้คุณดาวน์โหลดไปใช้งาน
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อหนังสือ หรือคีย์เวิร์ด..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700/80 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-glow'
                    : 'bg-gray-900/80 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-gray-400 glass-panel rounded-2xl">
            <BookOpen className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-base font-semibold text-gray-300">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
            <p className="text-xs text-gray-500 mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นดูครับ</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-gray-800 text-xs text-indigo-400 hover:bg-gray-700 font-medium"
            >
              ล้างการค้นหา
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-gray-800/80 hover:border-indigo-500/50"
              >
                {/* Product Cover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-950">
                  <img
                    src={product.coverImage}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.badge && (
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-600 text-white shadow-md">
                        {product.badge}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 backdrop-blur-md text-gray-300 border border-white/10">
                      {product.categoryLabel}
                    </span>
                  </div>

                  {/* Format pill */}
                  <div className="absolute bottom-3 right-3 text-[10px] px-2 py-0.5 rounded bg-gray-900/80 text-gray-300 backdrop-blur-sm border border-white/10">
                    {product.fileFormat}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Rating & reviews */}
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-2">
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold ml-1 text-white">{product.rating}</span>
                      </div>
                      <span className="text-gray-500">({product.reviewsCount} รีวิว)</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/product/${product.id}`}>{product.title}</Link>
                    </h3>

                    {/* Short Description */}
                    <p className="mt-2 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg sm:text-xl font-extrabold text-white font-mono">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through font-mono">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 block font-medium">
                        ดาวน์โหลดทันที
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/product/${product.id}`}
                        className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-medium transition-colors"
                        title="ดูรายละเอียดสินค้า"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-glow hover:scale-105"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>สั่งซื้อ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tech Architecture & Education Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Vibe Coding & System Architecture
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              สร้างด้วยเทคโนโลยีที่ทันสมัย เรียนรู้ได้จริง พร้อมสเกลสู่ธุรกิจ
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              โครงงานนี้จัดทำตามใบงานการศึกษา โดยใช้ Next.js 14 สำหรับระบบหน้าร้านและการจัดการคำสั่งซื้อ เชื่อมต่อฐานข้อมูล Supabase BaaS จำลองระบบชำระเงิน (Mock Payment) พร้อมป้ายเตือน DEMO ONLY ตามระเบียบข้อบังคับ และสร้าง Android Mobile App ผ่าน MIT App Inventor WebViewer เพื่อให้ผู้เรียนเห็นเส้นทางครบตั้งแต่ไอเดีย สู่เว็บ และสู่โมบายแอป
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-800/80">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white">1. สั่งซื้อง่าย</span>
              <p className="text-xs text-gray-400">กรอกเพียงชื่อและอีเมล ระบบสร้าง Order ID สถานะ PENDING ทันที</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-white">2. ชำระเงินจำลอง</span>
              <p className="text-xs text-gray-400">สแกน QR จำลอง กดปุ่มชำระเงินสำเร็จเพื่อเปลี่ยนสถานะเป็น PAID</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-white">3. ส่งมอบทางอีเมล</span>
              <p className="text-xs text-gray-400">รับลิงก์ดาวน์โหลดชั่วคราวทางอีเมล พร้อมดาวน์โหลดได้ทันที</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
