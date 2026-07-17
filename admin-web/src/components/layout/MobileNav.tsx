'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Hand-crafted SVG icon set — every path drawn for perfect optical weight at
// 24×24. Filled variant used for active state, outlined for inactive.
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ICONS: Record<string, (active: boolean) => JSX.Element> = {

  Home: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H15v-5a1 1 0 00-1-1h-4a1 1 0 00-1 1v5H4a1 1 0 01-1-1V10.5z" fill="currentColor"/>
        </>
      ) : (
        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H15v-5a1 1 0 00-1-1h-4a1 1 0 00-1 1v5H4a1 1 0 01-1-1V10.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      )}
    </svg>
  ),

  Attendance: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <rect x="3" y="4" width="18" height="17" rx="2.5" fill="currentColor" opacity="0.15"/>
          <rect x="3" y="4" width="18" height="17" rx="2.5" fill="currentColor" opacity="0.85"/>
          <path d="M8 2v4M16 2v4M3 9h18" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M8 14l2.5 2.5L16 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ) : (
        <>
          <rect x="3" y="4" width="18" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M8 2v4M16 2v4M3 9h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M8 14l2.5 2.5L16 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )}
    </svg>
  ),

  Students: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <path d="M12 3L2 8l10 5 10-5-10-5z" fill="currentColor"/>
          <path d="M2 8v5M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d="M12 3L2 8l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M2 8v5M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </>
      )}
    </svg>
  ),

  Staff: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <circle cx="9" cy="7" r="3.5" fill="currentColor"/>
          <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" fill="currentColor" opacity="0.9"/>
          <circle cx="18" cy="8" r="2.5" fill="currentColor" opacity="0.6"/>
          <path d="M22 20c0-2.5-1.8-4.5-4-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.6"/>
        </>
      ) : (
        <>
          <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="18" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M22 20c0-2.5-1.8-4.5-4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </>
      )}
    </svg>
  ),

  Fees: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <rect x="2" y="6" width="20" height="13" rx="2.5" fill="currentColor" opacity="0.15"/>
          <rect x="2" y="6" width="20" height="13" rx="2.5" fill="currentColor" opacity="0.8"/>
          <path d="M2 10h20" stroke="white" strokeWidth="1.6"/>
          <circle cx="12" cy="15" r="2" fill="white"/>
          <path d="M7 15h1M16 15h1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <rect x="2" y="6" width="20" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M2 10h20" stroke="currentColor" strokeWidth="1.6"/>
          <circle cx="12" cy="15" r="2" fill="currentColor"/>
          <path d="M7 15h1M16 15h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}
    </svg>
  ),

  Payroll: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2.5" fill="currentColor" opacity="0.85"/>
          <circle cx="12" cy="12" r="3.5" fill="white" opacity="0.9"/>
          <path d="M12 10v4M10.5 10.5h2a1 1 0 010 2h-1a1 1 0 010 2h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ) : (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 10v4M10.5 10.5h2a1 1 0 010 2h-1a1 1 0 010 2h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )}
    </svg>
  ),

  Expenses: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <path d="M4 20V8l8-5 8 5v12H4z" fill="currentColor" opacity="0.15"/>
          <path d="M4 20V8l8-5 8 5v12H4z" fill="currentColor" opacity="0.8"/>
          <path d="M9 20v-6h6v6" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M9 11h.01M12 11h.01M15 11h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d="M4 20V8l8-5 8 5v12H4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M9 11h.01M12 11h.01M15 11h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </>
      )}
    </svg>
  ),

  'Staff Leaves': (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <path d="M12 3c0 0-8 4-8 10a8 8 0 0016 0c0-6-8-10-8-10z" fill="currentColor" opacity="0.85"/>
          <path d="M12 3v18M8 9c1.5 1 3 1.5 4 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d="M12 3c0 0-8 4-8 10a8 8 0 0016 0c0-6-8-10-8-10z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M12 3v18M8 9c1.5 1 3 1.5 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}
    </svg>
  ),

  Classes: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" fill="currentColor"/>
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" fill="currentColor" opacity="0.6"/>
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" fill="currentColor" opacity="0.6"/>
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" fill="currentColor" opacity="0.3"/>
        </>
      ) : (
        <>
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
        </>
      )}
    </svg>
  ),

  Notices: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" fill="currentColor" opacity="0.1"/>
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill="currentColor" opacity="0.85"/>
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="18" cy="5" r="3" fill="#FF3B30"/>
        </>
      ) : (
        <>
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </>
      )}
    </svg>
  ),

  Transport: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <rect x="2" y="7" width="20" height="11" rx="2.5" fill="currentColor" opacity="0.85"/>
          <path d="M2 11h20" stroke="white" strokeWidth="1.5"/>
          <path d="M6 4h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="7" cy="20" r="1.5" fill="white"/>
          <circle cx="17" cy="20" r="1.5" fill="white"/>
          <path d="M7 7v4M17 7v4M12 7v4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <rect x="2" y="7" width="20" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M2 11h20" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M6 4h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="7" cy="20" r="1.5" fill="currentColor"/>
          <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
        </>
      )}
    </svg>
  ),

  Analytics: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <rect x="3" y="14" width="4" height="7" rx="1" fill="currentColor"/>
          <rect x="10" y="9" width="4" height="12" rx="1" fill="currentColor" opacity="0.8"/>
          <rect x="17" y="4" width="4" height="17" rx="1" fill="currentColor" opacity="0.6"/>
          <path d="M3 8l5-4 6 5 7-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ) : (
        <>
          <rect x="3" y="14" width="4" height="7" rx="1" stroke="currentColor" strokeWidth="1.7"/>
          <rect x="10" y="9" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.7"/>
          <rect x="17" y="4" width="4" height="17" rx="1" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M3 8l5-4 6 5 7-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )}
    </svg>
  ),

  Settings: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" fill="currentColor" opacity="0.4"/>
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.7"/>
        </>
      )}
    </svg>
  ),

  Approvals: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.85"/>
          <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ) : (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M7 12l3.5 3.5L17 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )}
    </svg>
  ),

  Homework: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <path d="M4 4h16v16H4V4z" rx="2" fill="currentColor" opacity="0.1"/>
          <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" opacity="0.85"/>
          <path d="M8 10h8M8 13h5" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
          <path d="M8 7h3" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M8 10h8M8 13h5M8 7h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </>
      )}
    </svg>
  ),

  Diary: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor" opacity="0.85"/>
          <path d="M5 7h14M9 3v18" stroke="white" strokeWidth="1.5"/>
          <path d="M13 11h4M13 14h4M13 17h2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M5 7h14M9 3v18" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13 11h4M13 14h4M13 17h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}
    </svg>
  ),

  Grades: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor" opacity="0.85"/>
        </>
      ) : (
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      )}
    </svg>
  ),

  Messages: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" fill="currentColor" opacity="0.85"/>
          <path d="M8 10h8M8 13h5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </>
      )}
    </svg>
  ),

  Timetable: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.85"/>
          <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )}
    </svg>
  ),

  // Fallback — generic grid
  Default: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {active ? (
        <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.85"/>
      ) : (
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/>
      )}
    </svg>
  ),
};

// "More" grid icon — always outlined dots
function MoreIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="5"  cy="12" r="1.8" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.7}/>
      <circle cx="12" cy="12" r="1.8" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.7}/>
      <circle cx="19" cy="12" r="1.8" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.7}/>
    </svg>
  );
}

// Close X
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function getIcon(name: string, active: boolean): JSX.Element {
  const fn = NAV_ICONS[name] ?? NAV_ICONS['Default'];
  return fn(active);
}

// ─────────────────────────────────────────────────────────────────────────────

interface MobileNavProps {
  navItems: { name: string; href: string; icon: any }[];
}

export function MobileNav({ navItems }: MobileNavProps) {
  const pathname   = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => { setIsMoreOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = isMoreOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMoreOpen]);

  const primaryItems = navItems.slice(0, 4);
  const moreItems    = navItems.slice(4);
  const hasMore      = moreItems.length > 0;

  return (
    <>
      {/* ── Bottom tab bar ─────────────────────────────────────────────── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{
          background:          'rgba(10,12,20,0.82)',
          backdropFilter:      'blur(48px) saturate(2)',
          WebkitBackdropFilter:'blur(48px) saturate(2)',
          borderTop:           '1px solid rgba(255,255,255,0.08)',
          boxShadow:           '0 -1px 0 rgba(255,255,255,0.06) inset, 0 -12px 40px rgba(0,0,0,0.25)',
          paddingTop:          '6px',
          paddingBottom:       'calc(6px + env(safe-area-inset-bottom))',
        }}
      >
        {/* Subtle top shimmer line */}
        <div className="absolute top-0 left-8 right-8 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18) 30%,rgba(255,255,255,0.30) 50%,rgba(255,255,255,0.18) 70%,transparent)' }}
        />

        <div className="flex items-end justify-around px-1">
          {primaryItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="flex-1">
                <TabItem name={item.name} active={isActive} />
              </Link>
            );
          })}

          {hasMore && (
            <button
              type="button"
              className="flex-1"
              onClick={e => { e.preventDefault(); e.stopPropagation(); setIsMoreOpen(true); }}
            >
              <TabItem name="More" active={isMoreOpen} isMore />
            </button>
          )}
        </div>
      </div>

      {/* ── More sheet ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMoreOpen && hasMore && (
          <>
            {/* Scrim */}
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setIsMoreOpen(false)}
              className="md:hidden fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 440, damping: 42 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] overflow-hidden"
              style={{
                background:          'rgba(10,12,22,0.94)',
                backdropFilter:      'blur(60px) saturate(2)',
                WebkitBackdropFilter:'blur(60px) saturate(2)',
                border:              '1px solid rgba(255,255,255,0.10)',
                borderBottom:        'none',
                boxShadow:           '0 -20px 60px rgba(0,0,0,0.45)',
              }}
              role="dialog"
              aria-modal="true"
            >
              {/* Top specular */}
              <div className="absolute top-0 left-12 right-12 h-px"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25) 40%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.25) 60%,transparent)' }}
              />

              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-black text-base tracking-tight" style={{ color: 'rgba(255,255,255,0.90)' }}>
                  All Modules
                </p>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setIsMoreOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.50)', border: '1px solid rgba(255,255,255,0.10)' }}
                >
                  <CloseIcon />
                </motion.button>
              </div>

              {/* Grid of items */}
              <div
                className="overflow-y-auto p-4 grid grid-cols-2 gap-2.5"
                style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))', maxHeight: '65vh' }}
              >
                {moreItems.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMoreOpen(false)}>
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all"
                        style={{
                          background: isActive
                            ? 'linear-gradient(135deg,rgba(0,122,255,0.22),rgba(88,86,214,0.18))'
                            : 'rgba(255,255,255,0.05)',
                          border: isActive
                            ? '1px solid rgba(0,122,255,0.35)'
                            : '1px solid rgba(255,255,255,0.08)',
                          boxShadow: isActive ? '0 4px 20px rgba(0,122,255,0.18)' : 'none',
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center"
                          style={{
                            background: isActive
                              ? 'linear-gradient(135deg,#007AFF,#5856D6)'
                              : 'rgba(255,255,255,0.07)',
                            boxShadow: isActive ? '0 6px 18px rgba(0,122,255,0.35)' : 'none',
                            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                          }}
                        >
                          {getIcon(item.name, isActive)}
                        </div>
                        <span
                          className="text-[11px] font-bold text-center leading-tight"
                          style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)' }}
                        >
                          {item.name}
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Single tab button ─────────────────────────────────────────────────────────
function TabItem({
  name, active, isMore = false,
}: { name: string; active: boolean; isMore?: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-end gap-1 py-1 w-full cursor-pointer select-none"
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {/* Icon container */}
      <div className="relative flex items-center justify-center">
        {/* Active glow blob behind icon */}
        {active && (
          <motion.div
            layoutId="tab-glow"
            className="absolute rounded-full pointer-events-none"
            style={{ width: 44, height: 28, background: 'rgba(0,122,255,0.22)', filter: 'blur(8px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}

        {/* Active pill */}
        {active && (
          <motion.div
            layoutId="tab-pill"
            className="absolute rounded-[10px]"
            style={{ width: 44, height: 28, background: 'rgba(0,122,255,0.18)', border: '1px solid rgba(0,122,255,0.30)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}

        <motion.div
          animate={{ y: active ? -1 : 0, scale: active ? 1.08 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="relative z-10 w-11 h-7 flex items-center justify-center"
          style={{ color: active ? '#007AFF' : 'rgba(255,255,255,0.35)' }}
        >
          {isMore
            ? <MoreIcon active={active} />
            : getIcon(name, active)
          }
        </motion.div>
      </div>

      {/* Label */}
      <motion.span
        animate={{ opacity: active ? 1 : 0.5 }}
        className="text-[10px] font-bold leading-none tracking-tight"
        style={{ color: active ? '#007AFF' : 'rgba(255,255,255,0.40)' }}
      >
        {name}
      </motion.span>

      {/* Active dot indicator */}
      {active && (
        <motion.div
          layoutId="tab-dot"
          className="w-1 h-1 rounded-full"
          style={{ background: '#007AFF' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </motion.div>
  );
}
