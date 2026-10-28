import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('logo_url').limit(1).single();
  const logoUrl = settings?.logo_url;

  return (
    <footer className="bg-[var(--surface)] border-t border-white/10 pt-16 pb-8 mt-auto w-full relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

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
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Home</Link></li>
              <li><Link href="#packages" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Pricing & Packages</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Blog & News</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Refund Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Renovra SaaS. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Secured with</span>
            <span className="font-bold text-gray-300">SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
