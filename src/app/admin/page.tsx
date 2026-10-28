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
  MoreHorizontal,
  Download,
  Package,
  Trash2,
  MessageSquare,
  Send
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
};

export default function AdminDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>(defaultProducts);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    setProducts(defaultProducts);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        setPayments(data.orders);
      }
    } catch (e) {
      console.warn('Error fetching orders:', e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPayments(payments.map(p => (p.id === id || p.trx_id === id) ? { ...p, status: newStatus } : p));
      } else {
        alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!');
      }
    } catch (err) {
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!');
      console.error(err);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPayments(payments.filter(p => p.id !== id));
      } else {
        alert('অর্ডার ডিলিট করতে সমস্যা হয়েছে!');
      }
    } catch (err) {
      alert('অর্ডার ডিলিট করতে সমস্যা হয়েছে!');
      console.error(err);
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesFilter = activeFilter === 'All' || p.status === activeFilter.toLowerCase();
    const productName = products.find(prod => prod.id === p.package_id)?.name || p.package_id;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (p.trx_id && p.trx_id.toLowerCase().includes(searchLower)) || 
                          p.user_phone.toLowerCase().includes(searchLower) ||
                          productName.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const totalOrders = payments.length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const approvedCount = payments.filter(p => p.status === 'approved').length;
  const rejectedCount = payments.filter(p => p.status === 'rejected').length;

  const filters = ['All', 'Pending', 'Approved', 'Rejected'];

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Orders</h1>
          <p className="text-gray-400 text-sm">Track status, update progress & manage transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-white/10 hover:bg-white/5 rounded-xl text-sm font-medium text-gray-300 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white transition-colors">
            + New Order
          </button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--surface)] border border-blue-500/50 rounded-2xl p-5 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{totalOrders}</h3>
            <p className="text-gray-400 text-sm mt-1">Total Orders</p>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{pendingCount}</h3>
            <p className="text-gray-400 text-sm mt-1">Pending <span className="text-xs">• needs action</span></p>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{approvedCount}</h3>
            <p className="text-gray-400 text-sm mt-1">Approved <span className="text-xs">• completed</span></p>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{rejectedCount}</h3>
            <p className="text-gray-400 text-sm mt-1">Rejected <span className="text-xs">• cancelled</span></p>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-[var(--surface)] border border-white/5 rounded-2xl overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search order ID, phone or package..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-4">
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto">
              {filters.map(filter => {
                const count = filter === 'All' ? totalOrders : 
                              filter === 'Pending' ? pendingCount : 
                              filter === 'Approved' ? approvedCount : rejectedCount;
                return (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      activeFilter === filter 
                        ? 'bg-[var(--surface)] text-white shadow-sm border border-white/10' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      activeFilter === filter ? 'bg-white/10' : 'bg-white/5'
                    }`}>{count}</span>
                  </button>
                )
              })}
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-medium text-gray-300 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-medium text-gray-300 transition-colors">
              Newest first
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-semibold">Order Details</th>
                <th className="px-6 py-4 font-semibold">Customer Phone</th>
                <th className="px-6 py-4 font-semibold">Package / Product</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const isPending = payment.status === 'pending';
                  const isApproved = payment.status === 'approved';
                  
                  return (
                    <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Order */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-200">
                            #{payment.trx_id ? payment.trx_id.substring(0, 8).toUpperCase() : payment.id.substring(0, 8).toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {new Date(payment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      
                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold shrink-0">
                            {payment.user_phone.substring(0, 2)}
                          </div>
                          <div>
                            <span className="font-medium text-gray-300 block">{payment.user_phone}</span>
                            {payment.user_phone && (
                              <a
                                href={`https://wa.me/${payment.user_phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-green-400 hover:text-green-300 transition mt-0.5"
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
                          <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-300 truncate max-w-[150px]" title={products.find(p => p.id === payment.package_id)?.name || payment.package_id}>
                            {products.find(p => p.id === payment.package_id)?.name || 'Unknown Package'}
                          </span>
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold ${isApproved ? 'text-green-500' : isPending ? 'text-yellow-500' : 'text-red-500'}`}>
                            {isApproved ? 'Paid' : isPending ? 'Unpaid' : 'Refunded'}
                          </span>
                          <span className="text-xs text-gray-500 mt-1 uppercase">
                            {payment.payment_method}
                          </span>
                          {payment.proof_url && payment.proof_url !== 'FREE_TRIAL' && (
                            <button 
                              onClick={() => setSelectedProof(payment.proof_url!)} 
                              className="text-xs text-blue-400 hover:text-blue-300 underline text-left mt-2"
                            >
                              View Proof
                            </button>
                          )}
                          {payment.proof_url === 'FREE_TRIAL' && (
                            <span className="text-xs text-green-400 mt-2 font-semibold">Free Order</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border
                          ${isPending 
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                            : isApproved 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                              : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-yellow-500' : isApproved ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="capitalize">{payment.status}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => updateStatus(payment.id, 'approved')}
                              className="px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => updateStatus(payment.id, 'rejected')}
                              className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="relative inline-block group/dropdown">
                            <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-36 bg-[#1a2234] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-20 overflow-hidden">
                              <button 
                                onClick={() => deleteOrder(payment.id)}
                                className="w-full flex items-center justify-start gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-white/5 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </div>
                        )}
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
            Showing <span className="font-medium text-white">{filteredPayments.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-white/10 bg-blue-600/20 text-blue-400 border-blue-500/30 rounded-lg font-medium">1</button>
            <button className="px-3 py-1 border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Proof Image Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProof(null)}>
          <div className="relative max-w-2xl w-full bg-[var(--surface)] p-2 rounded-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 px-4 pt-4">
              <h3 className="text-xl font-bold text-white">Payment Proof</h3>
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
