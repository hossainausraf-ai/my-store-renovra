'use client';

import { useEffect, useState } from 'react';
import { defaultProducts } from '@/data/products';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ChevronDown,
  Download,
  Package,
  Trash2,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

type Payment = {
  id: string;
  created_at: string;
  user_phone: string;
  trx_id: string;
  payment_method: string;
  package_id: string;
  status: string;
  proof_url?: string;
  customer_name?: string;
  product_name?: string;
  price?: number;
  whatsapp?: string;
  coupon_code?: string;
  discount_amount?: number;
  original_price?: number;
};

export default function AdminDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>(defaultProducts);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchPayments = async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);

    setProducts(defaultProducts);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        setPayments(data.orders);
      }
    } catch (e) {
      console.warn('Error fetching orders:', e);
    } finally {
      if (isInitial) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments(true);
    const interval = setInterval(() => fetchPayments(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic UI update
    setPayments(prev => prev.map(p => (p.id === id || p.trx_id === id) ? { ...p, status: newStatus } : p));

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!');
        fetchPayments(false);
      }
    } catch (err) {
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!');
      fetchPayments(false);
      console.error(err);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি সম্পূর্ণ মুছে ফেলতে চান?')) return;
    setPayments(prev => prev.filter(p => p.id !== id && p.trx_id !== id));
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        alert('অর্ডার ডিলিট করতে সমস্যা হয়েছে!');
        fetchPayments(false);
      }
    } catch (err) {
      alert('অর্ডার ডিলিট করতে সমস্যা হয়েছে!');
      fetchPayments(false);
      console.error(err);
    }
  };

  const filteredPayments = payments.filter(p => {
    let matchesFilter = true;
    if (activeFilter === 'Pending') matchesFilter = p.status === 'pending';
    else if (activeFilter === 'Verifying') matchesFilter = p.status === 'verifying';
    else if (activeFilter === 'Confirmed') matchesFilter = p.status === 'confirmed' || p.status === 'approved';
    else if (activeFilter === 'Declined') matchesFilter = p.status === 'declined' || p.status === 'rejected';

    const productName = p.product_name || products.find(prod => prod.id === p.package_id)?.name || p.package_id || '';
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (p.trx_id && p.trx_id.toLowerCase().includes(searchLower)) || 
                          (p.user_phone && p.user_phone.toLowerCase().includes(searchLower)) ||
                          (p.whatsapp && p.whatsapp.toLowerCase().includes(searchLower)) ||
                          (p.customer_name && p.customer_name.toLowerCase().includes(searchLower)) ||
                          (p.id && p.id.toLowerCase().includes(searchLower)) ||
                          productName.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const totalOrders = payments.length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const verifyingCount = payments.filter(p => p.status === 'verifying').length;
  const confirmedCount = payments.filter(p => p.status === 'confirmed' || p.status === 'approved').length;
  const declinedCount = payments.filter(p => p.status === 'declined' || p.status === 'rejected').length;

  const filters = ['All', 'Pending', 'Verifying', 'Confirmed', 'Declined'];

  const getStatusBadgeClasses = (status: string) => {
    if (status === 'confirmed' || status === 'approved') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (status === 'declined' || status === 'rejected') {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
    if (status === 'verifying') {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white mb-1">Orders Dashboard</h1>
            {isRefreshing && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
          </div>
          <p className="text-gray-400 text-sm">অর্ডার স্ট্যাটাস পরিবর্তন, পেমেন্ট ভেরিফিকেশন ও ট্রানজাকশন ম্যানেজমেন্ট</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchPayments(false)} 
            className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-white/10 hover:bg-white/5 rounded-xl text-sm font-medium text-gray-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            রিফ্রেশ করুন
          </button>
        </div>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {/* Total */}
        <div 
          onClick={() => setActiveFilter('All')} 
          className={`bg-[var(--surface)] border cursor-pointer rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition hover:border-blue-500/50 ${activeFilter === 'All' ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-white/5'}`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{totalOrders}</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">মোট অর্ডার (All)</p>
          </div>
        </div>

        {/* Pending */}
        <div 
          onClick={() => setActiveFilter('Pending')} 
          className={`bg-[var(--surface)] border cursor-pointer rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition hover:border-amber-500/50 ${activeFilter === 'Pending' ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-white/5'}`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-400">{pendingCount}</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Pending</p>
          </div>
        </div>

        {/* Verifying */}
        <div 
          onClick={() => setActiveFilter('Verifying')} 
          className={`bg-[var(--surface)] border cursor-pointer rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition hover:border-cyan-500/50 ${activeFilter === 'Verifying' ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5'}`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-400">{verifyingCount}</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Verifying</p>
          </div>
        </div>

        {/* Confirmed */}
        <div 
          onClick={() => setActiveFilter('Confirmed')} 
          className={`bg-[var(--surface)] border cursor-pointer rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition hover:border-emerald-500/50 ${activeFilter === 'Confirmed' ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-white/5'}`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">{confirmedCount}</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Confirmed</p>
          </div>
        </div>

        {/* Declined */}
        <div 
          onClick={() => setActiveFilter('Declined')} 
          className={`bg-[var(--surface)] border cursor-pointer rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition hover:border-rose-500/50 ${activeFilter === 'Declined' ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'border-white/5'}`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-rose-400">{declinedCount}</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Declined</p>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-[var(--surface)] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Phone, Name, or TrxID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-4">
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto">
              {filters.map(filter => {
                const count = filter === 'All' ? totalOrders : 
                              filter === 'Pending' ? pendingCount : 
                              filter === 'Verifying' ? verifyingCount : 
                              filter === 'Confirmed' ? confirmedCount : declinedCount;
                return (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      activeFilter === filter 
                        ? 'bg-blue-600/30 text-white shadow-sm border border-blue-500/40' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      activeFilter === filter ? 'bg-blue-500/40 text-blue-200' : 'bg-white/5'
                    }`}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-400 bg-black/10">
                <th className="px-6 py-4 font-semibold">Order Details</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Package / Product</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Order Status (Change anytime)</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      অর্ডার লোড হচ্ছে...
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const normalizedStatus = 
                    payment.status === 'approved' ? 'confirmed' :
                    payment.status === 'rejected' ? 'declined' :
                    payment.status;

                  return (
                    <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors group">
                      
                      {/* Order Details */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white font-mono text-sm">
                            #{payment.id}
                          </span>
                          {payment.trx_id && (
                            <span className="text-xs text-gray-400 font-mono mt-0.5">
                              Trx: {payment.trx_id}
                            </span>
                          )}
                          <span className="text-[11px] text-gray-500 mt-1">
                            {new Date(payment.created_at).toLocaleString('en-US', { 
                              month: 'short', day: 'numeric', year: 'numeric',
                              hour: 'numeric', minute: 'numeric', hour12: true
                            })}
                          </span>
                        </div>
                      </td>
                      
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">
                            {payment.customer_name ? payment.customer_name.substring(0, 2).toUpperCase() : 'CU'}
                          </div>
                          <div>
                            {payment.customer_name && (
                              <span className="font-bold text-white block text-sm leading-tight">{payment.customer_name}</span>
                            )}
                            <span className="font-medium text-gray-300 block text-xs mt-0.5 font-mono">
                              {payment.whatsapp || payment.user_phone}
                            </span>
                            {(payment.whatsapp || payment.user_phone) && (
                              <a
                                href={`https://wa.me/${(payment.whatsapp || payment.user_phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `হ্যালো ${payment.customer_name || 'সম্মানিত গ্রাহক'}, Renovra থেকে আপনার অর্ডার #${payment.id} নিয়ে যোগাযোগ করছি।`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-green-400 hover:text-green-300 transition mt-1"
                              >
                                <MessageSquare className="w-3 h-3" /> WhatsApp চ্যাট
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center shrink-0 text-gray-400">
                            <Package className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-200 text-sm max-w-[200px]" title={payment.product_name || payment.package_id}>
                            {payment.product_name || products.find(p => p.id === payment.package_id)?.name || payment.package_id || 'Product'}
                          </span>
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white font-mono">
                              ৳{payment.price !== undefined ? payment.price : 0}
                            </span>
                            <span className="text-xs text-gray-400 uppercase font-semibold">
                              ({payment.payment_method})
                            </span>
                          </div>
                          {payment.coupon_code && (
                            <div className="mt-1 flex items-center gap-1">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                🎟️ {payment.coupon_code} (-৳{payment.discount_amount || 0})
                              </span>
                            </div>
                          )}
                          {payment.proof_url && payment.proof_url !== 'FREE_TRIAL' && (
                            <button 
                              onClick={() => setSelectedProof(payment.proof_url!)} 
                              className="text-xs text-blue-400 hover:text-blue-300 underline text-left mt-1.5 inline-block font-medium"
                            >
                              📷 প্রুফ দেখুন
                            </button>
                          )}
                          {payment.proof_url === 'FREE_TRIAL' && (
                            <span className="text-xs text-green-400 mt-1 font-semibold">ফ্রি ট্রায়াল</span>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown Selector */}
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={normalizedStatus}
                            onChange={(e) => updateStatus(payment.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none pr-8 cursor-pointer transition focus:outline-none shadow-sm ${getStatusBadgeClasses(normalizedStatus)}`}
                          >
                            <option value="pending" className="bg-[#111827] text-amber-400">⏳ Pending</option>
                            <option value="verifying" className="bg-[#111827] text-cyan-400">🔍 Verifying</option>
                            <option value="confirmed" className="bg-[#111827] text-emerald-400">✅ Confirmed</option>
                            <option value="declined" className="bg-[#111827] text-rose-400">❌ Declined</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70 text-current" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(payment.whatsapp || payment.user_phone) && (
                            <a
                              href={`https://wa.me/${(payment.whatsapp || payment.user_phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `হ্যালো ${payment.customer_name || 'গ্রাহক'}, Renovra থেকে আপনার অর্ডার #${payment.id} সংক্রান্ত তথ্য:`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="গ্রাহককে WhatsApp এ মেসেজ দিন"
                              className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl transition"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => deleteOrder(payment.id)}
                            title="অর্ডার মুছে ফেলুন"
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition"
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
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing <span className="font-medium text-white">{filteredPayments.length}</span> of {totalOrders} orders
          </div>
        </div>
      </div>

      {/* Proof Image Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={() => setSelectedProof(null)}>
          <div className="relative max-w-2xl w-full bg-[var(--surface)] p-4 rounded-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">গ্রাহকের পেমেন্ট স্ক্রিনশট / প্রমাণ</h3>
              <button onClick={() => setSelectedProof(null)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-2 overflow-hidden rounded-xl bg-black/50 flex justify-center">
              <img src={selectedProof} alt="Payment Proof" className="max-h-[70vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
