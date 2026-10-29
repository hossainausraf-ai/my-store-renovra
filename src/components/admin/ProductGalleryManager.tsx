'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Star, 
  Loader2, 
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { optimizeImageClient, formatBytes } from '@/lib/image-optimizer';

interface ProductGalleryManagerProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  galleryImages: string[];
  onGalleryImagesChange: (images: string[]) => void;
  maxGalleryImages?: number;
}

export default function ProductGalleryManager({
  imageUrl,
  onImageUrlChange,
  galleryImages = [],
  onGalleryImagesChange,
  maxGalleryImages = 5
}: ProductGalleryManagerProps) {
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlType, setUrlType] = useState<'main' | 'gallery'>('gallery');
  const [errorMsg, setErrorMsg] = useState('');

  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Helper to upload a single file with WebP optimization
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      // 1. Optimize on client to max 1200px WebP
      let uploadTargetFile = file;
      try {
        const optimized = await optimizeImageClient(file, { maxDimension: 1200, quality: 0.85 });
        uploadTargetFile = optimized.file;
      } catch (optErr) {
        console.warn('Client optimize fallback:', optErr);
      }

      // 2. Upload to /api/upload
      const formData = new FormData();
      formData.append('file', uploadTargetFile);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
      return null;
    } catch (err) {
      console.error('File upload error:', err);
      return null;
    }
  };

  // Main Image Upload
  const handleMainFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setErrorMsg('দয়া করে একটি সঠিক ইমেজ ফাইল নির্বাচন করুন।');
      return;
    }

    setIsUploadingMain(true);
    setErrorMsg('');
    const url = await uploadFile(file);
    if (url) {
      onImageUrlChange(url);
    } else {
      setErrorMsg('মেইন ছবি আপলোড করতে সমস্যা হয়েছে!');
    }
    setIsUploadingMain(false);
    if (mainInputRef.current) mainInputRef.current.value = '';
  };

  // Gallery Multiple Files Upload
  const handleGalleryFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));

    const remainingSlots = maxGalleryImages - galleryImages.length;
    if (remainingSlots <= 0) {
      setErrorMsg(`সর্বোচ্চ ${maxGalleryImages} টি গ্যালারি ছবি যোগ করতে পারবেন।`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    setIsUploadingGallery(true);
    setErrorMsg('');

    const uploadedUrls: string[] = [];
    for (const file of filesToUpload) {
      const url = await uploadFile(file);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      onGalleryImagesChange([...galleryImages, ...uploadedUrls]);
    }
    setIsUploadingGallery(false);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  // Add via Direct URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (urlType === 'main') {
      onImageUrlChange(urlInput.trim());
    } else {
      if (galleryImages.length >= maxGalleryImages) {
        setErrorMsg(`সর্বোচ্চ ${maxGalleryImages} টি ছবি যোগ করা সম্ভব।`);
        return;
      }
      onGalleryImagesChange([...galleryImages, urlInput.trim()]);
    }

    setUrlInput('');
    setShowUrlModal(false);
  };

  // Delete from Gallery
  const handleDeleteGalleryImage = (indexToDelete: number) => {
    const updated = galleryImages.filter((_, idx) => idx !== indexToDelete);
    onGalleryImagesChange(updated);
  };

  // Make a gallery image the main image
  const handleMakeMain = (indexToMain: number) => {
    const chosen = galleryImages[indexToMain];
    const oldMain = imageUrl;
    
    // Replace chosen with old main if old main exists, else just remove chosen
    const updated = [...galleryImages];
    if (oldMain) {
      updated[indexToMain] = oldMain;
    } else {
      updated.splice(indexToMain, 1);
    }

    onImageUrlChange(chosen);
    onGalleryImagesChange(updated);
  };

  return (
    <div className="space-y-4 bg-[#0a101d] border border-white/10 rounded-2xl p-4 sm:p-5">
      
      {/* Header & Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#ccff00]" />
            প্রোডাক্ট ইমেজ ও গ্যালারি ফটো (মেইন ছবি + ৪-৫ টি থাম্বনেইল)
          </h4>
          <p className="text-[11px] text-gray-400 mt-0.5">
            চেকআউট ও সিঙ্গেল প্রোডাক্ট ভিউতে এই ছবিগুলো ছোট থাম্বনেইল হিসেবে থাকবে এবং ক্লিক করলে মেইন পিকচারে দেখা যাবে।
          </p>
        </div>
        <span className="text-[10px] font-bold text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 px-2.5 py-1 rounded-full shrink-0">
          গ্যালারি: {galleryImages.length}/{maxGalleryImages} টি
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Image Section */}
      <div>
        <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
          ১. প্রধান ছবি (Main Display Picture) *
        </label>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Main Preview Box */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-black/50 border-2 border-dashed border-white/20 overflow-hidden flex items-center justify-center relative shrink-0 group shadow-lg">
            {imageUrl ? (
              <>
                <img 
                  src={imageUrl} 
                  alt="Main Preview" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
                <div className="absolute top-1 left-1 bg-[#ccff00] text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                  MAIN
                </div>
                <button
                  type="button"
                  onClick={() => onImageUrlChange('')}
                  title="Remove Main Image"
                  className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 p-2 text-center">
                <ImageIcon className="w-8 h-8 mb-1 opacity-40" />
                <span className="text-[10px]">মেইন ছবি দিন</span>
              </div>
            )}

            {isUploadingMain && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-xs text-white">
                <Loader2 className="w-6 h-6 animate-spin text-[#ccff00] mb-1" />
                <span>অপ্টিমাইজ হচ্ছে...</span>
              </div>
            )}
          </div>

          {/* Action buttons for Main Image */}
          <div className="flex-1 space-y-2.5 w-full">
            <input 
              type="file" 
              ref={mainInputRef} 
              onChange={handleMainFileSelect} 
              accept="image/*" 
              className="hidden" 
            />
            
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => mainInputRef.current?.click()}
                disabled={isUploadingMain}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>মেইন ছবি আপলোড করুন</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUrlType('main');
                  setUrlInput(imageUrl);
                  setShowUrlModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-bold transition border border-white/10 cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>ছবির URL পেস্ট করুন</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              PNG, JPG, WebP অথবা SVG সমর্থন করে। ফাইল আপলোড করলে স্বয়ংক্রিয়ভাবে সুপার-ফাস্ট WebP ফরম্যাটে অপ্টিমাইজ হবে।
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Additional Images Section */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
            ২. অতিরিক্ত ছবি ও স্ক্রিনশট (৪-৫ টি থাম্বনেইল)
          </label>
          <span className="text-[11px] text-gray-400">
            সর্বোচ্চ {maxGalleryImages} টি ছবি
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          
          {/* Render uploaded gallery thumbnails */}
          {galleryImages.map((url, idx) => (
            <div 
              key={idx}
              className="relative aspect-square rounded-xl bg-black/40 border border-white/15 overflow-hidden group shadow-md"
            >
              <img 
                src={url} 
                alt={`Gallery ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105" 
              />
              
              <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm text-gray-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                #{idx + 1}
              </div>

              {/* Hover Overlay with Action Buttons */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                <button
                  type="button"
                  onClick={() => handleMakeMain(idx)}
                  className="px-2 py-1 rounded bg-[#ccff00] text-black text-[9px] font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                  title="Make this the Main Image"
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>মেইন করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteGalleryImage(idx)}
                  className="px-2 py-1 rounded bg-red-600/80 text-white text-[9px] font-bold flex items-center gap-1 hover:bg-red-600 transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>মুছুন</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add More Gallery Card Button */}
          {galleryImages.length < maxGalleryImages && (
            <div className="aspect-square rounded-xl border-2 border-dashed border-white/15 hover:border-blue-500/50 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center p-2 text-center relative group">
              <input 
                type="file" 
                ref={galleryInputRef} 
                onChange={handleGalleryFilesSelect} 
                accept="image/*" 
                multiple
                className="hidden" 
              />

              {isUploadingGallery ? (
                <div className="flex flex-col items-center justify-center text-[10px] text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin text-[#ccff00] mb-1" />
                  <span>যোগ হচ্ছে...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full flex-1 flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5 text-[#ccff00] mb-0.5" />
                    <span className="text-[10px] font-bold text-gray-300">ছবি যোগ করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUrlType('gallery');
                      setUrlInput('');
                      setShowUrlModal(true);
                    }}
                    className="text-[9px] text-blue-400 hover:underline pt-1 border-t border-white/10 w-full"
                  >
                    URL দিন
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* URL Input Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/15 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h5 className="text-sm font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-blue-400" />
              {urlType === 'main' ? 'মেইন ছবির URL দিন' : 'গ্যালারি ছবির URL যোগ করুন'}
            </h5>
            
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-[#1F2937] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 text-gray-300 text-xs font-semibold hover:bg-white/15"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-1.5 rounded-xl bg-[#ccff00] text-black text-xs font-bold hover:bg-[#b3e600]"
              >
                যুক্ত করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

