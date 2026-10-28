'use client';

import LogoLoop from '@/components/ui/LogoLoop';

type ToolLogo = {
  id: string;
  name: string;
  image_url: string;
  row_position: 'top' | 'bottom';
};

const defaultTools: ToolLogo[] = [
  { id: '1', name: 'ChatGPT', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', row_position: 'top' },
  { id: '2', name: 'Claude', image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Claude_Ai.svg', row_position: 'top' },
  { id: '3', name: 'MidJourney', image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png', row_position: 'top' },
  { id: '4', name: 'ElevenLabs', image_url: 'https://images.seeklogo.com/logo-png/51/1/elevenlabs-logo-png_seeklogo-513682.png', row_position: 'top' },
  { id: '5', name: 'Canva', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg', row_position: 'bottom' },
  { id: '6', name: 'CapCut', image_url: 'https://upload.wikimedia.org/wikipedia/en/2/26/CapCut_logo.png', row_position: 'bottom' },
  { id: '7', name: 'Grammarly', image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Grammarly_logo.svg', row_position: 'bottom' },
  { id: '8', name: 'Semrush', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Semrush_logo.svg', row_position: 'bottom' },
];

export default function ToolsMarquee() {
  const tools = defaultTools;

  const topRow = tools.filter(t => t.row_position === 'top');
  const bottomRow = tools.filter(t => t.row_position === 'bottom');


  const renderTool = (tool: any, key: any) => (
    <div
      key={key}
      className="flex flex-col items-center justify-center bg-transparent border border-white/5 rounded-2xl p-4 w-28 h-28 hover:bg-white/5 hover:border-white/10 transition-all duration-300 shrink-0 group"
    >
      <div className="relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center mb-2 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300">
        <img src={tool.image_url} alt={tool.name} className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300" />
      </div>
      <span className="text-[10px] font-semibold text-gray-400 group-hover:text-white transition-colors">{tool.name}</span>
    </div>
  );

  return (
    <section className="py-20 w-full overflow-hidden bg-transparent border-t border-white/5">
      <div className="text-center mb-12">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">PREMIUM TOOLS WE PROVIDE</h2>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[100vw] overflow-hidden relative">
        
        {/* Top Row - Scrolls Left */}
        {topRow.length > 0 && (
          <LogoLoop
            logos={topRow}
            speed={40}
            direction="left"
            logoHeight={112} /* 28 * 4 for h-28 */
            gap={24}
            hoverSpeed={10}
            fadeOut
            fadeOutColor="#0a0a0a"
            renderItem={renderTool}
          />
        )}

        {/* Bottom Row - Scrolls Right */}
        {bottomRow.length > 0 && (
          <LogoLoop
            logos={bottomRow}
            speed={40}
            direction="right"
            logoHeight={112}
            gap={24}
            hoverSpeed={10}
            fadeOut
            fadeOutColor="#0a0a0a"
            renderItem={renderTool}
          />
        )}
      </div>
    </section>
  );
}
