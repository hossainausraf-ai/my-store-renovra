'use client';

import PackageCard from '@/components/home/PackageCard';
import DigitalProductCard from '@/components/home/DigitalProductCard';
import SingleToolCard from '@/components/home/SingleToolCard';
import ToolsMarquee from '@/components/home/ToolsMarquee';
import HeroSection from '@/components/home/HeroSection';
import UserReviews from '@/components/home/UserReviews';
import WhyChooseUs from '@/components/home/WhyChooseUs';
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
  features: string[];
  badge_text: string;
  color_from: string;
  color_to: string;
  is_popular: boolean;
};

import { defaultProducts } from '@/data/products';

export default function Home() {
  const [products, setProducts] = useState<any[]>(defaultProducts);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    let items = defaultProducts;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order_idx', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        items = data;
      }
    } catch (e) {
      console.warn('Using static products:', e);
    }

    setProducts(items);
    const uniqueCats = Array.from(new Set(items.map((p) => p.category))).filter(Boolean);
    setCategories(['All', ...uniqueCats]);
    setIsLoading(false);
  };

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const subscriptions = filteredProducts.filter(p => p.product_type === 'subscription');
  const digitalProducts = filteredProducts.filter(p => p.product_type === 'digital');
  const singleTools = filteredProducts.filter(p => p.product_type === 'single_tool');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen overflow-x-hidden pb-24">

      {/* Hero Section */}
      <div className="w-full">
        <HeroSection />
      </div>

      {/* Subscriptions Section (Moved below Hero) */}
      <div className="max-w-7xl mx-auto w-full mt-24 px-4 scroll-mt-24" id="packages">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">লোড হচ্ছে...</div>
        ) : (
          subscriptions.length > 0 && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-blue-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">Pricing</p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Choose a plan that's right for you</h2>
                <p className="text-gray-400">Unlock full access to 100+ premium tools while saving more.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {subscriptions.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={{
                      id: pkg.id,
                      badge: pkg.badge_text || 'Premium',
                      name: pkg.name,
                      price: pkg.price,
                      period: "month",
                      features: pkg.features || [],
                      colorFrom: pkg.color_from || 'from-blue-500/50',
                      colorTo: pkg.color_to || 'to-blue-500/10',
                      isPopular: pkg.is_popular
                    }}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <WhyChooseUs />

      <div id="tools" className="max-w-7xl mx-auto w-full scroll-mt-24 mt-16 px-4">

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${activeCategory === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'bg-[var(--surface)] text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400">লোড হচ্ছে...</div>
        ) : (
          <>
            {/* Single Premium Tools Section */}
            {singleTools.length > 0 && (
              <div className="mb-24">
                <div className="text-center mb-12">
                  <p className="text-green-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">The Arsenal</p>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Premium tools, zero setup.</h2>
                  <p className="text-gray-400">Hand-picked subscriptions, instantly accessible from your dashboard.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {singleTools.map((tool) => (
                    <SingleToolCard
                      key={tool.id}
                      tool={{
                        id: tool.id,
                        name: tool.name,
                        price: tool.price,
                        category: tool.category,
                        imageUrl: tool.image_url || '',
                        validity: tool.features?.[0] || '30 Days'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}



            {products.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                কোনো প্রোডাক্ট পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে অ্যাড করুন অথবা SQL ফাইলটি রান করুন।
              </div>
            )}
          </>
        )}
      </div>

      {/* Tools Marquee Section */}
      <ToolsMarquee />

      {/* User Reviews Section */}
      <div className="w-full mt-24">
        <UserReviews />
      </div>
    </main>
  );
}
