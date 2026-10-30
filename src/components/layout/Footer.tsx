import Link from 'next/link';
import { defaultSettings } from '@/data/settings';

export default function Footer() {
  const logoUrl = defaultSettings.logo_url;

  return (
    <footer className="bg-[var(--surface)] border-t border-white/10 pt-8 sm:pt-16 pb-24 md:pb-12 mt-auto w-full relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  R
                </div>
              )}
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Renovra
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
              Your ultimate destination for premium AI tools, software subscriptions, and digital assets. Empowering creators and businesses worldwide.
            </p>
            <div className="flex gap-4">
              <a href="https://t.me/renovra" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all text-gray-400" title="Telegram Channel">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              </a>
              <a href="https://wa.me/8801766392692" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all text-gray-400" title="WhatsApp Support">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Home</Link></li>
              <li><Link href="/#packages" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Pricing & Packages</Link></li>
              <li><Link href="/digital-products" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Digital Products</Link></li>
              <li><Link href="/track" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Track Order</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Help & Support</h3>
            <ul className="space-y-2.5">
              <li><Link href="/contact" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Contact Support</Link></li>
              <li>
                <a href="https://wa.me/8801766392692" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center gap-1.5">
                  <span className="text-[#25D366] font-medium">WhatsApp:</span> 01766392692
                </a>
              </li>
              <li>
                <a href="mailto:renovrait@gmail.com" className="text-gray-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-1.5">
                  <span className="text-purple-400 font-medium">Email:</span> renovrait@gmail.com
                </a>
              </li>
              <li><Link href="/track" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Track Order</Link></li>
              <li><Link href="/login" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Customer Login</Link></li>
              <li><Link href="/#faq" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">FAQ & Help</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Terms & Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Renovra. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Secured with</span>
            <span className="font-bold text-gray-300">SSL & Cloudflare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
