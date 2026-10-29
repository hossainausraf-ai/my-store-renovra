'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  imageUrl?: string;
  product_type?: string;
  validity?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalCount: number;
  subtotal: number;
  couponCode: string;
  appliedCoupon: any;
  discountAmount: number;
  finalTotal: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'renovra_shopping_cart';
const COUPON_STORAGE_KEY = 'renovra_cart_coupon';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        const c = JSON.parse(storedCoupon);
        setAppliedCoupon(c);
        setCouponCode(c.code);
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
  }, [items, isInitialized]);

  // Save/remove coupon in localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to sync coupon', e);
    }
  }, [appliedCoupon, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [...prev, { ...item, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Calculate discount based on applied coupon
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (subtotal >= (appliedCoupon.min_order_amount || 0)) {
      if (appliedCoupon.discount_type === 'percentage') {
        const raw = (subtotal * appliedCoupon.discount_value) / 100;
        discountAmount = appliedCoupon.max_discount_amount && appliedCoupon.max_discount_amount > 0
          ? Math.min(raw, appliedCoupon.max_discount_amount)
          : raw;
      } else {
        discountAmount = Math.min(appliedCoupon.discount_value, subtotal);
      }
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const applyCoupon = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: 'দয়া করে একটি কুপন কোড লিখুন' };
    }
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: trimmed,
          price: subtotal,
          productId: 'cart',
          productType: 'all',
        }),
      });
      const data = await res.json();
      if (data.valid && data.coupon) {
        setAppliedCoupon(data.coupon);
        setCouponCode(trimmed);
        return { success: true, message: data.message || `কুপন '${trimmed}' সফলভাবে যুক্ত হয়েছে!` };
      } else {
        return { success: false, message: data.message || 'কুপনটি সঠিক নয় বা মেয়াদ শেষ।' };
      }
    } catch (e) {
      return { success: false, message: 'কুপন যাচাই করতে সমস্যা হয়েছে।' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        totalCount,
        subtotal,
        couponCode,
        appliedCoupon,
        discountAmount,
        finalTotal,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
