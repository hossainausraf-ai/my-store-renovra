'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef } from 'react';

type ToolLogo = {
  id: string;
  name: string;
  image_url: string;
  row_position: 'top' | 'bottom';
};

export default function AdminToolsPage() {
  const [tools, setTools] = useState<ToolLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    row_position: 'top'
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
      .from('tools_logos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTools(data);
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
    setFormData({ name: '', image_url: '', row_position: 'top' });
    setImageFile(null);
    setImagePreview('');
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEditClick = (tool: ToolLogo) => {
    setFormData({
      name: tool.name,
      image_url: tool.image_url,
      row_position: tool.row_position
    });
    setImageFile(null);
    setImagePreview(tool.image_url);
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
      const fileName = `tool_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
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

    if (isEditing) {
      const { error } = await supabase
        .from('tools_logos')
        .update({
          name: formData.name,
          image_url: finalImageUrl,
          row_position: formData.row_position
        })
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
        .from('tools_logos')
        .insert([{
          name: formData.name,
          image_url: finalImageUrl,
          row_position: formData.row_position
        }]);

      if (error) {
        alert('অ্যাড করতে সমস্যা হয়েছে! SQL ফাইলটি রান করেছেন কি?');
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
    const { error } = await supabase.from('tools_logos').delete().eq('id', id);
    if (error) alert('ডিলিট করতে সমস্যা হয়েছে!');
    else setTools(tools.filter(t => t.id !== id));
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tools / Logos Management</h1>
          <button 
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            className={`${isAdding ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg transition`}
          >
            {isAdding ? 'Cancel' : '+ Add Tool Logo'}
          </button>
        </div>

        {isAdding && (
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-white/10 mb-8">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Tool Logo' : 'Add New Tool Logo'}</h2>
            <form onSubmit={handleSaveTool} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm text-gray-400 font-semibold mb-2">Tool Logo Image (Drag & Drop)</label>
                
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
                      <p className="text-xs opacity-70">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-xs text-gray-500">OR</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>
                
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Image URL (If not uploading from PC)</label>
                  <input type="url" value={formData.image_url} onChange={e => {setFormData({...formData, image_url: e.target.value}); setImagePreview(e.target.value);}} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500" placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-400">Tool Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="e.g. ChatGPT" />
              </div>
              
              <div>
                <label className="block text-sm mb-1 text-gray-400">Row Position (Animation direction)</label>
                <select value={formData.row_position} onChange={e => setFormData({...formData, row_position: e.target.value as 'top' | 'bottom'})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500">
                  <option value="top">Top Row (Scrolls Left)</option>
                  <option value="bottom">Bottom Row (Scrolls Right)</option>
                </select>
              </div>
              
              <div className="md:col-span-2 mt-4 flex gap-4">
                <button type="submit" disabled={isUploading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
                  {isUploading ? 'Saving...' : (isEditing ? 'Update Tool Logo' : 'Save Tool Logo')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[var(--surface)] rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold">All Tools</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-gray-400">
                <tr>
                  <th className="p-4">Logo</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Row</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading...</td></tr>
                ) : tools.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-400">No tools found. Add some logos!</td></tr>
                ) : (
                  tools.map(tool => (
                    <tr key={tool.id} className="hover:bg-white/5 transition">
                      <td className="p-4">
                        <div className="bg-black/30 p-2 rounded w-14 h-14 flex items-center justify-center">
                          <img src={tool.image_url} alt={tool.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-base">{tool.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${tool.row_position === 'top' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                          {tool.row_position.toUpperCase()}
                        </span>
                      </td>
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
