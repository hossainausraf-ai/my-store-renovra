'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, MonitorPlay, Phone } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
      const handleHashChange = () => setCurrentHash(window.location.hash);
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Packages', href: '/#packages', icon: Package },
    { name: 'Products', href: '/digital-products', icon: MonitorPlay },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-[#1E293B]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isPackages = item.href === '/#packages';
          const isHome = item.href === '/';
          
          let isActive = false;
          if (isPackages) {
            isActive = pathname === '/' && currentHash === '#packages';
          } else if (isHome) {
            isActive = pathname === '/' && currentHash !== '#packages';
          } else {
            isActive = pathname === item.href;
          }
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (isPackages) setCurrentHash('#packages');
                else if (isHome) setCurrentHash('');
              }}
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
