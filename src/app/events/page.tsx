'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Calendar, 
  Search, 
  Filter, 
  Trophy, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import EventCard from '@/components/EventCard';
import EventModal from '@/components/EventModal';
import { DepartmentEvent, EventCategory } from '@/lib/types';

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Hackathon',
  'Workshop',
  'Seminar',
  'Guest Lecture',
  'Tech Fest',
  'Cultural',
  'Sports',
  'Orientation',
];

function EventsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') === 'completed' ? 'completed' : 'upcoming';

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>(initialStatus);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<DepartmentEvent | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.success) {
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error('Unexpected error loading events:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (activeTab === 'upcoming' && event.status !== 'upcoming') return false;
      if (activeTab === 'completed' && event.status !== 'completed') return false;

      if (selectedCategory !== 'All' && event.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = event.title?.toLowerCase().includes(query);
        const matchDesc = event.description?.toLowerCase().includes(query);
        const matchSpeaker = event.speaker?.toLowerCase().includes(query);
        const matchCoordinator = event.coordinator?.toLowerCase().includes(query);
        const matchVenue = event.venue?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchSpeaker && !matchCoordinator && !matchVenue) {
          return false;
        }
      }

      return true;
    });
  }, [events, activeTab, selectedCategory, searchQuery]);

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const completedCount = events.filter((e) => e.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-black text-left">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0a152b] border border-[#1e3a8a]/60 text-blue-400 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>PSMO COLLEGE BCA PROGRAM SCHEDULES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Department Programs & Events
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
          Browse upcoming technical workshops, bootcamps, and IT fest schedules, or review outcomes and highlights from completed departmental programs.
        </p>
      </div>

      {/* Main Filter & Tabs Control Bar */}
      <div className="space-y-3">
        
        {/* Primary Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-[#08101e] border border-[#152540]">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-[#1d4ed8] text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#0c1628]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Upcoming Events</span>
              <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                activeTab === 'upcoming' ? 'bg-[#1e40af] text-white' : 'bg-black text-slate-400'
              }`}>
                {upcomingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === 'completed'
                  ? 'bg-emerald-700 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#0c1628]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Already Done Programs</span>
              <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                activeTab === 'completed' ? 'bg-emerald-800 text-white' : 'bg-black text-slate-400'
              }`}>
                {completedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#0f1d35] text-white border border-[#1e3a8a]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>All ({events.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-black border border-[#162744] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 px-1 shrink-0 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-blue-400" />
            <span>Tag:</span>
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1d4ed8] text-white'
                  : 'bg-[#08101e] text-slate-400 border border-[#152540] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading departmental schedules...</p>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={(ev) => setSelectedEvent(ev)}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl bg-[#08101e] border border-[#152540] space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Programs Found</h3>
          <p className="text-xs text-slate-400">
            No events match your current filter. Try selecting another category.
          </p>
        </div>
      )}

      {/* Event Details Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-slate-400 space-y-2 bg-black">
        <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading events...</p>
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
