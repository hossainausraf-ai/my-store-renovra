'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, CheckCircle2, Calendar, ShoppingCart, Clock } from 'lucide-react';

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
  return (
    <div className="bg-[#0b151a] border border-white/10 rounded-[24px] overflow-hidden hover:border-[#1e4a5d] transition-all group flex flex-col relative shadow-2xl">
      
      {/* Top Header Section with Blue Gradient & Shadow */}
      <div className="bg-gradient-to-br from-[#123040] to-[#0a1b24] shadow-[0_15px_30px_rgba(0,0,0,0.6)] relative z-10 px-5 pt-5 pb-5 flex flex-col border-b border-white/5">
        
        {/* Badges Row */}
        <div className="flex justify-between items-start mb-6">
          <div className="bg-[#0b3323] border border-[#145a3a] text-[#34d399] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider shadow-inner">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tools Status Active
          </div>
          <div className="w-8 h-8 rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.1)]">
            <Crown className="w-4 h-4" />
          </div>
        </div>

        {/* Logo and Category Row */}
        <div className="flex justify-between items-end">
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-20 bg-white/10 backdrop-blur-md border border-white/20 p-2 overflow-hidden relative transform-gpu">
            {tool.imageUrl ? (
              <img src={tool.imageUrl} alt={tool.name} className="max-w-full max-h-full object-contain relative z-10" />
            ) : (
              <div className="w-full h-full bg-gray-200/20 rounded-xl"></div>
            )}
          </div>
          <div className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider text-right max-w-[60%] pb-1 drop-shadow-md">
            {tool.category}
          </div>
        </div>
      </div>

      {/* Main Content (Bottom Section) */}
      <div className="px-5 pt-8 pb-5 flex-1 flex flex-col relative z-0">
        
        <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{tool.name}</h3>

        <div className="space-y-3.5 mb-8 text-sm">
          <div className="flex justify-between items-center text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Active From</span>
            </div>
            <span className="text-white font-semibold">On Activation</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Validity</span>
            </div>
            <span className="text-white font-semibold">{tool.validity || '30 Days'}</span>
          </div>
        </div>

        <div className="bg-black/40 rounded-full border border-green-500/30 py-2.5 flex items-center justify-center gap-2 mb-8 shadow-inner">
          <Clock className="w-4 h-4 text-green-500" />
          <span className="text-green-500 text-xs font-bold tracking-wide">Remaining: {tool.validity || '30 Days'}</span>
        </div>

        <div className="text-center mb-6 mt-auto">
          <div className="text-[32px] font-black text-white tracking-tight flex items-baseline justify-center gap-1">
            <span className="text-xl text-gray-400 font-bold">৳</span> 
            {tool.price} 
            <span className="text-sm font-medium text-gray-500 font-sans tracking-normal">/ month</span>
          </div>
        </div>

        <Link href={`/checkout?pkgId=${tool.id}`} className="w-full py-3.5 rounded-xl bg-[#B3E600] hover:bg-[#9cbd00] text-black font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_5px_15px_rgba(179,230,0,0.2)]">
          <ShoppingCart className="w-5 h-5" />
          Buy Now
        </Link>
      </div>
    </div>
  );
}
