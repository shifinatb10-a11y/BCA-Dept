'use client';

import React, { useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Ticket
} from 'lucide-react';
import { DepartmentEvent } from '@/lib/types';

interface EventModalProps {
  event: DepartmentEvent | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const isCompleted = event.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-w-2xl w-full bg-[#08101e] border border-[#162744] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto text-left">
        
        {/* Banner with Status Badge */}
        <div className="relative h-48 sm:h-56 w-full bg-black overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08101e] via-[#08101e]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 text-white hover:bg-black transition-colors z-10"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                isCompleted
                  ? 'bg-slate-900/90 text-emerald-400 border border-emerald-500/40'
                  : 'bg-[#1d4ed8] text-white'
              }`}>
                {isCompleted ? '✓ Completed Program' : 'Upcoming Event'}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-black/80 text-blue-300 border border-[#1e3a8a]">
                {event.category}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {event.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-300 bg-black/60 p-3 rounded-lg border border-[#13223c]">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span><strong className="text-slate-400">Date:</strong> {event.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span><strong className="text-slate-400">Time:</strong> {event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span><strong className="text-slate-400">Venue:</strong> {event.venue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span><strong className="text-slate-400">Lead:</strong> {event.coordinator}</span>
              </div>
            </div>
          </div>

          {/* Speaker */}
          {event.speaker && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#0b162b] border border-[#172b50]">
              <div className="w-10 h-10 rounded-full bg-[#1e3a8a] flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <p className="text-[10px] uppercase text-blue-400 font-semibold">Guest / Resource Person</p>
                <h4 className="text-sm font-bold text-white">{event.speaker}</h4>
                {event.speakerRole && <p className="text-xs text-slate-400">{event.speakerRole}</p>}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">About The Event</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Recap */}
          {isCompleted && event.recap && (
            <div className="space-y-3 pt-3 border-t border-[#14233c]">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Post-Event Summary & Outcomes</span>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-slate-200 text-xs leading-relaxed">
                {event.recap.summary}
              </div>

              {event.recap.highlights && event.recap.highlights.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-1.5">Key Highlights</h4>
                  <ul className="space-y-1">
                    {event.recap.highlights.map((h, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.recap.winners && event.recap.winners.length > 0 && (
                <div className="p-3 rounded-lg bg-[#0b162b] border border-[#172b50]">
                  <div className="flex items-center space-x-1.5 text-cyan-300 font-bold text-xs mb-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Honors & Winners</span>
                  </div>
                  <ul className="space-y-0.5">
                    {event.recap.winners.map((w, idx) => (
                      <li key={idx} className="text-xs text-slate-200 font-medium">
                        🏅 {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#14233c]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Schedule Agenda</h3>
              <div className="space-y-1.5">
                {event.agenda.map((ag) => (
                  <div key={ag.id} className="flex items-start space-x-2.5 text-xs p-2 rounded bg-black border border-[#13223c]">
                    <div className="px-2 py-0.5 rounded bg-[#0b162b] text-blue-300 font-mono text-[11px] font-semibold shrink-0">
                      {ag.time}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{ag.activity}</p>
                      {ag.speaker && <p className="text-[11px] text-slate-400">Speaker: {ag.speaker}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action */}
          {!isCompleted && event.registrationUrl && (
            <div className="pt-3 border-t border-[#14233c] flex items-center justify-between">
              <span className="text-xs text-slate-400">Registration is open</span>
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold text-xs transition-colors"
              >
                <span>Register for Event</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
