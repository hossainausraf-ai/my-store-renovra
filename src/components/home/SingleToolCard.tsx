'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Crown, CheckCircle2, Calendar, ShoppingCart, Clock, ShoppingBag, Check } from 'lucide-react';
import QuickViewModal, { QuickViewItem } from '@/components/ui/QuickViewModal';
import { useCart } from '@/context/CartContext';

interface SingleToolProps {
  tool: {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    galleryImages?: string[];
    validity?: string;
  };
}

export default function SingleToolCard({ tool }: SingleToolProps) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Normalize validity to prevent long sentences from breaking layout
  const rawValidity = tool.validity || '1 Month';
  const cleanValidity = rawValidity.length > 20 ? '1 Month' : rawValidity;
  const periodText = '/ mo';

  // Fallback initial
  const toolInitial = tool.name ? tool.name.charAt(0).toUpperCase() : 'T';

  const quickViewData: QuickViewItem = {
    id: tool.id,
    name: tool.name,
    type: 'single_tool',
    price: tool.price,
    period: '/ month',
    category: tool.category,
    imageUrl: tool.imageUrl,
    galleryImages: tool.galleryImages,
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
        className="bg-gradient-to-b from-[#0d171d] to-[#081014] border border-white/10 rounded-2xl sm:rounded-[28px] overflow-hidden hover:border-cyan-500/40 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between h-full relative shadow-xl hover:shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.12)] cursor-pointer"
      >
        
        {/* Top Header Section with Blue Gradient & Shadow */}
        <div className="bg-gradient-to-br from-[#123040] to-[#0a1b24] shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-10 p-2.5 sm:p-5 flex flex-col border-b border-white/5">
          
          {/* Badges Row */}
          <div className="flex justify-between items-center mb-2 sm:mb-5">
            <div className="bg-[#0b3323] border border-[#145a3a] text-[#34d399] text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse"></span>
              <span className="hidden sm:inline">Tools Status Active</span>
              <span className="sm:hidden">Active</span>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.1)] shrink-0">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Logo and Category Row */}
          <div className="flex justify-between items-end gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-20 bg-white/10 backdrop-blur-md border border-white/20 p-1 sm:p-2 overflow-hidden relative shrink-0">
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
                <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/30 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-black text-sm sm:text-lg">
                  {toolInitial}
                </div>
              )}
            </div>
            <div className="text-[8px] sm:text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider text-right line-clamp-1 pb-0.5 sm:pb-1 drop-shadow-md">
              {tool.category || 'Premium'}
            </div>
          </div>
        </div>

        {/* Main Content (Bottom Section) */}
        <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between relative z-0">
          
          <div>
            {/* Title box */}
            <div className="min-h-[34px] sm:min-h-[52px] flex items-center mb-1.5 sm:mb-4">
              <h3 className="text-xs sm:text-lg font-bold text-white tracking-tight leading-snug line-clamp-2">
                {tool.name}
              </h3>
            </div>

            {/* Specs Table */}
            <div className="space-y-1 sm:space-y-2.5 mb-2 sm:mb-5 text-[10px] sm:text-xs">
              <div className="flex justify-between items-center text-gray-400">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 shrink-0" />
                  <span className="hidden sm:inline">Active From</span>
                  <span className="sm:hidden">Start</span>
                </div>
                <span className="text-white font-medium text-[9px] sm:text-xs">Instant</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 shrink-0" />
                  <span>Validity</span>
                </div>
                <span className="text-white font-semibold text-[9px] sm:text-xs truncate max-w-[85px] sm:max-w-none">{cleanValidity}</span>
              </div>
            </div>

            {/* Clean Remaining Pill */}
            <div className="bg-black/40 rounded-full border border-green-500/30 py-1 px-2 sm:py-2 sm:px-3 flex items-center justify-center gap-1 sm:gap-1.5 mb-2 sm:mb-5 shadow-inner">
              <Clock className="w-3 h-3 text-green-400 shrink-0" />
              <span className="text-green-400 text-[8px] sm:text-[11px] font-bold tracking-tight truncate">
                {cleanValidity}
              </span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="mt-auto pt-1">
            <div className="text-center mb-2 sm:mb-3">
              <div className="text-base sm:text-2xl font-black text-white tracking-tight flex items-baseline justify-center gap-0.5 sm:gap-1">
                <span className="text-xs sm:text-base text-gray-400 font-bold">৳</span> 
                {tool.price} 
                <span className="text-[9px] sm:text-xs font-medium text-gray-500 font-sans tracking-normal">{periodText}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart({
                    id: tool.id,
                    name: tool.name,
                    price: tool.price,
                    imageUrl: tool.imageUrl,
                    product_type: 'single_tool',
                    validity: cleanValidity
                  });
                  setIsAdded(true);
                  setTimeout(() => setIsAdded(false), 1500);
                }}
                className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer truncate ${
                  isAdded
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white hover:text-[#ccff00] hover:border-[#ccff00]/40 shadow-sm'
                }`}
                title="Add to Shopping Cart"
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
                    <span className="truncate">Add to Cart</span>
                  </>
                )}
              </button>

              <Link 
                href={`/checkout?pkgId=${tool.id}`} 
                onClick={(e) => e.stopPropagation()}
                className="py-2 sm:py-2.5 px-3 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_12px_rgba(204,255,0,0.2)] shrink-0"
                title="Buy Now"
              >
                <span>Buy</span>
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