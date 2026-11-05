'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { defaultSettings } from '@/data/settings';
import { MessageCircle, Send, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState<string>(defaultSettings.logo_url || '');
  const [supportWhatsApp, setSupportWhatsApp] = useState<string>('8801766392692');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.logo_url) setLogoUrl(data.settings.logo_url);
          if (data.settings.support_whatsapp) {
            const num = data.settings.support_whatsapp.replace(/[^0-9]/g, '');
            setSupportWhatsApp(num.startsWith('88') ? num : `88${num}`);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#080d14] border-t border-white/10 pt-6 sm:pt-8 pb-20 md:pb-6 mt-auto w-full relative z-10 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Grid - Compact & Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Col 1: Brand & Tagline (md: 5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              {logoUrl ? (
                <img src={logoUrl} alt="Renovra" className="h-7 w-auto object-contain" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-[0_0_12px_rgba(59,130,246,0.4)]">
                  R
                </div>
              )}
              <span className="text-xl font-black text-white tracking-tight">
                Renovra
              </span>
            </Link>
            
            <p className="text-xs sm:text-[13px] text-gray-400 leading-relaxed max-w-sm">
              Your trusted platform for premium AI tools, software subscriptions & digital assets with 24/7 warranty.
            </p>

            {/* Social / Direct Action Pills */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://t.me/renovra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/40 text-gray-300 hover:text-blue-400 text-xs font-semibold transition-all active:scale-95"
                title="Telegram Channel"
              >
                <Send className="w-3.5 h-3.5 text-blue-400" />
                <span>Telegram</span>
              </a>

              <a
                href={`https://wa.me/${supportWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-emerald-600/20 border border-white/10 hover:border-emerald-500/40 text-gray-300 hover:text-emerald-400 text-xs font-semibold transition-all active:scale-95"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (md: 4 cols) */}
          <div className="md:col-span-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-2.5">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[13px]">
              <Link href="/" className="hover:text-[#ccff00] transition-colors">Home</Link>
              <Link href="/#packages" className="hover:text-[#ccff00] transition-colors">Packages</Link>
              <Link href="/digital-products" className="hover:text-[#ccff00] transition-colors">Digital Products</Link>
              <Link href="/track" className="hover:text-[#ccff00] transition-colors">Track Order</Link>
              <Link href="/about" className="hover:text-[#ccff00] transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-[#ccff00] transition-colors">Contact</Link>
            </div>
          </div>

          {/* Col 3: Direct Help & Support (md: 3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-2.5">
              Help & Support
            </h3>
            <div className="space-y-1.5 text-xs sm:text-[13px]">
              <a
                href={`https://wa.me/${supportWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <span className="text-emerald-400 font-bold">WhatsApp:</span>
                <span className="text-gray-300 font-medium">01766392692</span>
              </a>

              <a
                href="mailto:renovrait@gmail.com"
                className="flex items-center gap-2 hover:text-purple-400 transition-colors truncate"
              >
                <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="text-gray-300 truncate">renovrait@gmail.com</span>
              </a>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active 24/7 Instant Support</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar - Tight & Minimal */}
        <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Renovra. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secured with SSL & Cloudflare</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
