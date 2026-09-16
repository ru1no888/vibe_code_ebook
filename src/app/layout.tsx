import type { Metadata, Viewport } from 'next';
import './globals.css';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Vibe Store — ร้านขายสินค้า Digital Product & E-Book แบบครบวงจร',
  description: 'แพลตฟอร์มสั่งซื้อ E-Book และสินค้าดิจิทัลแบบจำลอง (Vibe Coding + Next.js + Supabase + MIT App Inventor)',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col antialiased">
        <a href="#main-content" className="skip-link">ข้ามไปเนื้อหาหลัก</a>
        <DemoBanner />
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
