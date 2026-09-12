'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setIsAdmin(true);
      })
      .catch(() => {});
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Programs & Events', href: '/events' },
    { name: 'Galleries', href: '/gallery' },
    { name: 'About Department', href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0f1f3a] bg-black/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Department Branding */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#2563eb]/40 flex items-center justify-center shrink-0 overflow-hidden p-0.5 shadow-md">
              <Image src="/logo.png" alt="PSMO College Logo" width={44} height={44} className="w-full h-full object-contain rounded-full" priority />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-lg text-white group-hover:text-blue-400 transition-colors truncate">
                  PSMO COLLEGE <span className="text-[#3b82f6] font-semibold hidden xs:inline">(AUTONOMOUS)</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-slate-400 truncate">
                <span>BCA Department</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-blue-400 hidden sm:inline">Tirurangadi</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-white bg-[#0e1d38] border border-[#1e3a8a]'
                    : 'text-slate-300 hover:text-white hover:bg-[#0a1426]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action: Admin Login */}
          <div className="hidden md:flex items-center space-x-3">
            {isAdmin ? (
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-sm font-semibold transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0a1222] text-slate-200 border border-[#162744] text-sm font-medium hover:border-[#2563eb] hover:text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0c162a] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#0f1f3a] bg-black px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                isActive(link.href)
                  ? 'bg-[#0e1d38] text-white border border-[#1e3a8a]'
                  : 'text-slate-300 hover:bg-[#0a1426] hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#122038]">
            {isAdmin ? (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-lg bg-[#1d4ed8] text-white font-medium text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-lg bg-[#0a1222] border border-[#162744] text-slate-300 font-medium text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
