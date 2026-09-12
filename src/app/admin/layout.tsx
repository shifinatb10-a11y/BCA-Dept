'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Image as ImageIcon, 
  DollarSign, 
  Settings, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }

    fetch('/api/auth', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'logout' }),
      });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-slate-400 space-y-2 flex-col">
        <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-blue-400">Verifying Admin Access...</p>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Program Scheduler', href: '/admin/events', icon: Calendar },
    { name: 'Media Gallery Hub', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Financial Management', href: '/admin/finances', icon: DollarSign },
    { name: 'Admin Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#08101e] border-b border-[#122038]">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-white text-xs">PSMO BCA Admin Panel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-[#0c1628] text-slate-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 max-w-[80vw] bg-[#070d18] border-r border-[#122038] p-5 flex flex-col justify-between overflow-y-auto transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3 px-1">
            <div className="w-9 h-9 rounded-lg bg-[#1e3a8a] border border-[#2563eb]/40 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">PSMO COLLEGE</h2>
              <p className="text-[11px] text-blue-400">BCA Admin Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#1d4ed8] text-white'
                      : 'text-slate-300 hover:text-white hover:bg-[#0c1628]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-blue-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-2 pt-4 border-t border-[#122038]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-[#0c1628] transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Public College Site</span>
            </span>
            <ChevronRight className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/50 hover:text-white text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full bg-black">
        {children}
      </div>

    </div>
  );
}
