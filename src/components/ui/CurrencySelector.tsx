'use client';

import React from 'react';
import { useCurrency, CurrencyCode } from '@/context/CurrencyContext';

const OPTIONS: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'BDT', symbol: '৳', label: 'BDT' },
  { code: 'INR', symbol: '₹', label: 'INR' },
  { code: 'USD', symbol: '$', label: 'USD' },
];

export default function CurrencySelector({ className = '' }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Currency Selector"
      className={`inline-flex items-center p-1 rounded-full bg-[#0d141e]/90 border border-white/15 backdrop-blur-md shadow-xl ${className}`}
    >
      {OPTIONS.map((opt) => {
        const isActive = currency === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setCurrency(opt.code)}
            className={`flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer select-none active:scale-95 ${
              isActive
                ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.4)] scale-100'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-[13px] sm:text-[14px] leading-none">{opt.symbol}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

