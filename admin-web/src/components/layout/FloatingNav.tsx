import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Shield, LogOut, Phone, Mail, BookOpen } from 'lucide-react';
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
    function outside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  return (
    <nav
      className="hidden md:flex flex-col items-center py-5 px-3 fixed left-4 top-1/2 -translate-y-1/2 z-50 max-h-[90vh] rounded-[28px] glass-nav"
    >
      {/* Brand logo */}
      <div
        className="w-11 h-11 mb-7 rounded-2xl flex items-center justify-center text-white shrink-0"
        style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', boxShadow: '0 6px 20px rgba(0,122,255,0.35)' }}
      >
        <BookOpen size={19} />
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} title={item.name} className="relative group">
              {isActive && (
                <motion.div
                  layoutId="glass-nav-active"
                  className="absolute inset-0 rounded-xl -z-10"
                  style={{
                    background: 'rgba(0,122,255,0.12)',
                    border: '1px solid rgba(0,122,255,0.22)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ color: isActive ? '#007AFF' : '#AEAEB2' }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = '#6C7278'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = '#AEAEB2'; }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              {/* Tooltip */}
              <div
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap pointer-events-none z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(20px)',
                  color: '#1C1C1E',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                }}
              >
                {item.name}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4"
                  style={{ borderRightColor: 'rgba(255,255,255,0.92)' }} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* User section */}
      <div
        className="mt-6 pt-5 flex flex-col gap-3 items-center shrink-0 relative"
        style={{ borderTop: '1px solid rgba(60,60,67,0.10)' }}
        ref={profileRef}
      >
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white transition-all"
          style={{
            background: showProfile ? 'linear-gradient(135deg,#007AFF,#5856D6)' : 'rgba(0,122,255,0.10)',
            border: '1px solid rgba(0,122,255,0.20)',
            color: showProfile ? '#fff' : '#007AFF',
            boxShadow: showProfile ? '0 6px 20px rgba(0,122,255,0.30)' : 'none',
          }}
        >
          {user.name.charAt(0)}
        </button>

        {/* Profile popover */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, x: -12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute left-[calc(100%+14px)] bottom-12 w-60 rounded-2xl p-5 z-50 flex flex-col gap-4"
              style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(40px) saturate(1.8)',
                border: '1px solid rgba(255,255,255,0.90)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,1) inset',
              }}
            >
              <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1px solid rgba(60,60,67,0.08)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
                  style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', boxShadow: '0 4px 14px rgba(0,122,255,0.30)' }}>
                  {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate" style={{ color: '#1C1C1E' }}>{user.name}</p>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-0.5 inline-block"
                    style={{ background: 'rgba(0,122,255,0.10)', color: '#007AFF', border: '1px solid rgba(0,122,255,0.18)' }}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {user.phoneNumber && (
                  <div className="flex items-center gap-2.5 text-xs" style={{ color: '#6C7278' }}>
                    <Phone size={13} style={{ color: '#AEAEB2' }} /> {user.phoneNumber}
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-2.5 text-xs" style={{ color: '#6C7278' }}>
                    <Mail size={13} style={{ color: '#AEAEB2' }} />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-xs" style={{ color: '#34C759' }}>
                  <Shield size={13} /> Identity Verified
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onSignOut}
          title="Sign Out"
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{ color: '#AEAEB2', border: '1px solid transparent' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = '#FF3B30';
            el.style.background = 'rgba(255,59,48,0.08)';
            el.style.borderColor = 'rgba(255,59,48,0.18)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = '#AEAEB2';
            el.style.background = 'transparent';
            el.style.borderColor = 'transparent';
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
