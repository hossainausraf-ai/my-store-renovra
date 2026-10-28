'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { LogOut, User, Package, Clock } from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);

      // Fetch user's orders (assuming manual_payments is used for orders)
      // If no user_id column exists, it will return empty or throw error, so we catch it gracefully
      try {
        const { data } = await supabase
          .from('manual_payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) {
          const productIds = data.map(o => o.package_id).filter(Boolean);
          if (productIds.length > 0) {
            const { data: products } = await supabase.from('products').select('*').in('id', productIds);
            const ordersWithProducts = data.map(order => {
               const product = products?.find(p => p.id === order.package_id);
               return { ...order, product };
            });
            setOrders(ordersWithProducts);
          } else {
            setOrders(data);
          }
        }
      } catch (err) {
        console.log("Could not fetch orders", err);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-10 h-10 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header section */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center border border-blue-500/30">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.user_metadata?.full_name || 'My Profile'}</h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {user?.email === 'admin@renovra.com' && (
              <Link 
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-colors font-medium border border-blue-500/20"
              >
                Go to Admin Panel
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors font-medium border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#ccff00]" />
            My Orders
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
              <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white mb-1">No orders yet</h3>
              <p className="text-gray-400 text-sm mb-4">You haven't placed any orders.</p>
              <Link href="/#packages" className="inline-block bg-[#ccff00] text-black font-bold px-6 py-2 rounded-xl">
                Browse Packages
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-lg">
                        {order.product?.name || `Order #${order.id.slice(0,8)}`}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${
                        order.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        order.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center gap-1 mb-2">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      Payment: <span className="text-white uppercase">{order.payment_method}</span> ({order.trx_id})
                    </div>
                  </div>
                  <div className="text-right mt-4 sm:mt-0">
                    {order.status === 'approved' ? (
                      order.product?.product_type === 'digital' || order.product?.download_url ? (
                        <a 
                          href={order.product?.download_url || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block bg-[#ccff00] hover:bg-[#b3e600] text-black font-bold py-2 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)]"
                          onClick={(e) => {
                            if (!order.product?.download_url) {
                              e.preventDefault();
                              alert('No download link is attached to this product yet.');
                            }
                          }}
                        >
                          Download Product
                        </a>
                      ) : (
                        <a 
                          href={`https://wa.me/8801766392692?text=${encodeURIComponent(`Hello, my order for ${order.product?.name || order.package_id} (Order ID: ${order.id.slice(0,8)}) is approved. Please provide my access.`)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                          Get Access via WhatsApp
                        </a>
                      )
                    ) : (
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm">
                        Waiting for Approval
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
