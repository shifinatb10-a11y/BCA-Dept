'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Image as ImageIcon, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  ArrowRight
} from 'lucide-react';
import { DepartmentEvent, GalleryItem, FinancialTransaction } from '@/lib/types';

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [finances, setFinances] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [evRes, galRes, finRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/gallery'),
          fetch('/api/finances'),
        ]);

        const evData = await evRes.json();
        const galData = await galRes.json();
        const finData = await finRes.json();

        if (evData.success) setEvents(evData.events || []);
        if (galData.success) setGallery(galData.gallery || []);
        if (finData.success) setFinances(finData);
      } catch (err) {
        console.error('Error loading admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const completedCount = events.filter((e) => e.status === 'completed').length;
  const imageCount = gallery.filter((g) => g.type === 'image').length;
  const videoCount = gallery.filter((g) => g.type === 'video').length;

  const netBalance = finances?.summary?.netBalance || 0;
  const totalIncome = finances?.summary?.totalIncome || 0;
  const totalExpense = finances?.summary?.totalExpense || 0;
  const utilization = finances?.summary?.utilizationPercentage || 0;

  return (
    <div className="space-y-6 text-left bg-black text-slate-100">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#122038]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            PSMO College (Autonomous) • BCA Operations & Financial Ledger Overview
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/events"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-medium text-xs transition-colors shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Program</span>
          </Link>

          <Link
            href="/admin/gallery"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0c1628] hover:bg-[#122038] text-slate-200 border border-[#162744] font-medium text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Add Media</span>
          </Link>

          <Link
            href="/admin/finances"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs transition-colors shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Transaction</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Net Department Balance */}
        <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dept Cash Balance</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ₹{netBalance.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-medium">In: ₹{totalIncome.toLocaleString('en-IN')}</span>
            <span>•</span>
            <span className="text-red-400 font-medium">Out: ₹{totalExpense.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Programs */}
        <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Programs</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {events.length} Total
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="text-blue-400">{upcomingCount} Upcoming</span>
            <span>•</span>
            <span className="text-emerald-400">{completedCount} Concluded</span>
          </div>
        </div>

        {/* Media */}
        <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gallery Assets</span>
            <ImageIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {gallery.length} Media
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="text-blue-300">{imageCount} Photos</span>
            <span>•</span>
            <span className="text-red-400">{videoCount} Videos</span>
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Budget Spent</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {utilization}%
          </div>
          <div className="w-full bg-black rounded-full h-1.5 overflow-hidden border border-[#14233c]">
            <div 
              className="bg-[#2563eb] h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, utilization)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Events Card */}
        <div className="p-5 rounded-xl bg-[#08101e] border border-[#152540] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Recent & Upcoming Events</h2>
            </div>
            <Link
              href="/admin/events"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>Manage Events</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {events.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="p-2.5 rounded-lg bg-black border border-[#122038] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      event.status === 'upcoming'
                        ? 'bg-[#0b162b] text-blue-300 border border-[#1e3a8a]'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {event.status}
                    </span>
                    <span className="text-[11px] text-slate-400">{event.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate mt-0.5">{event.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{event.venue}</p>
                </div>

                <Link
                  href="/admin/events"
                  className="p-1.5 rounded bg-[#0c1628] hover:bg-[#1d4ed8] text-slate-300 hover:text-white transition-colors shrink-0"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Financial Transactions */}
        <div className="p-5 rounded-xl bg-[#08101e] border border-[#152540] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Financial Activity Ledger</h2>
            </div>
            <Link
              href="/admin/finances"
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Full Finances</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {finances?.transactions?.slice(0, 4).map((tx: FinancialTransaction) => (
              <div
                key={tx.id}
                className="p-2.5 rounded-lg bg-black border border-[#122038] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      tx.type === 'income'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {tx.type}
                    </span>
                    <span className="text-[11px] text-slate-400">{tx.date}</span>
                    <span className="text-[10px] text-slate-500">({tx.paymentMethod})</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate mt-0.5">{tx.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{tx.payerPayee}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-mono text-xs font-bold ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">{tx.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
