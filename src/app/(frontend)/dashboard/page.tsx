'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/track');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400">অর্ডার ট্র্যাকিং পেজে নিয়ে যাওয়া হচ্ছে...</p>
    </div>
  );
}
