'use client';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    grecaptcha?: unknown;
  }
}

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  ArrowRight, Smartphone, TriangleAlert, CheckCircle2, Shield,
  BookOpen, Users, Sun, Moon, Globe, CalendarCheck, MessageCircle,
  BarChart3, ChevronRight, Lock, UserCog, KeyRound
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/lib/LanguageContext';
import { SchoolConfig } from '@/config/school.config';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { saveUserSession } from '@/lib/session';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

type RoleId = 'parent' | 'staff' | 'principal';

const ROLES = [
  { id: 'parent' as RoleId,    label: 'Parent',          icon: Users,   placeholder: '+91 98765 43210' },
  { id: 'staff' as RoleId,     label: 'Faculty & Staff', icon: UserCog, placeholder: '+91 98765 43210' },
  { id: 'principal' as RoleId, label: 'Principal',       icon: Shield,  placeholder: '+91 98765 43210' },
];

const OB_SLIDES = [
  { title: 'Track Progress', desc: 'Real-time updates on academics and attendance.', icon: BarChart3, color: '#3B82F6' },
  { title: 'Stay Connected', desc: 'Seamless communication with school staff.', icon: MessageCircle, color: '#10B981' },
  { title: 'Never Miss Out', desc: 'Stay updated with school events and exams.', icon: CalendarCheck, color: '#F59E0B' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LoginPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<'onboarding' | 'login' | 'success'>('onboarding');
  const [role, setRole] = useState<RoleId>('principal'); // Default to Principal for impressive demo
  const [staffSubRole, setStaffSubRole] = useState<'Teacher' | 'Clerk / Admin' | 'Accountant' | 'Librarian' | 'Driver' | 'Other'>('Teacher');
  const [otherStaffRoleName, setOtherStaffRoleName] = useState('Support Staff / Specialist');
  const [password, setPassword] = useState('jips-demo-2026');
  const [phoneNumber, setPhoneNumber] = useState('+91 94807 98833');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('jips_onboarding_seen') === 'true') {
      setScreen('login');
    }
  }, []);

  const isDark = theme === 'dark';

  const handleGetStarted = () => {
    localStorage.setItem('jips_onboarding_seen', 'true');
    setScreen('login');
  };

  const handleInstantDemoLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    // Instant Zero-Friction Demo Session Creation (No Firebase required!)
    const targetStaffRole = staffSubRole === 'Other' ? (otherStaffRoleName || 'Other Specialized Staff') : staffSubRole;
    
    const demoUser = {
      id: 'demo-' + role + '-' + Date.now(),
      role: role === 'principal' ? 'principal' : role === 'staff' ? 'staff' : 'parent',
      name: role === 'principal' ? 'Dr. Suja Philip (Principal)' : role === 'staff' ? `Staff Officer (${targetStaffRole})` : 'Parent / Student Explorer',
      email: role === 'principal' ? 'jipscrp@gmail.com' : 'staff@bot.smha.co.in',
      phoneNumber: phoneNumber || '+91 94807 98833',
      schoolId: 'JIPS-DEMO-29170104107',
      department: role === 'staff' ? targetStaffRole : 'Executive Admin'
    };

    localStorage.setItem('DEV_BYPASS_TOKEN', 'DEV_BYPASS_' + (phoneNumber || 'principal'));
    localStorage.setItem('JIPS_DEMO_MODE', 'true');
    saveUserSession(demoUser);

    setTimeout(() => {
      setIsLoading(false);
      setScreen('success');
      setTimeout(() => router.push('/dashboard'), 1400);
    }, 450);
  };

  if (!mounted) return null;

  const roleIdx = ROLES.findIndex(r => r.id === role);

  return (
    <>
      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════════════════════════════
           SCREEN 1: GET STARTED / ONBOARDING
           ══════════════════════════════════════════════════════════════ */}
        {screen === 'onboarding' && (
          <motion.div
            key="onboarding"
            className="screen theme-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ob-layout">
              {/* Ultra premium glowing logo */}
              <motion.div
                className="ob-logo-wrap"
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 20 }}
              >
                {isDark && <div className="ob-logo-glow" />}
                <div className="ob-logo-glass">
                  <img src={SchoolConfig.logoPath} alt="" className="ob-logo-img" />
                  <div className="ob-logo-reflection" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="ob-title">{SchoolConfig.shortName}</h1>
                <p className="ob-school-name">{SchoolConfig.name}</p>
                <div className="ob-divider" />
              </motion.div>

              {/* Feature pills */}
              <div className="ob-pills">
                {OB_SLIDES.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.title}
                      className="ob-pill"
                      initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="ob-pill-icon-wrap" style={{ '--accent': s.color } as React.CSSProperties}>
                        <Icon size={18} className="ob-pill-icon" />
                      </div>
                      <div className="ob-pill-text">
                        <span className="ob-pill-title">{s.title}</span>
                        <span className="ob-pill-desc">{s.desc}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <motion.div
                className="ob-cta-area"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <button className="btn-ultra-gold" onClick={handleGetStarted}>
                  <span>Get Started</span>
                  <ChevronRight size={18} />
                  <div className="btn-sweep" />
                </button>
                <p className="ob-signin-link">
                  Already a member?{' '}
                  <button onClick={handleGetStarted} className="text-link-gold">Sign in</button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════
           SCREEN 2: LOGIN
           ══════════════════════════════════════════════════════════════ */}
        {screen === 'login' && (
          <motion.div
            key="login"
            className="screen theme-layer"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Floating actions */}
            <div className="login-actions-top">
              <button onClick={() => setLang(lang === 'en' ? 'kn' : 'en')} className="glass-icon-btn">
                <Globe size={16} />
              </button>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="glass-icon-btn">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            <div className="login-scroll">
              {/* Hero Branding */}
              <motion.div
                className="login-brand-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
              >
                <div className="brand-logo-container">
                  {isDark && <div className="brand-logo-glow" />}
                  <img src={SchoolConfig.logoPath} alt="" className="brand-logo-img" />
                </div>
                <h2 className="brand-title">{SchoolConfig.name}</h2>
                <p className="brand-subtitle">Secure Access Portal</p>
              </motion.div>

              {/* Ultra Premium Glass Card */}
              <motion.div
                className="login-card-3d"
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: 'spring', stiffness: 100 }}
                style={{ perspective: 1000 }}
              >
                <div className="login-card-inner">
                  {/* Card border glow (only dark) */}
                  {isDark && <div className="card-border-glow" />}
                  
                  {/* Role selector */}
                  <div className="role-segment-control">
                    <motion.div
                      className="role-segment-active"
                      layout
                      style={{ width: `${100 / ROLES.length}%`, left: `${(roleIdx / ROLES.length) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const active = role === r.id;
                      return (
                        <button
                          key={r.id}
                          className={`role-btn ${active ? 'active' : ''}`}
                          onClick={() => {
                            setRole(r.id);
                            setError('');
                          }}
                        >
                          <Icon size={14} />
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Demo Mode Notice Badge */}
                  <div className="mb-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                    <span>Live Interactive Demo Mode • No Firebase or OTP SMS Required</span>
                  </div>

                  {/* Staff Specialty Subrole Selector */}
                  {role === 'staff' && (
                    <div className="mb-5 space-y-3">
                      <label className="text-xs font-black uppercase tracking-wider text-[var(--color-text-secondary)]">
                        Select Staff Specialty & Department:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Teacher', 'Clerk / Admin', 'Accountant', 'Librarian', 'Driver', 'Other'] as const).map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => setStaffSubRole(sub)}
                            className={`py-2 px-2 rounded-xl text-[11px] font-extrabold tracking-tight transition-all border ${
                              staffSubRole === sub 
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-[1.02]' 
                                : 'bg-[var(--color-glass)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-indigo-400'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>

                      {staffSubRole === 'Other' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-1"
                        >
                          <label className="input-label text-[11px] mb-1">Specify "Other" Role / Duty Title:</label>
                          <div className="input-wrapper">
                            <UserCog size={16} className="input-icon" />
                            <input
                              type="text"
                              placeholder="e.g., Lab Supervisor, Counselor, Warden, Sports Director"
                              value={otherStaffRoleName}
                              onChange={e => setOtherStaffRoleName(e.target.value)}
                              className="premium-input text-xs"
                              required
                            />
                            <div className="input-focus-ring" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Instant Demo Launch Form */}
                  <form onSubmit={handleInstantDemoLogin} className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-[var(--color-glass)] border border-[var(--color-border)] text-xs space-y-1.5 font-medium">
                      <div className="flex justify-between items-center text-[var(--color-text-primary)] font-bold">
                        <span>Active Profile:</span>
                        <span className="text-amber-500 font-black uppercase tracking-wider">
                          {role === 'principal' ? 'Dr. Suja Philip (Principal)' : role === 'staff' ? `Staff (${staffSubRole === 'Other' ? otherStaffRoleName || 'Other' : staffSubRole})` : 'Parent / Student Explorer'}
                        </span>
                      </div>
                      <div className="flex justify-between text-[var(--color-text-secondary)] text-[11px]">
                        <span>School Authority:</span>
                        <span>Jnanasagara International Public School (JIPS)</span>
                      </div>
                      <div className="flex justify-between text-[var(--color-text-secondary)] text-[11px]">
                        <span>UDISE+ Code:</span>
                        <span className="font-mono text-indigo-400 font-bold">29170104107</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-ultra-gold w-full py-4 text-sm font-black shadow-xl"
                    >
                      {isLoading ? (
                        <div className="spinner spinner-dark" />
                      ) : (
                        <>
                          🚀 Launch Live Demo as {role === 'principal' ? 'Principal' : role === 'staff' ? (staffSubRole === 'Other' ? otherStaffRoleName || 'Staff' : staffSubRole) : 'Parent & Student'}
                          <ArrowRight size={18} />
                        </>
                      )}
                      <div className="btn-sweep" />
                    </button>
                  </form>

                  {/* Error Notification */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="premium-error"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      >
                        <TriangleAlert size={16} />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                className="login-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <p><Lock size={12} className="mr-1 inline" /> Enterprise Grade Security &middot; DPDP Compliant</p>
                <p className="mt-1 opacity-50">&copy; {new Date().getFullYear()} Petersys Technology</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════
           SCREEN 3: SUCCESS (Cinematic Unveil)
           ══════════════════════════════════════════════════════════════ */}
        {screen === 'success' && (
          <motion.div
            key="success"
            className="screen theme-layer success-screen-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="success-center"
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="success-logo-wrap">
                {/* Expanding sonar rings */}
                <motion.div
                  className="sonar-ring"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0 }}
                />
                <motion.div
                  className="sonar-ring"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                />
                
                <div className="success-logo-glass">
                  <img src={SchoolConfig.logoPath} alt="" className="success-logo-img" />
                </div>

                <motion.div
                  className="success-check-badge"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 size={24} />
                </motion.div>
              </div>

              <motion.h2
                className="success-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Access Granted
              </motion.h2>
              <motion.p
                className="success-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Initializing your dashboard...
              </motion.p>

              <motion.div
                className="success-loader-track"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 240 }}
                transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
              >
                <motion.div
                  className="success-loader-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.5, duration: 1.2, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="recaptcha-container" />
    </>
  );
}

