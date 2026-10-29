'use client';

import PackageCard from '@/components/home/PackageCard';
import SingleToolCard from '@/components/home/SingleToolCard';
import ToolsMarquee from '@/components/home/ToolsMarquee';
import HeroSection from '@/components/home/HeroSection';
import UserReviews from '@/components/home/UserReviews';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import HowItWorksVideos from '@/components/home/HowItWorksVideos';
import { defaultProducts } from '@/data/products';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const INITIAL_VISIBLE_TOOLS = 12;

export default function Home() {
  const [products, setProducts] = useState<any[]>(defaultProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_TOOLS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products?.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(e => console.warn('Frontend products load fallback:', e));
  }, []);

  const subscriptions = products.filter(p => p.product_type === 'subscription');
  const allSingleTools = products.filter(p => p.product_type === 'single_tool');

  // Normalize and deduplicate categories specifically for Single Tools (The Arsenal)
  const categoryMap = new Map<string, string>();
  allSingleTools.forEach(p => {
    const raw = (p.category || '').trim();
    if (!raw) return;
    const lower = raw.toLowerCase();
    if (!categoryMap.has(lower)) {
      categoryMap.set(lower, raw);
    }
  });
  const categories = ['All', ...Array.from(categoryMap.values())];

  const singleTools = activeCategory.toLowerCase() === 'all'
    ? allSingleTools
    : allSingleTools.filter(p => (p.category || '').trim().toLowerCase() === activeCategory.toLowerCase());

  return (
    <main className="flex flex-col items-center justify-center min-h-screen overflow-x-hidden pb-24">

      {/* Hero Section */}
      <div className="w-full">
        <HeroSection />
      </div>

      {/* Subscriptions Section (Moved below Hero) */}
      <div className="max-w-7xl mx-auto w-full mt-2 sm:mt-6 px-2.5 sm:px-4 scroll-mt-24" id="packages">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">লোড হচ্ছে...</div>
        ) : (
          subscriptions.length > 0 && (
            <div className="mb-12 sm:mb-16">
              <div className="text-center mb-6 sm:mb-8">
                <p className="text-blue-500 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-1.5 sm:mb-2">Pricing</p>
                <h2 className="text-base min-[360px]:text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-1.5 sm:mb-3 text-white whitespace-nowrap">Choose a plan that's right for you</h2>
                <p className="text-xs sm:text-base text-gray-400">Unlock full access to 100+ premium tools while saving more.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
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
                      isPopular: pkg.is_popular,
                      imageUrl: pkg.image_url,
                      galleryImages: pkg.gallery_images
                    }}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <div id="tools" className="max-w-7xl mx-auto w-full scroll-mt-24 mt-8 sm:mt-16 px-2.5 sm:px-4">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-green-500 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-2 sm:mb-3">The Arsenal</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-4 text-white">Premium tools, zero setup.</h2>
          <p className="text-xs sm:text-base text-gray-400">Hand-picked subscriptions, instantly accessible from your dashboard.</p>
        </div>

        {/* Category Filters (Mobile: 1-line horizontal scroll, Desktop: flex wrap centered) */}
        <div className="relative w-full mb-8 sm:mb-12">
          <div className="flex sm:flex-wrap items-center sm:justify-center gap-2 sm:gap-3 overflow-x-auto sm:overflow-x-visible no-scrollbar px-2 sm:px-0 py-1.5 scroll-smooth">
            {categories.map(cat => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(INITIAL_VISIBLE_TOOLS);
                  }}
                  className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-105'
                      : 'bg-[var(--surface)] text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400">লোড হচ্ছে...</div>
        ) : (
          <>
            {/* Single Premium Tools Section */}
            {singleTools.length > 0 && (
              <div className="mb-16 sm:mb-24">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
                  {singleTools.slice(0, visibleCount).map((tool) => (
                    <SingleToolCard
                      key={tool.id}
                      tool={{
                        id: tool.id,
                        name: tool.name,
                        price: tool.price,
                        category: tool.category,
                        imageUrl: tool.image_url || '',
                        galleryImages: tool.gallery_images,
                        validity: tool.validity || '1 Month'
                      }}
                    />
                  ))}
                </div>

                {/* Show More / Show Less Button */}
                {singleTools.length > visibleCount && (
                  <div className="text-center mt-10 sm:mt-14">
                    <button
                      type="button"
                      onClick={() => setVisibleCount(singleTools.length)}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#1E293B] hover:bg-[#283548] border border-white/15 hover:border-[#ccff00] text-white hover:text-[#ccff00] font-bold text-xs sm:text-sm shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#ccff00]" />
                      <span>Show More Tools (আরও {singleTools.length - visibleCount}টি টুলস দেখুন)</span>
                      <ChevronDown className="w-4 h-4 text-[#ccff00] group-hover:translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                )}

                {visibleCount >= singleTools.length && singleTools.length > INITIAL_VISIBLE_TOOLS && (
                  <div className="text-center mt-10 sm:mt-14">
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleCount(INITIAL_VISIBLE_TOOLS);
                        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
                    >
                      <span>Show Less (কম দেখান)</span>
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {allSingleTools.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                কোনো প্রোডাক্ট পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে অ্যাড করুন অথবা SQL ফাইলটি রান করুন।
              </div>
            )}
          </>
        )}
      </div>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Tools Marquee Section */}
      <ToolsMarquee />

      {/* User Reviews Section */}
      <div className="w-full mt-16 sm:mt-24">
        <UserReviews />
      </div>

      {/* FAQ & Video Guide Section (Moved to the very bottom) */}
      <HowItWorksVideos />
    </main>
  );
}
