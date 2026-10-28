'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShieldCheck, Play, ArrowRight, CheckCircle2, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const changingWords = ['seconds.', 'clicks.', 'minutes.'];

type ToolCard = {
  id?: string;
  name: string;
  logo: string;
  features: string[];
  floatingReactions: string[];
};

const defaultToolCards: ToolCard[] = [
  {
    id: 'envato',
    name: 'Envato Elements',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Envato_Logo.svg',
    features: [
      'Unlimited downloads',
      'Templates, graphics, fonts',
      'Video & audio assets',
      'Commercial license',
      'New items weekly',
      'Instant access after purchase'
    ],
    floatingReactions: ['🚀', '🤩', '❤️']
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
    features: [
      '100M+ premium assets',
      'Magic Studio AI tools',
      'Background remover',
      'Brand kits & resize',
      '100GB cloud storage',
      'Instant access after purchase'
    ],
    floatingReactions: ['🎨', '✨', '💖']
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    features: [
      'GPT-4o & o1 models',
      'Unlimited prompts',
      'Image & file uploads',
      'Custom GPTs access',
      'Priority response speed',
      'Instant access after purchase'
    ],
    floatingReactions: ['🤖', '⚡', '🧠']
  },
  {
    id: 'monica',
    name: 'Monica AI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Claude_Ai.svg',
    features: [
      'GPT-4, Claude & Gemini',
      'AI chat on any webpage',
      'Image generation included',
      'Translator & writer',
      'Cross-device sync',
      'Instant access after purchase'
    ],
    floatingReactions: ['💡', '🔥', '🌟']
  }
];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [leavingCard, setLeavingCard] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [toolCards] = useState<ToolCard[]>(defaultToolCards);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Cycling words animation
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % changingWords.length);
    }, 2500);
    return () => clearInterval(wordInterval);
  }, []);

  // Card transition handlers
  const handleGoTo = (nextIdx: number) => {
    if (nextIdx === activeCard || leavingCard !== null) return;
    setLeavingCard(activeCard);
    setActiveCard(nextIdx);
    setTimeout(() => {
      setLeavingCard(null);
    }, 650);
  };

  const handleNextCard = () => {
    const nextIdx = (activeCard + 1) % toolCards.length;
    handleGoTo(nextIdx);
  };

  const handlePrevCard = () => {
    const prevIdx = (activeCard - 1 + toolCards.length) % toolCards.length;
    handleGoTo(prevIdx);
  };

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(() => {
      handleNextCard();
    }, 4500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeCard, isPaused, toolCards.length]);

  return (
    <div className="relative w-full pt-20 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-transparent">
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#ccff00]/10 to-[#00bfff]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#8a2be2]/10 to-transparent rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
      
      {/* Inline styles for custom floating animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatReaction1 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-12px) rotate(6deg) scale(1.05); }
        }
        @keyframes floatReaction2 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-15px) rotate(-8deg) scale(1.08); }
        }
        @keyframes floatReaction3 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-10px) rotate(5deg) scale(1.04); }
        }
        @keyframes float1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(15px) rotate(-5deg); } }
      `}} />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Side - Content */}
          <div className="relative">
            
            {/* Floating Badges */}
            <div className="flex flex-wrap gap-2 mb-6 relative z-20">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-medium text-gray-300 shadow-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                Trusted by 15K+
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-medium text-gray-300 shadow-xl">
                <span className="bg-gradient-to-r from-[#ccff00] to-[#99cc00] text-black px-1.5 py-0.5 rounded-[3px] font-bold text-[8px] sm:text-[10px]">NEW</span>
                GoSEOTools Saas Dashboard
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-black tracking-tighter leading-[1.05] sm:leading-[1.1] text-white mb-4 sm:mb-6 break-words">
              Premium tools at <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">90% off —</span> <br />
              in <span className="text-[#ccff00] transition-all duration-300 inline-block drop-shadow-[0_0_15px_rgba(204,255,0,0.4)]">{changingWords[wordIndex]}</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-lg leading-relaxed break-words pr-2">
              Pick any premium tool from <span className="text-white font-bold">100+ options</span>. Get instant access, share with team, save up to 90% on every subscription.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-10 sm:mb-12">
              <a href="#packages" className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#B3E600] hover:bg-[#9cbd00] text-black font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(179,230,0,0.2)]">
                Browse All Tools
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5" fill="currentColor" />
                </div>
                Watch How It Works
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 w-fit max-w-full overflow-hidden">
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black bg-purple-500 flex items-center justify-center font-bold text-white text-[10px] sm:text-xs">R</div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black bg-blue-500 flex items-center justify-center font-bold text-white text-[10px] sm:text-xs">S</div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black bg-orange-500 flex items-center justify-center font-bold text-white text-[10px] sm:text-xs">A</div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black bg-emerald-500 flex items-center justify-center font-bold text-white text-[10px] sm:text-xs">T</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#ccff00] mb-0.5">
                    {'★★★★★'.split('').map((star, i) => <span key={i} className="text-xs sm:text-sm">{star}</span>)}
                    <span className="text-white font-bold ml-1 text-xs sm:text-sm">4.9/5</span>
                  </div>
                  <p className="text-[9px] sm:text-[11px] text-gray-400">Joined by 15,000+</p>
                </div>
              </div>
              <div className="w-px h-8 sm:h-10 bg-white/10 shrink-0"></div>
              <div className="shrink-0 pr-2">
                <div className="text-white font-bold text-sm sm:text-base">100+</div>
                <div className="text-[9px] sm:text-[11px] text-gray-400">Premium Tools</div>
              </div>
            </div>
            
            {/* Scattered Floating Badges - Absolute positioning */}
            <div className="absolute top-[40%] right-[-5%] hidden xl:flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-medium text-gray-300 shadow-2xl" style={{ animation: 'float1 6s ease-in-out infinite' }}>
              <ShieldCheck className="w-4 h-4 text-green-500" />
              100% Secure
            </div>
            <div className="absolute top-[-5%] right-[20%] hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-medium text-gray-300 shadow-2xl" style={{ animation: 'float2 7s ease-in-out infinite' }}>
              <Zap className="w-4 h-4 text-yellow-500" />
              Instant Delivery
            </div>

          </div>

          {/* Right Side - Stacked 3D Cards */}
          <div className="relative h-[620px] flex items-center justify-center lg:justify-end">
            
            {/* Top Badge */}
            <div className="absolute top-[-2%] right-[5%] hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-gray-300 z-50 shadow-xl">
              <span className="text-[#ccff00]">✨</span> 100+ Premium Tools
            </div>

            {/* Stack Container */}
            <div 
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative w-full max-w-[430px] h-[540px] px-2 sm:px-0"
            >
              {toolCards.map((card, idx) => {
                const isLeaving = idx === leavingCard;
                const isActive = idx === activeCard;

                // Calculate position relative to active card
                const depth = (idx - activeCard + toolCards.length) % toolCards.length;

                let transform = '';
                let zIndex = 10;
                let opacity = 0;
                let pointerEvents: 'auto' | 'none' = 'none';

                if (isLeaving) {
                  // Card departure: smoothly lifts and swipes away to top-left
                  transform = 'translateX(-130px) translateY(-35px) rotate(-14deg) scale(0.92)';
                  zIndex = 40;
                  opacity = 0;
                  pointerEvents = 'none';
                } else if (isActive) {
                  // Active front card: perfectly centered, scale 1
                  transform = 'translateX(0px) translateY(0px) rotate(0deg) scale(1)';
                  zIndex = 30;
                  opacity = 1;
                  pointerEvents = 'auto';
                } else if (depth === 1) {
                  // 1st card stacked behind on left
                  transform = 'translateX(-22px) translateY(-14px) rotate(-3.5deg) scale(0.95)';
                  zIndex = 20;
                  opacity = 0.9;
                  pointerEvents = 'none';
                } else if (depth === 2) {
                  // 2nd card stacked further behind on left
                  transform = 'translateX(-40px) translateY(-26px) rotate(-6.5deg) scale(0.90)';
                  zIndex = 10;
                  opacity = 0.7;
                  pointerEvents = 'none';
                } else if (depth === 3) {
                  // 3rd card deepest layer on left
                  transform = 'translateX(-56px) translateY(-36px) rotate(-9.5deg) scale(0.85)';
                  zIndex = 5;
                  opacity = 0.45;
                  pointerEvents = 'none';
                } else {
                  transform = 'translateX(-70px) translateY(-44px) rotate(-12deg) scale(0.80)';
                  zIndex = 1;
                  opacity = 0;
                  pointerEvents = 'none';
                }

                return (
                  <div 
                    key={card.name}
                    className="absolute top-0 left-0 w-full h-full rounded-[32px] bg-gradient-to-br from-[#161c22] via-[#111519] to-[#0b0e11] border border-white/10 p-7 sm:p-8 transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_30px_70px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col justify-between select-none"
                    style={{
                      transform,
                      zIndex,
                      opacity,
                      pointerEvents
                    }}
                  >
                    
                    {/* Floating Reaction Badges (Only on Active Card, strictly outside text zone) */}
                    {isActive && (
                      <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
                        {/* Emoji 1: High Top Right */}
                        <div 
                          className="absolute -top-5 right-8 w-11 h-11 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-center text-2xl select-none"
                          style={{ animation: 'floatReaction1 4s ease-in-out infinite' }}
                        >
                          {card.floatingReactions[0]}
                        </div>

                        {/* Emoji 2: Upper Right Edge */}
                        <div 
                          className="absolute top-5 -right-4 w-11 h-11 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-center text-2xl select-none"
                          style={{ animation: 'floatReaction2 5s ease-in-out infinite 0.4s' }}
                        >
                          {card.floatingReactions[1]}
                        </div>

                        {/* Emoji 3: Mid Right Outer Margin */}
                        <div 
                          className="absolute top-24 -right-6 w-11 h-11 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-center text-2xl select-none"
                          style={{ animation: 'floatReaction3 4.5s ease-in-out infinite 0.8s' }}
                        >
                          {card.floatingReactions[2]}
                        </div>
                      </div>
                    )}

                    {/* Card Content Top */}
                    <div>
                      {/* Logo Box */}
                      <div className="w-16 h-16 bg-white rounded-2xl mb-5 flex items-center justify-center overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.35)] border border-white/20 relative z-10 shrink-0">
                        <img 
                          src={card.logo} 
                          alt={card.name} 
                          loading="lazy"
                          decoding="async"
                          className="w-11 h-11 object-contain" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-2xl font-black text-black">${card.name.charAt(0)}</span>`;
                          }}
                        />
                      </div>
                      
                      {/* Tool Name */}
                      <h3 className="text-3xl font-black text-white mb-5 relative z-10 tracking-tight drop-shadow-md">
                        {card.name}
                      </h3>
                      
                      {/* Features Label */}
                      <div className="flex items-center gap-2 text-[#ccff00] text-sm font-bold mb-3.5 relative z-10">
                        ✨ Features:
                      </div>

                      {/* Features List */}
                      <ul className="space-y-3 relative z-10">
                        {card.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <span className="text-gray-200 text-sm font-medium leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Content Bottom: Action Button */}
                    <div className="pt-4 flex items-center justify-end relative z-10">
                      <Link 
                        href={`/checkout?pkgId=${card.id || 'single_tool'}`} 
                        className="px-6 py-3 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-sm transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.55)] hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        Get Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>
                );
              })}

              {/* Slider Dots */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-40">
                {toolCards.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleGoTo(idx)}
                    aria-label={`Go to card ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                      idx === activeCard 
                        ? 'w-8 bg-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.6)]' 
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Arrows for desktop */}
              <button
                onClick={handlePrevCard}
                aria-label="Previous card"
                className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#161c22]/90 border border-white/15 text-white items-center justify-center hover:bg-[#ccff00] hover:text-black transition-all duration-300 shadow-xl z-40 cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextCard}
                aria-label="Next card"
                className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#161c22]/90 border border-white/15 text-white items-center justify-center hover:bg-[#ccff00] hover:text-black transition-all duration-300 shadow-xl z-40 cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
