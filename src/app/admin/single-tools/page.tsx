'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef } from 'react';

type SingleTool = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  category: string;
  features: string[]; // We'll store validity (e.g. 30 Days) in features[0]
};

export default function AdminSingleToolsPage() {
  const [tools, setTools] = useState<SingleTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    price: '',
    category: '',
    validity: '30 Days'
  });

  // Drag and Drop state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_type', 'single_tool')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTools(data as any[]);
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
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি সিলেক্ট করুন!');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData({ name: '', image_url: '', price: '', category: '', validity: '30 Days' });
    setImageFile(null);
    setImagePreview('');
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEditClick = (tool: SingleTool) => {
    setFormData({
      name: tool.name,
      image_url: tool.image_url || '',
      price: tool.price.toString(),
      category: tool.category || '',
      validity: tool.features?.[0] || '30 Days'
    });
    setImageFile(null);
    setImagePreview(tool.image_url || '');
    setIsEditing(tool.id);
    setIsAdding(true);
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    let finalImageUrl = formData.image_url;

    // Upload new image if file selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `singletool_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        alert('ছবি আপলোড করতে সমস্যা হয়েছে!');
        setIsUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      finalImageUrl = data.publicUrl;
    }

    const productPayload = {
      product_type: 'single_tool',
      name: formData.name,
      image_url: finalImageUrl,
      price: parseFloat(formData.price),
      category: formData.category,
      features: [formData.validity],
      description: 'Single Premium Tool'
    };

    if (isEditing) {
      const { error } = await supabase
        .from('products')
        .update(productPayload)
        .eq('id', isEditing);

      if (error) {
        alert('আপডেট করতে সমস্যা হয়েছে!');
      } else {
        alert('সফলভাবে আপডেট হয়েছে!');
        fetchTools();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productPayload]);

      if (error) {
        alert('অ্যাড করতে সমস্যা হয়েছে!');
      } else {
        alert('সফলভাবে যোগ করা হয়েছে!');
        fetchTools();
        resetForm();
      }
    }
    
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('ডিলিট করতে সমস্যা হয়েছে!');
    else fetchTools();
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Single Premium Tools</h1>
          <button 
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            className={`${isAdding ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg transition`}
          >
            {isAdding ? 'Cancel' : '+ Add Single Tool'}
          </button>
        </div>

        {isAdding && (
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-white/10 mb-8">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Single Tool' : 'Add New Single Tool'}</h2>
            <form onSubmit={handleSaveTool} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm text-gray-400 font-semibold mb-2">Tool Logo (Drag & Drop)</label>
                
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-white/40 bg-black/20'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onClick={(e) => ((e.target as HTMLInputElement).value = '')}
                    onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
                  />
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="h-32 object-contain rounded-lg" />
                      <div className="mt-4 text-sm text-blue-400 font-medium">Click or drag another image to replace</div>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <p className="mb-1 text-sm font-semibold">Click to upload or drag and drop</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Tool Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="e.g. Claude Ai" />
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-gray-400">Category</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="e.g. AI & WRITING" />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Price (৳)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="e.g. 400" />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Validity (Remaining)</label>
                <input required type="text" value={formData.validity} onChange={e => setFormData({...formData, validity: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="e.g. 30 Days" />
              </div>
              
              <div className="md:col-span-2 mt-4 flex gap-4">
                <button type="submit" disabled={isUploading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
                  {isUploading ? 'Saving...' : (isEditing ? 'Update Single Tool' : 'Save Single Tool')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[var(--surface)] rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold">All Single Tools</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-gray-400">
                <tr>
                  <th className="p-4">Logo</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading...</td></tr>
                ) : tools.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400">No tools found. Add some tools!</td></tr>
                ) : (
                  tools.map(tool => (
                    <tr key={tool.id} className="hover:bg-white/5 transition">
                      <td className="p-4">
                        <div className="bg-white p-1 rounded w-12 h-12 flex items-center justify-center">
                          {tool.image_url && <img src={tool.image_url} alt={tool.name} className="max-w-full max-h-full object-contain" />}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-base">{tool.name}</td>
                      <td className="p-4 text-gray-400">{tool.category}</td>
                      <td className="p-4 font-bold">৳{tool.price}</td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button onClick={() => handleEditClick(tool)} className="text-blue-400 hover:text-blue-300 transition font-medium">Edit</button>
                          <button onClick={() => handleDelete(tool.id)} className="text-red-500 hover:text-red-400 transition font-medium">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
