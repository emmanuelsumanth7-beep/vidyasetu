'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SocketProvider } from '@/components/SocketProvider';
import { useEffect, useState } from 'react';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { MobileNav } from '@/components/layout/MobileNav';
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
  LogOut
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
    } else {
      setUser(JSON.parse(userStr));
    }
  }, [router]);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div className="h-screen w-full flex items-center justify-center text-ink-secondary bg-canvas font-data">Loading workspace...</div>;

  // Role-based Navigation mapping
  let navItems: any[] = [];
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
  } else if (user.role === 'teacher') {
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
      <div className="flex h-screen bg-canvas overflow-hidden">
        
        {/* Desktop Floating Pill Navigation */}
        <FloatingNav navItems={navItems} user={user} onSignOut={handleSignOut} />
        
        {/* Main Content Area */}
        {/* On desktop, we add md:ml-[120px] to clear the fixed floating nav dock */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative md:ml-[120px]">
          
          {/* Topbar for Mobile */}
          <header className="md:hidden flex items-center justify-between px-4 h-16 bg-white shrink-0 shadow-sm relative z-10">
            <span className="font-bold text-xl tracking-tight text-ink-primary font-display">Vidya Setu</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-interactive-blue uppercase tracking-wider">{user.role}</span>
              <div className="w-9 h-9 rounded-full bg-hover-subtle flex items-center justify-center text-ink-primary font-bold">
                {user.name.charAt(0)}
              </div>
              <button onClick={handleSignOut} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </header>

          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-24 md:pb-10 relative">
            
            {/* Desktop Top Area: Title & Greeting. 
                Instead of a full-width header bar, it's just content placed directly on the canvas. */}
            <div className="hidden md:flex items-end justify-between mb-10 pb-4 border-b-2 border-border-draft">
              <h1 className="text-4xl font-bold text-ink-primary font-display tracking-tight">Workspace</h1>
              <div className="text-sm font-data text-ink-secondary flex items-center gap-4">
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="text-interactive-blue font-bold">
                  ● Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user.name.split(' ')[0]}
                </span>
                <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 ml-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-full font-bold transition-colors shadow-sm">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>

            <div className="w-full">
              {children}
            </div>
          </main>
          
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav navItems={navItems} />

      </div>
    </SocketProvider>
  );
}
