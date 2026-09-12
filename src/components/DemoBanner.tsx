'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-amber-600/90 text-amber-50 px-4 py-2 text-xs md:text-sm font-medium border-b border-amber-500/30 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between shadow-md">
      <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap justify-center text-center">
        <span className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wider text-amber-300 uppercase border border-amber-400/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          DEMO ONLY
        </span>
        <span>
          ระบบนี้เป็นโครงงานสาธิตการเชื่อมต่อเว็บสู่แอป (Mock Payment & Simulation) — <strong>ไม่มีการตัดเงินจริงหรือเรียกเก็บเงินใดๆ</strong>
        </span>
      </div>
    </div>
  );
}
