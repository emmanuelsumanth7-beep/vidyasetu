'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import {
  Home, ClipboardCheck, GraduationCap, Users, Banknote,
  CreditCard, Receipt, CalendarOff, LayoutGrid, Bell,
  Bus, LineChart, Settings, CheckSquare, BookOpen,
  Notebook, Award, MessageSquare, Clock, Circle,
  MoreHorizontal, X
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Hand-crafted SVG icon set — every path drawn for perfect optical weight at
// 24×24. Filled variant used for active state, outlined for inactive.
// ─────────────────────────────────────────────────────────────────────────────

const iconProps = (active: boolean) => ({
  size: 24,
  strokeWidth: active ? 2.5 : 1.75,
});

const NAV_ICONS: Record<string, (active: boolean) => JSX.Element> = {
  Home: (a) => <Home {...iconProps(a)} />,
  Attendance: (a) => <ClipboardCheck {...iconProps(a)} />,
  Students: (a) => <GraduationCap {...iconProps(a)} />,
  Staff: (a) => <Users {...iconProps(a)} />,
  Fees: (a) => <Banknote {...iconProps(a)} />,
  Payroll: (a) => <CreditCard {...iconProps(a)} />,
  Expenses: (a) => <Receipt {...iconProps(a)} />,
  'Staff Leaves': (a) => <CalendarOff {...iconProps(a)} />,
  Classes: (a) => <LayoutGrid {...iconProps(a)} />,
  Notices: (a) => <Bell {...iconProps(a)} />,
  Transport: (a) => <Bus {...iconProps(a)} />,
  Analytics: (a) => <LineChart {...iconProps(a)} />,
  Settings: (a) => <Settings {...iconProps(a)} />,
  Approvals: (a) => <CheckSquare {...iconProps(a)} />,
  Homework: (a) => <BookOpen {...iconProps(a)} />,
  Diary: (a) => <Notebook {...iconProps(a)} />,
  Grades: (a) => <Award {...iconProps(a)} />,
  Messages: (a) => <MessageSquare {...iconProps(a)} />,
  Timetable: (a) => <Clock {...iconProps(a)} />,
  Default: (a) => <Circle {...iconProps(a)} />,
};

// "More" grid icon
function MoreIcon({ active }: { active: boolean }) {
  return <MoreHorizontal size={24} strokeWidth={active ? 2.5 : 1.75} />;
}

// Close X
function CloseIcon() {
  return <X size={20} strokeWidth={2} />;
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
  const { t } = useLanguage();

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
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-[420px]">
        <div
          className="rounded-full overflow-hidden"
          style={{
            background:          'var(--nav-bg)',
            backdropFilter:      'blur(60px) saturate(200%)',
            WebkitBackdropFilter:'blur(60px) saturate(200%)',
            border:              '1px solid rgba(255,255,255,0.3)',
            borderBottom:        '1px solid rgba(255,255,255,0.05)',
            boxShadow:           '0 32px 80px -12px rgba(0,0,0,0.35), 0 4px 16px -2px rgba(0,0,0,0.15), inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)',
            padding:             '8px 12px',
          }}
        >
          <div className="flex items-center justify-between">
            {primaryItems.map((item) => {
              const isActive = pathname === item.href;
              const label = item.name === 'Home' ? t('nav_home') : t('nav_' + item.name.toLowerCase().replace(' ', '_'));
              return (
                <Link key={item.name} href={item.href} className="flex-1 flex justify-center">
                  <TabItem name={item.name} label={label} active={isActive} />
                </Link>
              );
            })}

            {hasMore && (
              <button
                type="button"
                className="flex-1 flex justify-center"
                onClick={e => { e.preventDefault(); e.stopPropagation(); setIsMoreOpen(true); }}
              >
                <TabItem name="More" label={t('nav_more')} active={isMoreOpen} isMore />
              </button>
            )}
          </div>
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
                  {t('nav_all_modules')}
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
                  const label = t('nav_' + item.name.toLowerCase().replace(' ', '_'));
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
                            ? 'linear-gradient(135deg,rgba(27,42,74,0.22),rgba(196,155,42,0.18))'
                            : 'rgba(255,255,255,0.05)',
                          border: isActive
                            ? '1px solid rgba(27,42,74,0.35)'
                            : '1px solid rgba(255,255,255,0.08)',
                          boxShadow: isActive ? '0 4px 20px rgba(27,42,74,0.18)' : 'none',
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center"
                          style={{
                            background: isActive
                              ? 'linear-gradient(135deg,#1B2A4A,#C49B2A)'
                              : 'rgba(255,255,255,0.07)',
                            boxShadow: isActive ? '0 6px 18px rgba(27,42,74,0.35)' : 'none',
                            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                          }}
                        >
                          {getIcon(item.name, isActive)}
                        </div>
                        <span
                          className="text-[11px] font-bold text-center leading-tight"
                          style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)' }}
                        >
                          {label}
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
  name, label, active, isMore = false,
}: { name: string; label: string; active: boolean; isMore?: boolean }) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center w-full max-w-[64px] h-[52px] cursor-pointer select-none rounded-[20px]"
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {/* Active Pill Background */}
      {active && (
        <motion.div
          layoutId="floating-tab-pill"
          className="absolute inset-0 rounded-full"
          style={{ 
            background: 'var(--nav-pill-bg)',
            boxShadow: 'var(--nav-pill-shadow)'
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        />
      )}

      {/* Icon */}
      <motion.div
        animate={{ y: active ? -6 : 0, scale: active ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className="relative z-10 w-7 h-7 flex items-center justify-center"
        style={{ color: active ? 'var(--nav-icon-active)' : 'var(--nav-icon-inactive)' }}
      >
        {isMore ? <MoreIcon active={active} /> : getIcon(name, active)}
      </motion.div>

      {/* Label */}
      <motion.span
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8, scale: active ? 1 : 0.8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute bottom-[4px] text-[9.5px] font-bold tracking-wide text-center leading-none whitespace-nowrap"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {active && label}
      </motion.span>
    </motion.div>
  );
}
