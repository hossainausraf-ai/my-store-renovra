'use client';

import { useState } from 'react';
import { Play, Sparkles, CheckCircle2, MessageCircle, HelpCircle } from 'lucide-react';

interface VideoGuide {
  id: string;
  badge: string;
  title: string;
  subtitleBn: string;
  src: string;
  highlights: string[];
}

const videoGuides: VideoGuide[] = [
  {
    id: 'video-order',
    badge: 'Guide 01 • অর্ডার ও পেমেন্ট',
    title: 'How to Order & Complete Payment',
    subtitleBn: 'প্যাকেজ বা সিঙ্গেল টুল সিলেক্ট করে বিকাশ/সেলফিন/ব্যাংক ট্রান্সফারের মাধ্যমে সহজেই অর্ডার করার সম্পূর্ণ প্রসেস।',
    src: '/videos/how-it-works-1.mp4',
    highlights: ['সহজ ১ মিনিটের চেকআউট', 'বিকাশ, নগদ ও সেলফিন সাপোর্ট', 'অটোমেটিক ইনভয়েস ও রিসিট']
  },
  {
    id: 'video-access',
    badge: 'Guide 02 • লগইন ও অ্যাক্সেস',
    title: 'How to Access & Use Your Tools',
    subtitleBn: 'অর্ডার কমপ্লিট হওয়ার পর আপনার ইউজার ড্যাশবোর্ড থেকে কিভাবে সফটওয়্যার ও AI টুলস অ্যাক্সেস করবেন।',
    src: '/videos/how-it-works-2.mp4',
    highlights: ['১-ক্লিক ড্যাশবোর্ড অ্যাক্সেস', '১০০% রিপ্লেসমেন্ট ওয়ারেন্টি', '২৪/৭ ইনস্ট্যান্ট হোয়াটসঅ্যাপ সাপোর্ট']
  }
];

export default function HowItWorksVideos() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="how-it-works" className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24 sm:scroll-mt-32">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/10 via-[#ccff00]/5 to-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold text-[#ccff00] mb-4 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>ভিডিও গাইড ও টিউটোরিয়াল</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Watch How It Works
        </h2>
        
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          মাত্র ১-২ মিনিটে ভিডিও দেখে জেনে নিন কিভাবে খুব সহজে আপনার পছন্দের যেকোনো টুলস অর্ডার করবেন এবং ইনস্ট্যান্ট অ্যাক্সেস পাবেন।
        </p>
      </div>

      {/* Video Grid (2 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        {videoGuides.map((guide, idx) => (
          <div
            key={guide.id}
            className="group relative rounded-3xl bg-[var(--surface)] border border-white/10 overflow-hidden shadow-2xl hover:border-[#ccff00]/40 transition-all duration-300 flex flex-col"
          >
            {/* Top Badge Banner */}
            <div className="px-6 py-3.5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <span className="text-xs font-bold text-[#ccff00] tracking-wide uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                {guide.badge}
              </span>
              <span className="text-[11px] font-mono text-gray-400">Step {idx + 1} of 2</span>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
              <video
                controls
                preload="metadata"
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setActiveVideo(guide.id)}
              >
                <source src={guide.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info Content */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#ccff00] transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                  {guide.subtitleBn}
                </p>
              </div>

              {/* Highlights */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                {guide.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Help Banner */}
      <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-emerald-900/20 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-[#ccff00]">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-1">ভিডিও দেখেও কোনো সাহায্য প্রয়োজন?</h4>
            <p className="text-xs sm:text-sm text-gray-400">আমাদের কাস্টমার সাপোর্ট টিম সার্বক্ষণিক লাইভ রয়েছে সরাসরি সহায়তা করার জন্য।</p>
          </div>
        </div>

        <a
          href="https://wa.me/8801766392692?text=Hello%20Renovra!%20I%20watched%20the%20video%20guides%20and%20need%20some%20help."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] shrink-0 active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>হোয়াটসঅ্যাপে মেসেজ দিন</span>
        </a>
      </div>
    </section>
  );
}

