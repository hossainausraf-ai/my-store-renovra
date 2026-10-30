'use client';

import React from 'react';
import { ThumbsUp, Globe, MoreHorizontal, Sparkles, Star } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  date: string;
  content: string;
  verifiedBrand: string;
  rating: number;
}

const row1Reviews: ReviewItem[] = [
  {
    id: 'r1-1',
    name: 'Michael Carter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    date: 'March 14, 2026',
    content: 'Honestly the cheapest way to access ChatGPT Plus and Canva Pro together. Support replied in seconds.',
    verifiedBrand: 'Renovra',
    rating: 5
  },
  {
    id: 'r1-2',
    name: 'Mehedi Hasan Rocky',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    date: 'April 8, 2026',
    content: 'Alhamdulillah excellent service quality. Highly recommended. 100% trusted service provider in BD.',
    verifiedBrand: 'Renovra',
    rating: 5
  },
  {
    id: 'r1-3',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    date: 'February 24, 2026',
    content: 'I bought the Envato & Freepik package. All downloads work flawlessly without any limits. Wonderful team!',
    verifiedBrand: 'Renovra',
    rating: 4
  },
  {
    id: 'r1-4',
    name: 'Tanvir Ahmed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    date: 'January 19, 2026',
    content: 'Freelancing er jonno Semrush aar Envato niyechi. Fast activation ebong 24/7 WhatsApp help. Best decision!',
    verifiedBrand: 'Renovra',
    rating: 5
  },
  {
    id: 'r1-5',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    date: 'May 2, 2026',
    content: 'Super fast activation. Got my Claude 3.5 Sonnet and Leonardo AI setup within 3 minutes of ordering.',
    verifiedBrand: 'Renovra',
    rating: 4
  },
  {
    id: 'r1-6',
    name: 'Asif Mahmud',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    date: 'March 18, 2026',
    content: 'Academic thesis er jonno Paperpal aar Scite AI khub dorkar chilo. Khub kom dam e peyechi, onnek bhalo!',
    verifiedBrand: 'Renovra',
    rating: 3
  }
];

const row2Reviews: ReviewItem[] = [
  {
    id: 'r2-1',
    name: 'Nayan Ali',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    date: 'March 30, 2026',
    content: 'Udemy aar Kittl ekshathe pelam ekta plan e. Support team khub helpful. Joss service!',
    verifiedBrand: 'Renovra',
    rating: 5
  },
  {
    id: 'r2-2',
    name: 'Ananya Iyer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    date: 'March 2, 2026',
    content: 'The Canva Pro access is genuine, no logout issues. Customer support is available 24/7 which is amazing.',
    verifiedBrand: 'Renovra',
    rating: 4
  },
  {
    id: 'r2-3',
    name: 'David Brown',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    date: 'November 18, 2025',
    content: 'Subscribed to the All-in-One plan. Semrush, Ahrefs, ChatGPT — all working perfectly. Five stars!',
    verifiedBrand: 'Renovra',
    rating: 5
  },
  {
    id: 'r2-4',
    name: 'Rashedul Islam',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    date: 'April 12, 2026',
    content: 'bKash diye payment kore 2 min er moddhe instant access pelam. WhatsApp support response speed osadharon!',
    verifiedBrand: 'Renovra',
    rating: 4
  },
  {
    id: 'r2-5',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    date: 'February 11, 2026',
    content: 'The best tools ecosystem for content creators and marketers. Huge money saver every single month.',
    verifiedBrand: 'Renovra',
    rating: 3
  },
  {
    id: 'r2-6',
    name: 'Fariha Zaman',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    date: 'March 22, 2026',
    content: 'Amar agency team er jonno agency bundle niyechi. Shob graphic & video editing tools seamlessly kaj korche.',
    verifiedBrand: 'Renovra',
    rating: 5
  }
];

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="w-[210px] min-[360px]:w-[225px] sm:w-[380px] shrink-0 bg-[#0e131f]/90 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-2xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between">
      <div>
        {/* Top Header: Avatar + Name + Recommends + Date */}
        <div className="flex items-start gap-2 sm:gap-3">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-7 h-7 sm:w-10 sm:h-10 rounded-full object-cover border border-white/15 shrink-0 shadow-md"
            loading="lazy"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              <span className="font-bold text-white text-[11px] sm:text-sm tracking-tight truncate max-w-[90px] sm:max-w-none">
                {review.name}
              </span>
              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px] text-gray-400">
                <ThumbsUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 fill-emerald-400 shrink-0" />
                <span className="hidden min-[360px]:inline">recommends</span>
                <strong className="text-white font-semibold">{review.verifiedBrand}.</strong>
              </span>
            </div>

            <div className="flex items-center gap-1 text-[8.5px] sm:text-[11px] text-gray-500 mt-0.5">
              <span>{review.date}</span>
              <span>•</span>
              <Globe className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            </div>
          </div>

          <div className="hidden sm:block text-gray-500 hover:text-gray-300 cursor-pointer shrink-0 ml-1">
            <MoreHorizontal className="w-4 h-4" />
          </div>
        </div>

        {/* Review Text */}
        <p className="text-[10px] min-[360px]:text-[11px] sm:text-sm text-gray-300 leading-snug line-clamp-3 mt-1.5 mb-2 sm:mt-3 sm:mb-4">
          {review.content}
        </p>
      </div>

      {/* Bottom Tag Pill */}
      <div className="pt-1.5 sm:pt-2 border-t border-white/5 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/5 border border-white/10 text-[8.5px] sm:text-[11px] font-medium text-gray-300">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
          <span>{review.verifiedBrand}</span>
        </div>

        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star 
              key={s} 
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                s <= review.rating 
                  ? 'text-amber-400 fill-amber-400' 
                  : 'text-gray-600 fill-white/5'
              }`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UserReviews() {
  const loopRow1 = [...row1Reviews, ...row1Reviews];
  const loopRow2 = [...row2Reviews, ...row2Reviews];

  return (
    <section className="py-5 sm:py-24 bg-transparent border-t border-white/5 relative overflow-hidden w-full">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/10 via-[#ccff00]/5 to-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-3.5 sm:mb-14 px-3 sm:px-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-semibold text-[#ccff00] mb-1 sm:mb-2.5 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
          <Sparkles className="w-3 h-3" />
          <span>কাস্টমার রিভিউ • 100% Genuine</span>
        </div>

        <h2 className="text-sm min-[360px]:text-[15px] min-[400px]:text-base sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-1 sm:mb-3 whitespace-nowrap">
          Loved by 1,200+ Creators & Students
        </h2>
        
        <p className="text-gray-400 text-[11px] sm:text-base leading-relaxed max-w-2xl mx-auto">
          দেখুন ১২০০+ ফ্রিল্যান্সার, কন্টেন্ট ক্রিয়েটর এবং শিক্ষার্থীরা Renovra সম্পর্কে কী বলছেন।
        </p>
      </div>

      {/* Two-Row Marquee Loop Carousel */}
      <div 
        className="relative w-full overflow-hidden space-y-2.5 sm:space-y-5"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
        }}
      >
        {/* Row 1: Right to Left (animate-marquee-left) */}
        <div className="flex gap-2.5 sm:gap-5 w-max animate-marquee-left hover:[animation-play-state:paused] active:[animation-play-state:paused] py-0.5">
          {loopRow1.map((rev, idx) => (
            <ReviewCard key={`r1-${rev.id}-${idx}`} review={rev} />
          ))}
        </div>

        {/* Row 2: Left to Right (animate-marquee-right) */}
        <div className="flex gap-2.5 sm:gap-5 w-max animate-marquee-right hover:[animation-play-state:paused] active:[animation-play-state:paused] py-0.5">
          {loopRow2.map((rev, idx) => (
            <ReviewCard key={`r2-${rev.id}-${idx}`} review={rev} />
          ))}
        </div>
      </div>
    </section>
  );
}
