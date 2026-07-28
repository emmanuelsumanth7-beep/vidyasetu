'use client';

import { useRouter } from 'next/navigation';
import { SocketProvider } from '@/components/SocketProvider';
import { useEffect, useState } from 'react';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNav } from '@/components/layout/MobileNav';
import { clearUserSession, readUserSession, type ClientUser } from '@/lib/session';
import { SchoolConfig } from '@/config/school.config';
import { NotificationBell } from '@/components/NotificationBell';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  Bell, 
  BookOpen, 
  CheckSquare, 
  CalendarClock, 
  Bus, 
  BarChart, 
  MessageSquare,
  Award,
  BookMarked,
  LogOut,
  RefreshCw,
  CalendarDays,
  Settings,
  type LucideIcon
} from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user] = useState<ClientUser | null>(() => readUserSession());

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  // Auto-sync when internet is restored
  useEffect(() => {
    const handleOnline = () => {
      console.log('Internet connected. Auto-syncing data...');
      window.location.reload();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    clearUserSession();
    router.push('/');
  };

  if (!user) return <div className="h-screen w-full flex items-center justify-center font-data" style={{color:'#AEAEB2'}}>Loading workspace…</div>;

  // Role-based Navigation mapping (100% Synced with Quick Access Grid)
  let navItems: NavItem[] = [];
  if (user.role === 'principal' || user.role === 'admin') {
    navItems = [
      { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Students', href: '/dashboard/students', icon: GraduationCap },
      { name: 'Classes', href: '/dashboard/classes', icon: CalendarClock },
      { name: 'Grades', href: '/dashboard/grades', icon: Award },
      { name: 'Staff', href: '/dashboard/staff', icon: Users },
      { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
      { name: 'Staff Leaves', href: '/dashboard/leaves', icon: CalendarDays },
      { name: 'Payroll', href: '/dashboard/payroll', icon: CreditCard },
      { name: 'Expenses', href: '/dashboard/expenses', icon: BarChart },
      { name: 'Fees', href: '/dashboard/fees', icon: CreditCard },
      { name: 'Transport', href: '/dashboard/transport', icon: Bus },
      { name: 'Approvals', href: '/dashboard/approvals', icon: CheckSquare },
      { name: 'Notices', href: '/dashboard/notices', icon: Bell },
      { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
      { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
      { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];
  } else if (user.role === 'teacher' || user.role === 'staff' || user.role === 'clerk') {
    navItems = [
      { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Students', href: '/dashboard/students', icon: GraduationCap },
      { name: 'Classes', href: '/dashboard/classes', icon: CalendarClock },
      { name: 'Grades', href: '/dashboard/grades', icon: Award },
      { name: 'Homework', href: '/dashboard/homework', icon: BookOpen },
      { name: 'Class Diary', href: '/dashboard/diary', icon: BookMarked },
      { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
      { name: 'Staff Leaves', href: '/dashboard/leaves', icon: CalendarDays },
      { name: 'Approvals', href: '/dashboard/approvals', icon: CheckSquare },
      { name: 'Notices', href: '/dashboard/notices', icon: Bell },
      { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
      { name: 'Expenses', href: '/dashboard/expenses', icon: BarChart },
      { name: 'Transport', href: '/dashboard/transport', icon: Bus },
      { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
      { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
    ];
  } else if (user.role === 'parent' || user.role === 'student') {
    navItems = [
      { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Attendance', href: '/dashboard/parent-attendance', icon: Calendar },
      { name: 'Homework', href: '/dashboard/homework', icon: BookOpen },
      { name: 'Class Diary', href: '/dashboard/diary', icon: BookMarked },
      { name: 'Grades', href: '/dashboard/grades', icon: Award },
      { name: 'Fees', href: '/dashboard/fees', icon: CreditCard },
      { name: 'Transport', href: '/dashboard/transport', icon: Bus },
      { name: 'Notices', href: '/dashboard/notices', icon: Bell },
      { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
      { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
    ];
  }

  return (
    <SocketProvider>
      {/* Root container — transparent so body blobs show through */}
      <div className="flex h-screen overflow-hidden" style={{ background: 'transparent' }}>

        {/* Desktop Floating Glass Nav */}
        <FloatingNav navItems={navItems} user={user} onSignOut={handleSignOut} />

        {/* Main content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative md:ml-[100px]">

          {/* Mobile glass topbar */}
          <header
            className="md:hidden flex items-center justify-between px-4 h-14 shrink-0 relative z-10 w-full"
            style={{
              background: 'var(--nav-bg)',
              backdropFilter: 'blur(32px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
              borderBottom: '1px solid var(--nav-border)',
            }}
          >
            <div className="flex items-center gap-2.5">
              {SchoolConfig.logoPath ? (
                <img src={SchoolConfig.logoPath} alt="Logo" className="w-8 h-8 rounded-xl object-contain" />
              ) : (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg,#1B2A4A,#C49B2A)', boxShadow: '0 4px 12px rgba(27,42,74,0.30)' }}
                >
                  <BookOpen size={14} />
                </div>
              )}
              <span className="font-black text-lg tracking-tight truncate max-w-[130px]" style={{ color: 'var(--color-text-primary)' }}>
                {SchoolConfig.shortName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(27,42,74,0.10)', color: '#1B2A4A', border: '1px solid rgba(27,42,74,0.18)' }}
              >
                {user.role}
              </span>
              <ThemeToggle />
              <button
                onClick={handleSignOut}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ color: 'var(--nav-icon-inactive)', background: 'var(--color-glass)' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          </header>

          {/* Scrollable main */}
          <main
            className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 md:px-10 md:py-10 relative w-full overflow-x-hidden"
            style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
          >
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>

        {/* Desktop Top Right Controls */}
        <div className="hidden md:flex fixed top-8 right-10 z-50 items-center gap-4">
          <NotificationBell />
          <ThemeToggle />
        </div>

        {/* Global Floating Refresh Button */}
        <button
          onClick={handleRefresh}
          className="fixed bottom-24 md:bottom-10 right-4 md:right-10 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group"
          style={{ 
            background: 'linear-gradient(135deg, #1B2A4A, #2A4A7A)',
            boxShadow: '0 8px 24px rgba(27,42,74,0.40), 0 1px 0 rgba(255,255,255,0.15) inset'
          }}
          title="Force Sync / Refresh"
        >
          <RefreshCw size={18} className="group-active:animate-spin" />
        </button>

        {/* Mobile bottom nav */}
        <MobileNav navItems={navItems} />

      </div>
    </SocketProvider>
  );
}
