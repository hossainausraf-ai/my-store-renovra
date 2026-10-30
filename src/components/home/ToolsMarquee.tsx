'use client';

import React from 'react';

type ToolLogo = {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
};

const topRowTools: ToolLogo[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    category: 'AI Assistant',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M22.28 9.87a5.98 5.98 0 00-.51-4.91 6.05 6.05 0 00-6.51-2.9A6.06 6.06 0 0010.5 0a6.05 6.05 0 00-5.77 4.22 6.01 6.01 0 00-4 2.9 6.05 6.05 0 00.75 7.12 5.98 5.98 0 00.51 4.91 6.05 6.05 0 006.51 2.9A6.06 6.06 0 0013.5 24a6.05 6.05 0 005.77-4.22 6.01 6.01 0 004-2.9 6.05 6.05 0 00-.75-7.12zM13.5 22.45a4.48 4.48 0 01-3.32-1.48c.03-.02.07-.04.1-.06l4.98-2.87a.79.79 0 00.4-.69v-7.03l2.1 1.21a.07.07 0 01.04.06v5.88a4.52 4.52 0 01-4.3 4.98zm-8.87-4.22a4.49 4.49 0 01-.6-3.58c.03.02.06.03.1.05l4.98 2.88a.79.79 0 00.79 0l6.09-3.52v2.43a.07.07 0 01-.03.06l-5.1 2.94a4.52 4.52 0 01-6.23-1.26zm-2.02-9.67a4.48 4.48 0 012.72-2.11v5.86a.79.79 0 00.4.69l6.09 3.51-2.1 1.22a.07.07 0 01-.07 0l-5.09-2.95a4.52 4.52 0 01-1.95-6.22zm14.16 2.45l-6.09-3.51 2.1-1.22a.07.07 0 01.07 0l5.1 2.95a4.52 4.52 0 01.12 7.78v-5.31a.79.79 0 00-.4-.69zm3.03-3.03a4.52 4.52 0 01-.72 8.44c-.03-.02-.06-.03-.1-.05l-4.98-2.88a.79.79 0 00-.79 0l-6.09 3.52v-2.43a.07.07 0 01.03-.06l5.1-2.94a4.52 4.52 0 017.45-3.6zm-11.4 4.58l2.4-1.39 2.4 1.39v2.77l-2.4 1.39-2.4-1.39z" fill="#10A37F"/>
      </svg>
    ),
  },
  {
    id: 'claude',
    name: 'Claude 3.5',
    category: 'AI Model',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#D97757">
        <path d="M13.68 2.05L12 6.32 10.32 2.05a1 1 0 10-1.87.72l1.32 4.6-4.57-1.42a1 1 0 00-.59 1.91l4.47 1.7-4.14 2.46a1 1 0 101.03 1.72l4.16-2.12-.53 4.77a1 1 0 001.98.22l.85-4.57.85 4.57a1 1 0 001.98-.22l-.53-4.77 4.16 2.12a1 1 0 101.03-1.72l-4.14-2.46 4.47-1.7a1 1 0 00-.59-1.91l-4.57 1.42 1.32-4.6a1 1 0 10-1.87-.72z"/>
      </svg>
    ),
  },
  {
    id: 'midjourney',
    name: 'Midjourney v6',
    category: 'AI Art',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 19.5c3.5 0 5-2 8-2s4.5 2 8 2 4.5-2 8-2" />
        <path d="M12 3v13" />
        <path d="M7 8l5-5 5 5" />
      </svg>
    ),
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'AI Voice',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#3B82F6">
        <rect x="6" y="4" width="4" height="16" rx="2" />
        <rect x="14" y="4" width="4" height="16" rx="2" />
      </svg>
    ),
  },
  {
    id: 'perplexity',
    name: 'Perplexity Pro',
    category: 'AI Search',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#22B8CD">
        <path d="M12 2L2 8v8l10 6 10-6V8L12 2zm0 3.2L18.8 9 12 12.8 5.2 9 12 5.2zM4 10.3l7 3.9v6.6l-7-4.2v-6.3zm16 6.3l-7 4.2v-6.6l7-3.9v6.3z"/>
      </svg>
    ),
  },
  {
    id: 'runway',
    name: 'Runway Gen-3',
    category: 'AI Video',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#A855F7">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 7h4c2.2 0 4 1.8 4 4 0 1.5-.8 2.8-2 3.5l2.5 4.5H14l-2.2-4H10v4H8V7zm2 5h2c1.1 0 2-.9 2-2s-.9-2-2-2h-2v4z" fill="#FFFFFF"/>
      </svg>
    ),
  },
];

const bottomRowTools: ToolLogo[] = [
  {
    id: 'canva',
    name: 'Canva Pro',
    category: 'Design',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#00C4CC">
        <circle cx="12" cy="12" r="10" />
        <path d="M15.5 8.5c-.8-.8-2-1.2-3.5-1.2-3 0-5 2.2-5 5.2s2 5.2 5 5.2c1.7 0 2.8-.5 3.5-1.2.4-.4.4-1 0-1.4s-1-.4-1.4 0c-.5.5-1.3.8-2.1.8-1.8 0-3-1.3-3-3.4s1.2-3.4 3-3.4c.8 0 1.6.3 2.1.8.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4z" fill="#FFFFFF"/>
      </svg>
    ),
  },
  {
    id: 'capcut',
    name: 'CapCut Pro',
    category: 'Video Edit',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#06B6D4">
        <path d="M4 6l7 6-7 6V6z M20 6l-7 6 7 6V6z" />
      </svg>
    ),
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    category: 'Writing',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#15C39A">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5c1.8 0 3.3-.9 4.2-2.3.4-.6.2-1.3-.4-1.6-.6-.4-1.3-.2-1.6.4-.6.9-1.4 1.5-2.2 1.5-1.7 0-3-1.3-3-3s1.3-3 3-3c.8 0 1.6.3 2.1.8l-1.3 1.3h4.2V6.6l-1.4 1.4C14.7 7.3 13.4 7 12 7z" fill="#FFFFFF"/>
      </svg>
    ),
  },
  {
    id: 'semrush',
    name: 'Semrush Pro',
    category: 'SEO Tools',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF642D">
        <path d="M12 2L4 9l3 11h10l3-11-8-7z" />
        <path d="M12 6l-3 5 3 4 3-4-3-5z" fill="#FFFFFF"/>
      </svg>
    ),
  },
  {
    id: 'envato',
    name: 'Envato Elements',
    category: 'Assets',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#81B441">
        <path d="M19.7 3.5C18.2 2 15.5 2 12.8 3.3c-3.6 1.8-6.2 5.5-6.8 9.5-.7 4.7 1.8 8.4 5.9 9.1 4.5.8 8.8-2.2 9.5-6.7.7-4.4-.7-9.8-1.7-11.7z" />
      </svg>
    ),
  },
  {
    id: 'freepik',
    name: 'Freepik Premium',
    category: 'Graphics',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0B72E3">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 8h8v3H8V8zm0 5h5v3H8v-3z" fill="#FFFFFF"/>
      </svg>
    ),
  },
];

function ToolCard({ tool }: { tool: ToolLogo }) {
  return (
    <div className="flex flex-col items-center justify-center bg-[var(--surface)]/70 hover:bg-[var(--surface)] border border-white/10 hover:border-blue-500/40 rounded-2xl p-3 w-28 h-28 sm:w-32 sm:h-32 transition-all duration-300 shrink-0 group shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer select-none">
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:border-white/20 transition-all duration-300 shrink-0">
        {tool.icon}
      </div>
      <span className="text-[11px] sm:text-xs font-bold text-gray-200 group-hover:text-white transition-colors tracking-tight text-center truncate max-w-[95px]">
        {tool.name}
      </span>
      <span className="text-[9px] text-gray-500 group-hover:text-gray-400 tracking-wider uppercase font-medium">
        {tool.category}
      </span>
    </div>
  );
}

export default function ToolsMarquee() {
  // Multiply sets to ensure seamless infinite looping with zero pop-in
  const topQuad = [...topRowTools, ...topRowTools, ...topRowTools, ...topRowTools];
  const bottomQuad = [...bottomRowTools, ...bottomRowTools, ...bottomRowTools, ...bottomRowTools];

  return (
    <section className="py-6 sm:py-24 w-full overflow-hidden bg-transparent border-t border-white/5 relative">
      <div className="text-center mb-4 sm:mb-14 px-4">
        <p className="text-blue-500 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-1 sm:mb-2">Our Tool Stack</p>
        <h2 className="text-lg sm:text-3xl font-extrabold text-white tracking-tight">PREMIUM TOOLS WE PROVIDE</h2>
        <p className="text-[11px] sm:text-sm text-gray-400 mt-1 sm:mt-2 max-w-md mx-auto">
          Over 100+ industry-standard tools available instantly from your dashboard
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-[100vw] overflow-hidden relative">
        {/* Soft edge blur masks (Left and Right) */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none z-10" />

        {/* Top Row - Smooth GPU Glide Left */}
        <div className="flex overflow-hidden group">
          <div className="flex w-max gap-3 sm:gap-4 animate-marquee-left group-hover:[animation-play-state:paused] will-change-transform">
            {topQuad.map((tool, idx) => (
              <ToolCard key={`top-${tool.id}-${idx}`} tool={tool} />
            ))}
          </div>
        </div>

        {/* Bottom Row - Smooth GPU Glide Right */}
        <div className="flex overflow-hidden group">
          <div className="flex w-max gap-3 sm:gap-4 animate-marquee-right group-hover:[animation-play-state:paused] will-change-transform">
            {bottomQuad.map((tool, idx) => (
              <ToolCard key={`bot-${tool.id}-${idx}`} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
