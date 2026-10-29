'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Check, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    subtotal,
    appliedCoupon,
    discountAmount,
    finalTotal,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim();
    if (!code) return;
    setIsApplyingCoupon(true);
    setCouponMsg(null);

    const res = await applyCoupon(code);
    setIsApplyingCoupon(false);

    if (res.success) {
      setCouponMsg({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponMsg({ type: 'error', text: res.message });
    }
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout?cart=true');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Slide-over Drawer from Right */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0F172A] border-l border-white/10 shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Shopping Cart
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ccff00] text-black font-extrabold">
                  {totalCount}
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">আপনার নির্বাচিত টুলস ও প্যাকেজসমূহ</p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-4">
              <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">আপনার কার্ট খালি আছে</h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xs mb-6">
              যেকোনো প্রিমিয়াম টুল বা প্যাকেজের &ldquo;Add to Cart&rdquo; বাটনে ক্লিক করে সহজেই এখানে যুক্ত করুন।
            </p>
            <button
              onClick={closeCart}
              className="px-6 py-3 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)]"
            >
              টুলস ব্রাউজ করুন
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center gap-3 relative group"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center text-white font-bold text-base">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate mb-0.5">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-gray-300 font-medium">
                      {item.validity || '1 Month'}
                    </span>
                    <span className="text-xs font-bold text-[#ccff00]">
                      ৳{item.price * item.quantity}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-gray-500">
                        (৳{item.price} each)
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-white/10 rounded-lg bg-black/30 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                  title="কার্ট থেকে সরান"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Clear Cart link */}
            <div className="flex justify-end pt-1">
              <button
                onClick={clearCart}
                className="text-[11px] text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                কার্ট পরিষ্কার করুন
              </button>
            </div>

            {/* Coupon Code Section */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#ccff00]" />
                  ডিসকাউন্ট কুপন কোড
                </span>
                {appliedCoupon && (
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-red-400 hover:underline"
                  >
                    রিমুভ করুন
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
                  <span className="font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    কুপন &apos;{appliedCoupon.code}&apos; প্রয়োগ হয়েছে (-৳{discountAmount})
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black">
                    {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}% OFF` : `৳${appliedCoupon.discount_value} OFF`}
                  </span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="কুপন কোড দিন (যেমন: WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ccff00] uppercase"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#ccff00] hover:text-black text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    {isApplyingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              )}

              {couponMsg && (
                <p className={`text-[11px] ${couponMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponMsg.text}
                </p>
              )}

              {/* Quick Coupon Suggestions */}
              {!appliedCoupon && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 self-center">ক্লিক করে কুপন ব্যবহার করুন:</span>
                  {['WELCOME10', 'SAVE50', 'DEMO50'].map(cpn => (
                    <button
                      key={cpn}
                      onClick={() => handleApplyCoupon(cpn)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 hover:bg-[#ccff00]/20 text-gray-300 hover:text-[#ccff00] border border-white/10 transition-colors"
                    >
                      {cpn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Summary & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-white/[0.02] space-y-3.5">
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-400">
                <span>সাবটোটাল ({totalCount}টি আইটেম):</span>
                <span className="text-white font-medium">৳{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>কুপন ডিসকাউন্ট:</span>
                  <span className="font-bold">- ৳{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-white">
                <span className="text-sm sm:text-base font-bold">সর্বমোট প্রদেয়:</span>
                <div className="text-right">
                  <span className="text-lg sm:text-2xl font-black text-[#ccff00] tracking-tight">
                    ৳{finalTotal}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] active:scale-[0.98]"
            >
              <span>অর্ডার সম্পন্ন করুন / Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>১০০% নিরাপদ পেমেন্ট ও ইনস্ট্যান্ট এক্টিভেশন</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

