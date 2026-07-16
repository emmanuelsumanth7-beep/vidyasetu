"use client";

import { useState, useEffect } from 'react';
import { 
  FeePaymentIcon,
  ProfileIcon,
  AttendanceIcon,
  AbsentInfoIcon,
  RemarksIcon,
  LateComerIcon,
  StudyMaterialIcon,
  NotificationIcon,
  CalendarIcon,
  UpcomingEventsIcon,
  SuggestionIcon,
  NightModeIcon,
  BellIcon,
  LogoutIcon
} from './GridIcons';

interface StudentDetails {
  name: string;
  usn: string;
  class: string;
  section: string;
  rollNo: string;
  dob: string;
  parentName: string;
  parentPhone: string;
  bloodGroup: string;
  address: string;
  email: string;
  admissionYear: string;
  house: string;
}

export function HomeGrid() {
  const [student, setStudent] = useState<StudentDetails | null>(null);

  useEffect(() => {
    // Try to load student details from localStorage or use default
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setStudent({
        name: user.name || 'RIKHIL P',
        usn: user.usn || '1SJ22CS045',
        class: user.class || 'II PUC',
        section: user.section || 'A',
        rollNo: user.rollNo || '45',
        dob: user.dob || '15-Mar-2007',
        parentName: user.parentName || 'Mr. Prasad K',
        parentPhone: user.parentPhone || '+91 98765 43210',
        bloodGroup: user.bloodGroup || 'O+',
        address: user.address || 'Bengaluru, Karnataka',
        email: user.email || 'rikhil.p@sjpuc.edu.in',
        admissionYear: user.admissionYear || '2024',
        house: user.house || 'Blue House',
      });
    } else {
      setStudent({
        name: 'RIKHIL P',
        usn: '1SJ22CS045',
        class: 'II PUC',
        section: 'A',
        rollNo: '45',
        dob: '15-Mar-2007',
        parentName: 'Mr. Prasad K',
        parentPhone: '+91 98765 43210',
        bloodGroup: 'O+',
        address: 'Bengaluru, Karnataka',
        email: 'rikhil.p@sjpuc.edu.in',
        admissionYear: '2024',
        house: 'Blue House',
      });
    }
  }, []);

  const gridItems = [
    { label: 'FEE PAYMENT', icon: FeePaymentIcon },
    { label: 'MY PROFILE', icon: ProfileIcon },
    { label: 'MY ATTENDANCE', icon: AttendanceIcon },
    { label: 'ABSENT INFO', icon: AbsentInfoIcon },
    { label: 'REMARKS', icon: RemarksIcon },
    { label: 'LATE COMER', icon: LateComerIcon },
    { label: 'STUDY MATERIAL', icon: StudyMaterialIcon },
    { label: 'MY NOTIFICATION', icon: NotificationIcon },
    { label: 'CALENDER', icon: CalendarIcon },
    { label: 'UPCOMING EVENTS', icon: UpcomingEventsIcon },
    { label: 'SUGGESTION', icon: SuggestionIcon },
    { label: 'LOGOUT', icon: LogoutIcon },
  ];

  const initials = student ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'R';

  return (
    <div className="flex flex-col min-h-screen bg-[#4A4073] max-w-md mx-auto relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
        <div className="absolute -top-10 -left-16 w-40 h-40 rounded-full bg-white/3" />
        <div className="absolute top-24 right-10 w-20 h-20 rounded-full bg-white/5" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-5 pt-6 pb-3 text-white relative z-10">
        <div className="text-lg">
          <span className="opacity-75 text-sm">Welcome back,</span>
          <div className="font-bold text-xl tracking-wide">{student?.name || 'Student'}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-white/10">
            <NightModeIcon />
          </button>
          <button className="w-10 h-10 transition-all hover:scale-110 active:scale-95">
            <BellIcon />
          </button>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white to-purple-100 text-[#4A4073] flex items-center justify-center font-bold text-lg ml-1 shadow-lg border-2 border-white/30">
            {initials}
          </div>
        </div>
      </header>

      {/* Student Info Card */}
      <div className="px-4 mb-3 z-10">
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex items-center gap-4">
            {/* School crest */}
            <div className="w-14 h-14 rounded-xl bg-white/20 overflow-hidden shrink-0 flex items-center justify-center relative border border-white/20">
              <div className="w-10 h-12 bg-blue-100/90 border-2 border-blue-900 absolute flex flex-col items-center pt-1" style={{clipPath: 'polygon(50% 0%, 100% 0, 100% 70%, 50% 100%, 0 70%, 0 0)'}}>
                <div className="w-6 h-1 bg-yellow-400 mb-1"></div>
                <div className="w-8 h-4 bg-blue-900"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white leading-tight truncate">
                St. Joseph&apos;s Pre-University College
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] bg-white/20 text-white/90 px-2.5 py-0.5 rounded-full font-semibold tracking-wide">
                  {student?.class || 'II PUC'} - {student?.section || 'A'}
                </span>
                <span className="text-[10px] bg-white/20 text-white/90 px-2.5 py-0.5 rounded-full font-semibold">
                  USN: {student?.usn || '1SJ22CS045'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick stats row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <div className="text-center flex-1">
              <div className="text-white/60 text-[9px] uppercase tracking-wider font-medium">Roll No</div>
              <div className="text-white font-bold text-sm">{student?.rollNo || '45'}</div>
            </div>
            <div className="w-px h-6 bg-white/15" />
            <div className="text-center flex-1">
              <div className="text-white/60 text-[9px] uppercase tracking-wider font-medium">Blood</div>
              <div className="text-white font-bold text-sm">{student?.bloodGroup || 'O+'}</div>
            </div>
            <div className="w-px h-6 bg-white/15" />
            <div className="text-center flex-1">
              <div className="text-white/60 text-[9px] uppercase tracking-wider font-medium">House</div>
              <div className="text-white font-bold text-sm">{student?.house || 'Blue'}</div>
            </div>
            <div className="w-px h-6 bg-white/15" />
            <div className="text-center flex-1">
              <div className="text-white/60 text-[9px] uppercase tracking-wider font-medium">Year</div>
              <div className="text-white font-bold text-sm">{student?.admissionYear || '2024'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Card */}
      <div className="flex-1 bg-white rounded-t-[28px] pt-7 px-4 pb-24 z-10 shadow-[0_-4px_30px_rgba(0,0,0,0.15)]">
        <div className="grid grid-cols-3 gap-y-7 gap-x-3">
          {gridItems.map((item, idx) => (
            <button 
              key={idx} 
              className="flex flex-col items-center gap-2 group transition-all active:scale-90 hover:scale-[1.02]"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="w-[68px] h-[68px] flex items-center justify-center relative rounded-2xl bg-gray-50/80 p-1 group-hover:bg-gray-100 group-hover:shadow-md transition-all duration-200">
                <item.icon />
              </div>
              <span className="text-[10px] font-bold text-gray-700 tracking-tight uppercase text-center w-full px-0.5 leading-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Social Bar (Floating above bottom nav) */}
      <div className="absolute bottom-[68px] left-0 w-full px-4 flex justify-between gap-2 z-20">
        <button className="flex-1 bg-white/95 backdrop-blur-sm rounded-xl py-2 flex items-center justify-center gap-2 shadow-lg border border-gray-100/50 hover:bg-white transition-colors">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">f</div>
          <span className="text-xs font-semibold text-gray-700">Facebook</span>
        </button>
        <button className="flex-1 bg-white/95 backdrop-blur-sm rounded-xl py-2 flex items-center justify-center gap-2 shadow-lg border border-gray-100/50 hover:bg-white transition-colors">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] border border-white/20">ig</div>
          <span className="text-xs font-semibold text-gray-700">Instagram</span>
        </button>
        <button className="flex-1 bg-white/95 backdrop-blur-sm rounded-xl py-2 flex items-center justify-center gap-2 shadow-lg border border-gray-100/50 hover:bg-white transition-colors">
          <div className="w-5 h-5 rounded-full text-blue-500 border border-current flex items-center justify-center font-bold text-[10px]">🌐</div>
          <span className="text-xs font-semibold text-gray-700">Web</span>
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200/80 py-2 flex justify-around items-end px-2 z-30 pb-4 h-16 shadow-[0_-2px_20px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 transition-all hover:scale-105">
          <div className="w-6 h-6 bg-[#4A4073] rounded-sm" style={{clipPath: 'polygon(50% 0%, 100% 40%, 100% 100%, 0 100%, 0 40%)'}}></div>
          <span className="text-[11px] font-bold text-[#4A4073]">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition-all hover:scale-105">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span className="text-[11px] font-medium">Profile</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition-all hover:scale-105">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="text-[11px] font-medium">Alerts</span>
        </button>
      </nav>
    </div>
  );
}
