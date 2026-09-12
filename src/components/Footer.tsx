import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, ShieldCheck, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#0f1f3a] bg-black text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: PSMO College BCA Dept */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] border border-[#2563eb]/40 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-200" />
              </div>
              <span className="font-bold text-white text-base">
                PSMO <span className="text-[#3b82f6]">COLLEGE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Department of Computer Applications (BCA)<br />
              Pocker Sahib Memorial Orphanage College (Autonomous)<br />
              Tirurangadi, Malappuram, Kerala - 676306
            </p>
            <p className="text-[11px] text-[#3b82f6]">
              Affiliated to University of Calicut | NAAC A+ Grade
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Department Navigation</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/events" className="hover:text-blue-400 transition-colors">Upcoming Programs</Link>
              </li>
              <li>
                <Link href="/events?status=completed" className="hover:text-blue-400 transition-colors">Completed Events & Archives</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-blue-400 transition-colors">Photos & Videos Gallery</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">Faculty Directory & Lab Facilities</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Associations */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Student Activities</h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• BCA Student Association</li>
              <li>• INNOVENTIA Technical Fest Committee</li>
              <li>• Web & Coding Club</li>
              <li>• Campus Cyber Awareness Cell</li>
            </ul>
          </div>

          {/* Col 4: Contact & Admin */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Campus Contact</h3>
            <div className="space-y-1.5 text-xs">
              <p className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>BCA Block, PSMO College Campus, Tirurangadi</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>bca@psmocollege.ac.in</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>0494 2460335</span>
              </p>
            </div>
            <div className="pt-2">
              <Link 
                href="/admin/login" 
                className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Admin Portal</span>
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-[#0f1f3a] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} BCA Department, PSMO College (Autonomous), Tirurangadi.</p>
          <p>Designed for BCA Students & Faculty</p>
        </div>
      </div>
    </footer>
  );
}
