'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import QuickViewModal, { QuickViewItem } from '@/components/ui/QuickViewModal';

interface DigitalProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export default function DigitalProductCard({ product }: { product: DigitalProductProps }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const quickViewData: QuickViewItem = {
    id: product.id,
    name: product.name,
    type: 'digital',
    price: product.price,
    period: 'one-time',
    category: product.category || 'Digital Asset',
    imageUrl: product.imageUrl,
    description: product.description,
    validity: 'Lifetime Access',
    features: [
      'Instant digital delivery to your account / email',
      'Full lifetime access with future updates',
      'Commercial usage license included',
      'Dedicated 24/7 technical support'
    ]
  };

  return (
    <>
      <div 
        onClick={() => setIsQuickViewOpen(true)}
        className="bg-[var(--surface)] border border-white/5 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer"
      >

        {/* Product Image Cover */}
        <div className="h-60 w-full bg-[#111] relative overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-600 flex flex-col items-center">
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm">No Image</span>
            </div>
          )}

          {/* Quick View Hover Pill on Image */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white font-bold text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
              <Eye className="w-4 h-4 text-[#ccff00]" />
              Quick View
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <p className="text-[10px] font-bold tracking-wider uppercase text-blue-400 mb-1">{product.category}</p>
          <h3 className="text-lg font-bold leading-tight text-white mb-2 flex-1">{product.name}</h3>

          {product.description && (
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
            <span className="text-xl font-black tracking-tight text-white">৳ {product.price}</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Quick View / কুইক ভিউ"
              >
                <Eye className="w-4 h-4 text-[#38bdf8]" />
              </button>

              <Link
                href={`/checkout?pkgId=${product.id}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#B3E600] text-black hover:bg-[#9cbd00] px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-[0_5px_15px_rgba(179,230,0,0.2)] flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Order
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