'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ShoppingBag, Mail, Menu, X } from 'lucide-react';
import { getCart, removeFromCart, getSimulatedEmails } from '@/lib/storage';
import { CartItem } from '@/types';
import CartDrawer from './CartDrawer';
import SimulatedInboxModal from './SimulatedInboxModal';

export default function Navbar() {
  const pathname = usePathname();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [inboxCount, setInboxCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refreshState = () => {
    const currentCart = getCart();
    setCart(currentCart);
    const emails = getSimulatedEmails();
    setInboxCount(emails.length);
  };

  useEffect(() => {
    refreshState();

    const handleStorageChange = () => {
      refreshState();
    };

    window.addEventListener('vibe-storage-updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('vibe-storage-updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleRemoveFromCart = (id: string) => {
    const updated = removeFromCart(id);
    setCart(updated);
  };

  return (
    <>
      <nav aria-label="เมนูหลัก" className="sticky top-0 z-40 border-b border-[#d9cfbf] bg-[#f4efe5]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="group flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#102a2f] text-[#fffdf8] transition-transform group-hover:-rotate-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black tracking-tight text-[#102a2f] transition-colors group-hover:text-[#a54727] sm:text-lg">
                      VIBE BOOKS
                    </span>
                    <span className="rounded border border-[#d5b49f] bg-[#f6e6dc] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#a54727]">
                      DEMO
                    </span>
                  </div>
                  <span className="text-[10px] tracking-wide text-[#667779]">
                    E-books from real projects
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'bg-[#102a2f] text-white'
                    : 'text-[#4f6264] hover:bg-[#e8dfd0] hover:text-[#102a2f]'
                }`}
              >
                หน้าร้านค้า
              </Link>
              <Link
                href="/track-order"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/track-order'
                    ? 'bg-[#102a2f] text-white'
                    : 'text-[#4f6264] hover:bg-[#e8dfd0] hover:text-[#102a2f]'
                }`}
              >
                🔍 ติดตามคำสั่งซื้อ
              </Link>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Simulated Inbox button */}
              <button
                onClick={() => setIsInboxOpen(true)}
                className="relative flex items-center gap-1.5 rounded-lg border border-[#bfc5bd] bg-[#fffdf8] px-3 py-2 text-xs font-bold text-[#334b4f] transition-colors hover:border-[#8b9996] sm:text-sm"
                title="เปิดดูกล่องจดหมายจำลองสำหรับการส่งอีเมล"
              >
                <Mail className="h-4 w-4 text-[#a54727]" />
                <span className="hidden sm:inline">กล่องอีเมลจำลอง</span>
                {inboxCount > 0 && (
                  <span className="min-w-[18px] rounded-full bg-[#102a2f] px-1.5 py-0.5 text-center text-[10px] font-black text-white">
                    {inboxCount}
                  </span>
                )}
              </button>

              {/* Cart button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 rounded-lg bg-[#c85f35] px-3 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#a54727] sm:text-sm"
                title="เปิดตะกร้าสินค้า"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">ตะกร้า</span>
                {totalCartCount > 0 && (
                  <span className="min-w-[18px] rounded-full bg-white px-1.5 py-0.5 text-center text-[10px] font-black text-[#a54727]">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={mobileMenuOpen ? 'ปิดเมนูหลัก' : 'เปิดเมนูหลัก'}
                className="rounded-lg p-2 text-[#4f6264] hover:bg-[#e8dfd0] hover:text-[#102a2f] md:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div id="mobile-navigation" className="space-y-1 border-t border-[#d9cfbf] py-3 md:hidden">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-bold text-[#334b4f] hover:bg-[#e8dfd0]"
              >
                หน้าร้านค้าดิจิทัล
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-bold text-[#334b4f] hover:bg-[#e8dfd0]"
              >
                🔍 ติดตามสถานะคำสั่งซื้อ
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={handleRemoveFromCart}
      />

      {/* Simulated Email Modal */}
      <SimulatedInboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </>
  );
}
