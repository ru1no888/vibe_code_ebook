import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Sparkles, Smartphone, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#2f4c50] bg-[#102a2f] text-sm text-[#c4d2cf]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c85f35] text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>VIBE BOOKS</span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#c4d2cf] sm:text-sm">
              ร้าน E-book สาธิตจากผลงานจริง 3 โปรเจกต์ สร้างด้วย Next.js 16 และเปิดบน Android ผ่าน MIT App Inventor WebViewer
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Next.js 16', 'Tailwind CSS', 'Mock Payment', 'MIT App Inventor'].map((item) => (
                <span key={item} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[#dbe5e2]">{item}</span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">เมนูด่วน</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-[#e8b18f]">หน้าร้าน E-book</Link>
              </li>
              <li>
                <Link href="/track-order" className="transition-colors hover:text-[#e8b18f]">ติดตามคำสั่งซื้อ</Link>
              </li>
              <li>
                <Link href="/#catalog" className="transition-colors hover:text-[#e8b18f]">เลือกหนังสือ</Link>
              </li>
            </ul>
          </div>

          {/* Project compliance */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-white">ขอบเขตโครงการ</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-[#b9d3a8]">
                <ShieldCheck className="w-3.5 h-3.5" /> Customer-Facing Only
              </li>
              <li className="flex items-center gap-1.5 text-[#e8b18f]">
                <Sparkles className="w-3.5 h-3.5" /> Mock Payment (DEMO ONLY)
              </li>
              <li className="flex items-center gap-1.5 text-[#b7d7dc]">
                <Smartphone className="w-3.5 h-3.5" /> Android WebViewer Ready
              </li>
              <li className="flex items-center gap-1.5 text-[#d5c9b8]">
                <Globe className="w-3.5 h-3.5" /> Vercel Deployment Ready
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[#9fb0ad] sm:flex-row">
          <p>© 2026 Vibe Digital Store — โครงงานวิชาการเพื่อการศึกษา (Educational Demonstration Project)</p>
          <p className="rounded border border-[#c85f35]/50 bg-[#c85f35]/10 px-3 py-1 text-[#f0c3a8]">
            ห้ามใช้สำหรับรับเงินจริง • เป็นระบบจำลองสถานะ PENDING → PAID เพื่อการทดสอบ
          </p>
        </div>
      </div>
    </footer>
  );
}
