'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import StarBorder from '@/components/ui/StarBorder';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase.from('site_settings').select('logo_url').limit(1).single();
      if (data?.logo_url) setLogoUrl(data.logo_url);
    };
    fetchLogo();

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="fixed w-full z-50 top-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto transition-all duration-300">
          {/* Main Pill Navbar */}
          <div className={`border rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled
              ? 'bg-[#1E293B]/80 border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
              : 'bg-[#1E293B]/40 border-white/10 backdrop-blur-md shadow-lg'
            }`}>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu}
                className="text-white hover:text-blue-400 transition-colors p-1"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center absolute md:static left-1/2 -translate-x-1/2 md:translate-x-0">
              <Link href="/" className="flex items-center gap-2 group">
                {logoUrl && (
                  <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
                )}
                <span className="text-xl font-black text-white tracking-tight">
                  Renovra
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="relative flex flex-col items-center group">
                <span className={`text-sm font-semibold transition-colors ${pathname === '/' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>
                  Home
                </span>
                <span className={`w-1 h-1 rounded-full mt-1 transition-all ${pathname === '/' ? 'bg-blue-400' : 'bg-transparent group-hover:bg-gray-600'}`}></span>
              </Link>

              <Link href="/#packages" className="relative flex flex-col items-center group">
                <span className="text-sm font-semibold text-gray-400 hover:text-gray-200 transition-colors">
                  Packages
                </span>
                <span className="w-1 h-1 rounded-full mt-1 bg-transparent group-hover:bg-gray-600 transition-all"></span>
              </Link>

              <Link href="/digital-products" className="relative flex flex-col items-center group">
                <span className={`text-sm font-semibold transition-colors ${pathname === '/digital-products' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>
                  Digital Products
                </span>
                <span className={`w-1 h-1 rounded-full mt-1 transition-all ${pathname === '/digital-products' ? 'bg-blue-400' : 'bg-transparent group-hover:bg-gray-600'}`}></span>
              </Link>

              <Link href="/track" className="relative flex flex-col items-center group">
                <span className={`text-sm font-semibold transition-colors ${pathname === '/track' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>
                  Track Order
                </span>
                <span className={`w-1 h-1 rounded-full mt-1 transition-all ${pathname === '/track' ? 'bg-blue-400' : 'bg-transparent group-hover:bg-gray-600'}`}></span>
              </Link>

              <Link href="/about" className="relative flex flex-col items-center group">
                <span className={`text-sm font-semibold transition-colors ${pathname === '/about' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>
                  About Us
                </span>
                <span className={`w-1 h-1 rounded-full mt-1 transition-all ${pathname === '/about' ? 'bg-blue-400' : 'bg-transparent group-hover:bg-gray-600'}`}></span>
              </Link>

              <Link href="/contact" className="relative flex flex-col items-center group">
                <span className={`text-sm font-semibold transition-colors ${pathname === '/contact' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>
                  Contact
                </span>
                <span className={`w-1 h-1 rounded-full mt-1 transition-all ${pathname === '/contact' ? 'bg-blue-400' : 'bg-transparent group-hover:bg-gray-600'}`}></span>
              </Link>
            </div>

            {/* Desktop Right Side & Empty Mobile Right side placeholder to balance flex-between */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/login" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                    Login
                  </Link>
                )}
                <StarBorder
                  as={Link}
                  href="https://wa.me/8801766392692?text=Hello"
                  target="_blank"
                  color="cyan"
                  speed="5s"
                  backgroundColor="#B3E600"
                  textColor="#000000"
                  borderColor="rgba(179,230,0,0.4)"
                  thickness={2}
                  className="hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(179,230,0,0.3)] transition-all"
                >
                  Contact Us
                </StarBorder>
              </div>
              {/* Invisible spacer for mobile to keep logo centered */}
              <div className="w-6 h-6 md:hidden"></div>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Menu (Left to Right) */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      >
        <div 
          className={`fixed top-0 left-0 h-full w-[280px] bg-[#1E293B] border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out z-[70] flex flex-col ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <Link href="/" className="flex items-center gap-2 group" onClick={toggleMobileMenu}>
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
              )}
              <span className="text-xl font-black text-white tracking-tight">
                Renovra
              </span>
            </Link>
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-4">
            <Link 
              href="/" 
              onClick={toggleMobileMenu}
              className={`p-3 rounded-xl font-medium transition-colors ${pathname === '/' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-white/5'}`}
            >
              Home
            </Link>
            <Link 
              href="/#packages" 
              onClick={toggleMobileMenu}
              className="p-3 rounded-xl font-medium text-gray-300 hover:bg-white/5 transition-colors"
            >
              Packages
            </Link>
            <Link 
              href="/digital-products" 
              onClick={toggleMobileMenu}
              className={`p-3 rounded-xl font-medium transition-colors ${pathname === '/digital-products' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-white/5'}`}
            >
              Digital Products
            </Link>
            <Link 
              href="/track" 
              onClick={toggleMobileMenu}
              className={`p-3 rounded-xl font-medium transition-colors ${pathname === '/track' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-white/5'}`}
            >
              Track Order
            </Link>
            <Link 
              href="/about" 
              onClick={toggleMobileMenu}
              className={`p-3 rounded-xl font-medium transition-colors ${pathname === '/about' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-white/5'}`}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              onClick={toggleMobileMenu}
              className={`p-3 rounded-xl font-medium transition-colors ${pathname === '/contact' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-white/5'}`}
            >
              Contact
            </Link>
            {user ? (
              <Link 
                href="/dashboard" 
                onClick={toggleMobileMenu}
                className={`p-3 rounded-xl font-medium transition-colors ${pathname === '/dashboard' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-white/5'}`}
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                onClick={toggleMobileMenu}
                className={`p-3 rounded-xl font-medium transition-colors ${pathname === '/login' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300 hover:bg-white/5'}`}
              >
                Login
              </Link>
            )}
          </div>
          
          <div className="p-6 border-t border-white/10">
            <a 
              href="https://wa.me/8801766392692?text=Hello"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,191,255,0.3)]"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}


