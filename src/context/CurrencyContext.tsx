'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'BDT' | 'INR' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromBDT: number; // multiply BDT by this to get foreign currency
  decimals: number;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  BDT: {
    code: 'BDT',
    symbol: '৳',
    name: 'BDT',
    rateFromBDT: 1,
    decimals: 0,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'INR',
    rateFromBDT: 1 / 1.45,
    decimals: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'USD',
    rateFromBDT: 1 / 120,
    decimals: 2,
  },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  symbol: string;
  config: CurrencyConfig;
  convertPrice: (amountInBDT: number) => number;
  formatPrice: (amountInBDT: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'renovra_selected_currency';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('BDT');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'BDT' || stored === 'INR' || stored === 'USD') {
        setCurrencyState(stored as CurrencyCode);
      }
    } catch (e) {
      console.warn('Could not read currency from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch (e) {
      console.warn('Could not save currency to localStorage', e);
    }
  };

  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.BDT;

  const convertPrice = (amountInBDT: number): number => {
    const raw = (Number(amountInBDT) || 0) * config.rateFromBDT;
    if (config.decimals === 0) {
      return Math.round(raw);
    }
    return Number(raw.toFixed(config.decimals));
  };

  const formatPrice = (amountInBDT: number): string => {
    const converted = convertPrice(amountInBDT);
    if (config.decimals > 0) {
      return `${config.symbol} ${converted.toFixed(config.decimals)}`;
    }
    return `${config.symbol} ${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        symbol: config.symbol,
        config,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: 'BDT' as CurrencyCode,
      setCurrency: () => {},
      symbol: '৳',
      config: CURRENCY_CONFIGS.BDT,
      convertPrice: (val: number) => Number(val) || 0,
      formatPrice: (val: number) => `৳ ${Number(val) || 0}`,
    };
  }
  return context;
}

