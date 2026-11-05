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
    validity: pkg.period === '24h' ? '24 Hours' : (pkg.period === 'year' ? '1 Year' : '1 Month')
  };

  return (
    <>
      <div 
        onClick={() => setIsQuickViewOpen(true)}
        className={`relative rounded-2xl border bg-[var(--surface)] p-3 sm:p-6 flex flex-col transition-all hover:-translate-y-1 cursor-pointer ${
          pkg.isPopular 
            ? 'border-[#ccff00]/60 shadow-[0_0_30px_rgba(204,255,0,0.18)] ring-1 ring-[#ccff00]/50' 
            : 'border-white/10 hover:border-white/25 hover:shadow-lg'
        }`}
      >

        {pkg.isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-0.5 sm:py-1 rounded-full bg-[#ccff00] text-black text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase shadow-[0_0_15px_rgba(204,255,0,0.5)] whitespace-nowrap z-20">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-black text-black" />
            MOST POPULAR
          </div>
        )}

        <div className={`h-1 w-8 sm:w-12 rounded-full bg-gradient-to-r mb-2 sm:mb-4 ${pkg.colorFrom} ${pkg.colorTo}`}></div>
        <p className="text-[9px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#ccff00] mb-1 sm:mb-2">{pkg.badge}</p>
        <h3 className="text-sm sm:text-xl font-bold leading-tight min-h-[2.2rem] sm:min-h-[2.8rem] text-white line-clamp-2">{pkg.name}</h3>

        <div className="mt-2 sm:mt-4 flex items-baseline gap-1">
          <span className="text-xl sm:text-4xl font-black tracking-tight text-white">৳ {pkg.price}</span>
          <span className="text-[10px] sm:text-sm text-gray-400 font-normal">/{pkg.period || 'month'}</span>
        </div>

        {/* Action Row: Get Started & Add to Cart */}
        <div className="mt-2.5 sm:mt-5 flex items-center gap-1.5 sm:gap-2">
          <Link
            href={`/checkout?pkgId=${pkg.id}`}
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 h-9 sm:h-11 px-2.5 sm:px-3 rounded-xl font-bold text-xs sm:text-sm transition-all truncate ${
              pkg.isPopular 
                ? 'bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.35)] hover:bg-[#b3e600]' 
                : 'border border-white/20 bg-white/[0.04] text-white hover:border-[#ccff00] hover:text-[#ccff00]'
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
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/20 text-white hover:text-[#ccff00] hover:border-[#ccff00]/50'
            }`}
            title="Add to Cart"
          >
            {isAdded ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4 text-[#ccff00]" />}
          </button>
        </div>

        <div className="mt-2.5 sm:mt-6 pt-2 sm:pt-5 border-t border-white/10 flex-1">
          <p className="text-[9px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 sm:mb-3.5">Plan includes</p>
          <ul className="space-y-1 sm:space-y-2.5">
            {pkg.features.map((feature, i) => (
              <li 
                key={i} 
                className={`items-start gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-200 ${
                  i < 4 ? 'flex' : 'hidden sm:flex'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ccff00] flex-shrink-0 mt-0.5" />
                <span className="leading-snug line-clamp-1">{feature}</span>
              </li>
            ))}
            {pkg.features.length > 4 && (
              <li className="sm:hidden text-[9px] text-[#ccff00]/90 font-semibold pl-5 pt-0.5">
                + আরও {pkg.features.length - 4}টি সুবিধা অন্তর্ভুক্ত
              </li>
            )}
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