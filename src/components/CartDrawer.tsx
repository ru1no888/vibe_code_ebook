'use client';

import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, BookOpen } from 'lucide-react';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (productId: string) => void;
}

export default function CartDrawer({ isOpen, onClose, cart, onRemove }: Props) {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col text-white">
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold">ตะกร้าสินค้าดิจิทัล</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">
                {cart.length} รายการ
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gray-800/60">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-base font-medium text-gray-300">ยังไม่มีสินค้าในตะกร้า</p>
                <p className="text-xs text-gray-500 max-w-xs">
                  เลือกชม E-Book และ Digital Product ที่น่าสนใจแล้วกดเพิ่มลงในตะกร้าได้เลย
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                  <img
                    src={item.product.coverImage}
                    alt={item.product.title}
                    className="w-16 h-20 object-cover rounded-lg border border-gray-700/80 shadow-md shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider block">
                      {item.product.categoryLabel}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">รูปแบบ: {item.product.fileFormat}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-indigo-400 font-mono">
                        {formatPrice(item.product.price)}
                      </span>
                      <button
                        onClick={() => onRemove(item.product.id)}
                        className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors text-xs flex items-center gap-1"
                        title="ลบออกจากตะกร้า"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">ลบ</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with checkout summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-800 bg-gray-950/80 space-y-4">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>ยอดรวมสินค้า</span>
                  <span className="font-mono">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>ค่าจัดส่ง (Digital Delivery)</span>
                  <span className="text-emerald-400 font-medium">ฟรี (ทันที)</span>
                </div>
                <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-base text-white">
                  <span>ยอดสุทธิ</span>
                  <span className="text-indigo-400 font-mono text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-glow transition-all"
              >
                <span>ดำเนินการสั่งซื้อ (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[11px] text-center text-gray-500">
                ⚡ ระบบชำระเงินจำลอง (DEMO ONLY) — ไม่มีค่าใช้จ่ายจริง
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
