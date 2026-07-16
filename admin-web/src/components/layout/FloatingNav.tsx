import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Shield, LogOut, User, Phone, Mail, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingNavProps {
  navItems: { name: string; href: string; icon: any }[];
  user: { name: string; role: string; phoneNumber?: string; email?: string };
  onSignOut: (e: React.MouseEvent) => void;
}

export function FloatingNav({ navItems, user, onSignOut }: FloatingNavProps) {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="hidden md:flex flex-col items-center py-6 px-4 fixed left-6 top-1/2 -translate-y-1/2 bg-white shadow-2xl z-50 rounded-[32px] border border-gray-100 max-h-[85vh]">
      
      {/* Brand Icon */}
      <div className="w-12 h-12 mb-8 rounded-full bg-ink-primary flex items-center justify-center text-sheet shadow-sm shrink-0">
        <Shield size={22} />
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} title={item.name} className="relative group">
              {isActive && (
                <motion.div
                  layoutId="floating-active-indicator"
                  className="absolute inset-0 bg-hover-subtle rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isActive ? 'text-interactive-blue' : 'text-ink-secondary group-hover:text-ink-primary group-hover:bg-canvas'}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-ink-primary text-sheet text-xs font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                {item.name}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-ink-primary" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* User & Logout */}
      <div className="mt-8 pt-6 border-t border-border-draft flex flex-col gap-4 items-center shrink-0 relative" ref={profileRef}>
        <button 
          onClick={() => setShowProfile(!showProfile)}
          className="w-10 h-10 rounded-full bg-hover-subtle border border-border-draft flex items-center justify-center text-ink-primary font-bold font-display hover:shadow-md hover:bg-interactive-blue/10 transition-all cursor-pointer"
        >
          {user.name.charAt(0)}
        </button>
        
        {/* Profile Popover */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-[calc(100%+24px)] bottom-12 w-72 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 z-50 flex flex-col gap-4"
            >
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xl flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-gray-900 truncate" title={user.name}>{user.name}</h4>
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {user.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Award size={16} className="text-gray-400" />
                  <span>Verified Identity</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={onSignOut}
          className="w-12 h-12 rounded-full flex items-center justify-center text-ink-secondary hover:text-structural-red hover:bg-[#FCEAE8] transition-colors"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
