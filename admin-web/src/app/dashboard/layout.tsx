'use client';

import { useRouter } from 'next/navigation';
import { SocketProvider } from '@/components/SocketProvider';
import { useEffect, useState } from 'react';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { MobileNav } from '@/components/layout/MobileNav';
import { clearUserSession, readUserSession, type ClientUser } from '@/lib/session';
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
  Settings,
  MessageSquare,
  Award,
  BookMarked,
  LogOut,
  RefreshCw,
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

  // Role-based Navigation mapping
  let navItems: NavItem[] = [];
  if (user.role === 'principal' || user.role === 'admin') {
    navItems = [
      { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Payroll', href: '/dashboard/payroll', icon: CreditCard },
      { name: 'Expenses', href: '/dashboard/expenses', icon: BarChart },
      { name: 'Staff Leaves', href: '/dashboard/leaves', icon: Calendar },
      { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
      { name: 'Students', href: '/dashboard/students', icon: GraduationCap },
      { name: 'Staff', href: '/dashboard/staff', icon: Users },
      { name: 'Classes', href: '/dashboard/classes', icon: CalendarClock },
      { name: 'Fees', href: '/dashboard/fees', icon: CreditCard },
      { name: 'Notices', href: '/dashboard/notices', icon: Bell },
      { name: 'Transport', href: '/dashboard/transport', icon: Bus },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];
  } else if (user.role === 'teacher' || user.role === 'staff') {
    navItems = [
      { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Approvals', href: '/dashboard/approvals', icon: CheckSquare },
      { name: 'Classes', href: '/dashboard/classes', icon: Users },
      { name: 'Timetable', href: '/dashboard/classes', icon: CalendarClock },
      { name: 'Homework', href: '/dashboard/homework', icon: BookOpen },
      { name: 'Notices', href: '/dashboard/notices', icon: MessageSquare },
    ];
  } else if (user.role === 'clerk') {
    navItems = [
      { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Students', href: '/dashboard/students', icon: Users },
      { name: 'Fees', href: '/dashboard/fees', icon: CreditCard },
      { name: 'Approvals', href: '/dashboard/approvals', icon: CheckSquare },
      { name: 'Notices', href: '/dashboard/notices', icon: Bell },
    ];
  } else if (user.role === 'parent') {
    navItems = [
      { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Attendance', href: '/dashboard/parent-attendance', icon: Calendar },
      { name: 'Homework', href: '/dashboard/homework', icon: BookOpen },
      { name: 'Diary', href: '/dashboard/diary', icon: BookMarked },
      { name: 'Grades', href: '/dashboard/grades', icon: Award },
      { name: 'Fees', href: '/dashboard/fees', icon: CreditCard },
      { name: 'Notices', href: '/dashboard/notices', icon: Bell },
      { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    ];
  } else if (user.role === 'student') {
    navItems = [
      { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Homework', href: '/dashboard/homework', icon: BookOpen },
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
              background: 'rgba(242,242,247,0.80)',
              backdropFilter: 'blur(32px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
              borderBottom: '1px solid rgba(60,60,67,0.10)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.80) inset',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', boxShadow: '0 4px 12px rgba(0,122,255,0.30)' }}
              >
                <BookOpen size={14} />
              </div>
              <span className="font-black text-lg tracking-tight truncate max-w-[130px]" style={{ color: '#1C1C1E' }}>
                Vidya Setu
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,122,255,0.10)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.18)' }}
              >
                {user.role}
              </span>
              <button
                onClick={handleSignOut}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ color: '#6C7278', background: 'rgba(60,60,67,0.06)' }}
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

        {/* Global Floating Refresh Button */}
        <button
          onClick={handleRefresh}
          className="fixed bottom-24 md:bottom-10 right-4 md:right-10 bg-interactive-blue text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all z-50 group"
          title="Force Sync / Refresh"
        >
          <RefreshCw size={20} className="group-active:animate-spin" />
        </button>

        {/* Mobile bottom nav */}
        <MobileNav navItems={navItems} />

      </div>
    </SocketProvider>
  );
}
