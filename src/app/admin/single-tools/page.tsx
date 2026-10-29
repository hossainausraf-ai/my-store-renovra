'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Wrench, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  X, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Clock,
  Zap,
  Sparkles,
  GripVertical
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { optimizeImageClient, formatBytes } from '@/lib/image-optimizer';
import ProductGalleryManager from '@/components/admin/ProductGalleryManager';

type SingleTool = {
  id: string;
  name: string;
  image_url: string;
  gallery_images?: string[];
  price: number;
  category: string;
  validity?: string;
  description?: string;
};

export default function AdminSingleToolsPage() {
  const [tools, setTools] = useState<SingleTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    gallery_images: [] as string[],
    price: '',
    category: '',
    validity: '30 Days',
    description: ''
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

  const fetchTools = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?type=single_tool');
      const data = await res.json();
      if (data.success && data.products) {
        setTools(data.products);
      }
    } catch (e) {
      console.error('Error fetching tools:', e);
      showNotification('error', 'টুলস লোড করতে সমস্যা হয়েছে!');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      image_url: '',
      gallery_images: [],
      price: '',
      category: '',
      validity: '30 Days',
      description: ''
    });
    setImageFile(null);
    setImagePreview('');
    setOptimizationStats(null);
    setIsOptimizing(false);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEditClick = (tool: SingleTool) => {
    setFormData({
      name: tool.name,
      image_url: tool.image_url || '',
      gallery_images: tool.gallery_images || [],
      price: tool.price.toString(),
      category: tool.category || '',
      validity: tool.validity || '30 Days',
      description: tool.description || ''
    });
    setImagePreview(tool.image_url || '');
    setOptimizationStats(null);
    setIsOptimizing(false);
    setIsEditing(tool.id);
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
      // Auto-downsample to max 800px & convert to high-fidelity WebP (85% quality)
      const result = await optimizeImageClient(file, { maxDimension: 800, quality: 0.85 });
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

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let finalImageUrl = formData.image_url;

    // Upload image if a new file was chosen
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
      product_type: 'single_tool',
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      image_url: finalImageUrl,
      gallery_images: formData.gallery_images,
      validity: formData.validity || '30 Days',
      features: [formData.validity || '30 Days']
    };

    try {
      const res = await fetch('/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification('success', isEditing ? 'টুল আপডেট সফল হয়েছে!' : 'নতুন টুল সফলভাবে যোগ করা হয়েছে!');
        fetchTools();
        resetForm();
      } else {
        showNotification('error', data.message || 'টুল সংরক্ষণ করতে ব্যর্থ হয়েছে!');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'সার্ভারে সংযোগ করা যায়নি।');
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই টুলটি ডিলিট করতে চান?')) return;

    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTools(prev => prev.filter(t => t.id !== id));
        showNotification('success', 'টুল ডিলিট করা হয়েছে!');
      } else {
        showNotification('error', 'ডিলিট করতে ব্যর্থ হয়েছে!');
      }
    } catch {
      showNotification('error', 'সার্ভারে সংযোগ করা যায়নি।');
    }
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    
    const items = Array.from(tools);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTools(items);

    try {
      const res = await fetch('/api/products/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: items.map(t => t.id) })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'টুলসের ক্রম সফলভাবে আপডেট হয়েছে!');
      } else {
        showNotification('error', 'ক্রম পরিবর্তন সংরক্ষণ করতে সমস্যা হয়েছে!');
      }
    } catch (e) {
      console.error('Error reordering tools:', e);
      showNotification('error', 'সার্ভারে সংযোগ করা যায়নি।');
    }
  };

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
          <h1 className="text-3xl font-bold text-white mb-1">সিঙ্গেল টুলস (Single Tools)</h1>
          <p className="text-gray-400 text-sm">এককভাবে বিক্রয়যোগ্য প্রিমিয়াম টুলসের তালিকা ও প্রাইসিং ম্যানেজ করুন।</p>
        </div>
        <button
          onClick={() => {
            if (isAdding) resetForm();
            else setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'বাতিল করুন' : 'নতুন টুল যোগ করুন'}
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {isAdding && (
        <div className="bg-[#111827] border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-400" />
              {isEditing ? 'টুল এডিট করুন' : 'নতুন টুল যোগ করুন'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form 
            onSubmit={handleSaveTool} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                e.preventDefault();
              }
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            
            {/* Product Gallery Manager (Main + 4-5 Thumbnails) */}
            <div className="sm:col-span-2 lg:col-span-3">
              <ProductGalleryManager
                imageUrl={formData.image_url}
                onImageUrlChange={(url) => {
                  setFormData(prev => ({ ...prev, image_url: url }));
                  setImagePreview(url);
                }}
                galleryImages={formData.gallery_images}
                onGalleryImagesChange={(imgs) => setFormData(prev => ({ ...prev, gallery_images: imgs }))}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">টুলের নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: ChatGPT Plus"
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
                placeholder="যেমন: 350"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">ক্যাটাগরি</label>
              <input
                type="text"
                placeholder="যেমন: AI Writing, Graphics"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">মেয়াদ (Validity)</label>
              <input
                type="text"
                placeholder="যেমন: 1 Month বা 30 Days"
                value={formData.validity}
                onChange={e => setFormData({ ...formData, validity: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">সংক্ষিপ্ত বর্ণনা (Description)</label>
              <input
                type="text"
                placeholder="টুলের সুবিধা বা বর্ণনা..."
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

      {/* Search Input & Helper Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="টুল খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
          <GripVertical className="w-4 h-4 text-[#ccff00]" />
          <span>টুলসের ক্রম আগে-পরে নিতে ⠿ আইকনটি ধরে ড্র্যাগ করুন</span>
        </div>
      </div>

      {/* Drag & Drop Single Tools Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="single-tools-list" direction="horizontal">
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {isLoading ? (
                <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  টুলস লোড হচ্ছে...
                </div>
              ) : filteredTools.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-black/10">
                  কোনো টুল পাওয়া যায়নি। নতুন টুল যোগ করতে "+ নতুন টুল যোগ করুন" বাটনে চাপুন।
                </div>
              ) : (
                filteredTools.map((tool, index) => (
                  <Draggable key={tool.id} draggableId={tool.id} index={index} isDragDisabled={searchQuery.length > 0}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          ...(snapshot.isDragging ? { opacity: 0.85, zIndex: 100 } : {})
                        }}
                        className={`bg-[var(--surface)] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between group hover:border-white/20 hover:shadow-2xl transition-all ${
                          snapshot.isDragging ? 'shadow-blue-500/30 shadow-2xl border-blue-500/60 ring-2 ring-blue-500/30 scale-105' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 p-2.5 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                              {tool.image_url ? (
                                <img src={tool.image_url} alt={tool.name} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <Wrench className="w-7 h-7 text-gray-400" />
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-full">
                                {tool.category || 'Tool'}
                              </span>

                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="p-1.5 bg-black/40 hover:bg-white/10 rounded-lg border border-white/10 text-white/40 hover:text-[#ccff00] cursor-grab active:cursor-grabbing transition-colors"
                                title="টুলটির ক্রম আগে-পরে নিতে ড্র্যাগ করুন (Drag to reorder)"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-4">{tool.description || 'No description'}</p>

                          <div className="flex items-center gap-2 text-xs text-green-400 bg-green-950/30 border border-green-800/30 px-3 py-1.5 rounded-lg mb-4 w-fit">
                            <Clock className="w-3.5 h-3.5" />
                            <span>মেয়াদ: {tool.validity || '30 Days'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="text-xl font-bold text-white">
                            ৳{tool.price}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(tool)}
                              className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer"
                              title="Edit tool"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tool.id)}
                              className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                              title="Delete tool"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
