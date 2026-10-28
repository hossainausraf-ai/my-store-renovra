'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Crown, CheckCircle2, Calendar, ShoppingCart, Clock, Eye } from 'lucide-react';
import QuickViewModal, { QuickViewItem } from '@/components/ui/QuickViewModal';

interface SingleToolProps {
  tool: {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    validity?: string;
  };
}

export default function SingleToolCard({ tool }: SingleToolProps) {
  const [imgError, setImgError] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Normalize validity to prevent long sentences from breaking layout
  const rawValidity = tool.validity || '30 Days';
  const cleanValidity = rawValidity.length > 20 ? '30 Days' : rawValidity;
  const periodText = cleanValidity.toLowerCase().includes('year') ? '/ year' : '/ month';

  // Fallback initial
  const toolInitial = tool.name ? tool.name.charAt(0).toUpperCase() : 'T';

  const quickViewData: QuickViewItem = {
    id: tool.id,
    name: tool.name,
    type: 'single_tool',
    price: tool.price,
    period: periodText,
    category: tool.category,
    imageUrl: tool.imageUrl,
    validity: cleanValidity,
    features: [
      'Instant access credentials upon activation',
      '100% Genuine and private high-speed performance',
      'Full replacement warranty throughout validity',
      'Dedicated 24/7 VIP support on WhatsApp'
    ]
  };

  return (
    <>
      <div 
        onClick={() => setIsQuickViewOpen(true)}
        className="bg-gradient-to-b from-[#0d171d] to-[#081014] border border-white/10 rounded-[28px] overflow-hidden hover:border-cyan-500/40 hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between h-full relative shadow-2xl hover:shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.12)] cursor-pointer"
      >
        
        {/* Top Header Section with Blue Gradient & Shadow */}
        <div className="bg-gradient-to-br from-[#123040] to-[#0a1b24] shadow-[0_15px_30px_rgba(0,0,0,0.6)] relative z-10 px-5 pt-5 pb-5 flex flex-col border-b border-white/5">
          
          {/* Badges Row */}
          <div className="flex justify-between items-center mb-5">
            <div className="bg-[#0b3323] border border-[#145a3a] text-[#34d399] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider shadow-inner">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tools Status Active
            </div>
            <div className="w-8 h-8 rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.1)]">
              <Crown className="w-4 h-4" />
            </div>
          </div>

          {/* Logo and Category Row */}
          <div className="flex justify-between items-end gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-20 bg-white/10 backdrop-blur-md border border-white/20 p-2 overflow-hidden relative shrink-0">
              {tool.imageUrl && !imgError ? (
                <img 
                  src={tool.imageUrl} 
                  alt={tool.name} 
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgError(true)}
                  className="max-w-full max-h-full object-contain relative z-10" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/30 rounded-xl flex items-center justify-center text-white font-black text-lg">
                  {toolInitial}
                </div>
              )}
            </div>
            <div className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider text-right line-clamp-1 pb-1 drop-shadow-md">
              {tool.category || 'Premium Tool'}
            </div>
          </div>
        </div>

        {/* Main Content (Bottom Section) */}
        <div className="px-5 pt-6 pb-5 flex-1 flex flex-col justify-between relative z-0">
          
          <div>
            {/* Fixed height title box so all cards align identically */}
            <div className="min-h-[56px] flex items-center mb-5">
              <h3 className="text-xl font-bold text-white tracking-tight leading-snug line-clamp-2">
                {tool.name}
              </h3>
            </div>

            {/* Specs Table */}
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between items-center text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Active From</span>
                </div>
                <span className="text-white font-semibold">On Activation</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                  <span>Validity</span>
                </div>
                <span className="text-white font-semibold">{cleanValidity}</span>
              </div>
            </div>

            {/* Clean Remaining Pill */}
            <div className="bg-black/40 rounded-full border border-green-500/30 py-2.5 px-4 flex items-center justify-center gap-2 mb-6 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-green-400 shrink-0" />
              <span className="text-green-400 text-xs font-bold tracking-wide">
                Remaining: {cleanValidity}
              </span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="mt-auto pt-2">
            <div className="text-center mb-4">
              <div className="text-[32px] font-black text-white tracking-tight flex items-baseline justify-center gap-1">
                <span className="text-xl text-gray-400 font-bold">৳</span> 
                {tool.price} 
                <span className="text-sm font-medium text-gray-500 font-sans tracking-normal">{periodText}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
                className="py-3 px-3.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
                title="Quick View / কুইক ভিউ"
              >
                <Eye className="w-4 h-4 text-[#38bdf8]" />
                <span>View</span>
              </button>

              <Link 
                href={`/checkout?pkgId=${tool.id}`} 
                onClick={(e) => e.stopPropagation()}
                className="flex-1 py-3 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy Now
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal 
        item={quickViewData}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}