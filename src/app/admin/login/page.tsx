'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'login', username, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-black">
      <div className="max-w-md w-full rounded-2xl bg-[#08101e] border border-[#162744] p-8 space-y-6 shadow-2xl text-left">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-white border border-[#2563eb]/40 flex items-center justify-center shadow-md overflow-hidden p-0.5">
            <Image src="/logo.png" alt="PSMO College Logo" width={56} height={56} className="w-full h-full object-contain rounded-full" priority />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">PSMO College BCA Portal</h1>
          <p className="text-xs text-slate-400">
            Authorized Admin Sign-In • Tirurangadi
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-900/60 text-xs text-red-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Username / Email</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black border border-[#1b3156] rounded-lg text-white text-xs focus:outline-none focus:border-[#2563eb] placeholder-slate-600 transition-colors"
              placeholder="Enter admin username"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black border border-[#1b3156] rounded-lg text-white text-xs focus:outline-none focus:border-[#2563eb] placeholder-slate-600 transition-colors"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold text-xs transition-colors disabled:opacity-50 shadow-md"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">
            ← Return to Public College Website
          </Link>
        </div>

      </div>
    </div>
  );
}
