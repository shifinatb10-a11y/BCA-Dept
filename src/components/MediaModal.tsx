'use client';

import React, { useEffect } from 'react';
import { X, Calendar, ExternalLink, Sparkles } from 'lucide-react';
import { GalleryItem } from '@/lib/types';

interface MediaModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export default function MediaModal({ item, onClose }: MediaModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
  };

  const youtubeEmbed = item.type === 'video' ? getYouTubeEmbedUrl(item.url) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-w-4xl w-full bg-[#08101e] border border-[#162744] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#122038] bg-black">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              item.type === 'video'
                ? 'bg-red-950 text-red-400 border border-red-900/50'
                : 'bg-[#0e1d38] text-blue-300 border border-[#1e3a8a]'
            }`}>
              {item.type}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#08101e] text-slate-300 border border-[#162744]">
              {item.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#0c1628] text-slate-400 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Preview Container */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[280px] sm:min-h-[420px] overflow-hidden">
          {item.type === 'video' ? (
            youtubeEmbed ? (
              <iframe
                src={youtubeEmbed}
                title={item.title}
                className="w-full h-[300px] sm:h-[460px] border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={item.url}
                controls
                autoPlay
                className="max-h-[70vh] w-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.title}
              className="max-h-[70vh] w-auto max-w-full object-contain"
            />
          )}
        </div>

        {/* Media Details Footer */}
        <div className="p-4 sm:p-5 bg-[#08101e] border-t border-[#122038] space-y-1.5 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="text-base font-bold text-white">{item.title}</h3>
            <div className="flex items-center space-x-3 text-xs text-slate-400 shrink-0">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>{item.date}</span>
              </span>
              {item.eventName && (
                <span className="flex items-center space-x-1 text-blue-400">
                  <Sparkles className="w-3 h-3" />
                  <span>{item.eventName}</span>
                </span>
              )}
            </div>
          </div>

          {item.description && (
            <p className="text-xs text-slate-300 leading-relaxed">
              {item.description}
            </p>
          )}

          {item.url && (
            <div className="pt-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 hover:underline"
              >
                <span>View original media link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
