'use client';

import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  PlayCircle, 
  Plus, 
  Trash2, 
  Upload, 
  Link as LinkIcon, 
  X, 
  Check, 
  Sparkles, 
  Filter,
  Eye
} from 'lucide-react';
import MediaModal from '@/components/MediaModal';
import { GalleryItem, MediaType, DepartmentEvent } from '@/lib/types';

const CATEGORIES = [
  'Hackathons',
  'Workshops',
  'Tech Fest',
  'Campus Life',
  'Cultural',
  'Sports',
  'Guest Lectures',
];

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<DepartmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPreviewMedia, setSelectedPreviewMedia] = useState<GalleryItem | null>(null);

  // Form states
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [category, setCategory] = useState('Hackathons');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [featured, setFeatured] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const loadData = async () => {
    try {
      const [galRes, evRes] = await Promise.all([
        fetch('/api/gallery'),
        fetch('/api/events'),
      ]);
      const galData = await galRes.json();
      const evData = await evRes.json();
      if (galData.success) setGallery(galData.gallery || []);
      if (evData.success) setEvents(evData.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUrl(data.url);
      } else {
        alert(data.message || 'File upload failed');
      }
    } catch (err) {
      alert('Error uploading file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      alert('Please provide a media URL or upload a file');
      return;
    }

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          type: mediaType,
          url,
          thumbnailUrl: mediaType === 'video' ? thumbnailUrl : undefined,
          category,
          eventId: selectedEventId || undefined,
          featured,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        // Reset form
        setTitle('');
        setDescription('');
        setUrl('');
        setThumbnailUrl('');
        setFeatured(false);
        loadData();
      } else {
        alert(data.message || 'Error saving media');
      }
    } catch (err) {
      alert('Failed to save media item');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Remove "${title}" from the department gallery?`)) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.message || 'Error deleting media');
      }
    } catch (err) {
      alert('Failed to delete media');
    }
  };

  const filteredGallery = gallery.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Media Gallery Hub</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload high-resolution event photos, embed YouTube tech showcases, and organize department memories.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-blue-glow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo or Video</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 p-2 rounded-2xl bg-slate-900/80 border border-blue-900/40 w-fit">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'all'
              ? 'bg-blue-600 text-white shadow-blue-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          All Media ({gallery.length})
        </button>
        <button
          onClick={() => setFilterType('image')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'image'
              ? 'bg-blue-600 text-white shadow-blue-glow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Photos ({gallery.filter((g) => g.type === 'image').length})
        </button>
        <button
          onClick={() => setFilterType('video')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filterType === 'video'
              ? 'bg-red-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Videos ({gallery.filter((g) => g.type === 'video').length})
        </button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading media...</div>
      ) : filteredGallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/80 border border-blue-900/40 overflow-hidden shadow-lg flex flex-col group"
            >
              <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.type === 'video' ? (item.thumbnailUrl || item.url) : item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    item.type === 'video' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {item.type}
                  </span>
                  {item.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/90 text-slate-950">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1.5">
                  <button
                    onClick={() => setSelectedPreviewMedia(item)}
                    title="Preview Media"
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-blue-600 text-white text-xs backdrop-blur-sm transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    title="Delete Media"
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-red-600 text-red-400 hover:text-white text-xs backdrop-blur-sm transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-400">{item.category}</span>
                  <h4 className="font-bold text-white line-clamp-1 mt-0.5">{item.title}</h4>
                  {item.eventName && (
                    <p className="text-[11px] text-cyan-400 truncate mt-0.5">Linked: {item.eventName}</p>
                  )}
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
          No media items found in this section.
        </div>
      )}

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative z-10 max-w-xl w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>Add Media to Department Gallery</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4 text-xs">
              
              {/* Type Switcher */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Media Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold transition-all ${
                      mediaType === 'image'
                        ? 'bg-blue-600 text-white shadow-blue-glow'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo / Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold transition-all ${
                      mediaType === 'video'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Video (YouTube / MP4)</span>
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Title / Caption *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ByteCraft Hackathon Midnight Coding Session"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Associate with Event (Optional)</label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                  >
                    <option value="">None / Independent</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Source URL or Upload */}
              {mediaType === 'image' ? (
                <div className="space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="text-slate-300 font-semibold block">Photo File or Direct Image URL *</label>
                  
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition-colors font-medium text-xs shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingFile ? 'Uploading...' : 'Choose File to Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploadingFile}
                      />
                    </label>
                    <span className="text-slate-500 text-xs">or paste image URL below:</span>
                  </div>

                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:border-blue-500 outline-none"
                  />
                  {url && (
                    <div className="h-20 w-32 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Video URL (YouTube link or MP4) *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube.com/watch?v=... or .mp4"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Custom Video Poster Thumbnail URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Additional context about this photograph or footage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured-check" className="text-slate-300 text-xs cursor-pointer">
                  Feature this on the department homepage showcase
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-blue-glow"
                >
                  Save to Gallery
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      <MediaModal
        item={selectedPreviewMedia}
        onClose={() => setSelectedPreviewMedia(null)}
      />

    </div>
  );
}
