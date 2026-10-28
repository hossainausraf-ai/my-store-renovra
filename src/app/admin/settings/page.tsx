'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { 
  Settings as SettingsIcon,
  Save,
  Image as ImageIcon
} from 'lucide-react';

type SiteSettings = {
  id: string;
  site_name: string;
  logo_url: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  bkash_number?: string;
  bank_transfer_number?: string;
  redotpay_id?: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    site_name: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    bkash_number: '',
    bank_transfer_number: '',
    redotpay_id: ''
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
    } else if (data) {
      setSettings(data);
      setFormData({
        site_name: data.site_name || '',
        contact_phone: data.contact_phone || '',
        contact_email: data.contact_email || '',
        contact_address: data.contact_address || '',
        bkash_number: data.bkash_number || '',
        bank_transfer_number: data.bank_transfer_number || '',
        redotpay_id: data.redotpay_id || ''
      });
      setLogoPreview(data.logo_url || null);
    }
    setIsLoading(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('অনুগ্রহ করে শুধুমাত্র ছবি সিলেক্ট করুন!');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings?.id) return;
    
    setIsSaving(true);
    
    let finalLogoUrl = logoPreview || '';

    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, logoFile);

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        alert('লোগো আপলোড করতে সমস্যা হয়েছে!');
        setIsSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      finalLogoUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from('site_settings')
      .update({
        site_name: formData.site_name,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        contact_address: formData.contact_address,
        bkash_number: formData.bkash_number,
        bank_transfer_number: formData.bank_transfer_number,
        redotpay_id: formData.redotpay_id,
        logo_url: finalLogoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', settings.id);

    setIsSaving(false);

    if (error) {
      alert('সেটিংস সেভ করতে সমস্যা হয়েছে!');
      console.error(error);
    } else {
      alert('সফলভাবে সেটিংস আপডেট করা হয়েছে!');
      fetchSettings();
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Site Settings</h1>
          <p className="text-gray-400 text-sm">Customize your website branding and contact details</p>
        </div>
      </div>

      <div className="bg-[var(--surface)] p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl">
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* Logo Section */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              Website Logo
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div 
                className="w-32 h-32 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden shrink-0 relative group"
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} alt="Site Logo" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <span className="text-xs font-bold text-white">Change</span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-medium">No Logo</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-4">
                  Upload a high-resolution logo. We recommend a transparent PNG format. Maximum file size is 2MB.
                </p>
                <div className="flex items-center gap-3">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleLogoChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors text-sm"
                  >
                    Upload Logo
                  </button>
                  {logoPreview && (
                    <button 
                      type="button"
                      onClick={() => {
                        setLogoPreview(null);
                        setLogoFile(null);
                      }}
                      className="px-4 py-2 text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* General Details Section */}
          <div>
            <h2 className="text-lg font-bold text-white mb-6">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-400 font-medium">Site Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.site_name} 
                  onChange={e => setFormData({...formData, site_name: e.target.value})} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" 
                  placeholder="e.g. Renovra" 
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">Contact Phone (WhatsApp)</label>
                <input 
                  type="text" 
                  value={formData.contact_phone} 
                  onChange={e => setFormData({...formData, contact_phone: e.target.value})} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" 
                  placeholder="e.g. 01708746669" 
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">Contact Email</label>
                <input 
                  type="email" 
                  value={formData.contact_email} 
                  onChange={e => setFormData({...formData, contact_email: e.target.value})} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" 
                  placeholder="e.g. contact@renovra.com" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-400 font-medium">Office Address</label>
                <textarea 
                  value={formData.contact_address} 
                  onChange={e => setFormData({...formData, contact_address: e.target.value})} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors resize-none h-24" 
                  placeholder="Your physical office address (optional)" 
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* Payment Details Section */}
          <div>
            <h2 className="text-lg font-bold text-white mb-6">Payment Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">bKash Personal Number</label>
                <input 
                  type="text" 
                  value={formData.bkash_number} 
                  onChange={e => setFormData({...formData, bkash_number: e.target.value})} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" 
                  placeholder="e.g. 01708746669" 
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">Bank Transfer Info</label>
                <input 
                  type="text" 
                  value={formData.bank_transfer_number} 
                  onChange={e => setFormData({...formData, bank_transfer_number: e.target.value})} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" 
                  placeholder="e.g. IBBL: 2050123456789" 
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-400 font-medium">RedotPay ID</label>
                <input 
                  type="text" 
                  value={formData.redotpay_id} 
                  onChange={e => setFormData({...formData, redotpay_id: e.target.value})} 
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none transition-colors" 
                  placeholder="e.g. 1234567890" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Settings</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
