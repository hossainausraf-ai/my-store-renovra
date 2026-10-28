'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, X, CheckCircle2 } from 'lucide-react';

interface PurchaseNotification {
  name: string;
  initials: string;
  action: string;
  product?: string;
  location: string;
  time: string;
  avatarBg?: string;
  textColor?: string;
}

const fallbackPurchases: PurchaseNotification[] = [
  { 
    name: 'Anik Rahman', 
    initials: 'AR', 
    action: 'upgraded to ChatGPT Plus (GPT-4o)', 
    location: 'Dhaka', 
    time: 'Just Now', 
    avatarBg: 'bg-[#ccff00]', 
    textColor: 'text-black' 
  },
  { 
    name: 'Tanvir Ahmed', 
    initials: 'TA', 
    action: 'purchased Canva Pro Direct Invite', 
    location: 'Chittagong', 
    time: '2 min ago', 
    avatarBg: 'bg-[#34d399]', 
    textColor: 'text-black' 
  },
  { 
    name: 'Nusrat Jahan', 
    initials: 'NJ', 
    action: 'ordered Envato Elements Unlimited', 
    location: 'Sylhet', 
    time: 'Just Now', 
    avatarBg: 'bg-[#38bdf8]', 
    textColor: 'text-black' 
  },
  { 
    name: 'Sabbir Hossain', 
    initials: 'SH', 
    action: 'upgraded to All-in-One AI Bundle', 
    location: 'Rajshahi', 
    time: '4 min ago', 
    avatarBg: 'bg-[#c084fc]', 
    textColor: 'text-black' 
  },
  { 
    name: 'Farhana Akter', 
    initials: 'FA', 
    action: 'purchased Monica AI Pro Assistant', 
    location: 'Dhaka', 
    time: 'Just Now', 
    avatarBg: 'bg-[#ccff00]', 
    textColor: 'text-black' 
  },
  { 
    name: 'Mehedi Hasan', 
    initials: 'MH', 
    action: 'bought 10,000+ AI Prompts Pack', 
    location: 'Khulna', 
    time: '5 min ago', 
    avatarBg: 'bg-[#f472b6]', 
    textColor: 'text-black' 
  },
  { 
    name: 'Ariful Islam', 
    initials: 'AI', 
    action: 'renewed CapCut Pro Membership', 
    location: 'Gazipur', 
    time: 'Just Now', 
    avatarBg: 'bg-[#60a5fa]', 
    textColor: 'text-black' 
  },
  { 
    name: 'Rifat Hasan', 
    initials: 'RH', 
    action: 'upgraded to Gemini Advanced Bundle', 
    location: 'Dhaka', 
    time: '1 min ago', 
    avatarBg: 'bg-[#ccff00]', 
    textColor: 'text-black' 
  },
  { 
    name: 'Shamim Reza', 
    initials: 'SR', 
    action: 'purchased Semrush Guru SEO Suite', 
    location: 'Cumilla', 
    time: 'Just Now', 
    avatarBg: 'bg-[#fb923c]', 
    textColor: 'text-black' 
  }
];

export default function LiveSalesNotification() {
  const [notifications, setNotifications] = useState<PurchaseNotification[]>(fallbackPurchases);
  const [current, setCurrent] = useState<PurchaseNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const currentIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Attempt to fetch real orders from API to merge with realistic social proof
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          const realPurchases: PurchaseNotification[] = data.orders.slice(0, 10).map((ord: any) => {
            const rawName = ord.customer_name || 'Customer';
            const parts = rawName.trim().split(' ');
            const initials = parts.length > 1 
              ? (parts[0][0] + parts[1][0]).toUpperCase() 
              : rawName.slice(0, 2).toUpperCase();

            return {
              name: rawName,
              initials,
              action: `purchased ${ord.package_name || ord.item_name || 'Premium Tool'}`,
              location: 'Bangladesh',
              time: 'Just Now',
              avatarBg: 'bg-[#ccff00]',
              textColor: 'text-black'
            };
          });

          // Merge real orders at the top
          setNotifications([...realPurchases, ...fallbackPurchases]);
        }
      })
      .catch(() => {});
  }, []);

  // Main notification loop
  useEffect(() => {
    if (isDismissed || notifications.length === 0) return;

    // Initial popup appears 3.5 seconds after page load
    const initialTimeout = setTimeout(() => {
      showNextNotification();
    }, 3500);

    return () => {
      clearTimeout(initialTimeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDismissed, notifications]);

  const showNextNotification = () => {
    if (isDismissed) return;

    // Pick next notification
    const item = notifications[currentIndexRef.current % notifications.length];
    currentIndexRef.current += 1;
    setCurrent(item);
    setIsVisible(true);

    // Keep visible for 5 seconds
    timerRef.current = setTimeout(() => {
      setIsVisible(false);

      // Wait random 7 to 13 seconds before showing the next one
      const nextDelay = Math.floor(Math.random() * 6000) + 7000;
      timerRef.current = setTimeout(() => {
        showNextNotification();
      }, nextDelay);

    }, 5000);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    // Pause for 45 seconds if dismissed
    setTimeout(() => {
      if (!isDismissed) showNextNotification();
    }, 45000);
  };

  if (!current) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
          : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
      } bottom-[84px] md:bottom-6 left-4 md:left-6 max-w-[calc(100vw-32px)] sm:max-w-[360px]`}
    >
      <Link 
        href="/#packages"
        className="block group relative"
      >
        <div className="bg-[#0f1419]/95 backdrop-blur-xl border border-white/10 hover:border-[#ccff00]/40 rounded-2xl p-3 sm:p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(204,255,0,0.05)] flex items-center gap-3 transition-all duration-300">
          
          {/* Avatar with Initials + Shopping Bag Icon Badge */}
          <div className="relative shrink-0">
            <div className={`w-10 h-10 rounded-full ${current.avatarBg || 'bg-[#ccff00]'} ${current.textColor || 'text-black'} font-black flex items-center justify-center text-xs tracking-wider shadow-md`}>
              {current.initials}
            </div>

            {/* Tiny Verified Purchase Badge on Avatar Corner */}
            <div className="w-4 h-4 rounded-full bg-[#161c22] border border-white/20 text-[#ccff00] flex items-center justify-center text-[9px] absolute -bottom-0.5 -right-0.5 shadow-sm">
              <ShoppingBag className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Text Information */}
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs sm:text-[13px] text-gray-300 leading-snug line-clamp-1">
              <span className="font-extrabold text-white">{current.name}</span>{' '}
              <span className="text-gray-400">{current.action}</span>
            </p>

            <div className="flex items-center gap-2 mt-0.5">
              {/* Pulsing Green Dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-400">
                {current.time}
              </span>
              <span className="text-[10px] text-gray-500">•</span>
              <span className="text-[11px] text-gray-400 truncate">
                {current.location}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="Dismiss notification"
            className="absolute top-2.5 right-2.5 text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors opacity-70 group-hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>

        </div>
      </Link>
    </div>
  );
}
