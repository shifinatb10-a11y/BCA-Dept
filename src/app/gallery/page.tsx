'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Image as ImageIcon, 
  PlayCircle, 
  Filter, 
  Layers,
  Search
} from 'lucide-react';
import MediaModal from '@/components/MediaModal';
import { GalleryItem } from '@/lib/types';

const CATEGORIES = [
  'All',
  'Hackathons',
  'Workshops',
  'Campus Life',
  'Cultural',
  'Sports',
];

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        if (data.success) {
          setGallery(data.gallery || []);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const filteredItems = useMemo(() => {
    return gallery.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (categoryFilter !== 'All' && item.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });
  }, [gallery, typeFilter, categoryFilter, searchQuery]);

  const photoCount = gallery.filter((i) => i.type === 'image').length;
  const videoCount = gallery.filter((i) => i.type === 'video').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-black text-left">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0a152b] border border-[#1e3a8a]/60 text-blue-400 text-xs font-semibold">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>PSMO COLLEGE BCA MEDIA ARCHIVES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Photo & Video Galleries
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
          Visual documentation of student achievements, lab sessions, association celebrations, and campus life at PSMO College (Autonomous), Tirurangadi.
        </p>
      </div>

      {/* Filter and Switcher Controls */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-[#08101e] border border-[#152540]">
          
          {/* Media Type Buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                typeFilter === 'all'
                  ? 'bg-[#1d4ed8] text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#0c1628]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All ({gallery.length})</span>
            </button>

            <button
              onClick={() => setTypeFilter('image')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                typeFilter === 'image'
                  ? 'bg-[#1d4ed8] text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#0c1628]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos ({photoCount})</span>
            </button>

            <button
              onClick={() => setTypeFilter('video')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                typeFilter === 'video'
                  ? 'bg-red-700 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#0c1628]'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Videos ({videoCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-black border border-[#162744] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 px-1 shrink-0 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-blue-400" />
            <span>Category:</span>
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#1d4ed8] text-white'
                  : 'bg-[#08101e] text-slate-400 border border-[#152540] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading media...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group relative rounded-xl bg-[#08101e] border border-[#152540] overflow-hidden cursor-pointer shadow hover:border-[#2563eb] transition-colors flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full bg-black overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.type === 'video' ? (item.thumbnailUrl || item.url) : item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Badge for Type */}
                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    item.type === 'video'
                      ? 'bg-red-950/90 text-red-400 border border-red-900'
                      : 'bg-[#0b162b] text-blue-300 border border-[#1e3a8a]'
                  }`}>
                    {item.type}
                  </span>
                </div>

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2.5 right-2.5 text-[10px] text-slate-300 bg-black/80 px-1.5 py-0.5 rounded border border-[#152540]">
                  {item.date}
                </div>
              </div>

              {/* Information */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-1 bg-[#08101e]">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-blue-400">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 mt-0.5">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl bg-[#08101e] border border-[#152540] space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Media Found</h3>
          <p className="text-xs text-slate-400">No photos or videos match the selected filters.</p>
        </div>
      )}

      {/* Lightbox / Video Player Modal */}
      <MediaModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />

    </div>
  );
}
