'use client';

import { useState } from 'react';
import { defaultProducts } from '@/data/products';
import { Wrench, Search, FileCode } from 'lucide-react';

export default function AdminSingleToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const singleTools = defaultProducts.filter((p) => p.product_type === 'single_tool');

  const filtered = singleTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">সিঙ্গেল টুলস (Single Tools)</h1>
        <p className="text-gray-400 text-sm">এককভাবে বিক্রয়যোগ্য প্রিমিয়াম টুলসের তালিকা।</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-3">
        <FileCode className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-blue-300 font-semibold mb-1">টুলস যোগ বা এডিট করবেন কীভাবে?</p>
          <p className="text-gray-300 leading-relaxed">
            টুলসের তালিকা সরাসরি <code className="text-white bg-black/40 px-2 py-0.5 rounded font-mono">src/data/products.ts</code> ফাইলে সংরক্ষিত। কোডে আপডেট করে GitHub-এ পুশ করলেই ওয়েবসাইটে স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="টুল খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((tool) => (
          <div
            key={tool.id}
            className="bg-[var(--surface)] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/10 p-2 mb-4 flex items-center justify-center">
                {tool.image_url ? (
                  <img src={tool.image_url} alt={tool.name} className="w-8 h-8 object-contain" />
                ) : (
                  <Wrench className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                {tool.category}
              </span>
              <h3 className="text-lg font-bold text-white mb-1">{tool.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 mb-4">{tool.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-xl font-bold text-white">৳ {tool.price}</span>
              <span className="text-xs text-gray-400">{tool.validity || '1 Month'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
