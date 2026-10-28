'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  LogOut, 
  Download, 
  ShoppingBag, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          setOrders(data.orders || []);
        } else {
          router.replace('/login');
        }
      })
      .catch(() => {
        router.replace('/login');
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-sm">ড্যাশবোর্ড লোড হচ্ছে...</p>
      </div>
    );
  }

  const approvedOrders = orders.filter(o => o.status === 'approved');
  const pendingOrders = orders.filter(o => o.status === 'pending');

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 max-w-6xl mx-auto space-y-10">

      {/* User Header Profile */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center text-xl font-black text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{user?.name || 'Customer'}</h1>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 border border-blue-800/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Member
              </span>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-3">
              <span>{user?.email}</span>
              {user?.phone && <span>• {user?.phone}</span>}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 text-sm font-semibold transition-all self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          লগআউট
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#111827]/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">মোট অর্ডার</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{orders.length} টি</h3>
          </div>
        </div>

        <div className="bg-[#111827]/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">সক্রিয় / অ্যাপ্রুভড</p>
            <h3 className="text-2xl font-bold text-green-400 mt-0.5">{approvedOrders.length} টি</h3>
          </div>
        </div>

        <div className="bg-[#111827]/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">পেন্ডিং অর্ডার</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-0.5">{pendingOrders.length} টি</h3>
          </div>
        </div>
      </div>

      {/* Orders List Section */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              আপনার অর্ডার ও সার্ভিসের তালিকা
            </h2>
            <p className="text-xs text-gray-400 mt-1">আপনার কেনা সমস্ত টুলস, প্যাকেজ এবং ডেলিভারি স্ট্যাটাস।</p>
          </div>
          <Link
            href="/#packages"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold"
          >
            নতুন টুল কিনুন <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-black/20 flex flex-col items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-gray-600 mb-1" />
            <p className="text-base font-bold text-gray-300">এখনো কোনো অর্ডার পাওয়া যায়নি</p>
            <p className="text-xs text-gray-500 max-w-sm">
              আপনি যদি ফোন নম্বর ছাড়া অর্ডার করে থাকেন, সরাসরি <Link href="/track" className="text-blue-400 underline font-semibold">Track Order</Link> পেজে TrxID দিয়ে সার্চ করতে পারেন।
            </p>
            <Link
              href="/#packages"
              className="mt-3 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              টুলস ও প্যাকেজ ব্রাউজ করুন
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isApproved = order.status === 'approved';
              const isPending = order.status === 'pending';

              return (
                <div
                  key={order.id}
                  className="bg-[var(--surface)] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white">
                        {order.product_name || 'Premium Package'}
                      </span>
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-950/80 text-green-400 border border-green-800/40">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/40">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-800/40">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-mono">
                      <span>Order ID: <b className="text-gray-300">{order.id}</b></span>
                      <span>TrxID: <b className="text-gray-300">{order.trx_id}</b></span>
                      <span>মূল্য: <b className="text-white font-sans">৳{order.price}</b></span>
                      <span>পেমেন্ট: <b className="text-gray-300 uppercase">{order.payment_method}</b></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <a
                      href={`https://wa.me/8801766392692?text=${encodeURIComponent(`Hello, I need access for Order #${order.id} (${order.product_name})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      এক্সেস হেল্পলাইন
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
