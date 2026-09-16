'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="border-b border-[#8e321c] bg-[#a54727] px-4 py-2 text-xs font-semibold text-white md:text-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
          <AlertTriangle className="w-3.5 h-3.5" />
          DEMO ONLY
        </span>
        <span>
          งานสาธิต Mock Payment — <strong>ไม่รับเงินจริง ไม่ใช้ข้อมูลบัตรหรือ QR ธนาคารจริง</strong>
        </span>
      </div>
    </div>
  );
}
