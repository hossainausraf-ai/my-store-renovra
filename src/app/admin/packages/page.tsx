'use client';

import { useState } from 'react';
import { defaultProducts } from '@/data/products';
import { Package, CreditCard, Search, FileCode, CheckCircle2 } from 'lucide-react';

export default function AdminPackagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const packages = defaultProducts.filter((p) => p.product_type === 'subscription');

  const filtered = packages.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">সাবস্ক্রিপশন প্যাকেজসমূহ (Packages)</h1>
          <p className="text-gray-400 text-sm">
            ওয়েবসাইটে প্রদর্শিত সব প্যাকেজের তালিকা।
          </p>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-3">
        <FileCode className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-blue-300 font-semibold mb-1">প্যাকেজ যোগ বা আপডেট করবেন কীভাবে?</p>
          <p className="text-gray-300 leading-relaxed">
            এই প্যাকেজগুলো সরাসরি <code className="text-white bg-black/40 px-2 py-0.5 rounded font-mono">src/data/products.ts</code> ফাইলে কোড হিসেবে সংরক্ষিত। যেকোনো মূল্য পরিবর্তন বা নতুন প্যাকেজ যোগ করতে ফাইলটিতে এডিট করে GitHub-এ পুশ করুন।
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="প্যাকেজ খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {pkg.badge_text || pkg.category}
                </span>
                <span className="text-2xl font-extrabold text-white">৳ {pkg.price}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-sm text-gray-400 mb-6">{pkg.description}</p>

              <div className="space-y-2 mb-6 border-t border-white/5 pt-4">
                {pkg.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-xs text-gray-500 font-mono">
              ID: {pkg.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
