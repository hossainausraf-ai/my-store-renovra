'use client';

import DigitalProductCard from '@/components/home/DigitalProductCard';
import { defaultProducts } from '@/data/products';
import { useState, useEffect } from 'react';

export default function DigitalProductsPage() {
  const [digitalProducts, setDigitalProducts] = useState<any[]>(
    defaultProducts.filter((p) => p.product_type === 'digital')
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/products?type=digital')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setDigitalProducts(data.products);
        }
      })
      .catch(e => console.warn('Digital products fetch fallback:', e));
  }, []);

  return (
    <main className="flex flex-col items-center pt-32 pb-24 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <p className="text-purple-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">Resources</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">Digital Products</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Download exclusive e-books, templates, and coding resources to supercharge your workflow.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400">লোড হচ্ছে...</div>
        ) : digitalProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {digitalProducts.map((product) => (
              <DigitalProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  category: product.category,
                  imageUrl: product.image_url || ''
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            কোনো ডিজিটাল প্রোডাক্ট পাওয়া যায়নি।
          </div>
        )}
      </div>
    </main>
  );
}
