'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  MessageCircle, 
  ArrowRight, 
  Sparkles,
  Crown
} from 'lucide-react';

export interface QuickViewItem {
  id: string;
  name: string;
  type: 'subscription' | 'single_tool' | 'digital';
  price: number;
  period?: string;
  category?: string;
  badge?: string;
  imageUrl?: string;
  galleryImages?: string[];
  features?: string[];
  description?: string;
  validity?: string;
  isPopular?: boolean;
}

interface QuickViewModalProps {
  item: QuickViewItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ item, isOpen, onClose }: QuickViewModalProps) {
  const [supportWhatsApp, setSupportWhatsApp] = React.useState('8801766392692');
  const [activeImg, setActiveImg] = React.useState<string>('');

  React.useEffect(() => {
    if (item) {
      setActiveImg(item.imageUrl || item.galleryImages?.[0] || '');
    }
  }, [item?.id]);

  const allImages = React.useMemo(() => {
    if (!item) return [];
    const list: string[] = [];
    if (item.imageUrl) list.push(item.imageUrl);
    if (item.galleryImages && Array.isArray(item.galleryImages)) {
      item.galleryImages.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [item]);

  const currentImg = activeImg || item?.imageUrl || allImages[0] || '';

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.support_whatsapp) {
          const num = data.settings.support_whatsapp.replace(/[^0-9]/g, '');
          setSupportWhatsApp(num.startsWith('88') ? num : `88${num}`);
        }
      })
      .catch(() => {});
  }, []);

  // ESC key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const rawValidity = item.validity || '1 Month';
  const cleanValidity = rawValidity.length > 25 ? '1 Month' : rawValidity;
  const periodText = item.period 
    ? (item.period.startsWith('/') ? item.period : `/${item.period}`)
    : (item.type === 'digital' ? 'One-time' : '/ month');

  const initial = item.name ? item.name.charAt(0).toUpperCase() : 'P';
  
  const whatsappMsg = encodeURIComponent(
    `Hello Renovra! I want to order "${item.name}" (৳${item.price} ${periodText}). Please share details.`
  );

  // Default features if none specified
  const displayFeatures = (item.features && item.features.length > 0)
    ? item.features
    : [
        'Instant Access upon payment confirmation',
        '100% Genuine credentials with full security',
        '30-Day Replacement Guarantee & Warranty',
        'Dedicated 24/7 VIP WhatsApp support'
      ];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-[#111c24] to-[#0a1218] border border-white/15 rounded-[28px] max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_50px_rgba(56,189,248,0.15)] flex flex-col text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(204,255,0,0.2)]">
              <Sparkles className="w-3.5 h-3.5" />
              Quick View
            </span>
            {item.category && (
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                {item.category}
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all hover:rotate-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Main Info Header: Logo / Cover + Title */}
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 p-2.5 flex items-center justify-center shrink-0 shadow-xl overflow-hidden relative backdrop-blur-md">
              {currentImg ? (
                <img 
                  src={currentImg} 
                  alt={item.name} 
                  className="max-w-full max-h-full object-contain" 
                  onError={(e) => {
                    // Hide image and show fallback initial
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-initial')) {
                      const div = document.createElement('div');
                      div.className = 'fallback-initial text-white font-black text-2xl';
                      div.innerText = initial;
                      parent.appendChild(div);
                    }
                  }}
                />
              ) : (
                <div className="text-white font-black text-2xl">
                  {initial}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="bg-[#0b3323] border border-[#145a3a] text-[#34d399] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  Active & Available
                </span>
                {item.isPopular && (
                  <span className="bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Popular Choice
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {item.name}
              </h2>

              {item.description && (
                <p className="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>

          {/* Gallery Showcase (if multiple screenshots/images exist) */}
          {allImages.length > 1 && (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
              <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                <img 
                  src={currentImg} 
                  alt={item.name} 
                  className="max-w-full max-h-full object-contain p-2"
                />
                <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md text-[10px] text-white/90 border border-white/20 px-2 py-0.5 rounded-full">
                  {allImages.indexOf(currentImg) + 1} / {allImages.length}
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImg(img)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 p-1 bg-black/50 shrink-0 cursor-pointer transition-all ${
                      img === currentImg
                        ? 'border-[#ccff00] ring-2 ring-[#ccff00]/40 scale-105 shadow-md shadow-[#ccff00]/20'
                        : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain rounded-lg" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pricing & Validity Box */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Pricing / প্যাকেজ মূল্য
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#ccff00] tracking-tight">
                  ৳{item.price}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {periodText}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-gray-300 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active: <strong className="text-white">On Activation</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-green-400" />
                <span>Validity: <strong className="text-white">{cleanValidity}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Delivery: <strong className="text-white">Instant (5-15 mins)</strong></span>
              </div>
            </div>
          </div>

          {/* Features Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
              What's Included / যা যা পাচ্ছেন:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {displayFeatures.map((feat, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs sm:text-sm text-gray-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-white">Instant Access</p>
              <p className="text-[9px] text-gray-400">Within 5-15 mins</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <ShieldCheck className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-white">100% Genuine</p>
              <p className="text-[9px] text-gray-400">Replacement Guarantee</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <MessageCircle className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-white">VIP Support</p>
              <p className="text-[9px] text-gray-400">24/7 WhatsApp</p>
            </div>
          </div>

        </div>

        {/* Footer Actions: Order Now + WhatsApp */}
        <div className="p-6 pt-4 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={`/checkout?pkgId=${item.id}`}
            onClick={onClose}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(204,255,0,0.35)] hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Order Now / অর্ডার করুন</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <a
            href={`https://wa.me/${supportWhatsApp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp Order</span>
          </a>
        </div>

      </div>
    </div>
  );
}
