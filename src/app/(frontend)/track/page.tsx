'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, Clock, CheckCircle2, XCircle, ArrowLeft, Download, MessageSquare } from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('phone') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [supportWhatsApp, setSupportWhatsApp] = useState('8801766392692');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.support_whatsapp) {
          const num = data.settings.support_whatsapp.replace(/[^0-9]/g, '');
          setSupportWhatsApp(num.startsWith('88') ? num : `88${num}`);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchVal?: string) => {
    const val = (searchVal || query).trim();
    if (!val) {
      setErrorMessage('দয়া করে ফোন নম্বর বা TrxID লিখুন।');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(val)}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
        if (data.orders?.length === 0 && data.message) {
          setErrorMessage(data.message);
        }
      } else {
        setErrorMessage(data.message || 'অর্ডার তথ্য খুঁজে পাওয়া যায়নি।');
      }
    } catch (err) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Verification
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      
      {/* Header */}
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> হোমে ফিরে যান
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          অর্ডার ট্র্যাকিং (Track Order)
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
          আপনার পেমেন্ট ভেরিফিকেশন স্ট্যাটাস ও ডিজিটাল প্রোডাক্ট অ্যাক্সেস পেতে ফোন নম্বর বা TrxID দিয়ে সার্চ করুন।
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl mb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="অর্ডার আইডি (যেমন: RNV-123456), মোবাইল নম্বর বা TrxID লিখুন"
              className="w-full bg-[#1F2937]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'খোঁজা হচ্ছে...' : 'অর্ডার খুঁজুন'}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Results List */}
      {hasSearched && !isLoading && orders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">পাওয়া গেছে {orders.length}টি অর্ডার:</h2>
          
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#1E293B]/60 border border-white/10 rounded-2xl p-5 sm:p-6 transition hover:border-white/20 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">{order.product_name}</h3>
                  </div>
                  <p className="text-xs text-gray-400">
                    TrxID: <span className="font-mono text-gray-300">{order.trx_id}</span> • মেথড: {order.payment_method?.toUpperCase()}
                  </p>
                </div>

                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Status explanation */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-300">
                  {order.status === 'approved' ? (
                    <div className="text-green-400 flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      আপনার অর্ডার অনুমোদিত হয়েছে! নিচে থেকে ফাইল ডাউনলোড করুন বা WhatsApp-এ এক্সেস পান।
                    </div>
                  ) : order.status === 'rejected' ? (
                    <div className="text-red-400 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      পেমেন্ট তথ্যে সমস্যা পাওয়া গেছে। অনুগ্রহ করে WhatsApp সাপোর্টে কথা বলুন।
                    </div>
                  ) : (
                    <div className="text-yellow-400/90 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      অ্যাডমিন পেমেন্ট যাচাই করছেন। সাধারণত ৫-১৫ মিনিটের মধ্যে কনফার্মেশন পাওয়া যায়।
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {order.status === 'approved' && order.download_url && (
                    <a
                      href={order.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#B3E600] text-black px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#9cbd00] transition shadow-md"
                    >
                      <Download className="w-4 h-4" /> Download / Access
                    </a>
                  )}

                  <a
                    href={`https://wa.me/${supportWhatsApp}?text=${encodeURIComponent(
                      `Hello, I am inquiring about Order TrxID: ${order.trx_id} (${order.product_name})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-green-400" /> Support
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-gray-400">লোড হচ্ছে...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
