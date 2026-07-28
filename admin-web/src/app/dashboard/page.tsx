'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { readUserSession } from '@/lib/session';
import { SchoolConfig } from '@/config/school.config';
import { Info, ChevronRight, Lock, Sparkles, TrendingUp, Users, Calendar, CreditCard, Bus, BarChart3, Settings as SettingsIcon, BookOpen, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  FeePaymentIcon, ProfileIcon, RemarksIcon, AbsentInfoIcon,
  StudyMaterialIcon, NotificationIcon, CalendarIcon,
  BiometricsIcon, GradesIcon, SystemIcon, DocumentIcon,
  ClassCompletedIcon, DocumentInfoIcon, AttendanceIcon, StaffIcon
} from '@/components/GridIcons';

/* ─── Module Registry (100% Synchronized with Floating & Mobile Nav Bar) ───────────────────── */
interface Module {
  id: string;
  title: string;
  icon: React.ComponentType<{size?: string | number, color?: string, strokeWidth?: string | number}>;
  href: string;
  accentHex: string;
  allowedRoles: string[];
  badge?: string;
  category?: string;
}

const MODULES: Module[] = [
  // Academics
  { id: 'students',         title: 'Students',     icon: ProfileIcon,        href: '/dashboard/students',       accentHex: '#1B2A4A', allowedRoles: ['principal','teacher','clerk','staff'], category: 'Academics' },
  { id: 'class_completed',  title: 'Classes',      icon: ClassCompletedIcon, href: '/dashboard/classes',        accentHex: '#34C759', allowedRoles: ['principal','teacher','staff'], category: 'Academics' },
  { id: 'exam_marks',       title: 'Grades',       icon: GradesIcon,         href: '/dashboard/grades',         accentHex: '#FF9500', allowedRoles: ['principal','teacher','staff','student','parent'], category: 'Academics' },
  { id: 'study_material',   title: 'Study Mat.',   icon: StudyMaterialIcon,  href: '/dashboard/study-material', accentHex: '#5AC8FA', allowedRoles: ['principal','teacher','staff'], category: 'Academics' },
  { id: 'homework',         title: 'Homework',     icon: BookOpen,           href: '/dashboard/homework',       accentHex: '#30B0C7', allowedRoles: ['principal','teacher','staff','parent','student'], category: 'Academics' },
  { id: 'diary',            title: 'Class Diary',  icon: BookMarked,         href: '/dashboard/diary',          accentHex: '#FF2D55', allowedRoles: ['principal','teacher','staff','parent'], category: 'Academics' },
  { id: 'calendar',         title: 'Calendar',     icon: CalendarIcon,       href: '/dashboard/calendar',       accentHex: '#AF52DE', allowedRoles: ['principal','teacher','staff','parent','student','clerk'], category: 'Academics' },

  // Staff & HR
  { id: 'staff',            title: 'Staff Directory', icon: StaffIcon,       href: '/dashboard/staff',          accentHex: '#C49B2A', allowedRoles: ['principal','clerk','staff'], category: 'Staff & HR' },
  { id: 'attendance',       title: 'Attendance',   icon: AttendanceIcon,     href: '/dashboard/attendance',     accentHex: '#30B0C7', allowedRoles: ['principal','teacher','staff'], category: 'Staff & HR' },
  { id: 'parent_attd',      title: 'My Attendance', icon: AttendanceIcon,    href: '/dashboard/parent-attendance', accentHex: '#34C759', allowedRoles: ['parent','student'], category: 'Academics' },
  { id: 'leaves',           title: 'Staff Leaves', icon: CalendarIcon,       href: '/dashboard/leaves',         accentHex: '#FF9500', allowedRoles: ['principal','teacher','staff','clerk'], category: 'Staff & HR' },
  { id: 'staff_attendance', title: 'Biometrics',   icon: BiometricsIcon,     href: '/dashboard/attendance',     accentHex: '#1B2A4A', allowedRoles: ['principal','clerk','staff'], category: 'Staff & HR' },

  // Finance & Analytics
  { id: 'finance',          title: 'Fee Collection', icon: FeePaymentIcon,   href: '/dashboard/fees',           accentHex: '#34C759', allowedRoles: ['principal','clerk','staff','parent'], category: 'Finance & Analytics' },
  { id: 'salary',           title: 'Payroll',      icon: SystemIcon,         href: '/dashboard/payroll',        accentHex: '#FFCC00', allowedRoles: ['principal','teacher','clerk','staff','counselor'], category: 'Finance & Analytics' },
  { id: 'expenses',         title: 'Expenses',     icon: BarChart3,          href: '/dashboard/expenses',       accentHex: '#FF3B30', allowedRoles: ['principal','clerk','staff'], category: 'Finance & Analytics' },
  { id: 'analytics',        title: 'Analytics',    icon: TrendingUp,         href: '/dashboard/analytics',      accentHex: '#5AC8FA', allowedRoles: ['principal','staff'], category: 'Finance & Analytics' },

  // Operations & Administration
  { id: 'transport',        title: 'Transport',    icon: Bus,                href: '/dashboard/transport',      accentHex: '#FF9500', allowedRoles: ['principal','clerk','staff','parent'], category: 'Operations' },
  { id: 'document_info',    title: 'Approvals',    icon: DocumentInfoIcon,   href: '/dashboard/approvals',      accentHex: '#AF52DE', allowedRoles: ['principal','teacher','clerk','staff','parent','student'], badge: '3', category: 'Operations' },
  { id: 'notifications',    title: 'Notices',      icon: NotificationIcon,   href: '/dashboard/notices',        accentHex: '#FF2D55', allowedRoles: ['principal','teacher','clerk','staff','parent'], badge: '5', category: 'Operations' },
  { id: 'office_print',     title: 'Certificates', icon: DocumentIcon,       href: '/dashboard/certificates',   accentHex: '#C49B2A', allowedRoles: ['principal','clerk','staff'], category: 'Operations' },
  { id: 'chat',             title: 'Messages',     icon: RemarksIcon,        href: '/dashboard/messages',       accentHex: '#30B0C7', allowedRoles: ['principal','teacher','staff','student','parent'], category: 'Operations' },
  { id: 'settings',         title: 'Settings',     icon: SettingsIcon,       href: '/dashboard/settings',       accentHex: '#6C7278', allowedRoles: ['principal','staff','admin'], category: 'Operations' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️';
  if (hour < 17) return '🌤️';
  return '🌙';
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 350 } }
};

export default function DashboardOverview() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [user, setUser] = useState<any>(null);

  useEffect(() => { const s = readUserSession(); if (s) setUser(s); }, []);

  if (!user) return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      <div className="animate-pulse-soft flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[var(--color-glass-2)]" />
        <span className="text-[var(--color-text-tertiary)] text-sm font-medium">Loading workspace…</span>
      </div>
    </div>
  );

  const available = MODULES.filter(m => m.allowedRoles.includes(user.role));
  const featured = available.slice(0, 2);
  const gridModules = available.slice(2);

  // Group by category
  const categories = [...new Set(gridModules.map(m => m.category || 'Other'))];

  const quickStats = [
    { label: 'Students', value: '1,245', icon: Users, color: '#1B2A4A' },
    { label: 'Attendance', value: '94.2%', icon: TrendingUp, color: '#34C759' },
    { label: 'Events', value: '8', icon: Calendar, color: '#AF52DE' },
    { label: 'Pending', value: '₹2.4L', icon: CreditCard, color: '#FF9500' },
  ];

  return (
    <div className="w-full min-h-screen bg-transparent pb-24 font-sans selection:bg-blue-100">
      
      {/* ── PREMIUM GREETING HEADER ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="px-4 pt-2 pb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--color-text-tertiary)] text-xs font-bold uppercase tracking-widest">
              {getGreetingEmoji()} {getGreeting()}
            </p>
            <h1 className="text-[var(--color-text-primary)] text-2xl font-black tracking-tight mt-0.5">
              {user.name}
            </h1>
            <p className="text-[var(--color-text-secondary)] text-[12px] mt-0.5 font-medium">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {SchoolConfig.shortName}
            </p>
          </div>
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0"
            style={{ 
              background: 'linear-gradient(135deg, #1B2A4A, #2A4A7A)', 
              boxShadow: '0 6px 20px rgba(27,42,74,0.35)' 
            }}
          >
            {user.name.charAt(0)}
          </div>
        </div>
      </motion.div>

      {/* ── QUICK STATS STRIP ── */}
      {(user.role === 'principal' || user.role === 'admin') && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 mb-4"
        >
          <div className="grid grid-cols-4 gap-2">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label} 
                  className="glass-card p-3 text-center group"
                  style={{ '--tile-color': `${stat.color}15` } as React.CSSProperties}
                >
                  <div className="flex items-center justify-center mb-1.5">
                    <Icon size={14} style={{ color: stat.color }} />
                  </div>
                  <p className="text-[var(--color-text-primary)] font-black text-[15px] leading-none tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[var(--color-text-tertiary)] text-[9px] font-bold uppercase tracking-widest mt-1">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── ACTION REQUIRED ALERT ── */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="px-4 pb-3"
      >
        <div 
          className="glass-card p-4 flex items-center gap-4 cursor-pointer group"
          onClick={() => router.push('/dashboard/approvals')}
          style={{ '--tile-color': 'rgba(255,45,85,0.08)' } as React.CSSProperties}
        >
          <div 
            className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF2D55, #FF6B8A)', boxShadow: '0 4px 14px rgba(255,45,85,0.30)' }}
          >
            <Sparkles size={18} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[var(--color-text-primary)] font-bold text-[14px] leading-tight">
              Action Required
            </h3>
            <p className="text-[var(--color-text-secondary)] text-[12px] mt-0.5 leading-tight truncate">
              You have pending approvals requiring attention
            </p>
          </div>
          <ChevronRight size={16} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-colors shrink-0" />
        </div>
      </motion.div>

      {/* ── FEATURED TOP ROW ── */}
      {featured.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 mb-2"
        >
          <div className="grid grid-cols-2 gap-3">
            {featured.map((mod) => (
              <div 
                key={mod.id} 
                onClick={() => router.push(mod.href)}
                className="glass-card p-4 flex items-center gap-3 cursor-pointer group"
                style={{ '--tile-color': `${mod.accentHex}10` } as React.CSSProperties}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-[var(--color-text-primary)] font-bold text-[14px] leading-tight">{mod.title}</h4>
                  <p className="text-[var(--color-text-tertiary)] text-[10px] mt-1 font-semibold uppercase tracking-wider">{mod.category}</p>
                </div>
                <div 
                  className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center"
                  style={{ background: `${mod.accentHex}12`, border: `1px solid ${mod.accentHex}20` }}
                >
                  <mod.icon />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── MODULE GRID BY CATEGORY ── */}
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="px-4 mt-4"
      >
        {categories.map((cat) => {
          const mods = gridModules.filter(m => (m.category || 'Other') === cat);
          return (
            <div key={cat} className="mb-6">
              <div className="section-label mb-3 px-1">
                {cat}
              </div>
              <div className="grid grid-cols-4 gap-x-2 gap-y-5">
                {mods.map((mod) => (
                  <motion.div 
                    key={mod.id}
                    variants={itemVariants}
                    onClick={() => router.push(mod.href)}
                    className="flex flex-col items-center cursor-pointer active:scale-90 transition-transform relative group"
                  >
                    <div 
                      className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center relative transition-all duration-200 group-hover:scale-105"
                      style={{ 
                        background: `${mod.accentHex}10`, 
                        border: `1px solid ${mod.accentHex}18`,
                        boxShadow: `0 4px 12px ${mod.accentHex}08`
                      }}
                    >
                      <mod.icon />
                      {mod.badge && (
                        <div className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#FF2D55] rounded-full border-2 border-[var(--surface)] flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                          {mod.badge}
                        </div>
                      )}
                      {mod.id === 'salary' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--surface)] border border-[var(--color-border)] rounded-full flex items-center justify-center shadow-sm">
                          <Lock size={9} className="text-[var(--color-text-tertiary)]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[var(--color-text-primary)] font-semibold text-[11px] mt-2 text-center leading-tight max-w-[64px] break-words">
                      {mod.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ── PROFILE CARD ── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="px-4 mt-2"
      >
        <div 
          className="glass-card flex items-center justify-between p-4 cursor-pointer"
          onClick={() => router.push('/dashboard/settings')}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #1B2A4A, #C49B2A)', boxShadow: '0 4px 14px rgba(27,42,74,0.25)' }}
            >
              {user.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-[var(--color-text-primary)] font-bold text-[14px] leading-tight">{user.name}</h4>
              <p className="text-[var(--color-text-secondary)] text-[12px]">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {SchoolConfig.shortName}
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[var(--color-text-tertiary)]" />
        </div>
      </motion.div>

    </div>
  );
}
