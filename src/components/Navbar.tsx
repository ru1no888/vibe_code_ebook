'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ShoppingBag, Mail, Search, Menu, X, ShieldCheck, Sparkles } from 'lucide-react';
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
      <nav className="sticky top-[37px] z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                      VIBE STORE
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      PRO
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 tracking-wide">
                    Digital Product & E-Book
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
                    ? 'text-white bg-gray-800/80'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                หน้าร้านค้า
              </Link>
              <Link
                href="/track-order"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/track-order'
                    ? 'text-white bg-gray-800/80'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
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
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 text-xs sm:text-sm font-medium transition-colors"
                title="เปิดดูกล่องจดหมายจำลองสำหรับการส่งอีเมล"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">กล่องอีเมลจำลอง</span>
                {inboxCount > 0 && (
                  <span className="bg-indigo-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                    {inboxCount}
                  </span>
                )}
              </button>

              {/* Cart button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-glow"
                title="เปิดตะกร้าสินค้า"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">ตะกร้า</span>
                {totalCartCount > 0 && (
                  <span className="bg-white text-indigo-700 text-[11px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-800 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 font-medium"
              >
                หน้าร้านค้าดิจิทัล
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 font-medium"
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
