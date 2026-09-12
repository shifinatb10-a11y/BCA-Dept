'use client';

import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight, User, Trophy, ExternalLink } from 'lucide-react';
import { DepartmentEvent } from '@/lib/types';

interface EventCardProps {
  event: DepartmentEvent;
  onSelect: (event: DepartmentEvent) => void;
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  const isCompleted = event.status === 'completed';

  return (
    <div className="group relative flex flex-col rounded-xl bg-[#08101e] border border-[#152540] overflow-hidden shadow-lg hover:border-[#2563eb] transition-colors duration-200">
      
      {/* Event Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08101e] via-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            isCompleted
              ? 'bg-slate-900/90 text-emerald-400 border border-emerald-500/40'
              : 'bg-[#1d4ed8] text-white shadow'
          }`}>
            {isCompleted ? '✓ Completed' : 'Upcoming'}
          </span>

          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/80 text-blue-300 border border-[#1e3a8a] backdrop-blur-sm">
            {event.category}
          </span>
        </div>

        {/* Date badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5 text-[11px] text-white bg-black/85 px-2 py-0.5 rounded border border-[#152540]">
          <Calendar className="w-3 h-3 text-blue-400" />
          <span>{event.date}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 
            onClick={() => onSelect(event)}
            className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {event.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="pt-1.5 space-y-1 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3 h-3 text-blue-400 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            {event.speaker && (
              <div className="flex items-center space-x-1.5 text-blue-300">
                <User className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate">Speaker: {event.speaker}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#121e33] flex items-center justify-between">
          {isCompleted ? (
            <button
              onClick={() => onSelect(event)}
              className="w-full flex items-center justify-center space-x-1 py-1.5 px-3 rounded-lg bg-[#0c1628] text-blue-300 hover:bg-[#122240] hover:text-white border border-[#162744] text-xs font-medium transition-colors"
            >
              <Trophy className="w-3 h-3 text-yellow-400" />
              <span>View Highlights & Outcomes</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => onSelect(event)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <span>Agenda Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              {event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-medium transition-colors shadow"
                >
                  <span>Register</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="text-[10px] text-slate-500">Open to students</span>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
