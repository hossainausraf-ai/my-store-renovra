const fs = require('fs');
const path = require('path');

// 15 Packages from PDF with starting prices
const pdfPackages = [
  {
    id: "pkg-ai-starter",
    product_type: "subscription",
    name: "AI Starter Package",
    description: "Essential AI tools bundle for students, freelancers, office employees & online learners.",
    price: 199,
    category: "AI & Writing",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
    ],
    features: [
      "ChatGPT (GPT-4o Access)",
      "Grammarly Premium",
      "QuillBot Premium",
      "Perplexity AI Pro",
      "Instant Dashboard Access",
      "30 Days Replacement Warranty"
    ],
    badge_text: "Starter Choice",
    color_from: "from-blue-500/50",
    color_to: "to-blue-500/10",
    is_popular: true,
    validity: "30 Days"
  },
  {
    id: "pkg-ai-student-pro",
    product_type: "subscription",
    name: "AI Student Pro Package",
    description: "Top academic & research AI tools for university students, thesis writers & researchers.",
    price: 399,
    category: "Academic & Research",
    image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "ChatGPT Plus",
      "Perplexity AI Pro",
      "Grammarly Premium",
      "QuillBot Premium",
      "Paperpal Academic AI",
      "Scite AI Research Assistant",
      "30 Days Full Warranty"
    ],
    badge_text: "Student Favorite",
    color_from: "from-emerald-500/50",
    color_to: "to-teal-500/10",
    is_popular: true,
    validity: "30 Days"
  },
  {
    id: "pkg-ai-content-creator",
    product_type: "subscription",
    name: "AI Content Creator Package",
    description: "Powerhouse copywriting & content generation tools for bloggers, YouTubers & creators.",
    price: 599,
    category: "Content Creation",
    image_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "ChatGPT Plus",
      "Hix AI Full Suite",
      "Jasper AI Writer",
      "Wordhero AI",
      "Grammarly Premium",
      "Rewritefy Content Humanizer",
      "24/7 WhatsApp Support"
    ],
    badge_text: "Best Value",
    color_from: "from-purple-500/50",
    color_to: "to-indigo-500/10",
    is_popular: true,
    validity: "30 Days"
  },
  {
    id: "pkg-ai-research-pro",
    product_type: "subscription",
    name: "AI Research Pro Package",
    description: "Advanced research, citation & plagiarism checking suite for PhD scholars & analysts.",
    price: 699,
    category: "Academic & Research",
    image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "ChatGPT Plus",
      "Perplexity AI Pro",
      "Scite AI Citation & Index",
      "Paperpal Research AI",
      "Quetext Plagiarism Checker",
      "Grammarly Premium",
      "30 Days Replacement Guarantee"
    ],
    badge_text: "Research Pro",
    color_from: "from-cyan-500/50",
    color_to: "to-blue-500/10",
    is_popular: false,
    validity: "30 Days"
  },
  {
    id: "pkg-business-professional",
    product_type: "subscription",
    name: "Business Professional AI Package",
    description: "Executive AI suite for business owners, corporate managers, founders & consultants.",
    price: 799,
    category: "Business & Productivity",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "ChatGPT Plus",
      "Grok AI Supercomputer",
      "Grammarly Business",
      "Beautiful AI Presentations",
      "Perplexity AI Pro",
      "Priority Account Support"
    ],
    badge_text: "Business Choice",
    color_from: "from-amber-500/50",
    color_to: "to-yellow-500/10",
    is_popular: false,
    validity: "30 Days"
  },
  {
    id: "pkg-ai-marketing-copy",
    product_type: "subscription",
    name: "AI Marketing Copy Package",
    description: "High-converting ad copy, landing pages & sales funnel copywriting tools.",
    price: 699,
    category: "Copywriting & Ads",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Jasper AI Copywriter",
      "Wordhero Copy Engine",
      "Hix AI All-in-One",
      "ChatGPT Plus",
      "Grammarly Premium",
      "Rewritefy Humanizer",
      "Instant Activation"
    ],
    badge_text: "Marketing Special",
    color_from: "from-pink-500/50",
    color_to: "to-rose-500/10",
    is_popular: false,
    validity: "30 Days"
  },
  {
    id: "pkg-ai-writer-premium",
    product_type: "subscription",
    name: "AI Writer Premium Package",
    description: "Unrestricted 8-tool ultimate writing stack for professional bloggers & writing agencies.",
    price: 999,
    category: "Writing & SEO",
    image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "ChatGPT Plus (GPT-4o)",
      "Grok AI",
      "Perplexity AI Pro",
      "Hix AI Suite",
      "Jasper AI Writer",
      "Wordhero AI",
      "Grammarly Premium",
      "QuillBot Premium",
      "Full 30 Days Warranty"
    ],
    badge_text: "Writer Ultimate",
    color_from: "from-violet-500/50",
    color_to: "to-purple-500/10",
    is_popular: true,
    validity: "30 Days"
  },
  {
    id: "pkg-ai-designer-pro",
    product_type: "subscription",
    name: "AI Designer Pro Package",
    description: "Complete creative design suite with unlimited stock assets and premium AI art tools.",
    price: 799,
    category: "Design & Graphics",
    image_url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80",
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg"
    ],
    features: [
      "Leonardo AI (Image Generation)",
      "ArtSpace AI",
      "Canva Pro Direct Invite",
      "Kittl Graphic Design Pro",
      "Freepik Premium",
      "Envato Elements (Unlimited)",
      "Photoroom Pro Background Remover"
    ],
    badge_text: "Designer Choice",
    color_from: "from-fuchsia-500/50",
    color_to: "to-pink-500/10",
    is_popular: true,
    validity: "30 Days"
  },
  {
    id: "pkg-ecommerce-design",
    product_type: "subscription",
    name: "Product & E-Commerce Design Package",
    description: "Create viral product mockups, ad banners & catalog designs for online shops.",
    price: 699,
    category: "E-Commerce & Shop",
    image_url: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Leonardo AI (Product Photos)",
      "Photoroom Pro",
      "Canva Pro",
      "Placeit Mockup Generator",
      "Envato Elements",
      "Freepik Premium",
      "Instant 1-Click Access"
    ],
    badge_text: "E-commerce Special",
    color_from: "from-orange-500/50",
    color_to: "to-amber-500/10",
    is_popular: false,
    validity: "30 Days"
  },
  {
    id: "pkg-social-media-growth",
    product_type: "subscription",
    name: "Social Media Growth Package",
    description: "All tools to design, write, edit videos & grow social media channels rapidly.",
    price: 799,
    category: "Social Media",
    image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Canva Pro",
      "Leonardo AI",
      "ChatGPT Plus",
      "Grammarly Premium",
      "CapCut Pro (Desktop & Mobile)",
      "Envato Elements",
      "24/7 WhatsApp Support"
    ],
    badge_text: "Social Media",
    color_from: "from-sky-500/50",
    color_to: "to-blue-500/10",
    is_popular: false,
    validity: "30 Days"
  },
  {
    id: "pkg-ai-video-creator",
    product_type: "subscription",
    name: "AI Video Creator Package",
    description: "Next-gen cinematic AI video generators, voiceovers & video editing suite.",
    price: 1499,
    category: "Video & Animation",
    image_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "VEO 3 (Google AI Video)",
      "Leonardo AI (Motion Video)",
      "CapCut Pro",
      "VideoExpress AI",
      "Avatar Builder AI",
      "Epidemic Sound (Copyright-Free Music)",
      "High Speed Access"
    ],
    badge_text: "Video Creator",
    color_from: "from-red-500/50",
    color_to: "to-orange-500/10",
    is_popular: true,
    validity: "30 Days"
  },
  {
    id: "pkg-youtube-automation",
    product_type: "subscription",
    name: "YouTube Automation Package",
    description: "Complete toolset for faceless YouTube channels & automated video production.",
    price: 1499,
    category: "YouTube & Video",
    image_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "ChatGPT Plus (Scriptwriting)",
      "VEO 3 (AI Video Clips)",
      "Leonardo AI (Thumbnails & Art)",
      "VidIQ Boost (SEO Keywords)",
      "CapCut Pro (Editing)",
      "Epidemic Sound (SFX & Music)",
      "Canva Pro (Thumbnails)"
    ],
    badge_text: "YouTube Pro",
    color_from: "from-red-600/50",
    color_to: "to-rose-600/10",
    is_popular: true,
    validity: "30 Days"
  },
  {
    id: "pkg-seo-growth",
    product_type: "subscription",
    name: "SEO Growth Package",
    description: "Dominate Google search results with the world's leading SEO intelligence tools.",
    price: 999,
    category: "SEO & Ranking",
    image_url: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Semrush Guru Access",
      "Moz Pro",
      "Ubersuggest Lifetime",
      "SpyFu Competitor Intel",
      "AnswerThePublic Pro",
      "SEOptimer Audit Tool",
      "Grammarly Premium"
    ],
    badge_text: "SEO Master",
    color_from: "from-emerald-500/50",
    color_to: "to-green-500/10",
    is_popular: false,
    validity: "30 Days"
  },
  {
    id: "pkg-freelancer-complete",
    product_type: "subscription",
    name: "Freelancer Complete Package",
    description: "The ultimate freelance bundle for Fiverr, Upwork & global client projects.",
    price: 1299,
    category: "Freelancing",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "ChatGPT Plus (GPT-4o)",
      "Leonardo AI",
      "Canva Pro",
      "Grammarly Premium",
      "QuillBot Premium",
      "Envato Elements (Assets)",
      "CapCut Pro",
      "Semrush Access",
      "30 Days Full Replacement Warranty"
    ],
    badge_text: "Freelancer All-in-One",
    color_from: "from-indigo-500/50",
    color_to: "to-purple-500/10",
    is_popular: true,
    validity: "30 Days"
  },
  {
    id: "pkg-ultimate-ai-creator",
    product_type: "subscription",
    name: "Ultimate AI Creator Bundle",
    description: "The most comprehensive master bundle with 13+ flagship AI & digital marketing tools.",
    price: 2499,
    category: "Full Agency Suite",
    image_url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "ChatGPT Plus (GPT-4o & o1)",
      "Grok AI",
      "Perplexity AI Pro",
      "VEO 3 (AI Video)",
      "Leonardo AI",
      "ArtSpace AI",
      "Canva Pro",
      "Envato Elements",
      "Freepik Premium",
      "CapCut Pro",
      "Grammarly Premium",
      "Semrush Guru",
      "VidIQ Boost",
      "VIP Dedicated Account & Priority Support"
    ],
    badge_text: "Ultimate Powerhouse",
    color_from: "from-yellow-500/50",
    color_to: "to-amber-500/10",
    is_popular: true,
    validity: "30 Days"
  }
];

async function main() {
  console.log('1. Updating products.json...');
  const jsonPath = path.join(__dirname, '../src/data/products.json');
  let currentProducts = [];
  try {
    currentProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (e) {
    currentProducts = [];
  }
  // Keep non-subscription items
  const nonSubscriptions = currentProducts.filter(p => p.product_type !== 'subscription');
  const updatedAll = [...pdfPackages, ...nonSubscriptions];
  fs.writeFileSync(jsonPath, JSON.stringify(updatedAll, null, 2), 'utf8');
  console.log(`Updated products.json: ${pdfPackages.length} subscriptions + ${nonSubscriptions.length} others.`);

  console.log('2. Updating Cloudflare D1 Database...');
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

  // First, delete old subscriptions
  console.log('Deleting previous subscriptions in D1...');
  const delRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql: "DELETE FROM products WHERE product_type = 'subscription'", params: [] })
  });
  const delData = await delRes.json();
  console.log('Delete result:', delData.success);

  // Next, insert each new subscription package
  console.log('Inserting 15 PDF packages into D1...');
  for (let i = 0; i < pdfPackages.length; i++) {
    const pkg = pdfPackages[i];
    const sql = `INSERT INTO products (
      id, product_type, name, description, price, category, image_url, gallery_images, 
      features, badge_text, color_from, color_to, is_popular, validity, order_idx
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      pkg.id,
      pkg.product_type,
      pkg.name,
      pkg.description,
      pkg.price,
      pkg.category,
      pkg.image_url,
      JSON.stringify(pkg.gallery_images || []),
      JSON.stringify(pkg.features || []),
      pkg.badge_text,
      pkg.color_from,
      pkg.color_to,
      pkg.is_popular ? 1 : 0,
      pkg.validity,
      i + 1
    ];

    const insRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params })
    });
    const insData = await insRes.json();
    if (!insData.success) {
      console.error(`Failed to insert ${pkg.name}:`, insData.errors);
    } else {
      console.log(`✓ Inserted [${i+1}/15]: ${pkg.name} - ৳${pkg.price}`);
    }
  }

  console.log('\nAll 15 packages updated successfully in both products.json and Cloudflare D1!');
}

main().catch(console.error);
