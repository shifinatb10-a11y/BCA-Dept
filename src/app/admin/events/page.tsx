'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle, 
  Clock, 
  X, 
  Sparkles, 
  Trophy, 
  User, 
  MapPin,
  ExternalLink 
} from 'lucide-react';
import { DepartmentEvent, EventCategory, EventStatus } from '@/lib/types';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES: EventCategory[] = [
  'Hackathon',
  'Workshop',
  'Seminar',
  'Guest Lecture',
  'Tech Fest',
  'Cultural',
  'Sports',
  'Orientation',
];

// Supabase Storage upload helper function
async function uploadBannerToSupabase(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `event-banners/${fileName}`;

  // Upload file to Supabase Storage bucket ('website-uploads')
  const { data, error } = await supabase.storage
    .from('website-uploads')
    .upload(filePath, file);

  if (error) {
    throw new Error('Error uploading image: ' + error.message);
  }

  // Get the public URL of the uploaded image
  const { data: publicUrlData } = supabase.storage
    .from('website-uploads')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<DepartmentEvent | null>(null);

  // Form states for Create/Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshop' as EventCategory,
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 04:00 PM',
    venue: 'BCA Air-Conditioned Computer Lab',
    coordinator: 'Prof. Mohammed Shafi T.',
    speaker: '',
    speakerRole: '',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    registrationUrl: '',
    registrationFee: 0,
    maxSeats: 60,
    status: 'upcoming' as EventStatus,
  });

  // Form state for Completion Recap
  const [recapData, setRecapData] = useState({
    summary: '',
    attendeeCount: 100,
    highlights: '',
    winners: '',
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Workshop',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 04:00 PM',
      venue: 'Turing Computing Lab',
      coordinator: 'Prof. Vikram Malhotra',
      speaker: '',
      speakerRole: '',
      bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      registrationUrl: '',
      registrationFee: 0,
      maxSeats: 100,
      status: 'upcoming',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (event: DepartmentEvent) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      coordinator: event.coordinator,
      speaker: event.speaker || '',
      speakerRole: event.speakerRole || '',
      bannerUrl: event.bannerUrl,
      registrationUrl: event.registrationUrl || '',
      registrationFee: event.registrationFee || 0,
      maxSeats: event.maxSeats || 100,
      status: event.status,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenComplete = (event: DepartmentEvent) => {
    setCurrentEvent(event);
    setRecapData({
      summary: event.recap?.summary || `The ${event.title} program was successfully conducted with enthusiastic participation from students.`,
      attendeeCount: event.recap?.attendeeCount || 80,
      highlights: event.recap?.highlights ? event.recap.highlights.join('\n') : 'Active participation from all semesters\nLive coding demonstrations\nIndustry networking and certificate distribution',
      winners: event.recap?.winners ? event.recap.winners.join('\n') : '',
    });
    setIsCompleteModalOpen(true);
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        fetchEvents();
      } else {
        alert(data.message || 'Error creating event');
      }
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: currentEvent.id,
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditModalOpen(false);
        fetchEvents();
      } else {
        alert(data.message || 'Error updating event');
      }
    } catch (err) {
      alert('Failed to update event');
    }
  };

  const handleSaveComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;
    try {
      const highlightsArray = recapData.highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      const winnersArray = recapData.winners
        .split('\n')
        .map((w) => w.trim())
        .filter(Boolean);

      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: currentEvent.id,
          status: 'completed',
          recap: {
            summary: recapData.summary,
            attendeeCount: Number(recapData.attendeeCount),
            highlights: highlightsArray,
            winners: winnersArray,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCompleteModalOpen(false);
        fetchEvents();
      } else {
        alert(data.message || 'Error updating event status');
      }
    } catch (err) {
      alert('Failed to mark event as completed');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        fetchEvents();
      } else {
        alert(data.message || 'Error deleting event');
      }
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const filtered = events.filter((ev) => {
    if (statusFilter === 'upcoming' && ev.status !== 'upcoming') return false;
    if (statusFilter === 'completed' && ev.status !== 'completed') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return ev.title.toLowerCase().includes(q) || ev.venue.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Program Scheduling Manager</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create upcoming bootcamps and hackathons, modify agendas, or finalize completed programs with recap highlights.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-blue-glow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Program</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/80 border border-blue-900/40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'upcoming'
                ? 'bg-blue-600 text-white shadow-blue-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Upcoming ({events.filter((e) => e.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Completed ({events.filter((e) => e.status === 'completed').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Events Table / List */}
      <div className="rounded-2xl bg-slate-900/80 border border-blue-900/40 overflow-hidden shadow-lg">
        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading programs...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-blue-900/30 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Program Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Venue & Lead</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filtered.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ev.bannerUrl}
                          alt={ev.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm line-clamp-1">{ev.title}</p>
                          {ev.speaker && (
                            <p className="text-[11px] text-cyan-400 truncate">Speaker: {ev.speaker}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-500/30">
                        {ev.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-white">{ev.date}</div>
                      <div className="text-[11px] text-slate-400">{ev.time}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white truncate max-w-[160px]">{ev.venue}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{ev.coordinator}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ev.status === 'upcoming'
                          ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {ev.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {ev.status === 'upcoming' && (
                          <button
                            onClick={() => handleOpenComplete(ev)}
                            title="Mark as Concluded & Add Recap"
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 hover:text-white border border-emerald-500/30 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          title="Edit Program"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id, ev.title)}
                          title="Delete Program"
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">No programs found matching filter.</div>
        )}
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative z-10 max-w-2xl w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>Schedule New BCA Program / Event</span>
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ByteCraft 2026: 24-Hour Hackathon"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Time Schedule</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:30 AM - 04:30 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Venue / Lab Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Turing Advanced Computing Lab"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Faculty / Student Coordinator</label>
                  <input
                    type="text"
                    value={formData.coordinator}
                    onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Guest Speaker / Jury</label>
                  <input
                    type="text"
                    placeholder="e.g. Arjun Das (Principal Architect)"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description / Scope *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed breakdown of the program, prerequisites, technologies covered..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Registration URL (Google Form / Portal)</label>
                  <input
                    type="url"
                    placeholder="https://forms.google.com/..."
                    value={formData.registrationUrl}
                    onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Banner Image (Upload to Supabase)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploadingImage(true);
                        const publicUrl = await uploadBannerToSupabase(file);
                        setFormData({ ...formData, bannerUrl: publicUrl });
                        alert('Banner uploaded successfully to Supabase!');
                      } catch (err: any) {
                        alert(err.message);
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                  />
                  {uploadingImage && <p className="text-[10px] text-blue-400 mt-1">Uploading image...</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-blue-glow disabled:opacity-50"
                >
                  Save & Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && currentEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative z-10 max-w-2xl w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <span>Edit Program Details</span>
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Venue</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-blue-glow"
                >
                  Update Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conclude Event & Add Recap Modal */}
      {isCompleteModalOpen && currentEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative z-10 max-w-xl w-full bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle className="w-5 h-5" />
                <span>Mark as Concluded & Add Recap</span>
              </div>
              <button onClick={() => setIsCompleteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Finalize <strong>{currentEvent.title}</strong> and make the outcomes visible in the "Already Done Programs" public section.
            </p>

            <form onSubmit={handleSaveComplete} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Executive Summary of Program Outcomes *</label>
                <textarea
                  rows={3}
                  required
                  value={recapData.summary}
                  onChange={(e) => setRecapData({ ...recapData, summary: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Total Verified Attendees</label>
                <input
                  type="number"
                  value={recapData.attendeeCount}
                  onChange={(e) => setRecapData({ ...recapData, attendeeCount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Key Highlights (one per line)</label>
                <textarea
                  rows={3}
                  value={recapData.highlights}
                  onChange={(e) => setRecapData({ ...recapData, highlights: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Awardees / Winners (one per line, optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1st Prize: MediScan AI (Lead: Rahul Pillai)"
                  value={recapData.winners}
                  onChange={(e) => setRecapData({ ...recapData, winners: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCompleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                >
                  Finalize & Archive Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}