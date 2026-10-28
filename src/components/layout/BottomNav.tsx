'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, MonitorPlay, Info, Phone } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Packages', href: '/#packages', icon: Package },
    { name: 'Products', href: '/digital-products', icon: MonitorPlay },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          // Special active state logic for hash links if needed, but for simplicity:
          const isActive = pathname === item.href || (item.href === '/#packages' && pathname === '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-[#B3E600]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#B3E600]' : 'text-gray-400'}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
