'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { 
  Package, 
  CreditCard,
  Search,
  Plus,
  Pencil,
  GripVertical
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
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    badge_text: 'New',
    features: '',
    color_from: 'from-blue-500/50',
    color_to: 'to-blue-500/10',
    is_popular: false
  });

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_type', 'subscription')
      // Fallback to created_at if order_idx doesn't exist yet, but order by order_idx first
      .order('order_idx', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', category: '', badge_text: 'New', 
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
      features: product.features ? product.features.join(', ') : '',
      color_from: product.color_from || '',
      color_to: product.color_to || '',
      is_popular: product.is_popular || false
    });
    setIsEditing(product.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    const featuresArray = formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f !== '') : [];

    const payload = {
      product_type: 'subscription',
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      badge_text: formData.badge_text,
      features: featuresArray,
      color_from: formData.color_from,
      color_to: formData.color_to,
      is_popular: formData.is_popular
    };

    if (isEditing) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', isEditing);

      if (error) {
        alert('প্যাকেজ আপডেট করতে সমস্যা হয়েছে!');
        console.error(error);
      } else {
        alert('সফলভাবে আপডেট করা হয়েছে!');
        fetchProducts();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([payload]);

      if (error) {
        alert('প্যাকেজ অ্যাড করতে সমস্যা হয়েছে!');
        console.error(error);
      } else {
        alert('সফলভাবে যোগ করা হয়েছে!');
        fetchProducts();
        resetForm();
      }
    }
    
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert('ডিলিট করতে সমস্যা হয়েছে!');
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    // Only allow drag and drop if there is no search query active
    if (searchQuery) {
      alert('অনুগ্রহ করে সার্চ ক্লিয়ার করে তারপর ড্র্যাগ অ্যান্ড ড্রপ করুন।');
      return;
    }

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic update
    setProducts(items);

    // Prepare payload
    const updates = items.map((item, index) => ({
      id: item.id,
      order_idx: index
    }));

    // Update in Supabase (we'll do a loop update for simplicity since packages are few)
    // In production with many items, a custom RPC function would be better.
    for (const update of updates) {
      await supabase.from('products').update({ order_idx: update.order_idx }).eq('id', update.id);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Subscription Packages</h1>
          <p className="text-gray-400 text-sm">Manage your recurring plans and pricing</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white transition-colors"
          >
            {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Package</>}
          </button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--surface)] border border-blue-500/50 rounded-2xl p-5 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{products.length}</h3>
            <p className="text-gray-400 text-sm mt-1">Total Packages</p>
          </div>
        </div>
      </div>

      {/* Add Form Area */}
      {isAdding && (
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-blue-500/30 mb-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            {isEditing ? 'Edit Subscription Package' : 'Create New Subscription Package'}
          </h2>
          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm mb-2 text-gray-400 font-medium">Package Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="e.g. Pro Plan" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">Price (৳)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="499" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">Category</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="e.g. Starter" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2 text-gray-400 font-medium">Badge Text (Optional)</label>
              <input type="text" value={formData.badge_text} onChange={e => setFormData({...formData, badge_text: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="e.g. Best Seller" />
            </div>
            

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-gray-400 font-medium">Features (Comma separated)</label>
              <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors h-24 resize-none" placeholder="Unlimited access, 24/7 support, Custom domain..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">Gradient Start (Tailwind class)</label>
                <input type="text" value={formData.color_from} onChange={e => setFormData({...formData, color_from: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">Gradient End (Tailwind class)</label>
                <input type="text" value={formData.color_to} onChange={e => setFormData({...formData, color_to: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" />
              </div>
            </div>

            <div className="md:col-span-2 flex items-center p-4 bg-black/20 rounded-xl border border-white/5">
              <input type="checkbox" id="isPop" checked={formData.is_popular} onChange={e => setFormData({...formData, is_popular: e.target.checked})} className="mr-3 w-5 h-5 accent-blue-500 bg-white/10 border-white/20 rounded cursor-pointer" />
              <label htmlFor="isPop" className="cursor-pointer text-gray-300 font-medium">Mark as "Most Popular" (adds glowing outline effects on the pricing table)</label>
            </div>
            
            <div className="md:col-span-2 mt-2 pt-6 border-t border-white/10 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isUploading}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
              >
                {isUploading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
                ) : (isEditing ? 'Update Package' : 'Publish Package')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog Display */}
      <div className="mb-6 flex flex-col sm:flex-row lg:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search packages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          Showing <span className="text-white font-bold">{filteredProducts.length}</span> packages
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="packages-list" direction="horizontal" type="PACKAGE" isDropDisabled={searchQuery.length > 0}>
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {isLoading ? (
                <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  Loading packages...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-black/10">
                  No packages found matching your search.
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
                          // Optional inline style for drag state
                          ...(snapshot.isDragging ? { opacity: 0.8, zIndex: 100 } : {})
                        }}
                        className={`bg-[var(--surface)] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 transition-all flex flex-col ${snapshot.isDragging ? 'shadow-blue-500/20 shadow-2xl border-blue-500/50' : ''}`}
                      >
                        
                        <div className={`relative aspect-[4/3] bg-gradient-to-br ${product.color_from} ${product.color_to} opacity-80 flex flex-col items-center justify-center p-6 text-center group-hover:opacity-100 transition-opacity`}>
                          {product.is_popular && (
                            <div className="absolute top-0 right-8 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-lg">
                              Popular
                            </div>
                          )}
                          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                            {product.category}
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

                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex-1"></div>
                          
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <div className="text-lg font-bold text-white">
                              ৳{product.price}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEditClick(product)}
                                className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors"
                                title="Edit package"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Delete package"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
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
