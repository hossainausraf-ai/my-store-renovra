'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Play, ArrowRight, CheckCircle2, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const changingWords = ['seconds.', 'clicks.', 'minutes.'];

const defaultToolCards = [
  {
    id: 'envato',
    name: 'Envato Elements',
    logo: 'https://cdn.worldvectorlogo.com/logos/envato.svg',
    features: [
      'Unlimited downloads',
      'Templates, graphics, fonts',
      'Video & audio assets',
      'Commercial license',
      'New items weekly',
      'Instant access after purchase'
    ],
    emojis: ['🚀', '😍', '❤️', '🔥', '✨']
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
    emojis: ['🎨', '✨', '🔥', '💖', '👑']
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
    emojis: ['🤖', '⚡', '🧠', '💡', '🚀']
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
    emojis: ['😍', '🚀', '❤️', '🌟', '📌']
  }
];

type ToolCard = {
  id?: string;
  name: string;
  logo: string;
  features: string[];
  emojis: string[];
};

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [toolCards] = useState<ToolCard[]>(defaultToolCards);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % changingWords.length);
    }, 2500);

    return () => clearInterval(wordInterval);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const cardInterval = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % (toolCards.length || 1));
    }, 4000);

    return () => clearInterval(cardInterval);
  }, [isPaused, toolCards.length]);

  const handleNext = () => {
    setCardIndex((prev) => (prev + 1) % toolCards.length);
  };

  const handlePrev = () => {
    setCardIndex((prev) => (prev - 1 + toolCards.length) % toolCards.length);
  };

  return (
    <div className="relative w-full pt-10 pb-4 sm:pt-16 sm:pb-8 md:pt-24 md:pb-12 overflow-hidden bg-transparent">
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#ccff00]/10 to-[#00bfff]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#8a2be2]/10 to-transparent rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
      
      {/* Inline styles for custom floating animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUpFloat {
          0% { transform: translateY(40px) scale(0.8); opacity: 0; }
          20% { opacity: 0.9; transform: translateY(10px) scale(1.1); }
          80% { opacity: 0.9; transform: translateY(-20px) scale(1); }
          100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
        }
        @keyframes float1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(15px) rotate(-5deg); } }
      `}} />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Content */}
          <div className="relative">
            
            {/* Floating Badges */}
            <div className="flex flex-wrap gap-2 mb-6 relative z-20">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-medium text-gray-300 shadow-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                Trusted by 15K+
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

          {/* Right Side - Stacked Cards (Hidden on mobile, visible on desktop lg+) */}
          <div className="hidden lg:flex relative h-[600px] items-center justify-end">
            <div className="absolute top-[-5%] right-[10%] hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-gray-300 z-50">
              <span className="text-[#ccff00]">✨</span> 100+ Premium Tools
            </div>

            <div 
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative w-full max-w-[420px] h-[520px]"
            >
              {toolCards.map((card, idx) => {
                // Calculate position based on current active card
                let relativeIndex = idx - cardIndex;
                if (relativeIndex < 0) relativeIndex += toolCards.length;
                
                const isTop = relativeIndex === 0;
                
                return (
                  <div 
                    key={card.name}
                    className="absolute top-0 left-0 w-full h-full rounded-[32px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 p-8 transition-all duration-[1000ms] ease-in-out shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                    style={{
                      transform: `translateX(${relativeIndex * -24}px) translateY(${relativeIndex * -20}px) scale(${1 - relativeIndex * 0.05})`,
                      zIndex: 30 - relativeIndex,
                      opacity: relativeIndex >= toolCards.length - 1 ? 0 : (1 - relativeIndex * 0.2),
                      pointerEvents: isTop ? 'auto' : 'none'
                    }}
                  >
                    
                    {/* Floating Emojis for the top card (Original styling & animation without boxes) */}
                    {isTop && card.emojis.map((emoji, eIdx) => {
                      const positions = [
                        { top: '-25px', right: '25px', delay: '0s', animation: 'fadeUpFloat 4s ease-in-out infinite' },      // Top Right
                        { top: '35px', right: '-15px', delay: '0.8s', animation: 'fadeUpFloat 4.8s ease-in-out infinite' },    // Upper Right
                        { top: '110px', right: '-20px', delay: '1.4s', animation: 'fadeUpFloat 5.2s ease-in-out infinite' },   // Mid Right
                        { top: '-20px', left: '30px', delay: '0.4s', animation: 'fadeUpFloat 4.4s ease-in-out infinite' },     // Top Left
                        { top: '-35px', left: '48%', delay: '1.1s', animation: 'fadeUpFloat 4.2s ease-in-out infinite' }       // Top Center
                      ];
                      const pos = positions[eIdx % positions.length];
                      return (
                        <div 
                          key={eIdx} 
                          className="absolute text-[32px] z-20 drop-shadow-xl select-none pointer-events-none"
                          style={{
                            top: pos.top,
                            right: pos.right,
                            left: pos.left,
                            animation: pos.animation,
                            animationDelay: pos.delay
                          }}
                        >
                          {emoji}
                        </div>
                      );
                    })}

                    {/* Logo container */}
                    <div className="w-16 h-16 bg-white rounded-2xl mb-6 flex items-center justify-center overflow-hidden shadow-lg relative z-10 p-2.5">
                      <img 
                        src={card.logo} 
                        alt={card.name} 
                        loading="lazy"
                        decoding="async"
                        className="w-11 h-11 object-contain" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-2xl font-bold text-black">${card.name.charAt(0)}</span>`;
                        }}
                      />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-6 relative z-10 drop-shadow-md">{card.name}</h3>
                    
                    <div className="flex items-center gap-2 text-[#ccff00] text-sm font-bold mb-4 relative z-10">
                      ✨ Features:
                    </div>

                    <ul className="space-y-4 mb-10 relative z-10">
                      {card.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="absolute bottom-8 right-8 z-10">
                      <Link 
                        href={`/checkout?pkgId=${card.id || 'single_tool'}`}
                        className="px-6 py-3 rounded-full bg-[#B3E600] text-black font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-lg hover:bg-[#9cbd00] cursor-pointer"
                      >
                        Get Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>
                );
              })}

              {/* Slider Dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
                {toolCards.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCardIndex(idx)}
                    aria-label={`Go to card ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === cardIndex ? 'w-6 bg-[#ccff00]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              {/* Side navigation arrows */}
              <button
                onClick={handlePrev}
                aria-label="Previous card"
                className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white items-center justify-center hover:bg-[#ccff00] hover:text-black transition-all shadow-xl z-40 cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next card"
                className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white items-center justify-center hover:bg-[#ccff00] hover:text-black transition-all shadow-xl z-40 cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
