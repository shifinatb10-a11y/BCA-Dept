'use client';

import React, { useState } from 'react';
import { Settings, Lock, ShieldCheck, CheckCircle2, AlertCircle, Database, Server } from 'lucide-react';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'change_password',
          password: currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Admin password successfully updated!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Error updating password' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to communicate with server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Settings & Security</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage administrator credentials, authentication preferences, and persistent data storage configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Security & Password Change */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-900/40 space-y-5">
          <div className="flex items-center space-x-2 text-blue-400 font-bold">
            <Lock className="w-5 h-5" />
            <h2 className="text-base text-white">Change Admin Password</h2>
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/50 border border-red-500/40 text-red-300'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">New Password (min 6 chars)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                placeholder="Re-enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-blue-glow transition-all disabled:opacity-50"
            >
              {loading ? 'Updating Credentials...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* System & Storage Info */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-900/40 space-y-5">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold">
            <Server className="w-5 h-5" />
            <h2 className="text-base text-white">System Architecture & Status</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database Engine:</span>
                <span className="font-mono text-cyan-400 font-semibold">JSON Persistent Store (Atomic)</span>
              </div>
              <p className="text-[11px] text-slate-500">File location: <code>data/bca_data.json</code></p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Media Upload Directory:</span>
                <span className="font-mono text-cyan-400 font-semibold">/public/uploads</span>
              </div>
              <p className="text-[11px] text-slate-500">Local disk persistent storage for gallery uploads</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Theme Palette:</span>
                <span className="font-mono text-blue-400 font-semibold">Black & Electric Blue</span>
              </div>
              <p className="text-[11px] text-slate-500">Slate-950 Midnight, Electric Blue (#2563EB), Cyan (#38BDF8)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Default Admin Email:</span>
                <span className="font-mono text-white font-semibold">admin@bca.edu</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
