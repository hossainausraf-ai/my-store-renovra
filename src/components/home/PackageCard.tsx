'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle2, ShoppingBag, Check } from 'lucide-react';
import QuickViewModal, { QuickViewItem } from '@/components/ui/QuickViewModal';
import { useCart } from '@/context/CartContext';

interface PackageProps {
  id: string;
  badge: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  colorFrom: string;
  colorTo: string;
  isPopular?: boolean;
  imageUrl?: string;
  galleryImages?: string[];
}

export default function PackageCard({ pkg }: { pkg: PackageProps }) {
  const { addToCart } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const quickViewData: QuickViewItem = {
    id: pkg.id,
    name: pkg.name,
    type: 'subscription',
    price: pkg.price,
    period: pkg.period || 'month',
    category: pkg.badge || 'Subscription Plan',
    imageUrl: pkg.imageUrl,
    galleryImages: pkg.galleryImages,
    features: pkg.features || [],
    isPopular: pkg.isPopular,
    validity: '1 Month'
  };

  return (
    <>
      <div 
        onClick={() => setIsQuickViewOpen(true)}
        className={`relative rounded-2xl border bg-[var(--surface)] p-3 sm:p-6 flex flex-col transition-all hover:-translate-y-1 cursor-pointer ${
          pkg.isPopular 
            ? 'border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/40' 
            : 'border-white/10 hover:border-blue-500/40'
        }`}
      >

        {pkg.isPopular && (
          <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500 text-white text-[8px] sm:text-[10px] font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(59,130,246,0.5)] whitespace-nowrap z-20">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            Most Popular
          </div>
        )}

        <div className={`h-1 w-8 sm:w-12 rounded-full bg-gradient-to-r mb-2 sm:mb-4 ${pkg.colorFrom} ${pkg.colorTo}`}></div>
        <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.14em] sm:tracking-[0.18em] uppercase text-blue-500 mb-1 sm:mb-2">{pkg.badge}</p>
        <h3 className="text-xs sm:text-lg font-bold leading-tight min-h-[2.2rem] sm:min-h-[3rem] text-white line-clamp-2">{pkg.name}</h3>

        <div className="mt-2 sm:mt-4 flex items-baseline gap-0.5 sm:gap-1">
          <span className="text-lg sm:text-4xl font-black tracking-tight text-white">৳ {pkg.price}</span>
          <span className="text-[9px] sm:text-sm text-gray-400">/{pkg.period}</span>
        </div>

        {/* Action Row: Get Started & Add to Cart */}
        <div className="mt-2.5 sm:mt-5 flex items-center gap-1.5 sm:gap-2">
          <Link
            href={`/checkout?pkgId=${pkg.id}`}
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 h-9 sm:h-11 px-2.5 sm:px-3 rounded-xl font-bold text-xs sm:text-sm transition-all truncate ${
              pkg.isPopular 
                ? 'bg-[#B3E600] text-black shadow-[0_0_15px_rgba(179,230,0,0.4)] hover:bg-[#9cbd00]' 
                : 'bg-transparent border border-blue-500/40 text-blue-500 hover:bg-blue-500/10'
            }`}
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </Link>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id: pkg.id,
                name: pkg.name,
                price: pkg.price,
                imageUrl: pkg.imageUrl,
                product_type: 'subscription',
                validity: pkg.period === 'month' ? '1 Month' : pkg.period
              });
              setIsAdded(true);
              setTimeout(() => setIsAdded(false), 1500);
            }}
            className={`h-9 sm:h-11 w-9 sm:w-11 rounded-xl border flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer ${
              isAdded
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-[#ccff00] hover:border-[#ccff00]/40'
            }`}
            title="Add to Cart"
          >
            {isAdded ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4 text-[#ccff00]" />}
          </button>
        </div>

        <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-5 border-t border-white/10 flex-1">
          <p className="text-[9px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">Plan includes</p>
          <ul className="space-y-1.5 sm:space-y-2.5">
            {pkg.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-gray-200">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="leading-snug line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
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