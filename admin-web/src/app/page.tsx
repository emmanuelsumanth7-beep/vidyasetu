'use client';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    grecaptcha?: unknown;
  }
}

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Shield, ArrowRight, Smartphone, Key, Globe, Zap, GraduationCap, Users, BookOpen, Sparkles, ChevronRight, Lock, ChevronLeft, TriangleAlert } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { clearUserSession, saveUserSession } from '@/lib/session';

const DEMO_PERSONAS = [
  {
    role: 'principal' as const,
    label: 'Principal',
    name: 'Dr. Anjali Rao',
    desc: 'KPIs · Staff · Fees · Analytics',
    icon: Shield,
    color: '#007AFF',
    colorB: '#5856D6',
    glow: 'rgba(0,122,255,0.5)',
  },
  {
    role: 'teacher' as const,
    label: 'Teacher',
    name: 'Mr. Ravi Kumar',
    desc: 'Attendance · Grades · Homework',
    icon: BookOpen,
    color: '#34C759',
    colorB: '#30B0C7',
    glow: 'rgba(52,199,89,0.5)',
  },
  {
    role: 'parent' as const,
    label: 'Parent',
    name: 'Mrs. Sunita Sharma',
    desc: 'Fees · Diary · Progress',
    icon: Users,
    color: '#FF9500',
    colorB: '#FF2D55',
    glow: 'rgba(255,149,0,0.5)',
  },
];

// Floating orb component
function Orb({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}, transparent 70%)`,
        filter: `blur(${size * 0.35}px)`,
      }}
      animate={{
        x: [0, 30, -20, 15, 0],
        y: [0, -25, 20, -10, 0],
        scale: [1, 1.08, 0.94, 1.05, 1],
      }}
      transition={{ duration: 18 + delay * 3, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

// Animated particle
function Particle({ delay }: { delay: number }) {
  const startX = Math.random() * 100;
  return (
    <motion.div
      className="absolute w-0.5 h-0.5 rounded-full bg-white/40 pointer-events-none"
      style={{ left: `${startX}%`, bottom: '-4px' }}
      animate={{ y: [0, -(300 + Math.random() * 400)], opacity: [0, 0.7, 0] }}
      transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function LoginPage() {
  const router = useRouter();
  const { lang, setLang, t: tFunc } = useLanguage();

  const [role, setRole] = useState<'parent' | 'teacher' | 'principal'>('parent');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [bypassLoading, setBypassLoading] = useState<string | null>(null);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [activePersona, setActivePersona] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Tilt effect
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), { stiffness: 150, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-6, 6]), { stiffness: 150, damping: 30 });

  useEffect(() => { setMounted(true); }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const clearRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch {}
      window.recaptchaVerifier = undefined;
    }
  };

  const getFormattedPhone = () => {
    const trimmed = phoneNumber.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (trimmed.startsWith('+') && digits.length >= 10 && digits.length <= 15) return `+${digits}`;
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
    throw new Error('Please enter a valid mobile number.');
  };

  const resetOtp = () => { setOtpSent(false); setOtpCode(''); setConfirmationResult(null); setSentTo(''); clearRecaptcha(); };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      const phone = getFormattedPhone();
      clearRecaptcha();
      auth.languageCode = lang;
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      await window.recaptchaVerifier.render();
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result); setSentTo(phone); setOtpSent(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send OTP. Please try again.'));
      clearRecaptcha();
    } finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      if (!confirmationResult) throw new Error('Please request a code first.');
      const cred = await confirmationResult.confirm(otpCode);
      const token = await cred.user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://bot-api.smha.co.in/api'}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      saveUserSession(data.user);
      localStorage.removeItem('DEV_BYPASS_TOKEN');
      router.push('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid OTP code.'));
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (persona: typeof DEMO_PERSONAS[0], idx: number) => {
    setActivePersona(idx);
    setBypassLoading(persona.role);
    clearUserSession();
    localStorage.setItem('DEV_BYPASS_TOKEN', `DEV_BYPASS_${persona.role.toUpperCase()}`);
    saveUserSession({ id: `demo-${persona.role}`, role: persona.role, name: persona.name, schoolId: 'demo-school-1' });
    await new Promise(r => setTimeout(r, 800));
    router.push('/dashboard');
  };

  if (!mounted) return null;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center"
      style={{ background: '#060912' }}>

      {/* ── Deep space background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% -20%, #0d1b3e 0%, #060912 60%)',
        }} />

        {/* Animated orbs */}
        <Orb x="-10%" y="-5%"  size={500} color="rgba(0,90,255,0.18)"   delay={0} />
        <Orb x="60%"  y="-15%" size={420} color="rgba(120,40,255,0.16)"  delay={2} />
        <Orb x="70%"  y="50%"  size={380} color="rgba(255,80,120,0.10)"  delay={5} />
        <Orb x="-5%"  y="55%"  size={350} color="rgba(0,180,200,0.10)"   delay={3} />
        <Orb x="35%"  y="30%"  size={280} color="rgba(80,120,255,0.08)"  delay={7} />

        {/* Subtle star field */}
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.85 ? 2 : 1,
              height: Math.random() > 0.85 ? 2 : 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.3,
            }}
            animate={{ opacity: [null, 0, 0.3 + Math.random() * 0.4, 0] }}
            transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 8 }}
          />
        ))}

        {/* Rising particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} delay={i * 0.4} />
        ))}

        {/* Horizontal light sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 0%, rgba(80,120,255,0.04) 50%, transparent 100%)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Main layout ── */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-stretch">

        {/* ── LEFT PANEL: brand hero (desktop) ── */}
        <div className="hidden md:flex flex-col flex-1 p-14 lg:p-20 justify-between">

          {/* Top */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-2xl"
                style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', boxShadow: '0 0 32px rgba(0,122,255,0.5)' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <GraduationCap size={22} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="font-black text-white text-lg tracking-tight leading-none">Vidya Setu</p>
              <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase mt-0.5">School OS · v3.0</p>
            </div>
          </motion.div>

          {/* Centre headline */}
          <div className="flex flex-col gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}>
              <h1 className="text-[clamp(3.5rem,6vw,6rem)] font-black leading-[0.88] tracking-tighter text-white">
                The future<br />
                <span style={{
                  background: 'linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>of schools</span><br />
                is here.
              </h1>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.45 }}
              className="text-white/45 text-lg leading-relaxed max-w-sm font-medium">
              One platform. Every role. Real-time data, AI insights, and zero paperwork.
            </motion.p>

            {/* Feature pills */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-2.5">
              {[
                { label: 'AI Powered',   color: '#60A5FA' },
                { label: 'OTP Secure',   color: '#A78BFA' },
                { label: 'DPDP Ready',   color: '#34D399' },
                { label: 'Role Aware',   color: '#F472B6' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}35`,
                    color,
                  }}>
                  <Sparkles size={10} />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.75 }}
              className="flex gap-8">
              {[['12K+', 'Students'], ['340+', 'Schools'], ['99.9%', 'Uptime']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-2xl font-black text-white">{val}</p>
                  <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{lbl}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-white/25 text-xs font-mono tracking-widest">ALL SYSTEMS OPERATIONAL</p>
            <button onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/40 hover:text-white/70 transition-all border border-white/10 hover:border-white/20">
              <Globe size={12} />
              {lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT PANEL: login card ── */}
        <div className="flex-1 md:flex-none md:w-[440px] lg:w-[480px] flex items-center justify-center p-4 md:p-8">
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-[420px] relative"
          >
            {/* Card glow halo */}
            <div className="absolute -inset-px rounded-[28px] pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(167,139,250,0.2), rgba(244,114,182,0.15))',
                filter: 'blur(1px)',
              }} />

            {/* Card body */}
            <div className="relative rounded-[26px] overflow-hidden"
              style={{
                background: 'rgba(15, 20, 40, 0.85)',
                backdropFilter: 'blur(60px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(60px) saturate(1.8)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
              }}>

              {/* Top specular line */}
              <div className="absolute top-0 left-8 right-8 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20) 30%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.20) 70%, transparent)' }} />

              {/* ── CARD HEADER ── */}
              <div className="flex items-center justify-between px-6 pt-6 pb-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', boxShadow: '0 4px 16px rgba(0,122,255,0.4)' }}>
                    <GraduationCap size={17} className="absolute inset-0 m-auto text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-black text-white text-sm tracking-tight">{tFunc('appName')}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-[9px] text-white/30 font-mono tracking-widest uppercase">Live · Demo Mode</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
                  className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.5)' }}>
                  <Globe size={11} />
                  {lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}
                </button>
              </div>

              <AnimatePresence mode="wait">

                {/* ── DEMO LOGIN PANEL ── */}
                {!showOtpLogin && (
                  <motion.div key="demo"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                    className="px-6 pt-5 pb-6 flex flex-col gap-4">

                    {/* Section header */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg,#FFCC00,#FF9500)' }}>
                        <Zap size={12} style={{ color: 'rgba(0,0,0,0.8)' }} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-black">Instant Demo Access</p>
                        <p className="text-white/30 text-[10px] font-mono tracking-wider">Tap any role to explore the full platform</p>
                      </div>
                    </div>

                    {/* Persona cards */}
                    <div className="flex flex-col gap-2.5">
                      {DEMO_PERSONAS.map((persona, idx) => {
                        const Icon = persona.icon;
                        const loading = bypassLoading === persona.role;
                        const isActive = activePersona === idx;
                        return (
                          <motion.button
                            key={persona.role}
                            onClick={() => handleDemoLogin(persona, idx)}
                            disabled={!!bypassLoading}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative w-full flex items-center gap-4 p-4 rounded-2xl text-left overflow-hidden disabled:opacity-60"
                            style={{
                              background: isActive
                                ? `linear-gradient(135deg, ${persona.color}25, ${persona.colorB}18)`
                                : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${isActive ? `${persona.color}50` : 'rgba(255,255,255,0.07)'}`,
                              transition: 'all 0.25s ease',
                            }}
                            onMouseEnter={e => {
                              if (!bypassLoading) {
                                (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${persona.color}18, ${persona.colorB}10)`;
                                (e.currentTarget as HTMLElement).style.borderColor = `${persona.color}40`;
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isActive) {
                                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                              }
                            }}
                          >
                            {/* Glow behind icon */}
                            <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
                              style={{ background: `radial-gradient(circle at 15% 50%, ${persona.glow} 0%, transparent 55%)` }} />

                            {/* Icon */}
                            <div className="relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${persona.color}, ${persona.colorB})`,
                                boxShadow: loading ? `0 0 20px ${persona.glow}` : `0 4px 16px ${persona.glow}`,
                              }}>
                              {loading
                                ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                : <Icon size={19} className="text-white" strokeWidth={2.2} />}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0 relative">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-black text-sm">{persona.label}</p>
                                {loading && (
                                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                                    style={{ background: `${persona.color}30`, color: persona.color }}>
                                    ENTERING…
                                  </motion.span>
                                )}
                              </div>
                              <p className="text-white/35 text-[11px] font-medium mt-0.5 truncate">{persona.name}</p>
                              <p className="text-white/20 text-[10px] mt-0.5 truncate font-mono">{persona.desc}</p>
                            </div>

                            {/* Arrow */}
                            {!loading && (
                              <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.20)', flexShrink: 0 }} />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                      <p className="text-white/20 text-[10px] font-mono tracking-widest uppercase">or sign in with OTP</p>
                      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    </div>

                    {/* OTP button */}
                    <motion.button
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setShowOtpLogin(true)}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        color: 'rgba(255,255,255,0.55)',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                      }}
                    >
                      <Smartphone size={15} />
                      Sign in with Phone Number
                    </motion.button>
                  </motion.div>
                )}

                {/* ── OTP LOGIN PANEL ── */}
                {showOtpLogin && (
                  <motion.div key="otp"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                    className="px-6 pt-5 pb-6 flex flex-col gap-4">

                    {/* Back + title */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                        <p className="text-white font-black text-sm uppercase tracking-wide">Secure Login</p>
                      </div>
                      <button type="button"
                        onClick={() => { setShowOtpLogin(false); resetOtp(); setError(''); }}
                        className="text-[11px] font-bold transition-colors flex items-center gap-1"
                        style={{ color: 'rgba(255,255,255,0.30)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.30)')}>
                        <ChevronLeft size={12} /> Back
                      </button>
                    </div>

                    {/* Role tabs */}
                    <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {(['parent', 'teacher', 'principal'] as const).map(r => (
                        <button key={r}
                          onClick={() => { setRole(r); resetOtp(); setError(''); }}
                          className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-200"
                          style={{
                            background: role === r ? 'rgba(255,255,255,0.12)' : 'transparent',
                            color: role === r ? '#fff' : 'rgba(255,255,255,0.35)',
                            boxShadow: role === r ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                          }}>
                          {r === 'parent' ? tFunc('guardian') : r === 'teacher' ? tFunc('faculty') : tFunc('principal')}
                        </button>
                      ))}
                    </div>

                    {/* Forms */}
                    <AnimatePresence mode="wait">
                      <motion.div key={role + (otpSent ? '-otp' : '-phone')}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }} className="flex flex-col gap-3">

                        {!otpSent ? (
                          <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                Mobile Number
                              </label>
                              <div className="relative">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={16}
                                  style={{ color: 'rgba(255,255,255,0.25)' }} />
                                <input
                                  type="tel" placeholder="+91 98765 43210"
                                  autoComplete="tel" inputMode="tel"
                                  value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                                  required disabled={isLoading}
                                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-white font-mono text-sm placeholder:opacity-25 focus:outline-none transition-all"
                                  style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.10)',
                                  }}
                                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                />
                              </div>
                            </div>
                            <motion.button type="submit" disabled={isLoading}
                              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                              className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                              style={{ background: 'linear-gradient(135deg,#007AFF,#5856D6)', color: '#fff', boxShadow: '0 8px 24px rgba(0,122,255,0.35)' }}>
                              {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</> : <>{tFunc('reqKey')} <ArrowRight size={16} /></>}
                            </motion.button>
                          </form>
                        ) : (
                          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                6-digit code sent to {sentTo}
                              </label>
                              <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={16}
                                  style={{ color: 'rgba(255,255,255,0.25)' }} />
                                <input
                                  type="text" placeholder="• • • • • •"
                                  autoComplete="one-time-code" inputMode="numeric" maxLength={6}
                                  value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                  required disabled={isLoading}
                                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-white font-mono tracking-[0.3em] text-xl placeholder:opacity-20 focus:outline-none transition-all"
                                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                />
                              </div>
                            </div>
                            <motion.button type="submit" disabled={isLoading}
                              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                              className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                              style={{ background: 'linear-gradient(135deg,#34C759,#30B0C7)', color: '#fff', boxShadow: '0 8px 24px rgba(52,199,89,0.30)' }}>
                              {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verifying…</> : <>{tFunc('confirmKey')} <ArrowRight size={16} /></>}
                            </motion.button>
                            <button type="button" onClick={resetOtp} disabled={isLoading}
                              className="text-center text-xs font-bold transition-colors"
                              style={{ color: 'rgba(255,255,255,0.25)' }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
                              {tFunc('reenter')}
                            </button>
                          </form>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mx-6 mb-4 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2"
                    style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.25)', color: '#FF6B6B' }}>
                    <TriangleAlert size={14} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-center text-[9px] font-mono tracking-widest" style={{ color: 'rgba(255,255,255,0.12)' }}>
                  FIREBASE AUTH · DPDP COMPLIANT · END-TO-END ENCRYPTED
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div id="recaptcha-container" />
    </div>
  );
}
