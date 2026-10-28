'use client';

import DigitalProductCard from '@/components/home/DigitalProductCard';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

type Product = {
  id: string;
  product_type: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

import { defaultProducts } from '@/data/products';

export default function DigitalProductsPage() {
  const [digitalProducts, setDigitalProducts] = useState<any[]>(
    defaultProducts.filter((p) => p.product_type === 'digital')
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDigitalProducts();
  }, []);

  const fetchDigitalProducts = async () => {
    setIsLoading(true);
    let items = defaultProducts.filter((p) => p.product_type === 'digital');

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'digital')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        items = data;
      }
    } catch (e) {
      console.warn('Using static digital products:', e);
    }

    setDigitalProducts(items);
    setIsLoading(false);
  };

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
