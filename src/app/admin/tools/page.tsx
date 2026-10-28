'use client';

import { Images, FileCode } from 'lucide-react';

const tools = [
  { id: '1', name: 'ChatGPT', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', row: 'Top' },
  { id: '2', name: 'Claude', image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Claude_Ai.svg', row: 'Top' },
  { id: '3', name: 'MidJourney', image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png', row: 'Top' },
  { id: '4', name: 'ElevenLabs', image_url: 'https://images.seeklogo.com/logo-png/51/1/elevenlabs-logo-png_seeklogo-513682.png', row: 'Top' },
  { id: '5', name: 'Canva', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg', row: 'Bottom' },
  { id: '6', name: 'CapCut', image_url: 'https://upload.wikimedia.org/wikipedia/en/2/26/CapCut_logo.png', row: 'Bottom' },
  { id: '7', name: 'Grammarly', image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Grammarly_logo.svg', row: 'Bottom' },
  { id: '8', name: 'Semrush', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Semrush_logo.svg', row: 'Bottom' },
];

export default function AdminToolsPage() {
  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">টুলস লোগো ও মারকুই (Tool Logos)</h1>
        <p className="text-gray-400 text-sm">হোমপেজের চলমান লোগো ক্যারোসেলের তালিকা।</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-3">
        <FileCode className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-blue-300 font-semibold mb-1">লোগো পরিবর্তন করবেন কীভাবে?</p>
          <p className="text-gray-300 leading-relaxed">
            এই লোগোগুলো <code className="text-white bg-black/40 px-2 py-0.5 rounded font-mono">src/components/home/ToolsMarquee.tsx</code> ফাইলে সংরক্ষিত।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-[var(--surface)] border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-lg"
          >
            <div className="w-14 h-14 rounded-xl bg-white/10 p-2.5 mb-3 flex items-center justify-center">
              <img src={tool.image_url} alt={tool.name} className="w-8 h-8 object-contain" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{tool.name}</h4>
            <span className="text-[10px] text-gray-500 font-mono">Row: {tool.row}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
