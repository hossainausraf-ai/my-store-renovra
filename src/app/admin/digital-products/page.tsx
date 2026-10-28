'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { 
  MonitorPlay,
  Search,
  Plus,
  Pencil,
  Image as ImageIcon
} from 'lucide-react';

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
  download_url?: string;
};

export default function AdminDigitalProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    download_url: ''
  });

  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_type', 'digital')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelection(e.target.files[0]);
    }
  };

  const handleImageSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('দয়া করে শুধুমাত্র ইমেজ ফাইল সিলেক্ট করুন।');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', download_url: '' });
    setImageFile(null);
    setImagePreview(null);
    setDownloadFile(null);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEditClick = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      download_url: product.download_url || ''
    });
    setImageFile(null);
    setImagePreview(product.image_url || null);
    setDownloadFile(null);
    setIsEditing(product.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImageUrl = imagePreview || ''; // Use existing preview if no new file is selected, though if imageFile is null and we are not editing, it will be empty.

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        alert('ছবি আপলোড করতে সমস্যা হয়েছে! Storage Policy চেক করুন।');
        setIsUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      finalImageUrl = data.publicUrl;
    }

    let finalDownloadUrl = formData.download_url;
    if (downloadFile) {
      const fileExt = downloadFile.name.split('.').pop();
      const fileName = `download_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `downloads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, downloadFile);

      if (uploadError) {
        console.error('Download File Upload Error:', uploadError);
        alert('Digital product file আপলোড করতে সমস্যা হয়েছে!');
        setIsUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      finalDownloadUrl = data.publicUrl;
    }
    
    const payload = {
      product_type: 'digital',
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: finalImageUrl,
      badge_text: '',
      features: [],
      color_from: '',
      color_to: '',
      is_popular: false,
      download_url: finalDownloadUrl
    };

    if (isEditing) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', isEditing);

      if (error) {
        alert('প্রোডাক্ট আপডেট করতে সমস্যা হয়েছে!');
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
        alert('প্রোডাক্ট অ্যাড করতে সমস্যা হয়েছে!');
        console.error(error);
      } else {
        alert('সফলভাবে যোগ করা হয়েছে!');
        fetchProducts();
        resetForm();
      }
    }

    setIsUploading(false);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert('ডিলিট করতে সমস্যা হয়েছে!');
    } else {
      if (imageUrl && imageUrl.includes('product-images/')) {
        const filePath = imageUrl.split('product-images/').pop();
        if (filePath) {
          await supabase.storage.from('product-images').remove([filePath]);
        }
      }
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Digital Products</h1>
          <p className="text-gray-400 text-sm">Manage your downloadable items and digital assets</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white transition-colors"
          >
            {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Digital Product</>}
          </button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--surface)] border border-blue-500/50 rounded-2xl p-5 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
            <MonitorPlay className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{products.length}</h3>
            <p className="text-gray-400 text-sm mt-1">Total Digital Products</p>
          </div>
        </div>
      </div>

      {/* Add Form Area */}
      {isAdding && (
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-blue-500/30 mb-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-blue-500" />
            {isEditing ? 'Edit Digital Product' : 'Create New Digital Product'}
          </h2>
          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm mb-2 text-gray-400 font-medium">Product Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="e.g. Canva Template" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">Price (৳)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="499" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" placeholder="e.g. Graphics" />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-gray-400 font-medium">Product Cover Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px]
                  ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/30 bg-black/20'}
                `}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="image/*" className="hidden" />
                
                {imagePreview ? (
                  <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-white/10 shadow-lg group">
                    <img src={imagePreview} alt="Preview" className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <span className="bg-white/20 px-4 py-2 rounded-lg text-sm font-bold text-white backdrop-blur-sm">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="text-gray-300 font-medium text-lg">Click to browse or drag and drop</p>
                    <p className="text-gray-500 text-sm mt-2">PNG, JPG, WebP up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-gray-400 font-medium">Digital Product File (Upload)</label>
              <input type="file" onChange={e => { if (e.target.files && e.target.files[0]) setDownloadFile(e.target.files[0]); }} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" />
              <div className="text-xs text-gray-500 mt-2">Or provide an external download link below:</div>
              <input type="url" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors mt-2" placeholder="https://example.com/download.zip" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-gray-400 font-medium">Short Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors h-20 resize-none" placeholder="A short compelling description..." />
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
                ) : (isEditing ? 'Update Product' : 'Publish Product')}
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
            placeholder="Search digital products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          Showing <span className="text-white font-bold">{filteredProducts.length}</span> items
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-black/10">
            No digital products found matching your search.
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-[var(--surface)] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 hover:shadow-2xl hover:shadow-black/50 transition-all flex flex-col">
              
              <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                  {product.category}
                </div>
                <div className="absolute top-3 right-3 bg-purple-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-lg">
                  Digital
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                
                <div className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                  {product.description}
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="text-lg font-bold text-white">
                    ৳{product.price}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Edit product"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id, product.image_url)}
                      className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete product"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
