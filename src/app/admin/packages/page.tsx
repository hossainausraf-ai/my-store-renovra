'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  CreditCard,
  Search,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type Product = {
  id: string;
  product_type: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  features: string[];
  badge_text: string;
  color_from: string;
  color_to: string;
  is_popular: boolean;
};

export default function AdminPackagesPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
    badge_text: 'Popular',
    features: '',
    color_from: 'from-blue-500/50',
    color_to: 'to-blue-500/10',
    is_popular: false
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?type=subscription');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error('Error fetching packages:', e);
      showNotification('error', 'প্যাকেজ লোড করতে সমস্যা হয়েছে!');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', category: '', badge_text: 'Popular', 
      features: '', color_from: 'from-blue-500/50', color_to: 'to-blue-500/10', is_popular: false
    });
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEditClick = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      badge_text: product.badge_text || '',
      features: product.features ? product.features.join('\n') : '',
      color_from: product.color_from || 'from-blue-500/50',
      color_to: product.color_to || 'to-blue-500/10',
      is_popular: product.is_popular || false
    });
    setIsEditing(product.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Split by newlines or commas
    const featuresArray = formData.features 
      ? formData.features.split(/\r?\n|,/).map(f => f.trim()).filter(f => f !== '') 
      : [];

    const payload = {
      id: isEditing || undefined,
      product_type: 'subscription',
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      badge_text: formData.badge_text,
      features: featuresArray,
      color_from: formData.color_from,
      color_to: formData.color_to,
      is_popular: formData.is_popular,
      validity: '30 Days'
    };

    try {
      const res = await fetch('/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification('success', isEditing ? 'প্যাকেজ সফলভাবে আপডেট হয়েছে!' : 'নতুন প্যাকেজ যোগ করা হয়েছে!');
        fetchProducts();
        resetForm();
      } else {
        showNotification('error', data.message || 'প্যাকেজ সংরক্ষণ করতে সমস্যা হয়েছে!');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'সার্ভারে সংযোগ করা যায়নি।');
    }
    
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই প্যাকেজটি ডিলিট করতে চান?')) return;
    
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showNotification('success', 'প্যাকেজ ডিলিট করা হয়েছে!');
      } else {
        showNotification('error', 'ডিলিট করতে সমস্যা হয়েছে!');
      }
    } catch {
      showNotification('error', 'সার্ভারে সংযোগ করা যায়নি।');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setProducts(items);

    try {
      await fetch('/api/products/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: items.map(p => p.id) })
      });
    } catch (e) {
      console.error('Error reordering packages:', e);
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
          <h1 className="text-3xl font-bold text-white mb-1">সাবস্ক্রিপশন প্যাকেজসমূহ (Packages)</h1>
          <p className="text-gray-400 text-sm">
            ওয়েবসাইটে প্রদর্শিত প্যাকেজ যোগ, এডিট, রি-অর্ডার বা ডিলিট করুন।
          </p>
        </div>
        <button
          onClick={() => {
            if (isAdding) resetForm();
            else setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'বাতিল করুন' : 'নতুন প্যাকেজ যোগ করুন'}
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {isAdding && (
        <div className="bg-[#111827] border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              {isEditing ? 'প্যাকেজ এডিট করুন' : 'নতুন প্যাকেজ তৈরি করুন'}
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
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">প্যাকেজের নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: Pro Creator Suite"
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
                placeholder="যেমন: 990"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">ক্যাটাগরি</label>
              <input
                type="text"
                placeholder="যেমন: AI Bundle, Design"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">ব্যাজ টেক্সট</label>
              <input
                type="text"
                placeholder="যেমন: Popular, Best Value"
                value={formData.badge_text}
                onChange={e => setFormData({ ...formData, badge_text: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">গ্রেডিয়েন্ট শুরু (Color From)</label>
              <input
                type="text"
                placeholder="from-blue-500/50"
                value={formData.color_from}
                onChange={e => setFormData({ ...formData, color_from: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">গ্রেডিয়েন্ট শেষ (Color To)</label>
              <input
                type="text"
                placeholder="to-indigo-500/10"
                value={formData.color_to}
                onChange={e => setFormData({ ...formData, color_to: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  ফিচারসমূহ (প্রতি লাইনে একটি করে ফিচার লিখুন)
                </label>
                <span className="text-[11px] text-blue-400 font-medium">Enter চাপলে নতুন লাইন তৈরি হবে</span>
              </div>
              <textarea
                rows={4}
                placeholder={"যেমন:\nChatGPT Plus GPT-4o\nCanva Pro 1 Year\nEnvato Elements Daily Download\n24/7 Priority Support"}
                value={formData.features}
                onChange={e => setFormData({ ...formData, features: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
              />
              <p className="text-[11px] text-gray-500 mt-1">প্রতিটি ফিচার লেখার পর Enter চেপে পরবর্তী লাইনে যান।</p>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">বর্ণনা (Description)</label>
              <textarea
                rows={2}
                placeholder="সংক্ষিপ্ত বর্ণনা..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={e => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="rounded bg-[#1F2937] border-white/20 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                পপুলার প্যাকেজ হিসেবে হাইলাইট করুন
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEditing ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

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

      {/* Drag & Drop Packages Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="packages-list" direction="horizontal">
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {isLoading ? (
                <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  প্যাকেজগুলো লোড হচ্ছে...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-black/10">
                  কোনো প্যাকেজ পাওয়া যায়নি। নতুন প্যাকেজ তৈরি করতে "+ নতুন প্যাকেজ যোগ করুন" বাটনে চাপুন।
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <Draggable key={product.id} draggableId={product.id} index={index} isDragDisabled={searchQuery.length > 0}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          ...(snapshot.isDragging ? { opacity: 0.8, zIndex: 100 } : {})
                        }}
                        className={`bg-[var(--surface)] border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 hover:shadow-2xl transition-all flex flex-col ${snapshot.isDragging ? 'shadow-blue-500/20 shadow-2xl border-blue-500/50' : ''}`}
                      >
                        <div className={`relative aspect-[4/3] bg-gradient-to-br ${product.color_from || 'from-blue-500/50'} ${product.color_to || 'to-blue-500/10'} opacity-90 flex flex-col items-center justify-center p-6 text-center group-hover:opacity-100 transition-opacity`}>
                          {product.is_popular && (
                            <div className="absolute top-0 right-8 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-lg">
                              Popular
                            </div>
                          )}
                          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                            {product.category || 'Package'}
                          </div>
                          
                          {/* Drag Handle */}
                          <div 
                            {...provided.dragHandleProps}
                            className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-md rounded border border-white/10 text-white/50 hover:text-white cursor-grab active:cursor-grabbing transition-colors"
                            title="Drag to reorder"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>

                          <Package className="w-12 h-12 text-white mb-3" />
                          <h3 className="text-xl font-bold text-white">{product.name}</h3>
                        </div>

                        <div className="p-5 flex flex-col flex-1 justify-between">
                          <p className="text-xs text-gray-400 line-clamp-2 mb-4">{product.description || 'No description'}</p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="text-xl font-bold text-white flex items-baseline gap-1">
                              <span className="text-sm text-gray-400">৳</span>{product.price}
                              <span className="text-xs text-gray-500 font-normal">/মাস</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEditClick(product)}
                                className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer"
                                title="Edit package"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                                title="Delete package"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
