'use client';

import { Layers, FileCode } from 'lucide-react';

const heroCards = [
  { name: 'Monica AI', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Claude_Ai.svg', desc: 'GPT-4, Claude & Gemini assistant' },
  { name: 'Canva Pro', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg', desc: '100M+ assets & Magic Studio AI' },
  { name: 'ChatGPT Plus', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', desc: 'GPT-4o & o1 with unlimited prompts' },
  { name: 'Envato Elements', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Envato_Logo.svg', desc: 'Unlimited themes, graphics & stock' },
];

export default function AdminHeroCardsPage() {
  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">হিরো সেকশন কার্ডসমূহ (Hero Cards)</h1>
        <p className="text-gray-400 text-sm">হোমপেজের শীর্ষে প্রদর্শিত অ্যানিমেটেড কার্ডের তালিকা।</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-3">
        <FileCode className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-blue-300 font-semibold mb-1">হিরো কার্ড আপডেট করবেন কীভাবে?</p>
          <p className="text-gray-300 leading-relaxed">
            এই কার্ডগুলো <code className="text-white bg-black/40 px-2 py-0.5 rounded font-mono">src/components/home/HeroSection.tsx</code> ফাইলে কোড হিসেবে সংরক্ষিত।
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {heroCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[var(--surface)] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-white/10 p-2.5 mb-4 flex items-center justify-center">
                <img src={card.logo} alt={card.name} className="w-9 h-9 object-contain" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{card.name}</h3>
              <p className="text-xs text-gray-400">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
