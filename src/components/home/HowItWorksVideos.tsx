'use client';

import { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Monitor, 
  Smartphone, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqList: FaqItem[] = [
  {
    question: 'টুলস কেনার পর কত দ্রুত অ্যাক্সেস পাবো?',
    answer: 'অর্ডার ও পেমেন্ট সম্পন্ন করার পর সাধারণত ১ থেকে ৫ মিনিটের মধ্যেই স্বয়ংক্রিয়ভাবে আপনার ড্যাশবোর্ডে অ্যাক্সেস ও লগইন তথ্য পেয়ে যাবেন। কিছু বিশেষ অ্যাকাউন্টের ক্ষেত্রে সর্বোচ্চ ১৫ মিনিট পর্যন্ত সময় লাগতে পারে।'
  },
  {
    question: 'আমি কি PC এবং Android উভয় ডিভাইসেই ব্যবহার করতে পারব?',
    answer: 'হ্যাঁ, অবশ্যই! আমাদের এক্সটেনশন সিস্টেম কম্পিউটার (Windows, Mac) এবং অ্যান্ড্রয়েড মোবাইলে (Kiwi বা Mises ব্রাউজার দিয়ে) সহজেই ব্যবহার করা যায়। ডানপাশের ভিডিওতে উভয় ডিভাইসে এক্সটেনশন সেটআপের সম্পূর্ণ টিউটোরিয়াল দেওয়া আছে।'
  },
  {
    question: 'টুলসের মেয়াদ চলাকালীন কোনো সমস্যা হলে কি সমাধান পাবো?',
    answer: 'সম্পূর্ণ ১০০% রিপ্লেসমেন্ট ও টেকনিক্যাল ওয়ারেন্টি প্রদান করা হয়। আপনার সাবস্ক্রিপশন মেয়াদ চলাকালীন যেকোনো সার্ভার বা লগইন সমস্যায় আমাদের ২৪/৭ হোয়াটসঅ্যাপ সাপোর্ট সক্রিয় থাকে। দ্রুত ফিক্স বা নতুন অ্যাক্সেস নিশ্চিত করা হয়।'
  },
  {
    question: 'ব্রাউজার থেকে কোনো টুল হঠাৎ লগআউট দেখালে কী করব?',
    answer: 'যদি কোনো টুলস লগআউট দেখেন, ব্রাউজারের ক্যাশ (Browser Cache) ক্লিয়ার করে আবার সেই টুল ওপেন করবেন। সমস্যা সমাধান না হলে সাথে সাথে আমাদের সাপোর্ট নম্বরে হোয়াটসঅ্যাপে মেসেজ করবেন।'
  },
  {
    question: 'এক্সটেনশন ব্যবহার করা কি নিরাপদ?',
    answer: 'একদমই নিরাপদ ও টেস্টেড। আমাদের এক্সটেনশন ১০০% সিকিউরড ক্লাউড সার্ভারের সাথে সরাসরি কানেক্টেড। এতে আপনার কম্পিউটারের ব্যক্তিগত কোনো তথ্যে অ্যাক্সেস থাকে না।'
  },
  {
    question: 'পেমেন্ট কোন কোন মাধ্যমে গ্রহণ করা হয়?',
    answer: 'বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket), সেলফিন (Cellfin), ব্যাংক ট্রান্সফার এবং যেকোনো ডেবিট/ক্রেডিট কার্ডের মাধ্যমে নিরাপদে পেমেন্ট করতে পারবেন।'
  }
];

export default function HowItWorksVideos() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [deviceTab, setDeviceTab] = useState<'pc' | 'phone'>('pc');

  return (
    <section id="faq" className="relative w-full py-6 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24 sm:scroll-mt-32">
      {/* Anchor for Watch How It Works links */}
      <div id="how-it-works" className="-mt-24 pt-24" />

      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/10 via-[#ccff00]/5 to-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-semibold text-[#ccff00] mb-1.5 sm:mb-2.5 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
          <HelpCircle className="w-3 h-3" />
          <span>FAQ ও ভিডিও গাইডলাইন</span>
        </div>

        <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-1 sm:mb-2">
          সাধারণ জিজ্ঞাসা ও ব্যবহারের নিয়ম
        </h2>
        
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
          টুলস ব্যবহার, এক্সটেনশন ইন্সটল এবং সাধারণ প্রশ্নাবলীর সহজ সমাধান এক নজরে দেখে নিন।
        </p>
      </div>

      {/* Two Column Layout: Left FAQ, Right Video Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Column: FAQ Accordion (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#ccff00]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#ccff00]">
              Frequently Asked Questions (FAQ)
            </span>
          </div>

          {faqList.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white/[0.04] border-[#ccff00]/40 shadow-[0_4px_20px_rgba(204,255,0,0.06)]'
                    : 'bg-[var(--surface)] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className={`text-xs sm:text-sm font-bold transition-colors ${
                    isOpen ? 'text-[#ccff00]' : 'text-white'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#ccff00]/20 text-[#ccff00] rotate-180' : 'bg-white/5 text-gray-400'
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                    <div className="pt-2 border-t border-white/5 text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Help Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-4 mt-4">
            <div>
              <p className="text-xs font-bold text-white mb-0.5">আরও কোনো প্রশ্ন আছে?</p>
              <p className="text-[11px] text-gray-400">আমাদের সাপোর্ট টিম সরাসরি আপনাকে সাহায্য করতে প্রস্তুত।</p>
            </div>
            <a
              href="https://wa.me/8801766392692?text=Hello%20Renovra%20Support,%20I%20have%20a%20question"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-black" />
              <span>সাপোর্ট পান</span>
            </a>
          </div>
        </div>

        {/* Right Column: Video Guide with PC/Phone Tabs (6 cols) */}
        <div className="lg:col-span-6 bg-[var(--surface)] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl relative">
          
          {/* Card Header & Title */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-400 mb-2">
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>ভিডিও টিউটোরিয়াল</span>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-white tracking-tight mb-1">
              Extension Install Guideline For PC & Android
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              অনেকে extension install এর গাইডলাইন ভিডিও চাচ্ছিলেন। এই গাইডলাইন ভিডিও টি দেখে নিন।
            </p>
          </div>

          {/* Device Switcher Tabs: PC vs Phone */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 border border-white/10 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => setDeviceTab('pc')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                deviceTab === 'pc'
                  ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>PC Version</span>
            </button>

            <button
              type="button"
              onClick={() => setDeviceTab('phone')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                deviceTab === 'phone'
                  ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Phone / Android</span>
            </button>
          </div>

          {/* Responsive Video Container */}
          {deviceTab === 'pc' ? (
            /* PC Video: 16:9 Landscape */
            <div className="relative w-full aspect-video rounded-2xl bg-black border border-white/10 overflow-hidden shadow-inner">
              <video
                key="pc-video"
                controls
                preload="metadata"
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/how-it-works-1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            /* Phone / Android Video: Portrait Natural 9:16 Frame */
            <div className="w-full py-2 flex justify-center">
              <div className="w-full max-w-[270px] sm:max-w-[290px] aspect-[9/16] rounded-2xl bg-black border-2 border-white/15 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative">
                <video
                  key="phone-video"
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/how-it-works-2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {/* Important Notes Box (as requested) */}
          <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs sm:text-sm leading-relaxed">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300 mb-1">Notes / বিশেষ দ্রষ্টব্য:</p>
                <p className="text-amber-100/90 text-xs sm:text-[13px] leading-relaxed">
                  যদি কোনো টুলস লগআউট দেখেন browser cache clear করে আবার সেই টুল ওপেন করবেন। অথবা সরাসরি সাপোর্ট এ জানাবেন। ধন্যবাদ
                </p>
              </div>
            </div>

            {/* Quick Contact Line */}
            <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
              <span className="text-amber-200/80">
                ইমেইল: <strong className="text-white">renovrait@gmail.com</strong>
              </span>
              <a
                href="https://wa.me/8801766392692?text=Hello%20Renovra%20Support,%20I%20need%20help"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ccff00] hover:underline font-bold flex items-center gap-1"
              >
                <span>WhatsApp: 01766392692</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
