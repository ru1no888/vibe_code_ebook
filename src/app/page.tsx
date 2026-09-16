'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  Mail,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { addToCart } from '@/lib/storage';
import { formatPrice } from '@/lib/utils';
import { Product, ProductCategory } from '@/types';

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'mediaplayer', label: 'Media Player' },
  { id: 'tarot', label: 'Tarot App' },
  { id: 'taskmanager', label: 'Task Manager' },
];

const BENEFITS = [
  { icon: Download, title: 'ส่งไฟล์ทันที', detail: 'หลังสถานะเป็น PAID' },
  { icon: ShieldCheck, title: 'ทดลองปลอดภัย', detail: 'ไม่มีการตัดเงินจริง' },
  { icon: Smartphone, title: 'ใช้บนมือถือ', detail: 'รองรับ WebViewer' },
  { icon: Mail, title: 'อีเมลจำลอง', detail: 'พร้อมลิงก์ดาวน์โหลด' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const categoryMatches = selectedCategory === 'all' || product.category === selectedCategory;
      const textMatches = !query || [product.title, product.description, product.categoryLabel]
        .some((value) => value.toLowerCase().includes(query));
      return categoryMatches && textMatches;
    });
  }, [selectedCategory, searchQuery]);

  const addProduct = (product: Product) => {
    addToCart(product);
    setToastMessage(`เพิ่ม “${product.title}” แล้ว`);
    window.setTimeout(() => setToastMessage(null), 2600);
  };

  return (
    <div className="pb-20">
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-lg bg-[#102a2f] px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:translate-x-0"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#b9d3a8]" />
          <span className="line-clamp-2">{toastMessage}</span>
        </div>
      )}

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-8 lg:pb-20">
        <div>
          <div className="eyebrow mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-[#c85f35]" />
            Vibe Coding E-book Shop
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.13] tracking-[-0.035em] text-[#102a2f] sm:text-5xl lg:text-6xl">
            คู่มือสร้างแอปจริง<br />อ่านง่าย ทำตามได้
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#4f6264] sm:text-lg">
            รวม 3 E-book จากผลงานจริง: Media Player, Tarot App และ Task Manager
            พร้อม Source Code ตัวอย่างและ flow สั่งซื้อแบบจำลองครบวงจร
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#catalog" className="button-primary">
              เลือกหนังสือ <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/track-order" className="button-secondary">
              <Search className="h-4 w-4" /> ติดตามคำสั่งซื้อ
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4f6264]">
            {['3 เล่มพร้อมอ่าน', 'Mock Payment', 'รองรับมือถือ'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#607b56]" /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-3 top-8 h-[88%] w-full rotate-[-3deg] rounded-xl bg-[#c85f35] sm:-left-6" />
          <div className="relative overflow-hidden rounded-xl border border-[#c8bda9] bg-[#102a2f] p-3 shadow-2xl sm:p-5">
            <img
              src={PRODUCTS[0].coverImage}
              alt={PRODUCTS[0].title}
              className="aspect-[16/10] w-full rounded-lg object-cover"
            />
            <div className="flex items-center justify-between gap-4 px-1 pb-1 pt-4 text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e8b18f]">Featured edition</p>
                <p className="mt-1 text-sm font-semibold sm:text-base">เรียนจากโปรเจกต์ที่รันได้จริง</p>
              </div>
              <div className="status-pill shrink-0"><Clock3 className="h-3.5 w-3.5" /> 48 ชม.</div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="จุดเด่นของร้าน" className="border-y border-[#d9cfbf] bg-[#fffdf8]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {BENEFITS.map(({ icon: Icon, title, detail }, index) => (
            <div key={title} className={`flex gap-3 px-3 py-5 sm:px-5 ${index ? 'border-l border-[#e4dacb]' : ''}`}>
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#c85f35]" />
              <div><h2 className="text-sm font-extrabold text-[#183036]">{title}</h2><p className="mt-0.5 text-xs text-[#667779]">{detail}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">Curated collection</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102a2f] sm:text-4xl">เลือกเล่มที่อยากสร้างต่อ</h2>
            <p className="mt-2 text-sm leading-7 text-[#667779]">ทุกเล่มมีคำอธิบาย เนื้อหาตัวอย่าง ราคา และไฟล์ทดสอบครบ</p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71807e]" />
            <input
              aria-label="ค้นหาหนังสือ"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ค้นหาชื่อหรือหัวข้อ..."
              className="w-full rounded-lg border border-[#bfc5bd] bg-[#fffdf8] py-3 pl-10 pr-4 text-sm text-[#183036] placeholder:text-[#7a8987]"
            />
          </div>
        </div>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2" aria-label="กรองตามหมวดหมู่">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                selectedCategory === category.id
                  ? 'border-[#102a2f] bg-[#102a2f] text-white'
                  : 'border-[#c8bda9] bg-[#fffdf8] text-[#4f6264] hover:border-[#c85f35] hover:text-[#a54727]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {filteredProducts.length ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <article key={product.id} className="interactive-card group flex flex-col overflow-hidden">
                <Link href={`/product/${product.id}`} className="relative block overflow-hidden bg-[#d8d0c2]">
                  <img src={product.coverImage} alt={product.title} className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
                  <span className="absolute left-3 top-3 rounded-md bg-[#fffdf8]/95 px-2.5 py-1 text-[11px] font-extrabold text-[#102a2f] shadow-sm">เล่ม {index + 1}</span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-[#a54727]">{product.categoryLabel}</span>
                    <span className="flex items-center gap-1 text-[#566765]"><Star className="h-3.5 w-3.5 fill-[#c85f35] text-[#c85f35]" /> {product.rating}</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-lg font-black leading-7 text-[#183036]">
                    <Link href={`/product/${product.id}`} className="hover:text-[#a54727]">{product.title}</Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667779]">{product.description}</p>
                  <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#e3dacb] pt-4">
                    <div><p className="text-xs text-[#71807e]">ราคา Demo</p><p className="text-xl font-black text-[#102a2f]">{formatPrice(product.price)}</p></div>
                    <div className="flex gap-2">
                      <Link href={`/product/${product.id}`} aria-label={`ดูรายละเอียด ${product.title}`} className="button-secondary !min-h-10 !px-3"><ExternalLink className="h-4 w-4" /></Link>
                      <button type="button" onClick={() => addProduct(product)} className="button-primary !min-h-10 !px-3"><ShoppingBag className="h-4 w-4" /> สั่งซื้อ</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div role="status" className="surface-panel mt-7 py-14 text-center">
            <BookOpen className="mx-auto h-9 w-9 text-[#81908d]" />
            <p className="mt-3 font-bold text-[#183036]">ไม่พบหนังสือที่ตรงกับคำค้น</p>
            <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="button-secondary mt-4">ล้างตัวกรอง</button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-xl bg-[#102a2f] text-white lg:grid-cols-[1fr_.85fr]">
          <div className="p-7 sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#e8b18f]">How it works</p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">ซื้อแบบ Demo เห็นทุกสถานะ</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#cfdbd8]">เลือกรายการ กรอกอีเมล สร้าง Order PENDING กดจำลองชำระ แล้วรับอีเมลพร้อมลิงก์ดาวน์โหลดชั่วคราว</p>
          </div>
          <ol className="grid border-t border-white/10 bg-[#17383d] sm:grid-cols-3 lg:border-l lg:border-t-0">
            {['เลือกเล่ม', 'จำลองจ่าย', 'รับไฟล์'].map((step, index) => (
              <li key={step} className="flex items-center gap-3 border-b border-white/10 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:flex-col lg:items-start lg:justify-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c85f35] text-sm font-black">{index + 1}</span>
                <span className="font-bold">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
