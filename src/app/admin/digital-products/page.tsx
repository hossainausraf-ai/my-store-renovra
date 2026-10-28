'use client';

import { useState } from 'react';
import { defaultProducts } from '@/data/products';
import { MonitorPlay, Search, FileCode, Download } from 'lucide-react';

export default function AdminDigitalProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const digitalProducts = defaultProducts.filter((p) => p.product_type === 'digital');

  const filtered = digitalProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">ডিজিটাল প্রোডাক্টসমূহ (Digital Products)</h1>
        <p className="text-gray-400 text-sm">ডাউনলোডযোগ্য ফাইল, ই-বুক ও প্রম্পট প্যাকের তালিকা।</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-3">
        <FileCode className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-blue-300 font-semibold mb-1">ডিজিটাল প্রোডাক্ট ও ডাউনলোড লিংক আপডেট করবেন কীভাবে?</p>
          <p className="text-gray-300 leading-relaxed">
            এই প্রোডাক্টগুলো <code className="text-white bg-black/40 px-2 py-0.5 rounded font-mono">src/data/products.ts</code> ফাইলে সংরক্ষিত। সেখানে প্রতিটি প্রোডাক্টের জন্য <code className="text-cyan-400 font-mono">download_url</code> যুক্ত করে GitHub-এ পুশ করতে পারেন।
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="ডিজিটাল প্রোডাক্ট খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-[var(--surface)] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
          >
            {product.image_url && (
              <div className="h-44 w-full overflow-hidden bg-black/50">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 mb-4">{product.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xl font-bold text-white">৳ {product.price}</span>
                {product.download_url && (
                  <a
                    href={product.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Link
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
