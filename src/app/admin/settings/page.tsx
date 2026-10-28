'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  Phone, 
  CreditCard, 
  Send, 
  ShieldCheck, 
  Save, 
  Upload, 
  CheckCircle2, 
  X, 
  Loader2,
  Globe,
  Zap
} from 'lucide-react';
import { optimizeImageClient, formatBytes } from '@/lib/image-optimizer';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    site_name: 'Renovra',
    logo_url: '',
    support_whatsapp: '8801766392692',
    support_phone: '01766392692',
    bkash_number: '01766392692 (Personal)',
    nagad_number: '01766392692 (Personal)',
    bank_transfer_number: 'Islami Bank Bangladesh / City Bank',
    redotpay_id: '12345678 (RedotPay ID)',
    telegram_channel: '@renovra'
  });

  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStats, setOptimizationStats] = useState<{
    original: string;
    optimized: string;
    saved: number;
    format: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setFormData(data.settings);
          if (data.settings.logo_url) {
            setLogoPreview(data.settings.logo_url);
          }
        }
      })
      .catch(err => {
        console.warn('Error fetching settings:', err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'দয়া করে একটি সঠিক ইমেজ ফাইল দিন (PNG, JPG, SVG, WebP)');
        return;
      }

      setIsOptimizing(true);
      setOptimizationStats(null);

      try {
        // Optimize logo to max 600px with 90% quality WebP
        const result = await optimizeImageClient(file, { maxDimension: 600, quality: 0.9 });
        setLogoFile(result.file);
        setLogoPreview(result.dataUrl);
        setFormData(prev => ({ ...prev, logo_url: result.dataUrl }));

        if (result.originalSize > result.optimizedSize) {
          setOptimizationStats({
            original: formatBytes(result.originalSize),
            optimized: formatBytes(result.optimizedSize),
            saved: result.savedPercent,
            format: result.format.toUpperCase(),
          });
          showNotification('success', `লোগো অপ্টিমাইজড (${result.format.toUpperCase()}): ${formatBytes(result.originalSize)} ➔ ${formatBytes(result.optimizedSize)} (${result.savedPercent}% সাইজ সেভ)`);
        }
      } catch (err) {
        console.warn('Logo optimization error, fallback to raw reader:', err);
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => {
          const url = ev.target?.result as string;
          setLogoPreview(url);
          setFormData(prev => ({ ...prev, logo_url: url }));
        };
        reader.readAsDataURL(file);
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let finalLogoUrl = formData.logo_url;

    if (logoFile) {
      try {
        const uploadData = new FormData();
        uploadData.append('file', logoFile);
        const upRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const upJson = await upRes.json();
        if (upJson.success && upJson.url) {
          finalLogoUrl = upJson.url;
        }
      } catch (err) {
        console.warn('Logo upload error:', err);
      }
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, logo_url: finalLogoUrl })
      });
      const data = await res.json();

      if (data.success) {
        showNotification('success', 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
      } else {
        showNotification('error', data.message || 'সংরক্ষণ ব্যর্থ হয়েছে!');
      }
    } catch {
      showNotification('error', 'সার্ভারে সংযোগ করা যায়নি।');
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-gray-500 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        সেটিংস লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto space-y-8">

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all ${
          notification.type === 'success' 
            ? 'bg-green-950 border-green-500/40 text-green-300' 
            : 'bg-red-950 border-red-500/40 text-red-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">সাইট ও পেমেন্ট সেটিংস</h1>
        <p className="text-gray-400 text-sm">
          আপনার বিকাশ, নগদ, হোয়াটসঅ্যাপ ও ওয়েবসাইটের তথ্য সরাসরি আপডেট করুন।
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* General Site Information */}
        <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Globe className="w-5 h-5 text-blue-400" />
            সাধারণ তথ্য (General Info)
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">সাইটের নাম (Site Name)</label>
              <input
                type="text"
                value={formData.site_name}
                onChange={e => setFormData({ ...formData, site_name: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">টেলিগ্রাম চ্যানেল / গ্রুপ (@channel)</label>
              <input
                type="text"
                value={formData.telegram_channel}
                onChange={e => setFormData({ ...formData, telegram_channel: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">সাইট লোগো</label>
              <div className="flex items-center gap-5">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-2xl bg-black/30 border border-white/10 p-2 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="অথবা সরাসরি লোগো ইমেজ URL দিন (https://...)"
                    value={formData.logo_url}
                    onChange={e => {
                      setFormData({ ...formData, logo_url: e.target.value });
                      setLogoPreview(e.target.value);
                    }}
                    className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">বামপাশের বক্সে ক্লিক করে ছবি আপলোড করতে পারেন অথবা অনলাইন লিংক দিতে পারেন।</p>
                  
                  {isOptimizing && (
                    <div className="mt-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2 animate-pulse">
                      <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                      <span>লোগো অপ্টিমাইজ হচ্ছে...</span>
                    </div>
                  )}

                  {optimizationStats && !isOptimizing && (
                    <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><b>অপ্টিমাইজড ({optimizationStats.format}):</b> {optimizationStats.original} ➔ {optimizationStats.optimized}</span>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                        {optimizationStats.saved}% সাশ্রয়
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Contact */}
        <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Phone className="w-5 h-5 text-green-400" />
            সাপোর্ট ও যোগাযোগ (Support & Contacts)
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">WhatsApp হেল্পলাইন নম্বর</label>
              <input
                type="text"
                placeholder="যেমন: 8801766392692"
                value={formData.support_whatsapp}
                onChange={e => setFormData({ ...formData, support_whatsapp: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-gray-500 mt-1">কাস্টমার ক্লিক করলে সরাসরি এই নম্বরে WhatsApp চ্যাট শুরু হবে।</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">সাপোর্ট ফোন নম্বর (Call)</label>
              <input
                type="text"
                placeholder="যেমন: 01766392692"
                value={formData.support_phone}
                onChange={e => setFormData({ ...formData, support_phone: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <CreditCard className="w-5 h-5 text-purple-400" />
            পেমেন্ট মেথড নম্বরসমূহ (Payment Numbers)
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">বিকাশ নম্বর (bKash)</label>
              <input
                type="text"
                placeholder="যেমন: 01766392692 (Personal / Send Money)"
                value={formData.bkash_number}
                onChange={e => setFormData({ ...formData, bkash_number: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">নগদ নম্বর (Nagad)</label>
              <input
                type="text"
                placeholder="যেমন: 01766392692 (Personal / Send Money)"
                value={formData.nagad_number}
                onChange={e => setFormData({ ...formData, nagad_number: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">ব্যাংক ট্রান্সফার ইনফো (Bank Transfer)</label>
              <input
                type="text"
                placeholder="ব্যাংকের নাম ও একাউন্ট নম্বর..."
                value={formData.bank_transfer_number}
                onChange={e => setFormData({ ...formData, bank_transfer_number: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">RedotPay / ক্রিপ্টো ID</label>
              <input
                type="text"
                placeholder="RedotPay ID বা Binance Pay..."
                value={formData.redotpay_id}
                onChange={e => setFormData({ ...formData, redotpay_id: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer text-base"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            সেটিংস সেভ করুন
          </button>
        </div>
      </form>
    </div>
  );
}
