import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Sparkles, Smartphone, Globe, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-800/80 bg-gray-950/80 backdrop-blur-md text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-glow">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>VIBE DIGITAL STORE</span>
            </div>
            <p className="text-gray-400 max-w-md text-xs sm:text-sm leading-relaxed">
              แพลตฟอร์มจำหน่าย E-Book และสินค้าดิจิทัลแบบครบวงจร พัฒนาด้วยเทคนิค <strong>Vibe Coding</strong> (Next.js + Tailwind + Supabase BaaS + Resend Email) พร้อมระบบ Android Mobile Wrapper ด้วย MIT App Inventor
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/60 text-indigo-400 border border-indigo-800/50">Next.js 14</span>
              <span className="px-2.5 py-1 rounded-md bg-violet-950/60 text-violet-400 border border-violet-800/50">Tailwind CSS</span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">Supabase Ready</span>
              <span className="px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-400 border border-amber-800/50">Mock Payment</span>
              <span className="px-2.5 py-1 rounded-md bg-sky-950/60 text-sky-400 border border-sky-800/50">MIT App Inventor</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">เมนูด่วน</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">หน้าร้านค้าดิจิทัล</Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-indigo-400 transition-colors">ติดตามคำสั่งซื้อ (Track Order)</Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-indigo-400 transition-colors">คำถามที่พบบ่อย (FAQ)</Link>
              </li>
            </ul>
          </div>

          {/* Project compliance */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">ข้อกำหนดโครงการ</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Customer-Facing Only
              </li>
              <li className="flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Mock Payment (DEMO ONLY)
              </li>
              <li className="flex items-center gap-1.5 text-sky-400">
                <Smartphone className="w-3.5 h-3.5" /> Android WebViewer Ready
              </li>
              <li className="flex items-center gap-1.5 text-indigo-400">
                <Globe className="w-3.5 h-3.5" /> Vercel Deployment Ready
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Vibe Digital Store — โครงงานวิชาการเพื่อการศึกษา (Educational Demonstration Project)</p>
          <p className="text-amber-400/80 bg-amber-950/30 px-3 py-1 rounded border border-amber-800/30">
            ห้ามใช้สำหรับรับเงินจริง • เป็นระบบจำลองสถานะ PENDING → PAID เพื่อการทดสอบ
          </p>
        </div>
      </div>
    </footer>
  );
}
