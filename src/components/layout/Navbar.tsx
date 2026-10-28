'use client';

import Link from 'next/link';
import { Menu, X, User } from 'lucide-react';
import { defaultSettings } from '@/data/settings';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import StarBorder from '@/components/ui/StarBorder';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(defaultSettings.logo_url);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.logo_url) {
          setLogoUrl(data.settings.logo_url);
        }
      })
      .catch(e => console.warn('Navbar settings load fallback:', e));
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [pathname]);

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
                  <img src={logoUrl} alt="Logo" loading="eager" decoding="async" className="h-8 object-contain" />
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
                <Link href="/track" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                  Track Order
                </Link>
                <StarBorder
                  as={Link}
                  href={currentUser ? "/dashboard" : "/login"}
                  color="cyan"
                  speed="5s"
                  backgroundColor={currentUser ? "#2563EB" : "#B3E600"}
                  textColor={currentUser ? "#FFFFFF" : "#000000"}
                  borderColor={currentUser ? "rgba(37,99,235,0.4)" : "rgba(179,230,0,0.4)"}
                  thickness={2}
                  className="hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(179,230,0,0.3)] transition-all font-bold"
                >
                  {currentUser ? (
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {currentUser.name ? currentUser.name.split(' ')[0] : 'Dashboard'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      Login
                    </span>
                  )}
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
            {currentUser ? (
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
                Login / Sign Up
              </Link>
            )}
          </div>
          
          <div className="p-6 border-t border-white/10">
            {currentUser ? (
              <Link 
                href="/dashboard"
                onClick={toggleMobileMenu}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <User className="w-4 h-4" />
                My Dashboard
              </Link>
            ) : (
              <Link 
                href="/login"
                onClick={toggleMobileMenu}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#B3E600] hover:bg-[#a1cf00] text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(179,230,0,0.3)]"
              >
                <User className="w-4 h-4" />
                Login / Create Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


