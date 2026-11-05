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
  order_idx?: number;
}

export const defaultProducts: Product[] = [
  {
    "id": "pkg-basic-plan",
    "product_type": "subscription",
    "name": "Basic Plan",
    "description": "Perfect for students & beginners needing essential tools.",
    "price": 500,
    "category": "Starter",
    "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "10+ Premium Tools",
      "Perfect for Students & Beginners",
      "Regular Updates & Maintenance",
      "Premium Support"
    ],
    "badge_text": "STARTER",
    "color_from": "from-blue-500/50",
    "color_to": "to-cyan-500/10",
    "is_popular": false,
    "validity": "1 Month",
    "order_idx": 1
  },
  {
    "id": "pkg-standard-plan",
    "product_type": "subscription",
    "name": "Standard Plan",
    "description": "Designed for growing teams and active creators.",
    "price": 650,
    "category": "Growing Teams",
    "image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "50+ Premium Tools",
      "Marketing & SEO Toolkit",
      "Social Media Management",
      "Design & Video Editors",
      "Unlimited Stock Assets",
      "Premium Support"
    ],
    "badge_text": "GROWING TEAMS",
    "color_from": "from-teal-500/50",
    "color_to": "to-emerald-500/10",
    "is_popular": false,
    "validity": "1 Month",
    "order_idx": 2
  },
  {
    "id": "pkg-ai-plan",
    "product_type": "subscription",
    "name": "AI Plan",
    "description": "Pure AI power with top conversational and generative AI suites.",
    "price": 1499,
    "category": "Pure AI Power",
    "image_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "ChatGPT – Unlimited Chats",
      "Gemini, Grok, Perplexity – Unlimited",
      "Hix Bypass & Stealth Writer",
      "Elevenlabs – 5-8K daily credits",
      "MidJourney – 30/day, Ideogram Unlimited",
      "Canva Pro – Own Mail Invitation",
      "Talking Photos + Artistly Unlimited"
    ],
    "badge_text": "PURE AI POWER",
    "color_from": "from-purple-500/50",
    "color_to": "to-pink-500/10",
    "is_popular": false,
    "validity": "1 Month",
    "order_idx": 3
  },
  {
    "id": "pkg-premium-plan",
    "product_type": "subscription",
    "name": "Premium Plan",
    "description": "Unlock 100+ high-quality tools with everything included.",
    "price": 799,
    "category": "Most Popular",
    "image_url": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "Unlock 100+ High-Quality Tools",
      "Everything in Basic + Standard",
      "Everything in SEO + Content",
      "Everything in Graphic + Learning",
      "Bonus: RunwayML, Pixlr, Lovo AI +12",
      "Regular Updates & Maintenance",
      "Premium Support"
    ],
    "badge_text": "MOST POPULAR",
    "color_from": "from-[#ccff00]/60",
    "color_to": "to-emerald-500/20",
    "is_popular": true,
    "validity": "1 Month",
    "order_idx": 4
  },
  {
    "id": "pkg-seo-plan",
    "product_type": "subscription",
    "name": "SEO Plan",
    "description": "Complete SEO intelligence suite for marketers and agencies.",
    "price": 590,
    "category": "For Marketers",
    "image_url": "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "15+ Premium SEO Tools",
      "Advanced Keyword Research & Audit",
      "Competitor & Backlink Analysis",
      "Rank Tracking",
      "Unlimited Reports & Exports",
      "Premium Support"
    ],
    "badge_text": "FOR MARKETERS",
    "color_from": "from-emerald-500/50",
    "color_to": "to-green-500/10",
    "is_popular": false,
    "validity": "1 Month",
    "order_idx": 5
  },
  {
    "id": "pkg-writer-plan",
    "product_type": "subscription",
    "name": "Writer Plan",
    "description": "Comprehensive copywriting and AI writing tools suite.",
    "price": 590,
    "category": "For Writers",
    "image_url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "20+ Premium Writing Tools",
      "Grammar & Plagiarism Checkers",
      "AI Content & Copywriting",
      "SEO Article Optimization",
      "Paraphrasing & Rewriting",
      "Premium Support"
    ],
    "badge_text": "FOR WRITERS",
    "color_from": "from-amber-500/50",
    "color_to": "to-orange-500/10",
    "is_popular": false,
    "validity": "1 Month",
    "order_idx": 6
  },
  {
    "id": "pkg-learning-plan",
    "product_type": "subscription",
    "name": "Learning Plan",
    "description": "Top-tier learning resources and courses for ambitious students.",
    "price": 590,
    "category": "For Students",
    "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "15+ Premium Learning Tools",
      "Courses from Top Providers",
      "Coding, Business & Design",
      "Exclusive Study Materials",
      "Daily Updated Library",
      "Premium Support"
    ],
    "badge_text": "FOR STUDENTS",
    "color_from": "from-blue-600/50",
    "color_to": "to-indigo-500/10",
    "is_popular": false,
    "validity": "1 Month",
    "order_idx": 7
  },
  {
    "id": "pkg-semrush-ubersuggest",
    "product_type": "subscription",
    "name": "Semrush + Ubersuggest",
    "description": "Mini combo with two essential SEO powerhouses.",
    "price": 350,
    "category": "Mini Combo",
    "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "Access 2 Premium Tools",
      "Regular Updates & Maintenance",
      "User-Friendly Instant Dashboard",
      "Premium Support"
    ],
    "badge_text": "MINI COMBO",
    "color_from": "from-orange-500/50",
    "color_to": "to-amber-500/10",
    "is_popular": false,
    "validity": "1 Month",
    "order_idx": 8
  },
  {
    "id": "pkg-chatgpt-hix-grammarly",
    "product_type": "subscription",
    "name": "ChatGPT + Hix + Grammarly",
    "description": "High-value combo for writers and content creators.",
    "price": 500,
    "category": "Writer Combo",
    "image_url": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "Access 3 Premium Tools",
      "Regular Updates & Maintenance",
      "User-Friendly Instant Dashboard",
      "Premium Support"
    ],
    "badge_text": "WRITER COMBO",
    "color_from": "from-emerald-500/50",
    "color_to": "to-teal-500/10",
    "is_popular": false,
    "validity": "1 Month",
    "order_idx": 9
  },
  {
    "id": "pkg-1-day-trial-premium",
    "product_type": "subscription",
    "name": "1 Day Trial – Premium",
    "description": "Try full Premium Plan access for 24 hours.",
    "price": 100,
    "category": "Try It Out",
    "image_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "Unlock Premium Plan for 24 Hours",
      "100+ High-Quality Tools",
      "Regular Updates & Maintenance",
      "Premium Support"
    ],
    "badge_text": "TRY IT OUT",
    "color_from": "from-yellow-500/50",
    "color_to": "to-amber-500/10",
    "is_popular": false,
    "validity": "24h",
    "order_idx": 10
  },
  {
    "id": "pkg-designer-plan",
    "product_type": "subscription",
    "name": "Designer Plan",
    "description": "50+ design and video tools with unlimited stock assets.",
    "price": 590,
    "category": "Design & Video",
    "image_url": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80",
    "gallery_images": [
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80"
    ],
    "features": [
      "50+ Design & Video Tools",
      "Unlimited Stock Photos & Vectors",
      "Canva Pro, Freepik, Envato Elements",
      "Premium Video Templates & Assets",
      "AI Art & Image Generators",
      "Premium Support"
    ],
    "badge_text": "DESIGN & VIDEO",
    "color_from": "from-violet-500/50",
    "color_to": "to-fuchsia-500/10",
    "is_popular": false,
    "validity": "1 Month",
    "order_idx": 11
  },
  {
    "id": "tool-claude",
    "product_type": "single_tool",
    "name": "Claude AI (Sonnet 3.5)",
    "description": "Claude 3.5 Sonnet leading AI model for coding, writing & long-context research.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/4/47/Claude_Ai.svg",
    "gallery_images": [
      "https://upload.wikimedia.org/wikipedia/commons/4/47/Claude_Ai.svg"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Top Rated",
    "validity": "1 Month",
    "order_idx": 1
  },
  {
    "id": "tool-dmeai",
    "product_type": "single_tool",
    "name": "DmeAI / DimeAI",
    "description": "Smart automated AI assistant and article drafting assistant.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 2
  },
  {
    "id": "tool-artspace",
    "product_type": "single_tool",
    "name": "Artspace AI (Image-Gen)",
    "description": "Next-generation generative art canvas and prompt generator for artists.",
    "price": 400,
    "category": "Design & Creative",
    "image_url": "https://artspace.ai/favicon.ico",
    "gallery_images": [
      "https://artspace.ai/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 3
  },
  {
    "id": "tool-leonardo",
    "product_type": "single_tool",
    "name": "Leonardo AI",
    "description": "Production-quality creative visual assets with fine-tuned AI models.",
    "price": 400,
    "category": "Design & Creative",
    "image_url": "https://leonardo.ai/favicon.ico",
    "gallery_images": [
      "https://leonardo.ai/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Popular",
    "validity": "1 Month",
    "order_idx": 4
  },
  {
    "id": "tool-grok",
    "product_type": "single_tool",
    "name": "Grok AI (Only Text)",
    "description": "Real-time conversational AI powered by xAI with unfiltered reasoning.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png",
    "gallery_images": [
      "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 5
  },
  {
    "id": "tool-heygen",
    "product_type": "single_tool",
    "name": "HeyGen AI (Best Humanoid)",
    "description": "Create photorealistic AI avatar spokesperson videos in 120+ languages.",
    "price": 400,
    "category": "Audio & Video",
    "image_url": "https://assets-global.website-files.com/63fdcbe48aa020c0a5493507/649e492bbd2986f34e6d4aa2_favicon.png",
    "gallery_images": [
      "https://assets-global.website-files.com/63fdcbe48aa020c0a5493507/649e492bbd2986f34e6d4aa2_favicon.png"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Trending",
    "validity": "1 Month",
    "order_idx": 6
  },
  {
    "id": "tool-semrush",
    "product_type": "single_tool",
    "name": "Semrush",
    "description": "Industry standard SEO keyword research, competitor analysis & backlink tool.",
    "price": 350,
    "category": "All SEO & Analytics",
    "image_url": "https://cdn.worldvectorlogo.com/logos/semrush-1.svg",
    "gallery_images": [
      "https://cdn.worldvectorlogo.com/logos/semrush-1.svg"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Essential",
    "validity": "1 Month",
    "order_idx": 7
  },
  {
    "id": "tool-perplexity",
    "product_type": "single_tool",
    "name": "Perplexity AI",
    "description": "AI-powered answer engine with real-time web citations and sources.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg",
    "gallery_images": [
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 8
  },
  {
    "id": "tool-canva",
    "product_type": "single_tool",
    "name": "Canva Pro",
    "description": "100M+ premium graphics, brand kits, background remover & Magic Studio.",
    "price": 300,
    "category": "Design & Creative",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    "gallery_images": [
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Best Seller",
    "validity": "1 Month",
    "order_idx": 9
  },
  {
    "id": "tool-grammarly",
    "product_type": "single_tool",
    "name": "Grammarly",
    "description": "AI communication assistant for mistake-free writing, tone & grammar fixes.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Grammarly_logo.svg",
    "gallery_images": [
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Grammarly_logo.svg"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 10
  },
  {
    "id": "tool-hixai",
    "product_type": "single_tool",
    "name": "Hix AI",
    "description": "All-in-one AI writing copilot for blogs, emails, essays and social copy.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://hix.ai/favicon.ico",
    "gallery_images": [
      "https://hix.ai/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 11
  },
  {
    "id": "tool-envato",
    "product_type": "single_tool",
    "name": "Envato Elements",
    "description": "Unlimited downloads of stock videos, audio, WordPress themes & graphics.",
    "price": 400,
    "category": "Design & Creative",
    "image_url": "https://cdn.worldvectorlogo.com/logos/envato.svg",
    "gallery_images": [
      "https://cdn.worldvectorlogo.com/logos/envato.svg"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Essential",
    "validity": "1 Month",
    "order_idx": 12
  },
  {
    "id": "tool-chatgpt",
    "product_type": "single_tool",
    "name": "ChatGPT",
    "description": "OpenAI GPT-4o, DALL-E 3 image generation & custom GPT access.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    "gallery_images": [
      "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Top Choice",
    "validity": "1 Month",
    "order_idx": 13
  },
  {
    "id": "tool-article-gen",
    "product_type": "single_tool",
    "name": "One-Click Article Generator",
    "description": "Generate 2,500+ word SEO-optimized long-form articles in a single click.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 14
  },
  {
    "id": "tool-boolvideo",
    "product_type": "single_tool",
    "name": "Bool Video",
    "description": "AI video generator that turns product URLs into high-converting video ads.",
    "price": 400,
    "category": "Audio & Video",
    "image_url": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 15
  },
  {
    "id": "tool-linguix",
    "product_type": "single_tool",
    "name": "Linguix",
    "description": "AI-based writing assistant and paraphraser with instant vocabulary boost.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://linguix.com/favicon.ico",
    "gallery_images": [
      "https://linguix.com/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 16
  },
  {
    "id": "tool-indexification",
    "product_type": "single_tool",
    "name": "Indexification",
    "description": "Fast high-percentage backlink indexer tool for Google search rankings.",
    "price": 400,
    "category": "All SEO & Analytics",
    "image_url": "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 17
  },
  {
    "id": "tool-smaily",
    "product_type": "single_tool",
    "name": "Smaily",
    "description": "Automated email marketing campaign creator and AI newsletter optimizer.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 18
  },
  {
    "id": "tool-wordflow",
    "product_type": "single_tool",
    "name": "Wordflow",
    "description": "Automated keyword ranking and content clustering workflow tool.",
    "price": 400,
    "category": "All SEO & Analytics",
    "image_url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 19
  },
  {
    "id": "tool-taplio",
    "product_type": "single_tool",
    "name": "Taplio",
    "description": "The all-in-one AI LinkedIn growth and content scheduling platform.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://taplio.com/favicon.ico",
    "gallery_images": [
      "https://taplio.com/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Trending",
    "validity": "1 Month",
    "order_idx": 20
  },
  {
    "id": "tool-peastai",
    "product_type": "single_tool",
    "name": "Peast AI",
    "description": "AI-powered creative writing and prompt engineering environment.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 21
  },
  {
    "id": "tool-nichescraper",
    "product_type": "single_tool",
    "name": "Niche Scraper",
    "description": "Dropshipping product research spy tool with winning product spy features.",
    "price": 400,
    "category": "E-Commerce & Dropshipping",
    "image_url": "https://nichescraper.com/favicon.ico",
    "gallery_images": [
      "https://nichescraper.com/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 22
  },
  {
    "id": "tool-audioblock",
    "product_type": "single_tool",
    "name": "Audio Block (Storyblocks)",
    "description": "Unlimited royalty-free music, sound effects and loops for video creators.",
    "price": 400,
    "category": "Audio & Video",
    "image_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 23
  },
  {
    "id": "tool-invideo",
    "product_type": "single_tool",
    "name": "InVideo",
    "description": "Generate complete scripted YouTube, TikTok & Reels videos with AI.",
    "price": 400,
    "category": "Audio & Video",
    "image_url": "https://invideo.io/favicon.ico",
    "gallery_images": [
      "https://invideo.io/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 24
  },
  {
    "id": "tool-writecream",
    "product_type": "single_tool",
    "name": "Writecream",
    "description": "Personalized cold emails, LinkedIn icebreakers and podcast audio AI.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://writecream.com/favicon.ico",
    "gallery_images": [
      "https://writecream.com/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 25
  },
  {
    "id": "tool-beautifulai",
    "product_type": "single_tool",
    "name": "Beautiful AI",
    "description": "Smart presentation maker that automatically adapts design principles.",
    "price": 400,
    "category": "AI & Writing",
    "image_url": "https://www.beautiful.ai/favicon.ico",
    "gallery_images": [
      "https://www.beautiful.ai/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 26
  },
  {
    "id": "tool-fameclips",
    "product_type": "single_tool",
    "name": "FameClips",
    "description": "Extract viral short-form clips from long videos with automated subtitles.",
    "price": 400,
    "category": "Audio & Video",
    "image_url": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 27
  },
  {
    "id": "tool-leadpal",
    "product_type": "single_tool",
    "name": "LeadPal",
    "description": "Smart verified lead generation and email opt-in funnel tool.",
    "price": 400,
    "category": "All SEO & Analytics",
    "image_url": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 28
  },
  {
    "id": "tool-quillbot",
    "product_type": "single_tool",
    "name": "QuillBot Premium",
    "description": "World's most popular paraphrasing tool, summarizer and grammar fixer.",
    "price": 250,
    "category": "AI & Writing",
    "image_url": "https://quillbot.com/favicon.ico",
    "gallery_images": [
      "https://quillbot.com/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Popular",
    "validity": "1 Month",
    "order_idx": 29
  },
  {
    "id": "tool-paperpal",
    "product_type": "single_tool",
    "name": "Paperpal Academic AI",
    "description": "Real-time subject-specific academic writing assistance for thesis writers.",
    "price": 350,
    "category": "AI & Writing",
    "image_url": "https://paperpal.com/favicon.ico",
    "gallery_images": [
      "https://paperpal.com/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 30
  },
  {
    "id": "tool-sciteai",
    "product_type": "single_tool",
    "name": "Scite AI Research",
    "description": "Discover and evaluate scientific papers with Smart Citations data.",
    "price": 350,
    "category": "AI & Writing",
    "image_url": "https://scite.ai/favicon.ico",
    "gallery_images": [
      "https://scite.ai/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 31
  },
  {
    "id": "tool-capcut",
    "product_type": "single_tool",
    "name": "CapCut Pro",
    "description": "Pro video editing with AI auto-captions, background removal & VFX.",
    "price": 350,
    "category": "Audio & Video",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/a/af/Capcut-icon.png",
    "gallery_images": [
      "https://upload.wikimedia.org/wikipedia/commons/a/af/Capcut-icon.png"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Top Choice",
    "validity": "1 Month",
    "order_idx": 32
  },
  {
    "id": "tool-freepik",
    "product_type": "single_tool",
    "name": "Freepik Premium",
    "description": "Millions of premium vectors, PSD mockups, stock photos & icons.",
    "price": 350,
    "category": "Design & Creative",
    "image_url": "https://cdn.worldvectorlogo.com/logos/freepik-1.svg",
    "gallery_images": [
      "https://cdn.worldvectorlogo.com/logos/freepik-1.svg"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 33
  },
  {
    "id": "tool-veo3",
    "product_type": "single_tool",
    "name": "VEO 3 (Google AI Video)",
    "description": "Next-gen cinematic high-definition AI video generator.",
    "price": 650,
    "category": "Audio & Video",
    "image_url": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Next-Gen",
    "validity": "1 Month",
    "order_idx": 34
  },
  {
    "id": "tool-vidiq",
    "product_type": "single_tool",
    "name": "VidIQ Boost",
    "description": "Boost YouTube video views with keyword analysis and SEO competitor stats.",
    "price": 400,
    "category": "All SEO & Analytics",
    "image_url": "https://vidiq.com/favicon.ico",
    "gallery_images": [
      "https://vidiq.com/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 35
  },
  {
    "id": "tool-kittl",
    "product_type": "single_tool",
    "name": "Kittl Graphic Design",
    "description": "Advanced graphic design tool for apparel, merch, vintage labels & fonts.",
    "price": 350,
    "category": "Design & Creative",
    "image_url": "https://kittl.com/favicon.ico",
    "gallery_images": [
      "https://kittl.com/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 36
  },
  {
    "id": "tool-photoroom",
    "product_type": "single_tool",
    "name": "Photoroom Pro",
    "description": "Studio-quality product photography with automated AI background replacement.",
    "price": 300,
    "category": "Design & Creative",
    "image_url": "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=200",
    "gallery_images": [
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=200"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 37
  },
  {
    "id": "tool-jasper",
    "product_type": "single_tool",
    "name": "Jasper AI",
    "description": "Enterprise marketing AI platform for on-brand copy, blogs and ad campaigns.",
    "price": 450,
    "category": "AI & Writing",
    "image_url": "https://www.jasper.ai/favicon.ico",
    "gallery_images": [
      "https://www.jasper.ai/favicon.ico"
    ],
    "features": [
      "Instant Access",
      "30 Days Warranty",
      "24/7 Support"
    ],
    "badge_text": "Premium",
    "validity": "1 Month",
    "order_idx": 38
  },
  {
    "id": "digital-ai-prompts",
    "product_type": "digital",
    "name": "10,000+ Ultimate ChatGPT Prompts Pack",
    "description": "Curated prompt collection for marketing, copywriting, coding, SEO & business growth.",
    "price": 250,
    "category": "Templates & Prompts",
    "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    "download_url": "https://drive.google.com"
  },
  {
    "id": "digital-canva-templates",
    "product_type": "digital",
    "name": "500+ Social Media Editable Canva Templates",
    "description": "Ready-to-use aesthetic templates for Facebook, Instagram, LinkedIn and YouTube.",
    "price": 299,
    "category": "Design Assets",
    "image_url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80",
    "download_url": "https://drive.google.com"
  },
  {
    "id": "digital-web-templates",
    "product_type": "digital",
    "name": "SaaS & Agency Landing Page UI Kit (Figma)",
    "description": "High-converting Figma UI kit with 50+ components, dark mode, and design system.",
    "price": 490,
    "category": "UI/UX Kits",
    "image_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
    "download_url": "https://drive.google.com"
  }
];
