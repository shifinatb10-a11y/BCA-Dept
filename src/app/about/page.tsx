'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Target, 
  Lightbulb, 
  Cpu, 
  Users, 
  Mail, 
  GraduationCap, 
  CheckCircle
} from 'lucide-react';
import { FacultyMember, DepartmentStats } from '@/lib/types';

export default function AboutPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setFaculty(data.faculty || []);
          setStats(data.stats || null);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 text-left bg-black text-slate-100">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0a152b] border border-[#1e3a8a]/60 text-blue-400 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>PSMO COLLEGE (AUTONOMOUS), TIRURANGADI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Department of Computer Applications (BCA)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Pocker Sahib Memorial Orphanage (PSMO) College, established in 1968 in Tirurangadi, Malappuram district, Kerala, is an autonomous premier institution of higher education affiliated to the University of Calicut and re-accredited with A+ Grade by NAAC.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div className="p-5 rounded-xl bg-[#08101e] border border-[#152540] space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#0e1d38] border border-[#1e3a8a] text-blue-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Department Vision</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            To provide high-quality, value-based computer applications education to empower rural and semi-urban youth, producing competent, socially responsible software professionals and innovators.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#08101e] border border-[#152540] space-y-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#0e1d38] border border-[#1e3a8a] text-cyan-400 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Department Mission</h2>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>Impart practical programming and computer science skills through hands-on lab training.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>Organize regular workshops, technical symposiums, and industrial interactions.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>Foster ethical coding practices, critical problem-solving, and team leadership.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Facilities */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white">Department Infrastructure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] space-y-1.5">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h3 className="text-xs font-bold text-white">BCA Computer Laboratory</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Equipped with 65 networked computer systems, air conditioning, and high-speed campus internet connection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] space-y-1.5">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-bold text-white">Smart Classrooms</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Interactive LCD projectors and audiovisual equipment for interactive technical lectures and project presentations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#08101e] border border-[#152540] space-y-1.5">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-bold text-white">Departmental Library</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Curated collection of standard textbooks, technical journals, project reports, and reference manuals.
            </p>
          </div>
        </div>
      </div>

      {/* Faculty Directory */}
      <div className="space-y-4 pt-4 border-t border-[#122038]">
        <div>
          <h2 className="text-lg font-bold text-white">Faculty Directory</h2>
          <p className="text-xs text-slate-400">
            Faculty members of the BCA Department at PSMO College (Autonomous), Tirurangadi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {faculty.map((member) => (
            <div
              key={member.id}
              className="rounded-xl bg-[#08101e] border border-[#152540] overflow-hidden flex flex-col"
            >
              <div className="h-44 w-full bg-black overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-xs">
                <div>
                  <h3 className="font-bold text-white text-xs sm:text-sm">{member.name}</h3>
                  <p className="text-blue-400 font-medium text-[11px]">{member.designation}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{member.qualification}</p>
                  <div className="mt-2 p-2 rounded bg-black text-[10px] text-slate-300 border border-[#122038]">
                    <span className="text-slate-400 font-medium block">Specialization:</span>
                    {member.specialization}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#122038] flex items-center justify-between text-slate-400 text-[11px]">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center space-x-1 text-blue-400 hover:underline"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                  <span>{member.experienceYears} yrs exp</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
