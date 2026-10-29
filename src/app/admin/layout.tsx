'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { defaultSettings } from '@/data/settings';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  MessageSquare,
  MonitorPlay,
  CreditCard,
  Mail, 
  BarChart2, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  Menu,
  X,
  Wrench,
  Images,
  Layers,
  TicketPercent
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  const [logoUrl, setLogoUrl] = useState<string | null>(defaultSettings.logo_url || null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;

    const fetchPendingOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success && data.orders) {
          const pending = data.orders.filter((o: any) => o.status === 'pending');
          setPendingOrders(pending.slice(0, 10));
        }
      } catch (e) {
        console.warn('Orders fetch error in admin layout:', e);
      }
    };

    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 10000); // Check every 10s

    return () => clearInterval(interval);
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }
  
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const navItems = [
    { name: 'Dashboard (Orders)', href: '/admin', icon: LayoutDashboard },
    { name: 'Packages', href: '/admin/packages', icon: CreditCard },
    { name: 'Digital Products', href: '/admin/digital-products', icon: MonitorPlay },
    { name: 'Single Tools', href: '/admin/single-tools', icon: Wrench },
    { name: 'Tool Logos', href: '/admin/tools', icon: Images },
    { name: 'Hero Cards', href: '/admin/hero-cards', icon: Layers },
    { name: 'Coupons & Discounts', href: '/admin/coupons', icon: TicketPercent },
  ];

  const otherItems = [
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-[var(--surface)] border-r border-white/5 hidden lg:flex flex-col h-screen sticky top-0 shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">R</span>
              </div>
            )}
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Renovra</h2>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="mb-8">
            <p className="px-4 text-xs font-semibold text-gray-500 mb-4 tracking-wider">MAIN MENU</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${
                      isActive 
                        ? 'bg-blue-600/10 text-blue-500' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mb-8">
            <p className="px-4 text-xs font-semibold text-gray-500 mb-4 tracking-wider">OTHER</p>
            <nav className="space-y-1">
              {otherItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5"
                >
                  <item.icon className="w-5 h-5 text-gray-500" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-[var(--surface)] border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex relative max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-black/20 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 font-mono">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 relative">
            <button 
              onClick={() => {
                setHasNew(false);
                const dropdown = document.getElementById('notification-dropdown');
                if (dropdown) dropdown.classList.toggle('hidden');
              }}
              className={`relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none ${hasNew ? 'text-white' : ''}`}
            >
              <Bell className={`w-5 h-5 ${hasNew ? 'animate-[bounce_1s_infinite] text-blue-400' : ''}`} />
              {pendingOrders.length > 0 && (
                <span className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 border border-[var(--surface)] text-[9px] font-bold text-white flex items-center justify-center ${hasNew ? 'animate-pulse' : ''}`}>
                  {pendingOrders.length > 9 ? '9+' : pendingOrders.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <div id="notification-dropdown" className="hidden absolute top-12 right-0 w-80 bg-[#1E293B] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
              <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{pendingOrders.length} Pending</span>
              </div>
              
              <div className="max-h-80 overflow-y-auto custom-scrollbar flex-1 bg-black/10">
                {pendingOrders.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-400">
                    No new notifications.
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-white/5">
                    {pendingOrders.map(order => (
                      <div key={order.id} className="p-3 hover:bg-white/5 transition-colors text-left flex flex-col gap-1">
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                          New Order Received!
                        </div>
                        <div className="text-xs text-gray-400 pl-4">Phone: <span className="text-gray-200">{order.user_phone}</span></div>
                        <div className="text-[10px] text-gray-500 pl-4">{new Date(order.created_at).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-2 border-t border-white/10 text-center bg-[var(--surface)]">
                <Link href="/admin" className="text-xs text-blue-400 hover:text-blue-300 font-bold inline-block p-1">
                  View All Orders
                </Link>
              </div>
            </div>

            <Link href="/" className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View Site
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative w-64 bg-[var(--surface)] h-full flex flex-col shadow-2xl">
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
              <span className="text-xl font-bold text-white">Admin</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                      pathname === item.href 
                        ? 'bg-blue-600/10 text-blue-500' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4">
              <Link href="/" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-xl mb-3 text-sm font-medium">
                View Site
              </Link>
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-400 bg-red-400/10 rounded-xl text-sm font-medium">
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
