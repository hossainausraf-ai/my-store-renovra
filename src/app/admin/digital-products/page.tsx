'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  MonitorPlay, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Download, 
  Upload, 
  X, 
  CheckCircle2, 
  Loader2,
  ExternalLink,
  Zap
} from 'lucide-react';
import { optimizeImageClient, formatBytes } from '@/lib/image-optimizer';

type DigitalProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  download_url?: string;
};

export default function AdminDigitalProductsPage() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    download_url: ''
  });

  // Upload & Optimization state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?type=digital');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error('Error fetching digital products:', e);
      showNotification('error', 'ডিজিটাল প্রোডাক্ট লোড করতে ব্যর্থ হয়েছে!');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      download_url: ''
    });
    setImageFile(null);
    setImagePreview('');
    setOptimizationStats(null);
    setIsOptimizing(false);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEditClick = (product: DigitalProduct) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      image_url: product.image_url || '',
      download_url: product.download_url || ''
    });
    setImagePreview(product.image_url || '');
    setOptimizationStats(null);
    setIsOptimizing(false);
    setIsEditing(product.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'দয়া করে একটি সঠিক ইমেজ ফাইল দিন (PNG, JPG, SVG, WebP)');
      return;
    }

    setIsOptimizing(true);
    setOptimizationStats(null);

    try {
      // Auto-downsample to max 1200px & convert to high-fidelity WebP
      const result = await optimizeImageClient(file, { maxDimension: 1200, quality: 0.85 });
      setImageFile(result.file);
      setImagePreview(result.dataUrl);
      setFormData(prev => ({ ...prev, image_url: result.dataUrl }));

      if (result.originalSize > result.optimizedSize) {
        setOptimizationStats({
          original: formatBytes(result.originalSize),
          optimized: formatBytes(result.optimizedSize),
          saved: result.savedPercent,
          format: result.format.toUpperCase(),
        });
        showNotification('success', `ইমেজ অপ্টিমাইজড (${result.format.toUpperCase()}): ${formatBytes(result.originalSize)} ➔ ${formatBytes(result.optimizedSize)} (${result.savedPercent}% সাইজ সেভ)`);
      }
    } catch (err) {
      console.warn('Client optimization failed, fallback to raw reader:', err);
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image_url: result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let finalImageUrl = formData.image_url;

    if (imageFile) {
      setIsUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const upRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const upJson = await upRes.json();
        if (upJson.success && upJson.url) {
          finalImageUrl = upJson.url;
        }
      } catch (err) {
        console.warn('Image upload error:', err);
      }
      setIsUploading(false);
    }

    const payload = {
      id: isEditing || undefined,
      product_type: 'digital',
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      image_url: finalImageUrl,
      download_url: formData.download_url
    };

    try {
      const res = await fetch('/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification('success', isEditing ? 'প্রোডাক্ট সফলভাবে আপডেট হয়েছে!' : 'নতুন ডিজিটাল প্রোডাক্ট যোগ করা হয়েছে!');
        fetchProducts();
        resetForm();
      } else {
        showNotification('error', data.message || 'সংরক্ষণ করতে ব্যর্থ হয়েছে!');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'সার্ভারে সংযোগ করা যায়নি।');
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ডিজিটাল প্রোডাক্টটি ডিলিট করতে চান?')) return;

    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showNotification('success', 'প্রোডাক্ট ডিলিট করা হয়েছে!');
      } else {
        showNotification('error', 'ডিলিট করতে ব্যর্থ হয়েছে!');
      }
    } catch {
      showNotification('error', 'সার্ভারে সংযোগ করা যায়নি।');
    }
  };

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-8">

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">ডিজিটাল প্রোডাক্টসমূহ (Digital Products)</h1>
          <p className="text-gray-400 text-sm">ডাউনলোডযোগ্য ফাইল, ই-বুক, প্রম্পট প্যাক ও ড্রাইভ লিংক ম্যানেজ করুন।</p>
        </div>
        <button
          onClick={() => {
            if (isAdding) resetForm();
            else setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'বাতিল করুন' : 'নতুন ডিজিটাল প্রোডাক্ট যোগ করুন'}
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {isAdding && (
        <div className="bg-[#111827] border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-blue-400" />
              {isEditing ? 'ডিজিটাল প্রোডাক্ট এডিট করুন' : 'নতুন ডিজিটাল প্রোডাক্ট তৈরি করুন'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form 
            onSubmit={handleSaveProduct} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                e.preventDefault();
              }
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            
            {/* Image Upload Section */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">কভার ছবি বা প্রিভিউ ইমেজ</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px] ${
                  isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 bg-black/20'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/10 overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">ছবি সিলেক্ট করা হয়েছে</p>
                      <p className="text-xs text-blue-400 hover:underline">ছবি পরিবর্তন করতে ক্লিক করুন</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Upload className="w-6 h-6 text-gray-500" />
                    <p className="text-sm"><span className="text-blue-400 font-semibold">ক্লিক করে কভার ছবি আপলোড করুন</span> বা ড্র্যাগ করে দিন</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP</p>
                  </div>
                )}
              </div>

              {/* Optimization Status Badge */}
              {isOptimizing && (
                <div className="mt-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2 animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                  <span>ইমেজ প্রসেস হচ্ছে: সর্বোচ্চ স্বচ্ছতা বজায় রেখে WebP ফরম্যাটে অপ্টিমাইজ করা হচ্ছে...</span>
                </div>
              )}

              {optimizationStats && !isOptimizing && (
                <div className="mt-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <b>স্মার্ট অপ্টিমাইজড ({optimizationStats.format}):</b> {optimizationStats.original} ➔ <b className="text-white">{optimizationStats.optimized}</b>
                    </span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                    {optimizationStats.saved}% সাইজ সাশ্রয়!
                  </span>
                </div>
              )}

              <div className="mt-2">
                <input
                  type="text"
                  placeholder="অথবা সরাসরি ইমেজ লিংক দিন (https://...)"
                  value={formData.image_url}
                  onChange={e => {
                    setFormData({ ...formData, image_url: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="w-full bg-[#1F2937]/30 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">প্রোডাক্টের নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: 10,000+ ChatGPT Prompts Pack"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">মূল্য (টাকা) *</label>
              <input
                type="number"
                required
                placeholder="যেমন: 250"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">ক্যাটাগরি</label>
              <input
                type="text"
                placeholder="যেমন: Templates, UI/UX Kits"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                ডাউনলোড লিংক (Google Drive বা Dropbox লিংক) *
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={formData.download_url}
                onChange={e => setFormData({ ...formData, download_url: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-gray-500 mt-1">কাস্টমারের অর্ডার Approved হলে সে /track পেজ থেকে এই লিংকে ক্লিক করে ডাউনলোড করতে পারবে।</p>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">বর্ণনা (Description)</label>
              <textarea
                rows={2}
                placeholder="এই ফাইলে কী কী আছে তার সংক্ষিপ্ত বিবরণ..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {(isSaving || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Input */}
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

      {/* Digital Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            প্রোডাক্টগুলো লোড হচ্ছে...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-black/10">
            কোনো ডিজিটাল প্রোডাক্ট পাওয়া যায়নি। নতুন প্রোডাক্ট তৈরি করতে "+ নতুন ডিজিটাল প্রোডাক্ট যোগ করুন" বাটনে চাপুন।
          </div>
        ) : (
          filtered.map((product) => (
            <div
              key={product.id}
              className="bg-[var(--surface)] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-white/20 hover:shadow-2xl transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#1a2333] overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <MonitorPlay className="w-12 h-12" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                    {product.category || 'Digital'}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-4">{product.description || 'No description'}</p>

                  {product.download_url && (
                    <a
                      href={product.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 hover:underline mb-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      ড্রাইভ ডাউনলোড লিংক টেস্ট করুন
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-auto">
                <div className="text-xl font-bold text-white pt-4">
                  ৳{product.price}
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer"
                    title="Edit product"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
