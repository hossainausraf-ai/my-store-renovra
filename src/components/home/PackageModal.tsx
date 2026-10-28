'use client';

import Link from 'next/link';

interface PackageProps {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export default function PackageModal({ pkg, onClose }: { pkg: PackageProps, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-3xl font-bold mb-2">{pkg.name}</h2>
        <p className="text-[var(--color-secondary)] mb-6">{pkg.description}</p>
        
        <div className="mb-6 bg-black/20 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Total Price</p>
          <div className="text-3xl font-bold text-[var(--color-accent)]">৳{pkg.price} <span className="text-base font-normal text-gray-400">/ month</span></div>
        </div>
        
        <div className="mb-8">
          <h4 className="font-semibold mb-3">Package Includes:</h4>
          <ul className="space-y-2">
            {pkg.features.map((feature, i) => (
              <li key={i} className="flex items-center text-sm">
                <svg className="w-4 h-4 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <Link 
          href={`/checkout?pkgId=${pkg.id}`}
          className="w-full flex justify-center py-3 px-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
