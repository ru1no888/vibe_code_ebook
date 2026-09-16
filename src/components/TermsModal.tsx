'use client';

import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: Props) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#fffdf8] border border-[#c8bda9] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#183036]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d9cfbf] bg-[#f4efe5]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#102a2f] text-white">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 id="terms-modal-title" className="text-base font-black text-[#102a2f]">
                ข้อกำหนดและเงื่อนไขการให้บริการ (Terms & Privacy Policy)
              </h2>
              <p className="text-xs text-[#667779]">
                กรุณาอ่านและทำความเข้าใจก่อนสั่งซื้อสินค้าดิจิทัล
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่างเงื่อนไข"
            className="rounded-lg p-1.5 text-[#667779] hover:bg-[#e8dfd0] hover:text-[#102a2f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm leading-relaxed text-[#4f6264]">
          <div className="p-3.5 rounded-xl bg-[#fff0d2] border border-[#d97706]/30 text-[#7c3e08] flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#c85f35] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#102a2f]">ข้อควรทราบ: ระบบนี้เป็นระบบจำลองเพื่อการศึกษา (DEMO ONLY)</strong>
              <p className="mt-0.5 text-xs">
                ไม่มีการตัดเงินจริง บัตรเครดิตและ PromptPay QR ที่แสดงในระบบเป็นการจำลองการเปลี่ยนสถานะ PENDING สู่ PAID เท่านั้น
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#102a2f] flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#607b56]" />
              1. สิทธิ์การใช้งาน E-Book ดิจิทัล (Personal Use License)
            </h3>
            <p>
              ไฟล์เอกสารคู่มือ PDF และ Source Code ตัวอย่างที่ท่านได้รับหลังการสั่งซื้อ เป็นสิทธิ์การใช้งานส่วนบุคคลเพื่อการศึกษาและพัฒนาตนเองเท่านั้น <strong>ไม่อนุญาตให้ทำซ้ำ ดัดแปลง จำหน่ายต่อ หรือนำไปเผยแพร่สาธารณะเชิงพาณิชย์โดยไม่ได้รับอนุญาต</strong>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#102a2f] flex items-center gap-1.5 mb-1.5">
              <Lock className="w-4 h-4 text-[#c85f35]" />
              2. นโยบายความเป็นส่วนตัว (Privacy Policy & PDPA)
            </h3>
            <p>
              ทางร้านค้าจัดเก็บข้อมูล ชื่อ-นามสกุล และ อีเมล ของท่านเพื่อวัตถุประสงค์ในการสร้างหมายเลขคำสั่งซื้อ (Order ID) และจัดส่งลิงก์ดาวน์โหลดเท่านั้น ระบบมีมาตรการรักษาความปลอดภัยโดยหน้า "ติดตามคำสั่งซื้อ" จะต้องระบุทั้ง Order ID และ อีเมล ตรงกันเท่านั้น จึงจะสามารถเข้าถึงข้อมูลคำสั่งซื้อได้ เพื่อป้องกันการเปิดเผยข้อมูลต่อบุคคลอื่น
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#102a2f] flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#102a2f]" />
              3. ระยะเวลาการดาวน์โหลด (Download Validity)
            </h3>
            <p>
              ลิงก์ดาวน์โหลดไฟล์ E-book ที่สร้างขึ้นจะมีอายุการใช้งาน 48 ชั่วโมงหลังการชำระเงินจำลองสำเร็จ เพื่อความปลอดภัยในการเข้าถึงข้อมูล หากหมดอายุ ท่านสามารถใช้ Order ID และอีเมลตรวจสอบสถานะผ่านระบบติดตามคำสั่งซื้อได้
            </p>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#102a2f] flex items-center gap-1.5 mb-1.5">
              <FileText className="w-4 h-4 text-[#4f6264]" />
              4. การรีเซ็ตเซสชันอัตโนมัติ (1-Hour Session Security)
            </h3>
            <p>
              เพื่อความปลอดภัยของผู้ใช้งาน ระบบจะทำการตรวจสอบและรีเซ็ตเซสชันตะกร้าสินค้าทุก 1 ชั่วโมงโดยอัตโนมัติ หากไม่มีการทำรายการในเวลาที่กำหนด
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#d9cfbf] bg-[#fffdf8]">
          <button
            type="button"
            onClick={onClose}
            className="button-secondary !min-h-10 !px-4 !text-xs sm:!text-sm"
          >
            ปิด
          </button>
          {onAccept && (
            <button
              type="button"
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="button-primary !min-h-10 !px-5 !text-xs sm:!text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ฉันยอมรับเงื่อนไข</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
