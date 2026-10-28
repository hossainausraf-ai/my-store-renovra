'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Play, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

const changingWords = ['seconds.', 'clicks.', 'minutes.'];

const defaultToolCards = [
  {
    name: 'Monica AI',
    logo: 'https://i.ibb.co/311WqS5/monica.png', // Placeholder, using initials or colored box if image fails
    features: [
      'GPT-4, Claude & Gemini',
      'AI chat on any webpage',
      'Image generation included',
      'Translator & writer',
      'Cross-device sync',
      'Instant access after purchase'
    ],
    emojis: ['😍', '🚀', '❤️', '👍', '📌']
  },
  {
    name: 'Canva Pro',
    logo: 'https://i.ibb.co/8g6wXW4/canva.png',
    features: [
      '100M+ premium assets',
      'Magic Studio AI tools',
      'Background remover',
      'Brand kits & resize',
      '100GB cloud storage',
      'Instant access after purchase'
    ],
    emojis: ['🎨', '✨', '🔥', '👍', '💖']
  },
  {
    name: 'ChatGPT Plus',
    logo: 'https://i.ibb.co/L5Qx6T2/chatgpt.png',
    features: [
      'GPT-4o & o1 models',
      'Unlimited prompts',
      'Image & file uploads',
      'Custom GPTs access',
      'Priority response speed',
      'Instant access after purchase'
    ],
    emojis: ['🤖', '⚡', '🧠', '👍', '💬']
  },
  {
    name: 'Envato Elements',
    logo: 'https://i.ibb.co/808bFqJ/envato.png',
    features: [
      'Unlimited downloads',
      'Templates, graphics, fonts',
      'Video & audio assets',
      'Commercial license',
      'New items weekly',
      'Instant access after purchase'
    ],
    emojis: ['🎥', '🎵', '🚀', '😍', '🔥']
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
  const [toolCards, setToolCards] = useState<ToolCard[]>(defaultToolCards);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % changingWords.length);
    }, 2500);

    const cardInterval = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % (toolCards.length || 1));
    }, 4000);

    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase
        .from('hero_cards')
        .select('*')
        .order('order_idx', { ascending: true })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setToolCards(data.map(d => ({
              id: d.id,
              name: d.name,
              logo: d.logo_url,
              features: d.features || [],
              emojis: d.emojis || []
            })));
          }
        });
    });

    return () => {
      clearInterval(wordInterval);
      clearInterval(cardInterval);
    };
  }, [toolCards.length]);

  return (
    <div className="relative w-full pt-20 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-transparent">
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#ccff00]/10 to-[#00bfff]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#8a2be2]/10 to-transparent rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
      
      {/* Inline styles for custom floating animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUpFloat {
          0% { transform: translateY(40px) scale(0.8); opacity: 0; }
          20% { opacity: 1; transform: translateY(10px) scale(1.1); }
          80% { opacity: 1; transform: translateY(-20px) scale(1); }
          100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
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

          {/* Right Side - Stacked Cards */}
          <div className="relative h-[600px] flex items-center justify-center lg:justify-end perspective-1000">
            <div className="absolute top-[-5%] right-[10%] hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-gray-300 z-50">
              <span className="text-[#ccff00]">✨</span> 100+ Premium Tools
            </div>

            <div className="relative w-full max-w-[420px] h-[520px]">
              {toolCards.map((card, idx) => {
                // Calculate position based on current active card
                let relativeIndex = idx - cardIndex;
                if (relativeIndex < 0) relativeIndex += toolCards.length;
                
                const isTop = relativeIndex === 0;
                
                return (
                  <div 
                    key={card.name}
                    className="absolute top-0 left-0 w-full h-full rounded-[32px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 p-8 transition-all duration-[1200ms] ease-in-out shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                    style={{
                      transform: `translateX(${relativeIndex * -24}px) translateY(${relativeIndex * -20}px) scale(${1 - relativeIndex * 0.05})`,
                      zIndex: 30 - relativeIndex,
                      opacity: relativeIndex >= toolCards.length - 1 ? 0 : (1 - relativeIndex * 0.2),
                      pointerEvents: isTop ? 'auto' : 'none'
                    }}
                  >
                    
                    {/* Floating Emojis for the top card */}
                    {isTop && card.emojis.map((emoji, eIdx) => {
                      const positions = [
                        { top: '-30px', right: '10px', delay: '0s', animation: 'fadeUpFloat 4s ease-in-out infinite' }, // Top Right edge
                        { top: '180px', right: '-10px', delay: '1s', animation: 'fadeUpFloat 5s ease-in-out infinite' }, // Middle Right edge
                        { top: '-10px', left: '-15px', delay: '0.5s', animation: 'fadeUpFloat 4.5s ease-in-out infinite' }, // Top Left edge
                        { top: '220px', left: '-10px', delay: '1.5s', animation: 'fadeUpFloat 5.5s ease-in-out infinite' }, // Middle Left edge
                        { top: '-40px', left: '45%', delay: '0.8s', animation: 'fadeUpFloat 4.2s ease-in-out infinite' } // Top Center edge
                      ];
                      const pos = positions[eIdx % positions.length];
                      return (
                        <div 
                          key={eIdx} 
                          className="absolute text-[32px] z-0 drop-shadow-xl opacity-60"
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

                    <div className="w-16 h-16 bg-white rounded-2xl mb-6 flex items-center justify-center overflow-hidden shadow-lg relative z-10">
                      <img src={card.logo} alt={card.name} className="w-12 h-12 object-contain" onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-2xl font-bold text-black">${card.name.charAt(0)}</span>`;
                      }}/>
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
                      <Link href="/checkout" className="px-6 py-3 rounded-full bg-[#B3E600] text-black font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-lg hover:bg-[#9cbd00]">
                        Get Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </div>
                );
              })}

              {/* Slider Dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {toolCards.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === cardIndex ? 'w-6 bg-[#ccff00]' : 'w-1.5 bg-white/20'}`}
                  ></div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
