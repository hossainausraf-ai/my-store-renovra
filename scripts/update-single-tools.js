const fs = require('fs');
const path = require('path');

const singleToolsList = [
  {
    id: "tool-claude",
    name: "Claude AI (Sonnet 3.5)",
    price: 400,
    category: "AI & Writing",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Claude_Ai.svg",
    description: "Claude 3.5 Sonnet leading AI model for coding, writing & long-context research.",
    validity: "1 Month",
    badge_text: "Top Rated"
  },
  {
    id: "tool-dmeai",
    name: "DmeAI / DimeAI",
    price: 400,
    category: "AI & Writing",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
    description: "Smart automated AI assistant and article drafting assistant.",
    validity: "1 Month"
  },
  {
    id: "tool-artspace",
    name: "Artspace AI (Image-Gen)",
    price: 400,
    category: "Design & Creative",
    image_url: "https://artspace.ai/favicon.ico",
    description: "Next-generation generative art canvas and prompt generator for artists.",
    validity: "1 Month"
  },
  {
    id: "tool-leonardo",
    name: "Leonardo AI",
    price: 400,
    category: "Design & Creative",
    image_url: "https://leonardo.ai/favicon.ico",
    description: "Production-quality creative visual assets with fine-tuned AI models.",
    validity: "1 Month",
    badge_text: "Popular"
  },
  {
    id: "tool-grok",
    name: "Grok AI (Only Text)",
    price: 400,
    category: "AI & Writing",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png",
    description: "Real-time conversational AI powered by xAI with unfiltered reasoning.",
    validity: "1 Month"
  },
  {
    id: "tool-heygen",
    name: "HeyGen AI (Best Humanoid)",
    price: 400,
    category: "Audio & Video",
    image_url: "https://assets-global.website-files.com/63fdcbe48aa020c0a5493507/649e492bbd2986f34e6d4aa2_favicon.png",
    description: "Create photorealistic AI avatar spokesperson videos in 120+ languages.",
    validity: "1 Month",
    badge_text: "Trending"
  },
  {
    id: "tool-semrush",
    name: "Semrush",
    price: 350,
    category: "All SEO & Analytics",
    image_url: "https://cdn.worldvectorlogo.com/logos/semrush-1.svg",
    description: "Industry standard SEO keyword research, competitor analysis & backlink tool.",
    validity: "1 Month",
    badge_text: "Essential"
  },
  {
    id: "tool-perplexity",
    name: "Perplexity AI",
    price: 400,
    category: "AI & Writing",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg",
    description: "AI-powered answer engine with real-time web citations and sources.",
    validity: "1 Month"
  },
  {
    id: "tool-canva",
    name: "Canva Pro",
    price: 300,
    category: "Design & Creative",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    description: "100M+ premium graphics, brand kits, background remover & Magic Studio.",
    validity: "1 Month",
    badge_text: "Best Seller"
  },
  {
    id: "tool-grammarly",
    name: "Grammarly",
    price: 400,
    category: "AI & Writing",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Grammarly_logo.svg",
    description: "AI communication assistant for mistake-free writing, tone & grammar fixes.",
    validity: "1 Month"
  },
  {
    id: "tool-hixai",
    name: "Hix AI",
    price: 400,
    category: "AI & Writing",
    image_url: "https://hix.ai/favicon.ico",
    description: "All-in-one AI writing copilot for blogs, emails, essays and social copy.",
    validity: "1 Month"
  },
  {
    id: "tool-envato",
    name: "Envato Elements",
    price: 400,
    category: "Design & Creative",
    image_url: "https://cdn.worldvectorlogo.com/logos/envato.svg",
    description: "Unlimited downloads of stock videos, audio, WordPress themes & graphics.",
    validity: "1 Month",
    badge_text: "Essential"
  },
  {
    id: "tool-chatgpt",
    name: "ChatGPT",
    price: 400,
    category: "AI & Writing",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    description: "OpenAI GPT-4o, DALL-E 3 image generation & custom GPT access.",
    validity: "1 Month",
    badge_text: "Top Choice"
  },
  {
    id: "tool-article-gen",
    name: "One-Click Article Generator",
    price: 400,
    category: "AI & Writing",
    image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200",
    description: "Generate 2,500+ word SEO-optimized long-form articles in a single click.",
    validity: "1 Month"
  },
  {
    id: "tool-boolvideo",
    name: "Bool Video",
    price: 400,
    category: "Audio & Video",
    image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200",
    description: "AI video generator that turns product URLs into high-converting video ads.",
    validity: "1 Month"
  },
  {
    id: "tool-linguix",
    name: "Linguix",
    price: 400,
    category: "AI & Writing",
    image_url: "https://linguix.com/favicon.ico",
    description: "AI-based writing assistant and paraphraser with instant vocabulary boost.",
    validity: "1 Month"
  },
  {
    id: "tool-indexification",
    name: "Indexification",
    price: 400,
    category: "All SEO & Analytics",
    image_url: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=200",
    description: "Fast high-percentage backlink indexer tool for Google search rankings.",
    validity: "1 Month"
  },
  {
    id: "tool-smaily",
    name: "Smaily",
    price: 400,
    category: "AI & Writing",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200",
    description: "Automated email marketing campaign creator and AI newsletter optimizer.",
    validity: "1 Month"
  },
  {
    id: "tool-wordflow",
    name: "Wordflow",
    price: 400,
    category: "All SEO & Analytics",
    image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200",
    description: "Automated keyword ranking and content clustering workflow tool.",
    validity: "1 Month"
  },
  {
    id: "tool-taplio",
    name: "Taplio",
    price: 400,
    category: "AI & Writing",
    image_url: "https://taplio.com/favicon.ico",
    description: "The all-in-one AI LinkedIn growth and content scheduling platform.",
    validity: "1 Month",
    badge_text: "Trending"
  },
  {
    id: "tool-peastai",
    name: "Peast AI",
    price: 400,
    category: "AI & Writing",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
    description: "AI-powered creative writing and prompt engineering environment.",
    validity: "1 Month"
  },
  {
    id: "tool-nichescraper",
    name: "Niche Scraper",
    price: 400,
    category: "E-Commerce & Dropshipping",
    image_url: "https://nichescraper.com/favicon.ico",
    description: "Dropshipping product research spy tool with winning product spy features.",
    validity: "1 Month"
  },
  {
    id: "tool-audioblock",
    name: "Audio Block (Storyblocks)",
    price: 400,
    category: "Audio & Video",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200",
    description: "Unlimited royalty-free music, sound effects and loops for video creators.",
    validity: "1 Month"
  },
  {
    id: "tool-invideo",
    name: "InVideo",
    price: 400,
    category: "Audio & Video",
    image_url: "https://invideo.io/favicon.ico",
    description: "Generate complete scripted YouTube, TikTok & Reels videos with AI.",
    validity: "1 Month"
  },
  {
    id: "tool-writecream",
    name: "Writecream",
    price: 400,
    category: "AI & Writing",
    image_url: "https://writecream.com/favicon.ico",
    description: "Personalized cold emails, LinkedIn icebreakers and podcast audio AI.",
    validity: "1 Month"
  },
  {
    id: "tool-beautifulai",
    name: "Beautiful AI",
    price: 400,
    category: "AI & Writing",
    image_url: "https://www.beautiful.ai/favicon.ico",
    description: "Smart presentation maker that automatically adapts design principles.",
    validity: "1 Month"
  },
  {
    id: "tool-fameclips",
    name: "FameClips",
    price: 400,
    category: "Audio & Video",
    image_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=200",
    description: "Extract viral short-form clips from long videos with automated subtitles.",
    validity: "1 Month"
  },
  {
    id: "tool-leadpal",
    name: "LeadPal",
    price: 400,
    category: "All SEO & Analytics",
    image_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200",
    description: "Smart verified lead generation and email opt-in funnel tool.",
    validity: "1 Month"
  },
  {
    id: "tool-quillbot",
    name: "QuillBot Premium",
    price: 250,
    category: "AI & Writing",
    image_url: "https://quillbot.com/favicon.ico",
    description: "World's most popular paraphrasing tool, summarizer and grammar fixer.",
    validity: "1 Month",
    badge_text: "Popular"
  },
  {
    id: "tool-paperpal",
    name: "Paperpal Academic AI",
    price: 350,
    category: "AI & Writing",
    image_url: "https://paperpal.com/favicon.ico",
    description: "Real-time subject-specific academic writing assistance for thesis writers.",
    validity: "1 Month"
  },
  {
    id: "tool-sciteai",
    name: "Scite AI Research",
    price: 350,
    category: "AI & Writing",
    image_url: "https://scite.ai/favicon.ico",
    description: "Discover and evaluate scientific papers with Smart Citations data.",
    validity: "1 Month"
  },
  {
    id: "tool-capcut",
    name: "CapCut Pro",
    price: 350,
    category: "Audio & Video",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Capcut-icon.png",
    description: "Pro video editing with AI auto-captions, background removal & VFX.",
    validity: "1 Month",
    badge_text: "Top Choice"
  },
  {
    id: "tool-freepik",
    name: "Freepik Premium",
    price: 350,
    category: "Design & Creative",
    image_url: "https://cdn.worldvectorlogo.com/logos/freepik-1.svg",
    description: "Millions of premium vectors, PSD mockups, stock photos & icons.",
    validity: "1 Month"
  },
  {
    id: "tool-veo3",
    name: "VEO 3 (Google AI Video)",
    price: 650,
    category: "Audio & Video",
    image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200",
    description: "Next-gen cinematic high-definition AI video generator.",
    validity: "1 Month",
    badge_text: "Next-Gen"
  },
  {
    id: "tool-vidiq",
    name: "VidIQ Boost",
    price: 400,
    category: "All SEO & Analytics",
    image_url: "https://vidiq.com/favicon.ico",
    description: "Boost YouTube video views with keyword analysis and SEO competitor stats.",
    validity: "1 Month"
  },
  {
    id: "tool-kittl",
    name: "Kittl Graphic Design",
    price: 350,
    category: "Design & Creative",
    image_url: "https://kittl.com/favicon.ico",
    description: "Advanced graphic design tool for apparel, merch, vintage labels & fonts.",
    validity: "1 Month"
  },
  {
    id: "tool-photoroom",
    name: "Photoroom Pro",
    price: 300,
    category: "Design & Creative",
    image_url: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=200",
    description: "Studio-quality product photography with automated AI background replacement.",
    validity: "1 Month"
  },
  {
    id: "tool-jasper",
    name: "Jasper AI",
    price: 450,
    category: "AI & Writing",
    image_url: "https://www.jasper.ai/favicon.ico",
    description: "Enterprise marketing AI platform for on-brand copy, blogs and ad campaigns.",
    validity: "1 Month"
  }
];

// Map into product objects
const formattedSingleTools = singleToolsList.map((t, idx) => ({
  id: t.id,
  product_type: "single_tool",
  name: t.name,
  description: t.description || "",
  price: t.price,
  category: t.category,
  image_url: t.image_url,
  gallery_images: [t.image_url],
  features: ["Instant Access", "30 Days Warranty", "24/7 Support"],
  badge_text: t.badge_text || "Premium",
  validity: t.validity || "1 Month",
  order_idx: idx + 1
}));

async function main() {
  console.log(`Prepared ${formattedSingleTools.length} single tools.`);

  // 1. Update products.json
  const jsonPath = path.join(__dirname, '../src/data/products.json');
  let currentProducts = [];
  try {
    currentProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (e) {
    currentProducts = [];
  }

  // Keep subscriptions and digital products
  const subscriptions = currentProducts.filter(p => p.product_type === 'subscription');
  const digitalProducts = currentProducts.filter(p => p.product_type === 'digital');
  const updatedAll = [...subscriptions, ...formattedSingleTools, ...digitalProducts];

  fs.writeFileSync(jsonPath, JSON.stringify(updatedAll, null, 2), 'utf8');
  console.log(`Updated products.json: ${subscriptions.length} subs + ${formattedSingleTools.length} single tools + ${digitalProducts.length} digital.`);

  // 2. Update Cloudflare D1
  const envLines = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8').split('\n');
  const envVars = {};
  for (const line of envLines) {
    const [k, ...v] = line.trim().split('=');
    if (k) envVars[k] = v.join('=');
  }

  const accountId = envVars['CLOUDFLARE_ACCOUNT_ID'];
  const databaseId = envVars['CLOUDFLARE_D1_DATABASE_ID'];
  const apiToken = envVars['CLOUDFLARE_API_TOKEN'];

  if (!accountId || !databaseId || !apiToken) {
    console.error('Missing D1 credentials in .env.local');
    return;
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  console.log('Deleting previous single tools in D1...');
  await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql: "DELETE FROM products WHERE product_type = 'single_tool'", params: [] })
  });

  console.log('Inserting all single tools into D1...');
  for (let i = 0; i < formattedSingleTools.length; i++) {
    const tool = formattedSingleTools[i];
    const sql = `INSERT INTO products (
      id, product_type, name, description, price, category, image_url, gallery_images, 
      features, badge_text, validity, order_idx
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      tool.id,
      tool.product_type,
      tool.name,
      tool.description,
      tool.price,
      tool.category,
      tool.image_url,
      JSON.stringify(tool.gallery_images),
      JSON.stringify(tool.features),
      tool.badge_text,
      tool.validity,
      tool.order_idx
    ];

    const insRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params })
    });
    const insData = await insRes.json();
    if (!insData.success) {
      console.error(`Failed to insert ${tool.name}:`, insData.errors);
    } else {
      console.log(`✓ Inserted [${i+1}/${formattedSingleTools.length}]: ${tool.name} - ৳${tool.price}`);
    }
  }

  console.log('\nAll single tools successfully synced to D1 and products.json!');
}

main().catch(console.error);

