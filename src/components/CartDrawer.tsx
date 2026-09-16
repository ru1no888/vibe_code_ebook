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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#102a2f]/65 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="flex w-screen max-w-md flex-col border-l border-[#d9cfbf] bg-[#f4efe5] text-[#183036] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#d9cfbf] bg-[#fffdf8] p-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#c85f35]" />
              <h2 id="cart-title" className="text-lg font-black">ตะกร้า E-book</h2>
              <span className="rounded-full border border-[#c8bda9] bg-[#efe6d8] px-2 py-0.5 text-xs font-bold text-[#4f6264]">
                {cart.length} รายการ
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="ปิดตะกร้า"
              className="rounded-lg p-1 text-[#667779] transition-colors hover:bg-[#e8dfd0] hover:text-[#102a2f]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 divide-y divide-[#d9cfbf] space-y-4 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-[#667779]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8dfd0] text-[#71807e]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-base font-bold text-[#183036]">ยังไม่มีหนังสือในตะกร้า</p>
                <p className="max-w-xs text-xs text-[#71807e]">
                  เลือกชม E-Book และ Digital Product ที่น่าสนใจแล้วกดเพิ่มลงในตะกร้าได้เลย
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                  <img
                    src={item.product.coverImage}
                    alt={item.product.title}
                    className="h-20 w-16 shrink-0 rounded-lg border border-[#c8bda9] object-cover shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#a54727]">
                      {item.product.categoryLabel}
                    </span>
                    <h4 className="line-clamp-2 text-xs font-bold leading-snug text-[#183036] sm:text-sm">
                      {item.product.title}
                    </h4>
                    <p className="mt-1 text-xs text-[#667779]">รูปแบบ: {item.product.fileFormat}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono text-sm font-black text-[#102a2f]">
                        {formatPrice(item.product.price)}
                      </span>
                      <button
                        onClick={() => onRemove(item.product.id)}
                        className="flex items-center gap-1 rounded p-1 text-xs text-[#71807e] transition-colors hover:text-[#a54727]"
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
            <div className="space-y-4 border-t border-[#d9cfbf] bg-[#fffdf8] p-6">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-[#667779]">
                  <span>ยอดรวมสินค้า</span>
                  <span className="font-mono">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[#667779]">
                  <span>ค่าจัดส่ง (Digital Delivery)</span>
                  <span className="font-bold text-[#607b56]">ฟรี (ทันที)</span>
                </div>
                <div className="flex justify-between border-t border-[#d9cfbf] pt-2 text-base font-black text-[#102a2f]">
                  <span>ยอดสุทธิ</span>
                  <span className="font-mono text-lg text-[#a54727]">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="button-primary w-full"
              >
                <span>ดำเนินการสั่งซื้อ (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-center text-[11px] text-[#71807e]">
                ⚡ ระบบชำระเงินจำลอง (DEMO ONLY) — ไม่มีค่าใช้จ่ายจริง
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
