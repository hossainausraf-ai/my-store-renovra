import React from 'react';

const FEATURES = [
  {
    id: 1,
    title: '100+ Premium Tools',
    description: 'Get access to industry-leading AI, SEO, and Design tools all in one single dashboard.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-950">
        <path d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Instant Access',
    description: 'No waiting time. Get instant access to all tools immediately after your payment is verified.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-950">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: '99.9% Uptime Guarantee',
    description: 'Our tools are hosted on premium servers ensuring uninterrupted workflow for your projects.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-950">
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M2 14h20" />
        <path d="M8 18v3" />
        <path d="M16 18v3" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Regular Updates',
    description: 'We constantly add new tools and update existing ones to keep you ahead of the competition.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-950">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 21v-5h5" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Premium Support',
    description: 'Stuck somewhere? Our dedicated support team is available 24/7 to resolve your issues.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-950">
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Affordable Pricing',
    description: 'Save thousands of dollars every month. Get all premium tools at a fraction of the cost.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-950">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 sm:py-24 px-3 sm:px-4 bg-transparent w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <p className="text-green-500 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-2 sm:mb-3">Elevate Your Workflow</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-4 text-white">Why Choose Our Subscription?</h2>
          <p className="text-gray-400 text-xs sm:text-lg max-w-2xl mx-auto">
            We've engineered a platform that focuses on <strong className="text-white">real productivity</strong>, saving you both time and money.
          </p>
        </div>

        {/* Mobile View: 3 Compact Cards Visible at Once in Continuous Loop Carousel (Right to Left) */}
        <div 
          className="block md:hidden overflow-hidden w-full relative py-2 -mx-3 px-3"
          style={{ 
            maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)'
          }}
        >
          <div className="flex gap-2 w-max animate-marquee-left hover:[animation-play-state:paused] active:[animation-play-state:paused]">
            {[...FEATURES, ...FEATURES].map((feature, idx) => (
              <div
                key={`mobile-${feature.id}-${idx}`}
                className="w-[114px] sm:w-[130px] shrink-0 bg-[var(--surface)] relative border border-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-green-400 flex items-center justify-center mb-2 shadow-[0_0_12px_rgba(74,222,128,0.3)] [&>div>svg]:w-4 [&>div>svg]:h-4">
                    <div className="text-green-950 flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-[11px] sm:text-xs font-bold text-white mb-1 leading-snug line-clamp-2 min-h-[1.7rem]">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-snug text-[8.5px] sm:text-[9.5px] line-clamp-3">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View: Grid Layout (PC/Tablet) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="bg-[var(--surface)] relative border border-white/5 rounded-3xl p-8 hover:bg-[#24334a] hover:border-white/10 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.3)] group-hover:shadow-[0_0_40px_rgba(74,222,128,0.5)] transition-shadow duration-300">
                <div className="text-green-950">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
