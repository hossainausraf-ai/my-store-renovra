'use client';

import { useState, useEffect } from 'react';
import { 
  TicketPercent, 
  Plus, 
  Search, 
  Trash2, 
  Pencil, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  Calendar, 
  Tag, 
  TrendingUp, 
  Percent, 
  Coins, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  applicable_to: string;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  expiry_date?: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    applicable_to: 'all',
    min_order_amount: '',
    max_discount_amount: '',
    usage_limit: '',
    expiry_date: '',
    is_active: true
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success && data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
      showNotification('error', 'কুপন তালিকা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn('Could not load products for coupon target picker:', err);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      applicable_to: 'all',
      min_order_amount: '',
      max_discount_amount: '',
      usage_limit: '',
      expiry_date: '',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: String(coupon.discount_value),
      applicable_to: coupon.applicable_to,
      min_order_amount: coupon.min_order_amount !== undefined ? String(coupon.min_order_amount) : '',
      max_discount_amount: coupon.max_discount_amount !== undefined ? String(coupon.max_discount_amount) : '',
      usage_limit: coupon.usage_limit !== undefined ? String(coupon.usage_limit) : '',
      expiry_date: coupon.expiry_date ? coupon.expiry_date.split('T')[0] : '',
      is_active: coupon.is_active
    });
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      showNotification('error', 'কুপন কোড প্রদান করুন');
      return;
    }

    const discountVal = Number(formData.discount_value);
    if (isNaN(discountVal) || discountVal <= 0) {
      showNotification('error', 'সঠিক ডিসকাউন্টের মান দিন');
      return;
    }

    if (formData.discount_type === 'percentage' && discountVal > 100) {
      showNotification('error', 'শতকরা ডিসকাউন্ট ১০০% এর বেশি হতে পারবে না');
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        code: formData.code.trim().toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: discountVal,
        applicable_to: formData.applicable_to,
        min_order_amount: formData.min_order_amount ? Number(formData.min_order_amount) : 0,
        max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : undefined,
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : undefined,
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : undefined,
        is_active: formData.is_active
      };

      if (editingCoupon) {
        payload.id = editingCoupon.id;
        payload.used_count = editingCoupon.used_count;
      }

      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showNotification('success', editingCoupon ? 'কুপন সফলভাবে আপডেট হয়েছে!' : 'নতুন কুপন সফলভাবে তৈরি হয়েছে!');
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        showNotification('error', data.message || 'কুপন সংরক্ষণ করতে ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', 'সার্ভার সমস্যা। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const newStatus = !coupon.is_active;
      // Optimistic update
      setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, is_active: newStatus } : c));

      const res = await fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coupon.id, is_active: newStatus })
      });

      const data = await res.json();
      if (!data.success) {
        fetchCoupons();
        showNotification('error', 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে');
      } else {
        showNotification('success', `কুপন এখন ${newStatus ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}`);
      }
    } catch (err) {
      fetchCoupons();
      showNotification('error', 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const handleDeleteCoupon = async (coupon: Coupon) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${coupon.code}" কুপনটি ডিলিট করতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/coupons?id=${coupon.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.filter(c => c.id !== coupon.id));
        showNotification('success', 'কুপন ডিলিট করা হয়েছে');
      } else {
        showNotification('error', data.message || 'কুপন ডিলিট করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      showNotification('error', 'কুপন ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Helper to format target name
  const getApplicableLabel = (val: string) => {
    if (val === 'all') return 'সব প্রোডাক্ট ও প্যাকেজ (All)';
    if (val === 'subscription') return 'প্যাকেজ সমূহ (Packages)';
    if (val === 'single_tool') return 'সিঙ্গেল টুলস (Single Tools)';
    if (val === 'digital') return 'ডিজিটাল প্রোডাক্টস (Digital)';
    const foundProd = products.find(p => p.id === val);
    return foundProd ? `নির্দিষ্ট: ${foundProd.name}` : `প্রোডাক্ট: ${val}`;
  };

  // Calculations for stats
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.is_active).length;
  const totalRedeemed = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);

  // Filtered coupons
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          coupon.applicable_to.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' 
      ? true 
      : filterStatus === 'active' 
        ? coupon.is_active 
        : !coupon.is_active;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300' 
            : 'bg-red-950/90 border-red-500/40 text-red-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <TicketPercent className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Coupons & Discounts</h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">সব প্রোডাক্ট, প্যাকেজ বা সিঙ্গেল টুলের জন্য ডিসকাউন্ট কুপন সেট করুন</p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কুপন যোগ করুন</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">মোট কুপন</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{totalCoupons}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">সক্রিয় কুপন</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{activeCoupons}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">মোট কুপন ব্যবহার</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1">{totalRedeemed}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--surface)] p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="কুপন কোড বা প্রযোজ্য বিভাগ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'all' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({coupons.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'active' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Active ({activeCoupons})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === 'inactive' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Inactive ({totalCoupons - activeCoupons})
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-[var(--surface)] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-400 bg-white/[0.02]">
                <th className="px-6 py-4 font-semibold">কুপন কোড</th>
                <th className="px-6 py-4 font-semibold">ডিসকাউন্ট</th>
                <th className="px-6 py-4 font-semibold">প্রযোজ্য ক্ষেত্র</th>
                <th className="px-6 py-4 font-semibold">শর্তসমূহ</th>
                <th className="px-6 py-4 font-semibold">ব্যবহার</th>
                <th className="px-6 py-4 font-semibold">মেয়াদ</th>
                <th className="px-6 py-4 font-semibold">স্ট্যাটাস</th>
                <th className="px-6 py-4 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <span className="text-sm">কুপন ডাটা লোড হচ্ছে...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <TicketPercent className="w-10 h-10 text-gray-600 mb-2" />
                      <p className="font-semibold text-white">কোনো কুপন পাওয়া যায়নি</p>
                      <p className="text-xs text-gray-500 mt-1">নতুন কুপন যোগ করতে উপরের "নতুন কুপন যোগ করুন" বাটনে ক্লিক করুন।</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const isExpired = coupon.expiry_date && new Date(coupon.expiry_date) < new Date();
                  const isLimitReached = coupon.usage_limit && coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit;

                  return (
                    <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Code */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-base tracking-wider bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(coupon.code)}
                            title="কপি করুন"
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 font-bold text-sm">
                          {coupon.discount_type === 'percentage' ? (
                            <span className="px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                              <Percent className="w-3.5 h-3.5" />
                              {coupon.discount_value}% OFF
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              ৳{coupon.discount_value} FLAT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Applicable to */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-gray-300 max-w-[200px] truncate block" title={getApplicableLabel(coupon.applicable_to)}>
                          {getApplicableLabel(coupon.applicable_to)}
                        </span>
                      </td>

                      {/* Conditions */}
                      <td className="px-6 py-4 text-xs text-gray-400 space-y-0.5">
                        {coupon.min_order_amount && coupon.min_order_amount > 0 ? (
                          <div>মিনিমাম: <span className="text-white font-medium">৳{coupon.min_order_amount}</span></div>
                        ) : (
                          <div>মিনিমাম: <span className="text-gray-500">নেই</span></div>
                        )}
                        {coupon.discount_type === 'percentage' && coupon.max_discount_amount && coupon.max_discount_amount > 0 ? (
                          <div>সর্বোচ্চ ছাড়: <span className="text-white font-medium">৳{coupon.max_discount_amount}</span></div>
                        ) : null}
                      </td>

                      {/* Usage */}
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <span className="font-bold text-white">{coupon.used_count || 0}</span>
                          <span className="text-gray-500"> / {coupon.usage_limit && coupon.usage_limit > 0 ? coupon.usage_limit : 'আনলিমিটেড'}</span>
                          {coupon.usage_limit && coupon.usage_limit > 0 && (
                            <div className="w-20 bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isLimitReached ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(100, ((coupon.used_count || 0) / coupon.usage_limit) * 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="px-6 py-4 text-xs">
                        {coupon.expiry_date ? (
                          <div className={isExpired ? 'text-red-400 font-semibold' : 'text-gray-300'}>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(coupon.expiry_date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            {isExpired && <span className="text-[10px] text-red-500 font-bold block mt-0.5">মেয়াদ উত্তীর্ণ</span>}
                          </div>
                        ) : (
                          <span className="text-gray-500">আজীবন মেয়াদী</span>
                        )}
                      </td>

                      {/* Active Toggle */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(coupon)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            coupon.is_active ? 'bg-emerald-600' : 'bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              coupon.is_active ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(coupon)}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="এডিট করুন"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCoupon(coupon)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                            title="ডিলিট করুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#111827] z-10">
              <div className="flex items-center gap-2">
                <TicketPercent className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingCoupon ? 'কুপন এডিট করুন' : 'নতুন ডিসকাউন্ট কুপন তৈরি করুন'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="p-6 space-y-4 text-sm">
              {/* Coupon Code */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  কুপন কোড <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: SAVE20, WELCOME50, EID2026"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono font-bold tracking-wider focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
                />
                <p className="text-[11px] text-gray-500 mt-1">গ্রাহক চেকআউটে এই কোডটি লিখে অ্যাপ্লাই করবে (স্বয়ংক্রিয়ভাবে ক্যাপিটাল হবে)।</p>
              </div>

              {/* Discount Type & Value Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Discount Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    ডিসকাউন্টের ধরণ <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="percentage">শতকরা হার (% Percentage)</option>
                    <option value="fixed">নির্দিষ্ট টাকা (৳ Fixed Amount)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    ডিসকাউন্টের পরিমাণ <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max={formData.discount_type === 'percentage' ? 100 : undefined}
                      placeholder={formData.discount_type === 'percentage' ? 'যেমন: 15 (15%)' : 'যেমন: 100 (৳ 100)'}
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      {formData.discount_type === 'percentage' ? '%' : '৳'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Applicable To (Which Products) */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  কোন প্রোডাক্টে প্রযোজ্য হবে?
                </label>
                <select
                  value={formData.applicable_to}
                  onChange={(e) => setFormData({ ...formData, applicable_to: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="all">🌟 সাইটের সব প্রোডাক্ট ও প্যাকেজে প্রযোজ্য (All)</option>
                  <option value="subscription">📦 শুধুমাত্র সাবস্ক্রিপশন প্যাকেজে (Packages Only)</option>
                  <option value="single_tool">🛠️ শুধুমাত্র সিঙ্গেল টুলসে (Single Tools Only)</option>
                  <option value="digital">📁 শুধুমাত্র ডিজিটাল প্রোডাক্টে (Digital Products Only)</option>
                  <optgroup label="নির্দিষ্ট কোনো একটি প্রোডাক্টে সেট করুন:">
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} ({prod.price ? `৳${prod.price}` : ''})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  আপনি চাইলে যেকোনো ক্যাটাগরি বা নির্দিষ্ট ১টি প্রোডাক্টেও কুপন প্রযোজ্য রাখতে পারেন।
                </p>
              </div>

              {/* Min Order & Max Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    মিনিমাম অর্ডার মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="যেমন: 300 (ঐচ্ছিক)"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">খালি রাখলে যেকোনো মূল্যের অর্ডারে কাজ করবে।</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    সর্বোচ্চ ছাড়ের সীমা (৳ Cap)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="যেমন: 250 (ঐচ্ছিক)"
                    value={formData.max_discount_amount}
                    onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                    disabled={formData.discount_type === 'fixed'}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600 disabled:opacity-40"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">% ডিসকাউন্টের সর্বোচ্চ লিমিট নির্ধারণে ব্যবহৃত হয়।</p>
                </div>
              </div>

              {/* Usage Limit & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    সর্বমোট কতবার ব্যবহারযোগ্য?
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="যেমন: 100 (খালি রাখলে আনলিমিটেড)"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    মেয়াদ উত্তীর্ণের তারিখ (Expiry Date)
                  </label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-xl">
                <div>
                  <p className="font-semibold text-white text-sm">কুপন সক্রিয় (Active) রাখুন</p>
                  <p className="text-xs text-gray-400">সক্রিয় না থাকলে গ্রাহক এটি চেকআউটে ব্যবহার করতে পারবে না।</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    formData.is_active ? 'bg-emerald-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>{editingCoupon ? 'আপডেট করুন' : 'কুপন তৈরি করুন'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

