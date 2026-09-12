'use client';

import React, { useState, useEffect } from 'react';
import { Mail, X, ExternalLink, Clock, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { getSimulatedEmails } from '@/lib/storage';
import { EmailNotification } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimulatedInboxModal({ isOpen, onClose }: Props) {
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);

  const loadEmails = () => {
    const list = getSimulatedEmails();
    setEmails(list);
    if (list.length > 0 && !selectedEmail) {
      setSelectedEmail(list[0]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      loadEmails();
    };
    window.addEventListener('vibe-storage-updated', handleUpdate);
    return () => window.removeEventListener('vibe-storage-updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                กล่องอีเมลจำลองสำหรับการทดสอบ (Simulated Mailbox)
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {emails.length} ฉบับ
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                แสดงผลอีเมลที่ระบบจัดส่งอัตโนมัติเมื่อสถานะคำสั่งซื้อเปลี่ยนเป็น <strong>PAID</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {emails.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
              <Mail className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-300">ยังไม่มีอีเมลในระบบจำลอง</p>
            <p className="text-xs max-w-md text-gray-500">
              เมื่อคุณทำรายการสั่งซื้อ E-Book และกดปุ่ม <strong>"จำลองชำระเงินสำเร็จ"</strong> ในหน้าชำระเงิน ระบบจะจำลองการส่งอีเมลพร้อมลิงก์ดาวน์โหลดมาแสดงที่นี่โดยอัตโนมัติ
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
            {/* Email list sidebar */}
            <div className="md:col-span-5 border-r border-gray-800 overflow-y-auto max-h-[60vh] md:max-h-full divide-y divide-gray-800/60 bg-gray-950/40">
              {emails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full text-left p-4 transition-all block ${
                    selectedEmail?.id === email.id
                      ? 'bg-indigo-950/50 border-l-4 border-indigo-500'
                      : 'hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span className="font-semibold text-indigo-300 truncate max-w-[140px]">{email.to}</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDate(email.sentAt).split(' ')[1] || 'เพิ่งส่ง'}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-white truncate mb-1">{email.subject}</h4>
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Order: {email.orderId}</span>
                    <span className="text-emerald-400 font-mono font-medium">{formatPrice(email.totalAmount)}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Email detail viewer */}
            <div className="md:col-span-7 p-6 overflow-y-auto max-h-[60vh] md:max-h-full bg-gray-900/60 flex flex-col">
              {selectedEmail ? (
                <div className="space-y-4">
                  <div className="bg-gray-800/70 p-4 rounded-xl border border-gray-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">ผู้ส่ง (From):</span>
                      <span className="text-indigo-300 font-medium">noreply@vibestore-ebook.dev (Vibe Store System)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">ผู้รับ (To):</span>
                      <span className="text-white font-medium">{selectedEmail.customerName} &lt;{selectedEmail.to}&gt;</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">เวลาส่ง (Date):</span>
                      <span className="text-gray-300">{formatDate(selectedEmail.sentAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-gray-700/60 pt-2">
                      <span className="text-gray-400">หัวเรื่อง:</span>
                      <span className="text-white font-semibold">{selectedEmail.subject}</span>
                    </div>
                  </div>

                  {/* Simulated Email Content Body */}
                  <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg space-y-4 text-xs sm:text-sm">
                    <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
                      <h3 className="font-bold text-indigo-700 text-base">VIBE DIGITAL STORE</h3>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                        PAID - ชำระเงินเรียบร้อย
                      </span>
                    </div>

                    <p>เรียน คุณ <strong>{selectedEmail.customerName}</strong>,</p>
                    <p className="text-gray-600">
                      ขอขอบพระคุณสำหรับการสั่งซื้อสินค้าดิจิทัล คำสั่งซื้อหมายเลข <strong>#{selectedEmail.orderId}</strong> ได้รับการยืนยันการชำระเงินเรียบร้อยแล้ว
                    </p>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                      <p className="font-semibold text-gray-800 text-xs uppercase tracking-wider">รายการสินค้าของคุณ:</p>
                      {selectedEmail.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-medium text-gray-900">{item.title}</span>
                            <span className="text-[11px] text-gray-500 block">รูปแบบ: {item.fileFormat}</span>
                          </div>
                          <span className="font-mono font-bold text-indigo-600">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm">
                        <span>ยอดรวมทั้งสิ้น</span>
                        <span className="text-indigo-600">{formatPrice(selectedEmail.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-center space-y-2">
                      <p className="text-xs text-indigo-900 font-medium">
                        คลิกที่ปุ่มด้านล่างเพื่อเข้าสู่หน้าดาวน์โหลดไฟล์ดิจิทัล (ลิงก์มีอายุ 48 ชั่วโมง):
                      </p>
                      <Link
                        href={selectedEmail.downloadUrl}
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-md"
                      >
                        <ExternalLink className="w-4 h-4" />
                        เข้าสู่หน้าดาวน์โหลดไฟล์สินค้าดิจิทัล
                      </Link>
                    </div>

                    <p className="text-[11px] text-gray-400 text-center pt-2">
                      หากมีข้อสงสัยหรือต้องการความช่วยเหลือ สามารถตอบกลับอีเมลนี้ได้ทันที
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 bg-gray-950 border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            เชื่อมต่อระบบจัดส่งและบันทึกอีเมลพร้อมลิงก์ดาวน์โหลดตาม Requirement หน้า 2, 4, 7
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium text-xs transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
