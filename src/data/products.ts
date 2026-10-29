export interface Product {
  id: string;
  product_type: 'subscription' | 'single_tool' | 'digital';
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  gallery_images?: string[];
  features?: string[];
  badge_text?: string;
  color_from?: string;
  color_to?: string;
  is_popular?: boolean;
  validity?: string;
  download_url?: string;
}

export const defaultProducts: Product[] = [
  // --- Subscriptions / Packages ---
  {
    id: 'pkg-starter',
    product_type: 'subscription',
    name: 'Starter AI Bundle',
    description: 'Essential AI tools bundle for creators and students.',
    price: 490,
    category: 'AI Bundle',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://i.ibb.co/L5Qx6T2/chatgpt.png',
      'https://i.ibb.co/8g6wXW4/canva.png',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'ChatGPT Plus (Shared Access)',
      'Canva Pro Education/Team',
      'Grammarly Premium',
      'Instant Email & WhatsApp Delivery',
      '30 Days Warranty & Support'
    ],
    badge_text: 'Popular',
    color_from: 'from-blue-500/50',
    color_to: 'to-blue-500/10',
    is_popular: true,
    validity: '30 Days'
  },
  {
    id: 'pkg-pro',
    product_type: 'subscription',
    name: 'Pro Creator Suite',
    description: 'All-in-one suite for digital marketers, designers & video editors.',
    price: 990,
    category: 'Design & AI',
    image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
      'https://i.ibb.co/8g6wXW4/canva.png',
      'https://i.ibb.co/L5Qx6T2/chatgpt.png',
      'https://i.ibb.co/808bFqJ/envato.png'
    ],
    features: [
      'Canva Pro (Private/Direct Invite)',
      'ChatGPT Plus GPT-4o Access',
      'Envato Elements (Daily Downloads)',
      'CapCut Pro / Freepik Premium',
      'Priority 24/7 WhatsApp Support',
      'Instant Replacement Guarantee'
    ],
    badge_text: 'Best Value',
    color_from: 'from-purple-500/50',
    color_to: 'to-indigo-500/10',
    is_popular: true,
    validity: '30 Days'
  },
  {
    id: 'pkg-master',
    product_type: 'subscription',
    name: 'Ultimate Agency Master',
    description: 'Massive collection of 30+ premium tools for agencies and power users.',
    price: 1990,
    category: 'Agency',
    image_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=60',
    features: [
      'ChatGPT Plus + Claude 3.5 Sonnet',
      'Midjourney v6 Unlimited Relaxed',
      'Canva Pro + Freepik + Envato',
      'SEMrush / Ahrefs Report Access',
      'Ubersuggest + Grammarly',
      'Dedicated Account Manager Support'
    ],
    badge_text: 'Agency Pick',
    color_from: 'from-amber-500/50',
    color_to: 'to-orange-500/10',
    is_popular: false,
    validity: '30 Days'
  },

  // --- Single Tools ---
  {
    id: 'tool-chatgpt',
    product_type: 'single_tool',
    name: 'ChatGPT Plus (GPT-4o)',
    description: 'Get access to GPT-4o, DALL-E 3, code interpreter and custom GPTs.',
    price: 350,
    category: 'AI Writing & Code',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    features: ['GPT-4o & o1 access', 'Image & file analysis', 'Fast response speed'],
    badge_text: 'Top Rated',
    validity: '1 Month'
  },
  {
    id: 'tool-canva',
    product_type: 'single_tool',
    name: 'Canva Pro Direct Invite',
    description: '100M+ premium graphics, templates, brand kit and Magic Studio AI.',
    price: 150,
    category: 'Graphics & Design',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
    features: ['100M+ Premium photos & videos', 'Background remover', 'Brand kits & resize'],
    badge_text: 'Best Seller',
    validity: '1 Month'
  },
  {
    id: 'tool-envato',
    product_type: 'single_tool',
    name: 'Envato Elements',
    description: 'Unlimited downloads of themes, templates, stock footage and audio.',
    price: 450,
    category: 'Design Assets',
    image_url: 'https://cdn.worldvectorlogo.com/logos/envato.svg',
    features: ['Themes, templates, graphics', 'Commercial license', 'Daily high speed download'],
    badge_text: 'Essential',
    validity: '1 Month'
  },
  {
    id: 'tool-monica',
    product_type: 'single_tool',
    name: 'Monica AI Pro',
    description: 'All-in-one AI assistant powered by GPT-4, Claude 3.5 and Gemini Pro.',
    price: 390,
    category: 'AI Assistant',
    image_url: 'https://monica.im/favicon.ico',
    features: ['GPT-4 & Claude 3.5 in sidebar', 'Web page summarizer', 'Image generator'],
    badge_text: 'Trending',
    validity: '1 Month'
  },

  // --- Digital Products ---
  {
    id: 'digital-ai-prompts',
    product_type: 'digital',
    name: '10,000+ Ultimate ChatGPT Prompts Pack',
    description: 'Curated prompt collection for marketing, copywriting, coding, SEO & business growth.',
    price: 250,
    category: 'Templates & Prompts',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    download_url: 'https://drive.google.com'
  },
  {
    id: 'digital-canva-templates',
    product_type: 'digital',
    name: '500+ Social Media Editable Canva Templates',
    description: 'Ready-to-use aesthetic templates for Facebook, Instagram, LinkedIn and YouTube.',
    price: 299,
    category: 'Design Assets',
    image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
    download_url: 'https://drive.google.com'
  },
  {
    id: 'digital-web-templates',
    product_type: 'digital',
    name: 'SaaS & Agency Landing Page UI Kit (Figma)',
    description: 'High-converting Figma UI kit with 50+ components, dark mode, and design system.',
    price: 490,
    category: 'UI/UX Kits',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    download_url: 'https://drive.google.com'
  }
];
