'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Monitor, 
  GraduationCap, 
  Image as ImageIcon, 
  PlayCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import EventCard from '@/components/EventCard';
import EventModal from '@/components/EventModal';
import MediaModal from '@/components/MediaModal';
import { DepartmentEvent, GalleryItem, DepartmentStats } from '@/lib/types';

export default function HomePage() {
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<DepartmentEvent | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [eventsRes, galleryRes, statsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/gallery?featured=true'),
          fetch('/api/stats'),
        ]);

        const eventsData = await eventsRes.json();
        const galleryData = await galleryRes.json();
        const statsData = await statsRes.json();

        if (eventsData.success) setEvents(eventsData.events || []);
        if (galleryData.success) setGallery(galleryData.gallery || []);
        if (statsData.success) setStats(statsData.stats || null);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const upcomingEvents = events.filter((e) => e.status === 'upcoming');
  const completedEvents = events.filter((e) => e.status === 'completed');
  const nearestUpcoming = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  return (
    <div className="pb-16 bg-black min-h-screen text-slate-100">
      
      {/* Hero Section */}
      <section className="border-b border-[#0f1f3a] bg-gradient-to-b from-[#060c18] via-[#03060c] to-black py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left Col: Department & College Info */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#0a152b] border border-[#1e3a8a]/60 text-blue-400 text-[10px] sm:text-xs font-semibold leading-snug">
                <span>PSMO COLLEGE (AUTONOMOUS), TIRURANGADI</span>
              </div>

              <h1 className="text-2xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Department of Computer Applications <span className="text-[#3b82f6]">(BCA)</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Welcome to the official portal for BCA students at PSMO College (Autonomous), Tirurangadi. Explore upcoming program schedules, completed technical events, photo and video archives, and departmental activities.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/events"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold text-sm transition-colors shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Program Schedules</span>
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#08101e] hover:bg-[#0c1830] text-slate-200 border border-[#162744] font-medium text-sm transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  <span>View Galleries</span>
                </Link>
              </div>
            </div>

            {/* Right Col: Nearest Event Spotlight */}
            <div className="lg:col-span-5">
              {nearestUpcoming ? (
                <div className="rounded-2xl bg-[#08101e] border border-[#16294a] p-6 space-y-4 text-left shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Next Upcoming Event</span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#0f2142] text-blue-300 border border-[#1e3e78]">
                      {nearestUpcoming.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {nearestUpcoming.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                      {nearestUpcoming.description}
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="py-2.5 px-3 rounded-xl bg-black border border-[#13223c] flex flex-col items-center justify-center space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Kickoff Countdown</p>
                    <CountdownTimer targetDate={nearestUpcoming.date} eventName={nearestUpcoming.title} />
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 pt-1">
                    <div><strong className="text-slate-400">Date:</strong> {nearestUpcoming.date} ({nearestUpcoming.time})</div>
                    <div><strong className="text-slate-400">Venue:</strong> {nearestUpcoming.venue}</div>
                  </div>

                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedEvent(nearestUpcoming)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold text-xs transition-colors text-center shadow"
                    >
                      View Full Details
                    </button>
                    {nearestUpcoming.registrationUrl && (
                      <a
                        href={nearestUpcoming.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg bg-[#0c1628] hover:bg-[#101d36] text-white font-medium text-xs border border-[#1b3156] transition-colors flex items-center space-x-1"
                      >
                        <span>Register</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#08101e] border border-[#152540] p-6 text-center text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 text-blue-500" />
                  <h3 className="text-sm font-bold text-white">No Upcoming Events Right Now</h3>
                  <p className="text-xs mt-1">Check back soon for new association announcements.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] text-center shadow-lg">
            <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{stats?.totalStudents || 180}+</div>
            <div className="text-xs text-slate-400">BCA Students</div>
          </div>

          <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] text-center shadow-lg">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{stats?.eventsCompleted || 28}+</div>
            <div className="text-xs text-slate-400">Events Completed</div>
          </div>

          <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] text-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{stats?.facultyCount || 8}</div>
            <div className="text-xs text-slate-400">Faculty Members</div>
          </div>

          <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] text-center shadow-lg">
            <Monitor className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{stats?.labSystemsCount || 65}+</div>
            <div className="text-xs text-slate-400">Computer Lab Systems</div>
          </div>
        </div>
      </section>

      {/* Upcoming Programs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Upcoming Programs</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Upcoming technical events, workshops, and seminars.</p>
          </div>
          <Link
            href="/events"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {upcomingEvents.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} onSelect={(ev) => setSelectedEvent(ev)} />
          ))}
        </div>
      </section>

      {/* Already Done / Completed Programs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Already Done Programs</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Past events with summaries, highlights, and outcomes.</p>
          </div>
          <Link
            href="/events?status=completed"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View Past Archives</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {completedEvents.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} onSelect={(ev) => setSelectedEvent(ev)} />
          ))}
        </div>
      </section>

      {/* Featured Galleries (Photos & Videos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Department Galleries</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Photos and videos of student life, labs, and celebrations.</p>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>Open Complete Gallery</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group relative h-56 rounded-xl bg-[#08101e] border border-[#152540] overflow-hidden cursor-pointer hover:border-[#2563eb] transition-colors shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.type === 'video' ? (item.thumbnailUrl || item.url) : item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute top-2.5 right-2.5">
                {item.type === 'video' ? (
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/80 text-blue-300 border border-[#1b3156]">
                    Photo
                  </span>
                )}
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span className="text-[10px] font-semibold text-blue-400 block">{item.category}</span>
                <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      <MediaModal item={selectedMedia} onClose={() => setSelectedMedia(null)} />

    </div>
  );
}
