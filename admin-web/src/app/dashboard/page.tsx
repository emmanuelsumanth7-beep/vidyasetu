'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { readUserSession } from '@/lib/session';
import {
  Sparkles, X, ChevronRight, Activity, TrendingUp, Clock,
  Banknote, Globe, Lock, ArrowUpRight,
  CalendarCheck, Zap, Users, BookOpen, Bell,
  GraduationCap, BarChart3, Trophy, Clipboard,
  CheckCircle2, AlertCircle, Calendar,
  School, UserCheck, CreditCard, Megaphone, Pin
} from 'lucide-react';
import {
  ProfileIcon, StaffIcon, AttendanceIcon, AbsentInfoIcon,
  ClassCompletedIcon, GradesIcon, StudyMaterialIcon,
  DocumentInfoIcon, BellIcon, SuggestionIcon, MoreInfoIcon,
  FeePaymentIcon, DocumentIcon, NotificationIcon, BiometricsIcon,
} from '@/components/GridIcons';

/* ─── Module Registry ─────────────────────────────────────────────────────── */
interface Module {
  id: string;
  title: string;
  icon: React.ComponentType;
  href: string;
  accentHex: string;
  allowedRoles: string[];
  badge?: string;
}

const MODULES: Module[] = [
  { id: 'students',         title: 'Students Info',     icon: ProfileIcon,        href: '/dashboard/students',       accentHex: '#007AFF', allowedRoles: ['principal','teacher','clerk'] },
  { id: 'staff',            title: 'Staff Info',         icon: StaffIcon,          href: '/dashboard/staff',          accentHex: '#5856D6', allowedRoles: ['principal','clerk'] },
  { id: 'attendance',       title: 'Take Attendance',    icon: AttendanceIcon,     href: '/dashboard/attendance',     accentHex: '#30B0C7', allowedRoles: ['principal','teacher','staff'] },
  { id: 'absent',           title: 'Absent Info',        icon: AbsentInfoIcon,     href: '/dashboard/attendance',     accentHex: '#FF3B30', allowedRoles: ['principal','teacher','staff'] },
  { id: 'class_completed',  title: 'Class Completed',    icon: ClassCompletedIcon, href: '/dashboard/classes',        accentHex: '#34C759', allowedRoles: ['principal','teacher'] },
  { id: 'exam_marks',       title: 'Exam Marks',         icon: GradesIcon,         href: '/dashboard/grades',         accentHex: '#FF9500', allowedRoles: ['principal','teacher','student','parent'] },
  { id: 'study_material',   title: 'Study Material',     icon: StudyMaterialIcon,  href: '/dashboard/study-material', accentHex: '#5AC8FA', allowedRoles: ['principal','teacher','staff'] },
  { id: 'document_info',    title: 'Document Info',      icon: DocumentInfoIcon,   href: '/dashboard/approvals',      accentHex: '#FF9500', allowedRoles: ['principal','teacher','clerk','parent','student'], badge: '3' },
  { id: 'notifications',    title: 'Send Notification',  icon: BellIcon,           href: '/dashboard/notices',        accentHex: '#FF2D55', allowedRoles: ['principal','teacher','clerk'], badge: '5' },
  { id: 'suggestions',      title: 'Student Suggestion', icon: SuggestionIcon,     href: '#',                         accentHex: '#AF52DE', allowedRoles: ['principal','counselor'] },
  { id: 'more_info',        title: 'More Info',           icon: MoreInfoIcon,       href: '/dashboard/analytics',     accentHex: '#00C7BE', allowedRoles: ['principal','teacher','clerk'] },
  { id: 'salary',           title: 'My Salary Slip',     icon: FeePaymentIcon,     href: '/dashboard/payroll',        accentHex: '#FFCC00', allowedRoles: ['principal','teacher','clerk','counselor'] },
  { id: 'work_done',        title: 'Work Done',          icon: DocumentIcon,       href: '#',                         accentHex: '#34C759', allowedRoles: ['teacher','staff','principal'] },
  { id: 'chat',             title: 'Chat',               icon: NotificationIcon,   href: '/dashboard/messages',       accentHex: '#AF52DE', allowedRoles: ['principal','teacher','student','parent'] },
  { id: 'staff_attendance', title: 'Staff Attendance',   icon: BiometricsIcon,     href: '#',                         accentHex: '#007AFF', allowedRoles: ['principal','clerk'] },
];

/* ─── Demo KPI data ───────────────────────────────────────────────────────── */
const PRINCIPAL_STATS = [
  { label: "Today's Attendance", value: '94.2%', delta: '+1.2%', trend: 'up',     color: '#34C759', bg: 'rgba(52,199,89,0.10)',   icon: Activity,  barPct: 0 },
  { label: 'Fee Collection',     value: '₹1.24L', delta: '68%',  trend: 'bar',    color: '#FF9500', bg: 'rgba(255,149,0,0.10)',   icon: Banknote,  barPct: 68 },
  { label: 'Pending Actions',    value: '7',     delta: 'Review', trend: 'action', color: '#FF3B30', bg: 'rgba(255,59,48,0.08)',   icon: Clock,     barPct: 0 },
];

const PRINCIPAL_INTELLIGENCE = [
  { label: 'Active Classes', value: '26',    Icon: School,     color: '#007AFF', trend: '+2' },
  { label: 'Staff Present',  value: '39/42', Icon: UserCheck,  color: '#34C759', trend: '93%' },
  { label: 'Pending Fees',   value: '₹86K',  Icon: CreditCard, color: '#FF9500', trend: '14 students' },
  { label: 'Notices Sent',   value: '9',     Icon: Megaphone,  color: '#5856D6', trend: 'This week' },
];

const TEACHER_SCHEDULE = [
  { period: '1st Period', class: 'Class 8A',  subject: 'Mathematics', status: 'ongoing',  students: 42, present: 40 },
  { period: '2nd Period', class: 'Class 9B',  subject: 'Physics',     status: 'upcoming', students: 38, present: 0  },
  { period: '3rd Period', class: 'Class 10A', subject: 'Mathematics', status: 'upcoming', students: 45, present: 0  },
  { period: '4th Period', class: 'Class 8B',  subject: 'Algebra',     status: 'upcoming', students: 40, present: 0  },
];

const RECENT_ACTIVITY = [
  { time: '09:14 AM', text: 'Rahul Sharma marked absent — Class 8A', type: 'absent', color: '#FF3B30' },
  { time: '09:02 AM', text: 'Fee paid: ₹12,500 by Priya Mehta (10B)', type: 'fee',    color: '#34C759' },
  { time: '08:55 AM', text: 'New TC request from Amit Kumar (9A)',     type: 'doc',    color: '#FF9500' },
  { time: '08:40 AM', text: 'Staff Ravi Kumar checked in at main gate', type: 'check', color: '#007AFF' },
];

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function DashboardOverview() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [user, setUser]               = useState<any>(null);
  const [query, setQuery]             = useState('');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [hoveredId, setHoveredId]     = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const s = readUserSession(); if (s) setUser(s); }, []);

  /* Skeleton */
  if (!user) return (
    <div className="w-full space-y-5 animate-fade-in pb-32">
      <div className="glass-card p-6 h-24 animate-shimmer" />
      <div className="grid grid-cols-3 gap-4">
        {[0,1,2].map(i => <div key={i} className="glass-card h-28 animate-shimmer" style={{animationDelay:`${i*80}ms`}} />)}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {[...Array(15)].map((_,i) => <div key={i} className="glass-card h-28 animate-shimmer" style={{animationDelay:`${i*40}ms`}} />)}
      </div>
    </div>
  );

  const available = MODULES.filter(m => m.allowedRoles.includes(user.role));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="w-full max-w-[1440px] mx-auto space-y-5 pb-28 animate-fade-in relative z-10">

      {/* ── Ask Vidya Copilot Drawer ───────────────────────────────────── */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.aside
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed top-0 right-0 h-full w-full md:w-[420px] z-[60] flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(48px) saturate(2)',
              WebkitBackdropFilter: 'blur(48px) saturate(2)',
              borderLeft: '1px solid rgba(255,255,255,0.90)',
              boxShadow: '-12px 0 60px rgba(0,0,0,0.10)',
            }}
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#5856D6,#007AFF)', boxShadow: '0 4px 12px rgba(88,86,214,0.35)' }}>
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1C1C1E' }}>Ask Vidya</p>
                  <p className="text-[10px] font-mono tracking-wider" style={{ color: '#AEAEB2' }}>AI INTELLIGENCE · LIVE</p>
                </div>
              </div>
              <button onClick={() => setCopilotOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'rgba(60,60,67,0.08)', color: '#6C7278' }}>
                <X size={15} />
              </button>
            </div>

            {/* query echo */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(0,122,255,0.07)', border: '1px solid rgba(0,122,255,0.14)' }}>
                <p className="text-sm font-medium leading-relaxed" style={{ color: '#007AFF' }}>"{query}"</p>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(52,199,89,0.07)', border: '1px solid rgba(52,199,89,0.15)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: 'linear-gradient(135deg,#34C759,#30B0C7)' }}>
                    <Activity size={12} className="text-white" />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#1C1C1E' }}>
                    Class 8A has <strong style={{ color: '#FF3B30' }}>2 absentees</strong> today — Rahul Sharma and Priya K. Overall school attendance is at <strong style={{ color: '#34C759' }}>94.2%</strong>, up 1.2% from yesterday. Fee collection this month stands at <strong style={{ color: '#FF9500' }}>₹1,24,000</strong> (68% of monthly target).
                  </p>
                </div>
                <button className="mt-4 flex items-center gap-1.5 text-xs font-bold transition-colors" style={{ color: '#007AFF' }}>
                  View full report <ChevronRight size={12} />
                </button>
              </div>

              {/* Absentee list */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,59,48,0.05)', border: '1px solid rgba(255,59,48,0.12)' }}>
                <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: '#FF3B30' }}>TODAY'S ABSENTEES</p>
                {[
                  { name: 'Rahul Sharma',  class: '8A', reason: 'Unnotified' },
                  { name: 'Priya K.',      class: '8A', reason: 'Sick Leave' },
                  { name: 'Aditya M.',     class: '9B', reason: 'Family Function' },
                  { name: 'Sneha Reddy',   class: '7C', reason: 'Unnotified' },
                ].map(s => (
                  <div key={s.name} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,59,48,0.08)' }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#1C1C1E' }}>{s.name}</p>
                      <p className="text-xs" style={{ color: '#6C7278' }}>Class {s.class}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,59,48,0.10)', color: '#FF3B30' }}>{s.reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* quick chips */}
            <div className="px-6 pb-8 space-y-3">
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#AEAEB2' }}>QUICK QUERIES</p>
              <div className="flex flex-wrap gap-2">
                {["Today's absentees", "Fee defaulters", "Staff on leave", "Top scorers", "Pending approvals"].map(chip => (
                  <button key={chip}
                    onClick={() => { setQuery(chip); }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{ background: 'rgba(0,122,255,0.08)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.18)' }}>
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── 1. Hero Bar ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34,1.56,0.64,1] }}
        className="glass-card p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        {/* identity */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black text-white"
              style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', boxShadow: '0 8px 24px rgba(0,122,255,0.30)' }}>
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: '#AEAEB2' }}>{greeting}</p>
            <h2 className="text-xl md:text-2xl font-black tracking-tight leading-none" style={{ color: '#1C1C1E' }}>
              {user.name.split(' ')[0]}
              <span className="ml-2 text-xs font-semibold capitalize px-2.5 py-0.5 rounded-full align-middle"
                style={{ background: 'rgba(0,122,255,0.10)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.18)' }}>
                {user.role}
              </span>
            </h2>
            <p className="text-xs font-mono mt-0.5" style={{ color: '#AEAEB2' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Ask Vidya search */}
        <div className="flex items-center gap-3 w-full md:w-auto md:max-w-[480px]">
          <form
            onSubmit={e => { e.preventDefault(); if (query.trim()) setCopilotOpen(true); }}
            className="relative flex-1"
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Sparkles size={14} style={{ color: '#5856D6' }} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Ask Vidya — "Who was absent today?"'
              className="search-glass w-full pl-10 pr-4 py-2.5 text-sm font-medium"
            />
          </form>
          <button
            onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
            className="shrink-0 px-3.5 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold tracking-wide transition-all"
            style={{ background: 'rgba(60,60,67,0.06)', border: '1px solid rgba(60,60,67,0.12)', color: '#6C7278' }}
          >
            <Globe size={13} />
            <span className="hidden sm:inline">{lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
          </button>
        </div>
      </motion.div>

      {/* ── 2a. Principal KPI Tiles ──────────────────────────────────────── */}
      {user.role === 'principal' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRINCIPAL_STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.34,1.56,0.64,1] }}
                className="hero-tile cursor-pointer p-5"
                style={{ background: s.bg }}
                onClick={() => router.push('/dashboard/analytics')}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: s.color }}>{s.label}</span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}28` }}>
                    <Icon size={15} style={{ color: s.color }} />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-3" style={{ color: '#1C1C1E' }}>{s.value}</p>
                {s.trend === 'bar' && (
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.barPct}%` }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.34,1.56,0.64,1] }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg,${s.color},${s.color}cc)` }}
                      />
                    </div>
                    <p className="text-[11px] font-bold" style={{ color: s.color }}>{s.delta} of monthly target</p>
                  </div>
                )}
                {s.trend === 'up' && (
                  <p className="text-xs font-bold flex items-center gap-1" style={{ color: s.color }}>
                    <TrendingUp size={12} /> {s.delta} from yesterday
                  </p>
                )}
                {s.trend === 'action' && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium" style={{ color: '#6C7278' }}>Require attention</p>
                    <button className="text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 transition-all"
                      style={{ background: `${s.color}14`, color: s.color, border: `1px solid ${s.color}28` }}>
                      Review <ChevronRight size={11} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── 2b. Teacher action tile ──────────────────────────────────────── */}
      {user.role === 'teacher' && (
        <div className="space-y-4">
          {/* Action banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.34,1.56,0.64,1] }}
            className="hero-tile p-5 flex items-center justify-between cursor-pointer group"
            style={{ background: 'rgba(0,122,255,0.07)' }}
            onClick={() => router.push('/dashboard/attendance')}
          >
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: '#007AFF' }}>Action Required</p>
              <h3 className="text-xl md:text-2xl font-black" style={{ color: '#1C1C1E' }}>Take 1st Period Attendance</h3>
              <p className="text-sm mt-0.5" style={{ color: '#6C7278' }}>Class 8A · 42 students · Started 9:00 AM</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
              style={{ background: 'rgba(0,122,255,0.14)', border: '1px solid rgba(0,122,255,0.22)' }}>
              <CalendarCheck size={24} style={{ color: '#007AFF' }} />
            </div>
          </motion.div>

          {/* Today's schedule */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black tracking-widest uppercase" style={{ color: '#AEAEB2' }}>Today's Schedule</p>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(0,122,255,0.08)', color: '#007AFF' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEACHER_SCHEDULE.map((slot, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: slot.status === 'ongoing' ? 'rgba(0,122,255,0.08)' : 'rgba(60,60,67,0.04)',
                    border: `1px solid ${slot.status === 'ongoing' ? 'rgba(0,122,255,0.18)' : 'rgba(60,60,67,0.08)'}`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: slot.status === 'ongoing' ? 'rgba(0,122,255,0.12)' : 'rgba(60,60,67,0.06)' }}>
                    <BookOpen size={15} style={{ color: slot.status === 'ongoing' ? '#007AFF' : '#AEAEB2' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate" style={{ color: '#1C1C1E' }}>{slot.subject}</p>
                    <p className="text-[10px] font-medium" style={{ color: '#6C7278' }}>{slot.class} · {slot.period}</p>
                  </div>
                  {slot.status === 'ongoing' && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: 'rgba(52,199,89,0.15)', color: '#34C759', border: '1px solid rgba(52,199,89,0.25)' }}>
                      LIVE
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 2c. Parent quick-view ─────────────────────────────────────────── */}
      {user.role === 'parent' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Attendance",    value: '96%',   sub: 'This month',     color: '#34C759', icon: CheckCircle2,  href: '/dashboard/parent-attendance' },
            { label: "Pending Fees",  value: '₹8,500', sub: 'Due 15 Jun',    color: '#FF9500', icon: Banknote,      href: '/dashboard/fees' },
            { label: "Homework",      value: '3 Due', sub: 'Submit by tomorrow', color: '#5856D6', icon: BookOpen, href: '/dashboard/homework' },
            { label: "New Notices",   value: '2 New', sub: 'Unread',         color: '#FF2D55', icon: Bell,          href: '/dashboard/notices' },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                className="hero-tile p-4 cursor-pointer"
                style={{ background: `${kpi.color}0A` }}
                onClick={() => router.push(kpi.href)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                    style={{ background: `${kpi.color}18` }}>
                    <Icon size={13} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: kpi.color }}>{kpi.label}</p>
                </div>
                <p className="text-xl font-black tracking-tight" style={{ color: '#1C1C1E' }}>{kpi.value}</p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: '#6C7278' }}>{kpi.sub}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── 3. Module Grid ────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="section-label">Quick Access</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {available.map((mod, i) => {
            const Icon = mod.icon;
            const isHovered = hoveredId === mod.id;
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.025, duration: 0.4, ease: [0.34,1.56,0.64,1] }}
                className="module-tile flex flex-col items-center gap-2 p-3 md:p-4"
                onMouseEnter={() => setHoveredId(mod.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => router.push(mod.href)}
              >
                <div className="relative w-13 h-13 md:w-16 md:h-16 shrink-0">
                  <div
                    className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 40%, ${mod.accentHex}28 0%, transparent 70%)`,
                      opacity: isHovered ? 1 : 0,
                    }}
                  />
                  <Icon />
                  {mod.badge && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-white px-1"
                      style={{ background: '#FF3B30', boxShadow: '0 2px 8px rgba(255,59,48,0.45)' }}>
                      {mod.badge}
                    </div>
                  )}
                  {mod.id === 'salary' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(0,0,0,0.08)' }}>
                      <Lock size={9} style={{ color: '#6C7278' }} />
                    </div>
                  )}
                </div>
                <span
                  className="text-[10px] md:text-[11px] font-bold text-center leading-tight w-full px-0.5 transition-colors duration-200"
                  style={{
                    minHeight: '2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isHovered ? '#1C1C1E' : '#3C3C43',
                  }}
                >
                  {mod.title}
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: isHovered ? mod.accentHex : 'transparent',
                    boxShadow: isHovered ? `0 0 8px ${mod.accentHex}` : 'none',
                    transform: isHovered ? 'scale(1)' : 'scale(0)',
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Principal Intelligence Strip ──────────────────────────────── */}
      {user.role === 'principal' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="glass-card p-5 md:p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#FFCC00,#FF9500)', boxShadow: '0 4px 14px rgba(255,149,0,0.30)' }}>
                <Zap size={15} style={{ color: 'rgba(0,0,0,0.75)' }} />
              </div>
              <div>
                <p className="text-sm font-black" style={{ color: '#1C1C1E' }}>Principal Intelligence</p>
                <p className="text-[10px] font-mono tracking-wider" style={{ color: '#AEAEB2' }}>LIVE · AUTO-REFRESH 5 MIN</p>
              </div>
            </div>
            <button
              onClick={() => { setQuery("Show me today's full summary"); setCopilotOpen(true); }}
              className="btn-gold hidden sm:flex text-xs"
            >
              <Sparkles size={12} /> Ask Vidya
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PRINCIPAL_INTELLIGENCE.map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.4, ease: [0.34,1.56,0.64,1] }}
                className="rounded-2xl p-3.5 space-y-2 cursor-pointer group transition-all hover:scale-[1.03]"
                style={{ background: `${kpi.color}0A`, border: `1px solid ${kpi.color}1A` }}
                onClick={() => router.push('/dashboard/analytics')}
              >
                <div className="flex items-center justify-between">
                  <kpi.Icon size={18} style={{ color: kpi.color }} />
                  <ArrowUpRight size={12} style={{ color: `${kpi.color}60` }} className="group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-2xl font-black tracking-tight" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>{kpi.label}</p>
                <p className="text-[10px] font-medium" style={{ color: kpi.color + 'CC' }}>{kpi.trend}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent activity feed */}
          <div className="space-y-2 pt-2" style={{ borderTop: '1px solid rgba(60,60,67,0.07)' }}>
            <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#AEAEB2' }}>Recent Activity</p>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
                <p className="flex-1 text-xs" style={{ color: '#3C3C43' }}>{a.text}</p>
                <span className="text-[10px] font-mono shrink-0" style={{ color: '#AEAEB2' }}>{a.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── 5. Teacher stats strip ───────────────────────────────────────── */}
      {user.role === 'teacher' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-5 space-y-3"
        >
          <p className="text-xs font-black tracking-widest uppercase" style={{ color: '#AEAEB2' }}>Your Stats Today</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Classes Done',   value: '1 / 4', color: '#007AFF', icon: CheckCircle2 },
              { label: 'Homework Due',   value: '12 Submissions', color: '#5856D6', icon: BookOpen },
              { label: 'Avg Attendance', value: '95.8%', color: '#34C759', icon: Users },
              { label: 'Leave Requests', value: '2 Pending', color: '#FF9500', icon: AlertCircle },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="rounded-2xl p-3.5 space-y-1"
                  style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
                  <Icon size={14} style={{ color: s.color }} />
                  <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>{s.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── 6. Parent child summary ──────────────────────────────────────── */}
      {user.role === 'parent' && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)' }}>
                <GraduationCap size={15} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-black" style={{ color: '#1C1C1E' }}>Aryan Sharma</p>
                <p className="text-[10px] font-mono" style={{ color: '#AEAEB2' }}>Class 8A · Roll No. 14</p>
              </div>
            </div>
            <button onClick={() => router.push('/dashboard/students')}
              className="text-xs font-bold flex items-center gap-1"
              style={{ color: '#007AFF' }}>
              Full Profile <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Attendance',  value: '96%',  color: '#34C759', bar: 96 },
              { label: 'Avg Score',   value: '82%',  color: '#007AFF', bar: 82 },
              { label: 'Homework',    value: '88%',  color: '#5856D6', bar: 88 },
            ].map((m, i) => (
              <div key={i} className="rounded-xl p-3 space-y-2"
                style={{ background: `${m.color}0A`, border: `1px solid ${m.color}1A` }}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>{m.label}</p>
                <p className="text-xl font-black" style={{ color: m.color }}>{m.value}</p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${m.bar}%` }}
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-3.5 flex items-center gap-2" style={{ background: 'rgba(255,204,0,0.08)', border: '1px solid rgba(255,204,0,0.20)' }}>
            <Pin size={12} style={{ color: '#FF9500', flexShrink: 0 }} />
            <p className="text-xs font-black" style={{ color: '#FF9500' }}>Next Exam: Unit Test 3 — Mathematics on {new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
